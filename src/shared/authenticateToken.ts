import { Request, Response, NextFunction } from 'express';
import config from 'config';
import jwt from 'jsonwebtoken';

export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.sendStatus(401);
    return;
  }

  jwt.verify(token, config.get('tokenConf.access_secret'), (err) => {
    if (err) {
      res.sendStatus(403);
      return;
    }
    next();
  });
}
