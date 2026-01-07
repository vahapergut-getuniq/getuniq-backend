// import WebProject from "../models/WebProject.js";

// export const createWebProject = async (req, res) => {
//   try {
//     const { projectName, brief } = req.body;

//     const project = await WebProject.create({
//       userId: req.user.id,
//       projectName,
//       brief
//     });

//     res.json(project);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// export const getWebProjects = async (req, res) => {
//   try {
//     const projects = await WebProject.find({ userId: req.user.id })
//       .sort({ createdAt: -1 });

//     res.json(projects);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
