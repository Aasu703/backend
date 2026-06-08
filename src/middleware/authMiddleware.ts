import jwt from 'jsonwebtoken';
import { Request } from 'express';
import { GraphQLContext } from '../dto/authDto';
import { JWT_SECRET } from '../config';

type ContextArgs = { req: Request };

export const buildContext = async ({ req }: ContextArgs): Promise<GraphQLContext> => {
  const token = req.headers.authorization?.replace('Bearer ', '') || '';
  
  if (!token) return { currentUser: null };

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return { currentUser: { id: decoded.userId } };
  } catch (err) {
    return { currentUser: null };
  }
};