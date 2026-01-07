import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProjectStep,
  renameProject,
  deleteProject,
  updateWebOfficeStatus,   // <-- 🔥 EKLEDİK
} from "../controllers/projectController.js";

const router = express.Router();

// CREATE
router.post("/", authMiddleware, createProject);

// LIST
router.get("/", authMiddleware, getProjects);

// GET ONE
router.get("/:id", authMiddleware, getProjectById);

// STEP UPDATE
router.patch("/:id/step", authMiddleware, updateProjectStep);

// RENAME
router.patch("/:id/rename", authMiddleware, renameProject);

// DELETE
router.delete("/:id", authMiddleware, deleteProject);

// 🆕 WEB OFFICE STATUS
router.patch(
  "/:id/web/weboffice/status",
  authMiddleware,
  updateWebOfficeStatus
);

export default router;
