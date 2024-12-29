import express from "express";
import {
  getAllTasks,
  getTasks,
  getTaskStats,
  postTasks,
  updateTask,
} from "../controller/taskController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", authMiddleware, postTasks);
router.get("/alltasks", authMiddleware, getAllTasks);
router.get("/tasks", authMiddleware, getTasks);
router.put("/taskupdate/:id", authMiddleware, updateTask);
router.get("/tasks/stats", authMiddleware, getTaskStats);

export default router;
