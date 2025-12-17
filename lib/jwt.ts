import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-this-in-production";
const TOKEN_EXPIRY = "7d";

export interface TokenPayload {
  userId: string;
  walletAddress?: string;
  email?: string;
  role: string;
}

export function generateToken(
  userId: string,
  role: string,
  walletAddress?: string,
  email?: string
): string {
  const payload: TokenPayload = {
    userId,
    role,
  };

  if (walletAddress) payload.walletAddress = walletAddress;
  if (email) payload.email = email;

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: TOKEN_EXPIRY,
  });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}
