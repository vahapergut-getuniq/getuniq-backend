import Project from "../models/Project.js";
import { useCredits } from "../utils/useCredits.js";
import { CREDIT_COSTS } from "../config/creditCosts.js";

/* ============================================================
   PIPELINE STEP MAP (TEK OTORİTE)
============================================================ */
const PIPELINE_STEPS = {
  branding: {
    fast: ["brief", "samples", "prompt", "generate", "choose", "brandkit", "export"],
    pro: ["brief", "samples", "moodboard", "prompt", "generate", "choose", "redesign", "export"],
    elite: [
      "brief",
      "samples",
      "moodboard",
      "prompt",
      "generate",
      "choose",
      "redesign",
      "feedback",
      "designer",
      "designerlogo",
      "identity",
      "export",
    ],
  },

  /* ================= WEB ================= */
  web: {
    onepage: ["brief", "design", "content", "build", "online"],
    landing: ["brief", "design", "content", "revisions", "online"],

    weboffice: [
      "home",
      "brief",
      "preparation",
      "proposal",
      "payment",
      "design",
      "frontend",
      "backend",
      "integration",
      "cms",
      "content",
      "test",
      "revisions",
      "online",
    ],
  },

  /* ================= MARKETING ================= */
  marketing: {
    dna: ["brief", "research", "contentplan", "publish", "report", "optimize"],
    growth: ["brief", "audit", "strategy", "setup", "execution", "optimize"],
    full: ["brief", "audit", "dna", "strategy", "execution", "optimize"],
  },

  /* ================= CONTENT ================= */
  content: {
    post: ["brief", "script", "design", "export"],
    reel: ["brief", "script", "shoot", "edit", "export"],
    real: ["brief", "script", "shoot", "edit", "export"],
  },
};

/* ============================================================
   STEP → CREDIT MAP
============================================================ */
const STEP_CREDIT_MAP = {
  branding: {
    generate: CREDIT_COSTS.branding.generate,
    redesign: CREDIT_COSTS.branding.redesign,
    designerlogo: CREDIT_COSTS.branding.designer_logo,
    identity: CREDIT_COSTS.branding.identity,
  },
  web: {
    generate: CREDIT_COSTS.web.web_office,
  },
  marketing: {
    dna: CREDIT_COSTS.marketing.dna,
    growth: CREDIT_COSTS.marketing.growth,
    full: CREDIT_COSTS.marketing.full,
  },
};

/* ============================================================
   ACTIVITY LOG HELPER
============================================================ */
const pushActivity = async (projectId, activity) => {
  await Project.findByIdAndUpdate(projectId, {
    $push: {
      activities: {
        ...activity,
        createdAt: new Date(),
      },
    },
  });
};

/* ============================================================
   CREATE PROJECT
============================================================ */
export const createProject = async (req, res) => {
  try {
    const { studio, pipeline } = req.body;

    if (!studio) return res.status(400).json({ message: "studio required" });

    const titles = {
      branding: "Branding Project",
      web: "Web Project",
      content: "Content Project",
      marketing: "Marketing Project",
    };

    const project = await Project.create({
      userId: req.user.id,
      type: studio,
      title: titles[studio] || "New Project",
      progress: 0,
      completedSteps: [],
      pipelines: pipeline ? { [pipeline]: { steps: [] } } : {},
      data: {},
      lastLocation: "",
      webOfficeStatus: pipeline === "weboffice" ? "proposal" : null,
      activities: [],
    });

    await pushActivity(project._id, {
      type: "create",
      message: "Project created",
    });

    return res.status(201).json({ project });
  } catch (err) {
    console.error("❌ CREATE PROJECT ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ============================================================
   GET PROJECTS
============================================================ */
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user.id }).sort({ createdAt: -1 });
    return res.json({ projects });
  } catch (err) {
    return res.status(500).json({ message: "Fetch error" });
  }
};

/* ============================================================
   GET SINGLE PROJECT
============================================================ */
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!project) return res.status(404).json({ message: "Project not found" });

    return res.json({ project });
  } catch {
    return res.status(500).json({ message: "Fetch error" });
  }
};

/* ============================================================
   UPDATE STEP + CREDIT GUARD
============================================================ */
export const updateProjectStep = async (req, res) => {
  try {
    const { studio, pipeline, step, location, data } = req.body;

    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!project) return res.status(404).json({ message: "Project not found" });

    const safeStudio = studio || project.type;
    const safePipeline = pipeline || null;
    const safeStep = step || null;

    /* CREDIT GUARD */
    const creditCost = STEP_CREDIT_MAP?.[safeStudio]?.[safeStep];
    if (creditCost) {
      await useCredits({
        userId: req.user.id,
        amount: creditCost,
        source: `${safeStudio}_${safeStep}`,
        refId: project._id.toString(),
      });
    }

    /* ================= PIPELINE INIT ================= */
    project.pipelines = project.pipelines || {};

    if (safePipeline) {
      if (!project.pipelines[safePipeline]) {
        project.pipelines[safePipeline] = { steps: [] };
      }
    }

    /* STEP TRACKING */
    if (safeStep) {
      if (!project.completedSteps.includes(safeStep)) {
        project.completedSteps.push(safeStep);
      }

      if (safePipeline) {
        const arr = project.pipelines[safePipeline].steps || [];
        if (!arr.includes(safeStep)) arr.push(safeStep);
        project.pipelines[safePipeline].steps = arr;
      }

      await pushActivity(project._id, {
        type: "step",
        message: `Completed: ${safePipeline}/${safeStep}`,
      });
    }

    /* LAST LOCATION */
    if (location) project.lastLocation = location;

    /* DATA MERGE */
    if (data && typeof data === "object") {
      project.data = { ...project.data, ...data };
    }

    /* PROGRESS CALC */
    if (safePipeline && PIPELINE_STEPS[safeStudio]?.[safePipeline]) {
      const total = PIPELINE_STEPS[safeStudio][safePipeline].length;
      const done = project.pipelines[safePipeline]?.steps?.length || 0;
      project.progress = Math.round((done / total) * 100);
    }

    await project.save();
    return res.json({ project });
  } catch (err) {
    return res.status(500).json({ message: "Step update error", error: err.message });
  }
};

/* ============================================================
   RENAME PROJECT
============================================================ */
export const renameProject = async (req, res) => {
  try {
    const { title } = req.body;

    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { title },
      { new: true }
    );

    if (!project) return res.status(404).json({ message: "Project not found" });

    await pushActivity(project._id, {
      type: "rename",
      message: `Renamed to "${title}"`,
    });

    return res.json({ project });
  } catch {
    return res.status(500).json({ message: "Rename error" });
  }
};

/* ============================================================
   DELETE PROJECT
============================================================ */
export const deleteProject = async (req, res) => {
  try {
    await Project.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    return res.json({ success: true });
  } catch {
    return res.status(500).json({ message: "Delete error" });
  }
};

/* ============================================================
   UPDATE WEB OFFICE STATUS
============================================================ */
export const updateWebOfficeStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["proposal", "approved", "paid", "production"];

    if (!allowed.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { webOfficeStatus: status },
      { new: true }
    );

    if (!project) return res.status(404).json({ message: "Project not found" });

    await pushActivity(project._id, {
      type: "web_status", // ⭐ Doğru enum
      message: `WebOffice → ${status}`,
    });

    return res.json({ project });
  } catch {
    return res.status(500).json({ message: "Status update error" });
  }
};
