import { Router } from "express";
import {
  addImageMessage,
  addMessage,
  addVoiceRecordMessage,
  getAllMessages,
  getInitialContactsWithMessages,
} from "../Controllers/MessageControllers.js";
import multer from "multer";

const router = Router();

const uploadImage = multer({ dest: "uploads/images" }); // we will be using this as a path for image to save on DB

const uploadVoiceRecord = multer({ dest: "uploads/recordings" });

router.post("/add-message", addMessage);
router.get("/get-all-message/:from/:to", getAllMessages);
router.post("/add-image-message", uploadImage.single("image"), addImageMessage);
router.post(
  "/add-voice-message",
  uploadVoiceRecord.single("audio"),
  addVoiceRecordMessage
);
router.get("/get-initial-contacts/:from", getInitialContactsWithMessages);

export default router;
