import UserModel from "../Models/user.js";
import bcryptjs from "bcryptjs";
import sendEmail from "../Config/sendEmail.js";
import verifyEmailTemplate from "../Utils/verifyEmailTemplate.js";
import dotenv from "dotenv";
import { generateAccessToken, generateRefreshToken } from "../Utils/generateAccessToken.js";
import { uploadImageToCloudinary } from '../Utils/uploadImageCloudinary.js'
import { generateOtp } from "../Utils/generateOtp.js";
import otpEmailTemplate from "../Utils/otpEmailTemplate.js";
import jwt from "jsonwebtoken"

dotenv.config();

// Register User
const registerUserController = async (request, response) => {
    try {
        const { name, email, password } = request.body;

        if (!name || !email || !password) {
            return response.status(400).json({
                message: "Provide email, name, and password.",
                error: true,
                success: false,
            });
        }

        const user = await UserModel.findOne({ email });

        if (user) {
            return response.status(400).json({
                message: "Email already registered.",
                error: true,
                success: false,
            });
        }

        // Hash Password
        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(password, salt);

        // Create a new user object
        const newUser = new UserModel({
            name,
            email,
            password: hashPassword,
            verify_email: false,
        });

        const savedUser = await newUser.save();

        const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${savedUser._id}`;

        // Send verification email
        await sendEmail({
            sendTo: email,
            subject: "Verification Email - Pranav Ecommerce",
            html: verifyEmailTemplate({
                name,
                url: verifyEmailUrl,
            }),
        });

        return response.status(201).json({
            message: "User registered successfully. Please verify your email.",
            error: false,
            success: true,
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || "Error in registering user.",
            error: true,
            success: false,
        });
    }
};

// Verify Email
const verifyEmailController = async (request, response) => {
    try {
        const { code } = request.body;

        const user = await UserModel.findById(code);

        if (!user) {
            return response.status(400).json({
                message: "Invalid verification code.",
                error: true,
                success: false,
            });
        }

        if (user.verify_email) {
            return response.status(400).json({
                message: "Email is already verified.",
                error: true,
                success: false,
            });
        }

        await UserModel.updateOne({ _id: code }, { verify_email: true });

        return response.status(200).json({
            message: "Email verified successfully.",
            error: false,
            success: true,
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || "Error verifying email.",
            error: true,
            success: false,
        });
    }
};

// Login User
const loginController = async (request, response) => {
    try {
        const { email, password } = request.body;

        const user = await UserModel.findOne({ email });

        if (!user) {
            return response.status(400).json({
                message: "User not registered.",
                error: true,
                success: false,
            });
        }

        // if (!user.verify_email) {
        //     return response.status(403).json({
        //         message: "Please verify your email before logging in.",
        //         error: true,
        //         success: false,
        //     });
        // }

        if (user.status !== "Active") {
            return response.status(403).json({
                message: "Account inactive. Contact admin.",
                error: true,
                success: false,
            });
        }

        const checkPassword = await bcryptjs.compare(password, user.password);

        if (!checkPassword) {
            return response.status(401).json({
                message: "Incorrect password.",
                error: true,
                success: false,
            });
        }

        const accessToken = await generateAccessToken(user._id);
        const refreshToken = await generateRefreshToken(user._id);

        console.log(accessToken, " : ", refreshToken)

        const cookiesOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        };

        response.cookie("accessToken", accessToken, cookiesOptions);
        response.cookie("refreshToken", refreshToken, cookiesOptions);

        return response.status(200).json({
            message: "Login successful.",
            error: false,
            success: true,
            data: {
                accessToken,
                refreshToken,
            },
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || "Error logging in.",
            error: true,
            success: false,
        });
    }
};

// Logout 
const logoutController = async (request, response) => {
    try {
        const userId = request.userId;
        const cookiesOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        };
        response.clearCookie("accessToken", cookiesOptions);
        response.clearCookie("refreshToken", cookiesOptions);

        const removeRefreshToken = await UserModel.findByIdAndUpdate(userId, {
            refresh_token: ""
        })

        return response.json({
            message: "Logout Successfully.",
            error: false,
            success: true,
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
}


const uploadAvatar = async (request, response) => {
    try {

        const userId = request.userId; // Auth MiddleWare
        const image = request.file; // Multer Middleware

        const upload = await uploadImageToCloudinary(image);

        const updateUser = await UserModel.findByIdAndUpdate(userId, {
            avatar: upload.url
        })

        return response.json({
            message: "Upload Profile Picture",
            data: {
                _id: userId,
                avatar: upload.url
            },
            error: false,
            success: true,
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
}

// Update User Detail
const updateUserDetails = async (request, response) => {
    try {

        const userId = request.userId; // Auth Middleware
        const { name, email, mobile, password } = request.body;

        let hashPassword = ""
        if (password) {
            // Hash Password
            const salt = await bcryptjs.genSalt(10);
            hashPassword = await bcryptjs.hash(password, salt);

        }

        const updateUser = await UserModel.updateOne({ _id: userId }, {
            ...(name && { name: name }),
            ...(email && { email: email }),
            ...(mobile && { mobile: mobile }),
            ...(password && { password: hashPassword }),
        })

        return response.status(200).json({
            message: "Updated User Successfully.",
            error: false,
            success: true,
            data: updateUser
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
}


const forgotPasswordController = async (request, response) => {
    try {
        const { email } = request.body;

        const user = await UserModel.findOne({ email });

        if (!user) {
            return response.status(401).json({
                message: "User not exist with this email Id",
                error: true,
                success: false,
            });
        }

        const otp = generateOtp();

        const expireTime = new Date() + 60 * 60 * 1000; // In 1 Hour

        const update = await UserModel.findByIdAndUpdate(user._id, {
            forgot_password_otp: otp,
            forgot_password_expiry: new Date(expireTime).toISOString(),
        });


        // Send Email

        await sendEmail({
            sendTo: email,
            subject: "Forgot Password from Pranav Ecommerce.",
            html: otpEmailTemplate({
                username: user.name,
                otp: otp
            })
        })

        return response.json({
            message: `OTP send on ${email}`,
            success: true,
            error: false
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
}


const verifyForgotPasswordController = async (request, response) => {
    try {
        const { email, otp } = request.body;
        if (!email || !otp) {
            return response.status(400).json({
                message: "Provide Email and OTP",
                error: true,
                success: false,
            });
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return response.status(401).json({
                message: "User not exist with this email Id",
                error: true,
                success: false,
            });
        }

        const currentTime = new Date().toISOString();

        const expiryTime = user.forgot_password_expiry;

        if (currentTime > expiryTime) {
            return response.status(400).json({
                message: `OTP is expired.`,
                success: false,
                error: true
            })
        }

        if (otp !== user.forgot_password_otp) {
            return response.status(400).json({
                message: `Invalid OTP`,
                error: true,
                success: false
            })
        }


        return response.json({
            message: `Verify OTP successfully.`,
            error: false,
            success: true
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
}


const resetPasswordController = async (request, response) => {
    try {
        const { email, newPassword, confirmPassword } = request.body;

        if (!email || !newPassword || !confirmPassword) {
            return response.status(400).json({
                message: "Provide Required Feild.",
                error: true,
                success: false,
            });
        }

        if (confirmPassword !== newPassword) {
            return response.status(400).json({
                message: "Password is not Match.",
                error: true,
                success: false,
            });
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return response.status(500).json({
                message: "User is not exist.",
                error: true,
                success: false,
            });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(newPassword, salt);

        const update = await UserModel.findOne(user._id, {
            password: hashPassword
        })

        return response.status(200).json({
            message: "Password updated SuccessFully.",
            error: false,
            success: true,
        });


    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
}


// Refersh Token 
const refreshTokenController = async (request, response) => {
    try {

        const refreshToken = request.cookies.refreshToken || request?.header?.authorization?.split(" ")[1];

        if (!refreshToken) {
            return response.status(401).json({
                message: "Invalid Token.",
                error: true,
                success: false,
            });
        }

        const verifyToken = await jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN);

        if (!verifyToken) {
            return response.status(200).json({
                message: "Token is expired.",
                error: true,
                success: false,
            });
        }

        // console.log("verifyToken  :::::::::::", verifyToken)

        const userId = verifyToken?.id;

        const newAccessToken = await generateAccessToken(userId);

        const cookiesOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        };

        response.cookie("accessToken", newAccessToken, cookiesOptions);

        return response.status(200).json({
            message: "New Access Token generated.",
            error: false,
            success: true,
            data: {
                accessToken: newAccessToken
            }
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
}

export { refreshTokenController, resetPasswordController, verifyForgotPasswordController, registerUserController, verifyEmailController, loginController, logoutController, uploadAvatar, updateUserDetails, forgotPasswordController };

