import { authService } from '@gateway/api/auth/auth.service';
import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export class AuthController {
  public async signup(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await authService.signUp(req.body);
    req.session = { jwt: response.data.token };
    res.status(StatusCodes.CREATED).json({ message: response.data.message, user: response.data.user });
  }

  public async signin(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await authService.signIn(req.body);
    const { message, user, token, browserName, deviceType } = response.data;
    req.session = { jwt: token };
    res.status(StatusCodes.OK).json({ message, user, browserName, deviceType });
  }

  public async signout(req: Request, res: Response): Promise<void> {
    req.session = null;
    res.status(StatusCodes.OK).json({ message: 'Logout successful', user: {} });
  }

  public async verifyEmail(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await authService.verifyEmail(req.body.token);
    res.status(StatusCodes.OK).json({ message: response.data.message, user: response.data.user });
  }

  public async refreshToken(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await authService.getRefreshToken(req.params.username);
    req.session = { jwt: response.data.token };
    res.status(StatusCodes.OK).json({ message: response.data.message, user: response.data.user });
  }

  public async forgotPassword(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await authService.forgotPassword(req.body.email);
    res.status(StatusCodes.OK).json({ message: response.data.message });
  }

  public async resetPassword(req: Request, res: Response): Promise<void> {
    const { password, confirmPassword } = req.body;
    const response: AxiosResponse = await authService.resetPassword(req.params.token, password, confirmPassword);
    res.status(StatusCodes.OK).json({ message: response.data.message });
  }

  public async changePassword(req: Request, res: Response): Promise<void> {
    const { currentPassword, newPassword } = req.body;
    const response: AxiosResponse = await authService.changePassword(currentPassword, newPassword);
    res.status(StatusCodes.OK).json({ message: response.data.message });
  }

  public async seed(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await authService.seed(req.params.count);
    res.status(StatusCodes.OK).json({ message: response.data.message });
  }
}
