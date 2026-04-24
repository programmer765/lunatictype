import jwt from 'jsonwebtoken';
import { jwt_secret } from '../env';
import userDb from '../db/user';
import { User } from '../prisma/generated/client';


export default async function validateToken(token: string): Promise<number> {
  try {
    const parsedUser = jwt.verify(token, jwt_secret) as { userId: number };
    const requiredFields = { id: true };
    const user : User | null = await userDb.findByUserId(parsedUser.userId);
    if (!user) {
      console.log('User not found for token validation, userId:', parsedUser.userId);
      throw new Error('User not found');
    }
    return user.id;
  }
  catch (error) {
    console.error('Error validating token:', error);
    throw new Error(error instanceof Error ? error.message : 'token validation failed');
  }
}