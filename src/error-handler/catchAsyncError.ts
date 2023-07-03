import { Request, Response, NextFunction } from 'express';

const catchAsyncErrors = (theFunc: (req: Request, res: Response, next: NextFunction | undefined) => Promise<unknown>) =>
  async (req: Request, res: Response, next: NextFunction | undefined) => {
    try {
      await theFunc(req, res, next);
    } catch (error) {
      next?.(error);
    }
  };

export default catchAsyncErrors;
