import http from 'http';

import { Application } from 'express';
import { Logger } from 'winston';
import { winstonLogger } from '@yazar-chakrar/brikoula-shared';
import { config } from '@gateway/config/config';
import { securityMiddleware, standardMiddleware, errorHandlerMiddleware } from '@gateway/middlewares';

const SERVER_PORT = config.SERVER_PORT;
const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationServer', 'debug');

export class GatewayServer {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  public start(): void {
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.errorHandlerMiddleware(this.app, log);
    this.startServer(this.app);
  }

  private securityMiddleware(app: Application): void {
    securityMiddleware(app);
  }

  private standardMiddleware(app: Application): void {
    standardMiddleware(app);
  }

  private errorHandlerMiddleware(app: Application, log: Logger): void {
    errorHandlerMiddleware(app, log);
  }

  private async startServer(app: Application): Promise<void> {
    try {
      const httpServer: http.Server = new http.Server(app);
      this.startHttpServer(httpServer);
    } catch (error) {
      log.log('error', 'GatewayService startServer() error method:', error);
    }
  }

  private async startHttpServer(httpServer: http.Server): Promise<void> {
    try {
      log.info(`Gateway server has started with process id ${process.pid}`);
      httpServer.listen(SERVER_PORT, () => {
        log.info(`Gateway server running on port ${SERVER_PORT}`);
      });
    } catch (error) {
      log.log('error', 'GatewayService startServer() error method:', error);
    }
  }
}
