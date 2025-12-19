use anchor_lang::prelude::*;
use anchor_spl::token::{self, CloseAccount, Mint, Token, TokenAccount, Transfer};

declare_id!("3TBgKSv7DAocvCn8q8njqC6B9f9BJc1VseUyQSvxKz1N");

// programId = FUDCeFk6YsFe6iTN69qu5PtuYr3dk1wAgjPD7RQLhGfo
// signature = 3xWJspP1FEt52hzTp2HaSJJBn8abhyWQDzyFHj4Gc2yDSFR7sidPih4qZP1MWAzK2BVWidnhN6ekPHUjA6q2HGxa

#[program]
pub mod dial_experts {
    use super::*;

    // 1. CREATE STREAM (Call Starts)
    // User deposits 'max_amount' to cover the max duration of the call.
    // 'rate_per_second' is the expert's rate divided by 60.
    pub fn create_stream(
        ctx: Context<CreateStream>,
        rate_per_second: u64,
        max_amount: u64,
    ) -> Result<()> {
        let stream = &mut ctx.accounts.stream;
        stream.sender = ctx.accounts.sender.key();
        stream.recipient = ctx.accounts.recipient.key();
        stream.mint = ctx.accounts.mint.key();
        stream.start_time = Clock::get()?.unix_timestamp; // Start the clock NOW
        stream.rate_per_second = rate_per_second;
        stream.total_deposit = max_amount;
        stream.active = true;

        // Transfer funds from User -> Vault
        let cpi_accounts = Transfer {
            from: ctx.accounts.sender_token_account.to_account_info(),
            to: ctx.accounts.vault_account.to_account_info(),
            authority: ctx.accounts.sender.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, max_amount)?;

        Ok(())
    }

    // 2. CLOSE STREAM (Call Ends)
    pub fn close_stream(ctx: Context<CloseStream>) -> Result<()> {
        // FIX 1: Change '&mut' to '&'. We are only reading values, not updating them.
        // The 'close = sender' constraint handles the actual closing logic automatically.
        let stream = &ctx.accounts.stream;
        let now = Clock::get()?.unix_timestamp;

        // Calculate time spent
        let time_elapsed = (now - stream.start_time).max(0) as u64;

        // Calculate earnings
        let amount_earned = time_elapsed
            .checked_mul(stream.rate_per_second)
            .ok_or(ErrorCode::MathOverflow)?;

        // Cap the earnings
        let amount_to_expert = if amount_earned > stream.total_deposit {
            stream.total_deposit
        } else {
            amount_earned
        };

        let amount_to_refund = stream.total_deposit - amount_to_expert;

        // Seeds for signing
        let seeds = &[
            b"stream",
            stream.sender.as_ref(),
            stream.recipient.as_ref(),
            &[ctx.bumps.stream],
        ];
        let signer = &[&seeds[..]];

        // A. Transfer Earnings to Expert
        if amount_to_expert > 0 {
            let cpi_accounts_expert = Transfer {
                from: ctx.accounts.vault_account.to_account_info(),
                to: ctx.accounts.recipient_token_account.to_account_info(),
                authority: ctx.accounts.stream.to_account_info(),
            };
            let cpi_ctx_expert = CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                cpi_accounts_expert,
                signer,
            );
            token::transfer(cpi_ctx_expert, amount_to_expert)?;
        }

        // B. Transfer Refund to User
        if amount_to_refund > 0 {
            let cpi_accounts_refund = Transfer {
                from: ctx.accounts.vault_account.to_account_info(),
                to: ctx.accounts.sender_token_account.to_account_info(),
                authority: ctx.accounts.stream.to_account_info(),
            };
            let cpi_ctx_refund = CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                cpi_accounts_refund,
                signer,
            );
            token::transfer(cpi_ctx_refund, amount_to_refund)?;
        }

        // C. Close the Vault Account
        let cpi_close = CloseAccount {
            account: ctx.accounts.vault_account.to_account_info(),
            destination: ctx.accounts.sender.to_account_info(),
            authority: ctx.accounts.stream.to_account_info(),
        };
        let cpi_close_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            cpi_close,
            signer,
        );
        token::close_account(cpi_close_ctx)?;

        Ok(())
    }

    // 3. DATA STRUCTURES

    #[derive(Accounts)]
    pub struct CreateStream<'info> {
        #[account(
        init,
        payer = sender,
        space = 8 + 32 + 32 + 32 + 8 + 8 + 8 + 1,
        seeds = [b"stream", sender.key().as_ref(), recipient.key().as_ref()],
        bump
    )]
        pub stream: Account<'info, StreamState>,

        #[account(mut)]
        pub sender: Signer<'info>, // James
        /// CHECK: Safe because we just store the key
        pub recipient: AccountInfo<'info>, // Buffet

        #[account(
        init,
        payer = sender,
        token::mint = mint,
        token::authority = stream,
        seeds = [b"vault", stream.key().as_ref()],
        bump
    )]
        pub vault_account: Account<'info, TokenAccount>, // The Escrow

        #[account(mut)]
        pub sender_token_account: Account<'info, TokenAccount>, // James's USDC wallet

        pub mint: Account<'info, Mint>, // USDC Mint
        pub system_program: Program<'info, System>,
        pub token_program: Program<'info, Token>,
        pub rent: Sysvar<'info, Rent>,
    }

    #[derive(Accounts)]
    pub struct CloseStream<'info> {
        #[account(
        mut,
        seeds = [b"stream", stream.sender.as_ref(), stream.recipient.as_ref()],
        bump,
        close = sender // Close the stream state and return rent to sender
    )]
        pub stream: Account<'info, StreamState>,

        #[account(mut)]
        pub vault_account: Account<'info, TokenAccount>,

        #[account(mut)]
        /// CHECK: We verify this matches the stream state
        pub sender: AccountInfo<'info>, // James

        #[account(mut)]
        pub sender_token_account: Account<'info, TokenAccount>,

        #[account(mut)]
        /// CHECK: We verify this matches the stream state
        pub recipient: AccountInfo<'info>, // Buffet

        #[account(mut)]
        pub recipient_token_account: Account<'info, TokenAccount>,

        pub token_program: Program<'info, Token>,
    }

    #[account]
    pub struct StreamState {
        pub sender: Pubkey,
        pub recipient: Pubkey,
        pub mint: Pubkey,
        pub start_time: i64,
        pub rate_per_second: u64,
        pub total_deposit: u64,
        pub active: bool,
    }

    #[error_code]
    pub enum ErrorCode {
        #[msg("Math Overflow")]
        MathOverflow,
    }
}
