import cookieSession from 'cookie-session';
import helmet from 'helmet';
import hpp from 'hpp';
import cors from 'cors';
import { Application } from 'express';
import { config } from '@gateway/config/config';

export const securityMiddleware = (app: Application): void => {
  app.set('trust proxy', 1);
  app.use(
    cookieSession({
      name: 'session',
      keys: [`${config.SECRET_KEY_ONE}`, `${config.SECRET_KEY_TWO}`],
      maxAge: 24 * 7 * 3600000,
      secure: config.NODE_ENV !== 'development',
      ...(config.NODE_ENV !== 'development' && {
        sameSite: 'none'
      })
    })
  );
  app.use(hpp());
  app.use(helmet());
  app.use(
    cors({
      origin: config.CLIENT_URL,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    })
  );
};
