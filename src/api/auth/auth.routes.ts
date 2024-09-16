import { AuthController } from '@gateway/api/auth/signup.controller';
import express, { Router } from 'express';

class AuthRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.post('/auth/signup', AuthController.prototype.signup);
    this.router.post('/auth/signin', AuthController.prototype.signin);
    this.router.post('/auth/signout', AuthController.prototype.signout);
    this.router.put('/auth/verify-email', AuthController.prototype.verifyEmail);
    this.router.put('/auth/forgot-password', AuthController.prototype.forgotPassword);
    this.router.put('/auth/reset-password/:token', AuthController.prototype.resetPassword);
    this.router.put('/auth/change-password', AuthController.prototype.changePassword);
    this.router.put('/auth/seed/:count', AuthController.prototype.seed);
    return this.router;
  }
}

export const authRoutes: AuthRoutes = new AuthRoutes();
