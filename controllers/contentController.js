// import ContentProject from "../models/ContentProject.js";

// export const createContentProject = async (req, res) => {
//   try {
//     const { projectName, brief } = req.body;

//     const project = await ContentProject.create({
//       userId: req.user.id,
//       projectName,
//       brief
//     });

//     res.json(project);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// export const getContentProjects = async (req, res) => {
//   try {
//     const projects = await ContentProject.find({ userId: req.user.id })
//       .sort({ createdAt: -1 });

//     res.json(projects);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
