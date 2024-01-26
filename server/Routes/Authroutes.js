import { Router } from "express";
import {
  CheckEmail,
  OnBoardUser,
  generateToken,
  getAllUsers,
} from "../Controllers/Authcontroller.js";

const router = Router();

router.post("/check-user", CheckEmail);

router.post("/onboard-user", OnBoardUser);

router.get("/get-alluser-name", getAllUsers);

router.get("/generate-token/:userId", generateToken);

export default router;
