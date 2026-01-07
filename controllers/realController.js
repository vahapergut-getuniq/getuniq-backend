// import RealProject from "../models/RealProject.js";

// export const createRealProject = async (req, res) => {
//   try {
//     const { projectName, brief } = req.body;

//     const project = await RealProject.create({
//       userId: req.user.id,
//       projectName,
//       brief
//     });

//     res.json(project);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// export const getRealProjects = async (req, res) => {
//   try {
//     const projects = await RealProject.find({ userId: req.user.id })
//       .sort({ createdAt: -1 });

//     res.json(projects);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
