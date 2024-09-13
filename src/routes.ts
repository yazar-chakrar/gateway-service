import { Application } from 'express';
import { healthRoutes } from '@gateway/health/health.route';

export const appRoutes = (app: Application) => {
  app.use('', healthRoutes.routes());
};
