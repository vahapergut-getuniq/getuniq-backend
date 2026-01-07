import Project from "../models/Project.js";

export const updateBrandingStep = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { pipeline, step, data } = req.body;

    if (!pipeline || !step) {
      return res.status(400).json({ message: "Pipeline and step are required" });
    }

    await Project.findByIdAndUpdate(projectId, {
      $set: {
        [`pipelines.branding.${pipeline}.data.${step}`]: data,
      },
      $addToSet: {
        [`pipelines.branding.${pipeline}.steps`]: step,
      },
    });

    res.json({ success: true });
  } catch (err) {
    console.error("updateBrandingStep error:", err);
    res.status(500).json({ message: "Save failed" });
  }
};
