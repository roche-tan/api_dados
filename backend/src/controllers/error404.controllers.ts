import { Request, Response } from "express";

export const error404 = (_req: Request, res: Response) => {
  try {
    res.status(404).json({
      msg: `Error 404 - Page Not Found`
    });
  } catch (error) {
    res.status(500).json({
      msg: `Error 500 - Internal Server Error`
    });
  }
};
