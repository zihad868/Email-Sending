import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import { AuthController } from "./auth.controller";

const router = express.Router();

router.post("/create-employee", AuthController.createEmployee);
router.post("/login", AuthController.loginUser);

router.post("/forgot-password", AuthController.forgetPassword);

router.patch("/reset-password", auth(), AuthController.resetPassword);

router.patch("/verify-otp", AuthController.verifyUserByOTP);

router.patch("/logout", auth(), AuthController.logOutUser);

router.post("/refresh-token", AuthController.refreshToken);

router.get("/me", auth(), AuthController.getMyProfile);

export const AuthRoutes = router;
