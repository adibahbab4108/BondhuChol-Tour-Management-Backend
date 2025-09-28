import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

export const validateRequest =
  (zodSchema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // re-assigning Zod validated data to req.body
      // This is necessary to ensure that the data is validated before it reaches the controller
      // and to avoid any type errors in TypeScript.
<<<<<<< HEAD
      req.body = await zodSchema.parseAsync(req.body);
=======
      if(req.body.data){
        req.body = JSON.parse(req.body.data);
      }
      
      req.body = await zodSchema.parseAsync(req.body);

>>>>>>> part6
      next();
    } catch (error) {
      next(error);
    }
  };
