import Jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

export const generateToken = (payload:JwtPayload, secret:string, expiresIn:string): string => {
  const token = Jwt.sign(payload, secret, { expiresIn } as SignOptions);
  return token;
};

export const verifyToken = (token: string, secret: string): JwtPayload => {
  try {
    const decoded = Jwt.verify(token, secret) as JwtPayload;
    return decoded;
  } catch {
    throw new Error("Token verification failed");
  }
}