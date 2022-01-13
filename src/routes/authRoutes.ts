import Router from 'express';
import config from 'config';
import jwt from 'jsonwebtoken';

export const authRouter = Router();

const generateAccessToken = (user: { login: string }): string => (
  jwt.sign(user, config.get('tokenConf.access_secret'), { expiresIn: '45m' })
);

authRouter.post('/auth', (req, res) => {
  const { login } = req.body;
  const payload = {
    login
  };

  const accessToken = generateAccessToken(payload);

  res.json({ accessToken });
});
