import { CustomError, IErrorResponse } from '@yazar-chakrar/brikoula-shared';
import { isAxiosError } from 'axios';
import { Application, NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Logger } from 'winston';

const DEFAULT_ERROR_CODE = 500;

export const errorHandlerMiddleware = (app: Application, log: Logger): void => {
  app.use('*', (req: Request, res: Response, next: NextFunction) => {
    const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    log.log('error', `${fullUrl} endpoint does not exist.`, '');
    res.status(StatusCodes.NOT_FOUND).json({ message: 'The endpoint called does not exist.' });
    next();
  });

  app.use((error: IErrorResponse, _req: Request, res: Response, next: NextFunction) => {
    if (error instanceof CustomError) {
      log.log('error', `GatewayService ${error.comingFrom}:`, error);
      res.status(error.statusCode).json(error.serializeErrors());
    }

    if (isAxiosError(error)) {
      log.log('error', `GatewayService Axios Error - ${error?.response?.data?.comingFrom}:`, error);
      res
        .status(error?.response?.data?.statusCode ?? DEFAULT_ERROR_CODE)
        .json({ message: error?.response?.data?.message ?? 'Error occurred.' });
    }

    next();
  });
};
