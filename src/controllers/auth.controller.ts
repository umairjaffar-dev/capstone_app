import { NextFunction, Request, Response } from "express";
import { LoginUserSchema, RegisterUserSchema } from "../schemas/auth.schema";
import { formatZodError } from "../utils/formatZodError";
import { authService } from "../services/auth.service";

export async function registerUserController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const parseResult = RegisterUserSchema.safeParse(req.body);
    if (!parseResult.success) {
      const fieldErrors = formatZodError(parseResult.error, req.body);
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: fieldErrors,
      });
    }

    const user = await authService.register(parseResult.data);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function loginUserController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const parseResult = LoginUserSchema.safeParse(req.body);

    if (!parseResult.success) {
      const fieldErrors = formatZodError(parseResult.error, req.body);
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: fieldErrors,
      });
    }

    const user = await authService.login(parseResult.data);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    req.session.userId = user.id;
    req.session.role = user.role;

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export function logoutUserController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  req.session.destroy((error) => {
    if (error) {
      return next(error);
    }

    res.clearCookie("connect.sid");
    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  });
}
