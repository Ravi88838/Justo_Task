import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

export const loginValidation = [
  body("username").notEmpty().withMessage("Username is required"),
  body("password").notEmpty().withMessage("Password is required"),
];
