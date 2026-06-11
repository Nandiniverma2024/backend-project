import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

const router=Router();

router.route("/register").post(registerUser); 
// /register hit hoga to user.router => registerUser method ko call kr dega


export default router;
