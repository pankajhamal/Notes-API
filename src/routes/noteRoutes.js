//This line is used to load express.js framework 
import express  from "express"
import { createNote, updateNote, deleteNote, readNote } from "../controller/noteController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

//to authenticate and authorized the user
router.use(authMiddleware);

router.post("/create-note", createNote);
router.put("/update-note/:id", updateNote);
router.delete("/delete-note/:id", deleteNote)
router.get("/read-note", readNote); //Fetch the note created by specific user

export default router;