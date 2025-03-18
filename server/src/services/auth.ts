// import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { GraphQLError } from 'graphql';

dotenv.config();

interface JwtPayload {
  _id: string;
  username: string;
  email: string,
}

export const authenticateToken = ({ req }: any) => {
  let token = req.body.token || req.query.token || req.headers.authorization;

  if (req.headers.authorization) {
    token = token.split(' ').pop().trim();
  }

  if (!token) {
    return { user: null };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || '') as JwtPayload;
    return { user: { _id: decoded._id, username: decoded.username, email: decoded.email } };
  } catch (error) {
    console.error(error);
    throw new GraphQLError('Invalid token');
  }
};

export const signToken = (username: string, email: string, _id: string) => {
  const payload = { username, email, _id };
  const secretKey = process.env.JWT_SECRET_KEY || '';

  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

export default { authenticateToken, signToken };
