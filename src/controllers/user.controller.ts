import { Request, Response, NextFunction } from "express";
import { CreateUserSchema, UserIdParamSchema } from "../schemas/user.schema";
import { storage } from "../services/storage/storage.service";
import { formatZodError } from "../utils/formatZodError";
import { userService } from "../services/user.service";

export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const parseResult = CreateUserSchema.safeParse(req.body);

    if (!parseResult.success) {
      const fieldErrors = formatZodError(parseResult.error, req.body);
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: fieldErrors,
      });
    }

    const user = await userService.createUser(parseResult.data);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllUsers(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const users = await userService.getAllUsers();

    // res.cookie("token", "xuznd-fhdjdf-2342342-dfgdfg", {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "strict",
    //   maxAge: 24 * 60 * 60 * 1000, // 1 day
    // });

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    next(error);
  }
}

export async function getUserById(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  const parseResult = UserIdParamSchema.safeParse(req.params);

  if (!parseResult.success) {
    const fieldErrors = formatZodError(parseResult.error, req.params);
    return res.status(400).json({
      success: false,
      error: "Validation failed",
      details: fieldErrors,
    });
  }

  try {
    const user = await userService.getUserById(parseResult.data.id);

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function uploadUserProfilePicture(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const parseResult = UserIdParamSchema.safeParse(req.params);

    // Check the user id (Valid or invalid)
    if (!parseResult.success) {
      const fieldErrors = formatZodError(parseResult.error, req.params);
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: fieldErrors,
      });
    }

    // Check the user existance here:
    const existingUser = await userService.getUserById(parseResult.data.id);
    if (!existingUser) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, error: "No image file provided." });
    }
    // We upload buffer to cloudinary through stream.
    const storedFile = await storage.save(req.file);
    const dbResult = await userService.updateProfilePicture(
      parseResult.data.id,
      storedFile.url,
    );

    if (!dbResult) {
      return res
        .status(404)
        .json({ success: false, error: "File upload failed!" });
    }

    res.status(200).json({ success: true, data: dbResult });
  } catch (error) {
    next(error);
  }
}

export async function uploadUserImages(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const parseResult = UserIdParamSchema.safeParse(req.params);
    if (!parseResult.success) {
      const fieldErrors = formatZodError(parseResult.error, req.params);
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: fieldErrors,
      });
    }

    const files = req.files as Express.Multer.File[] | undefined;

    if (!files || files.length === 0) {
      return res
        .status(400)
        .json({ success: false, error: "No image files provided" });
    }

    const existingUser = await userService.getUserById(parseResult.data.id);
    if (!existingUser) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const storedFiles = await storage.saveMany(files);
    const imageUrls = storedFiles.map((file) => file.url);

    const images = await userService.addUserImages(
      parseResult.data.id,
      imageUrls,
    );

    return res.status(201).json({
      success: true,
      message: "Images uploaded successfully",

      data: {
        userId: parseResult.data.id,
        images: images.map((image) => image.image_url),
      },
    });
  } catch (error) {
    next(error);
  }
}
