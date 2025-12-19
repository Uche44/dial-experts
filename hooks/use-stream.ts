import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { Program, AnchorProvider, BN } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import idl from "@/lib/dial_experts.json";
import { useState } from "react";

const PROGRAM_ID = new PublicKey(
  "3TBgKSv7DAocvCn8q8njqC6B9f9BJc1VseUyQSvxKz1N"
);
// Devnet USDC Mint (replace with mainnet if needed)
const USDC_MINT = new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU");

export const useStream = () => {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const [loading, setLoading] = useState(false);

  const startStream = async (
    expertWalletAddress: string,
    amount: number,
    rate: number
  ) => {
    if (!wallet) throw new Error("Connect Wallet first!");
    setLoading(true);

    try {
      const provider = new AnchorProvider(connection, wallet, {});
      const program = new Program(idl as any, provider);

      const expertKey = new PublicKey(expertWalletAddress);
      const amountBN = new BN(amount * 1_000_000); // 6 decimals for USDC
      const rateBN = new BN(rate);

      // PDAs
      const [streamPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("stream"),
          wallet.publicKey.toBuffer(),
          expertKey.toBuffer(),
        ],
        PROGRAM_ID
      );

      const [vaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("vault"), streamPda.toBuffer()],
        PROGRAM_ID
      );

      // Token Accounts
      const senderTokenAccount = await getAssociatedTokenAddress(
        USDC_MINT,
        wallet.publicKey
      );

      const tx = await program.methods
        .createStream(rateBN, amountBN)
        .accounts({
          stream: streamPda,
          sender: wallet.publicKey,
          recipient: expertKey,
          vaultAccount: vaultPda,
          senderTokenAccount: senderTokenAccount,
          mint: USDC_MINT,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: SYSVAR_RENT_PUBKEY,
        })
        .rpc();

      console.log("Stream created! TX:", tx);
      return tx;
    } catch (err) {
      console.error("Error creating stream:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const endStream = async (
    expertWalletAddress: string,
    userWalletAddress: string
  ) => {
    if (!wallet) throw new Error("Connect Wallet first!");
    setLoading(true);

    try {
      const provider = new AnchorProvider(connection, wallet, {});
      const program = new Program(idl as any, provider);

      const expertKey = new PublicKey(expertWalletAddress);
      const userKey = new PublicKey(userWalletAddress);

      // PDAs
      const [streamPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("stream"), userKey.toBuffer(), expertKey.toBuffer()],
        PROGRAM_ID
      );

      const [vaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("vault"), streamPda.toBuffer()],
        PROGRAM_ID
      );

      // Token Accounts
      const senderTokenAccount = await getAssociatedTokenAddress(
        USDC_MINT,
        userKey
      );

      const recipientTokenAccount = await getAssociatedTokenAddress(
        USDC_MINT,
        expertKey
      );

      const tx = await program.methods
        .closeStream()
        .accounts({
          stream: streamPda,
          vaultAccount: vaultPda,
          sender: userKey,
          senderTokenAccount: senderTokenAccount,
          recipient: expertKey,
          recipientTokenAccount: recipientTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc();

      console.log("Stream closed! TX:", tx);
      return tx;
    } catch (err) {
      console.error("Error closing stream:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { startStream, endStream, loading };
};
