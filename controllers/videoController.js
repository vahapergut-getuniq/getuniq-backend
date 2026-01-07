// import VideoProject from "../models/VideoProject.js";

// export const createVideoProject = async (req, res) => {
//   try {
//     const { projectName, brief } = req.body;

//     const project = await VideoProject.create({
//       userId: req.user.id,
//       projectName,
//       brief
//     });

//     res.json(project);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// export const getVideoProjects = async (req, res) => {
//   try {
//     const projects = await VideoProject.find({ userId: req.user.id })
//       .sort({ createdAt: -1 });

//     res.json(projects);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
