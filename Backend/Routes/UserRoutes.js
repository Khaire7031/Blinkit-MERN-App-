import { Router } from "express";
import { forgotPasswordController, loginController, logoutController, refreshTokenController, registerUserController, resetPasswordController, updateUserDetails, uploadAvatar, verifyEmailController, verifyForgotPasswordController } from "../Controllers/userController.js"
import { Auth } from "../MiddleWare/Auth.js";
import upload from "../MiddleWare/Multer.js";


const userRouter = Router();

userRouter.post("/register", registerUserController);
userRouter.post("/verify-email", verifyEmailController);
userRouter.post("/login", loginController);
userRouter.get("/logout", Auth, logoutController);
userRouter.put("/upload-avatar", Auth, upload.single('avatar'), uploadAvatar);
userRouter.put("/update-user", Auth, updateUserDetails);
userRouter.put("/forgot-password", forgotPasswordController);
userRouter.put("/verify-forgot-password-otp", verifyForgotPasswordController);
userRouter.put("/reset-password", resetPasswordController);
userRouter.post("/refresh-token", refreshTokenController);


export { userRouter };
