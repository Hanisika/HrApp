const express = require('express');
const router = express.Router();
const ProjectAssignment = require('../model/projectAssignment');
const ProjectUpdate = require('../model/projectUpdate');
const Project = require('../model/project');

// 🔹 Route to assign a project
router.post('/assign', async (req, res) => {
  try {
    const { projectId, projectName, description, teamId, employees } = req.body;

    const assignment = new ProjectAssignment({
      projectId,
      projectName,
      description,
      teamId,
      employees,
    });

    await assignment.save();
    res.status(201).json({ message: 'Project assigned successfully' });
  } catch (error) {
    console.error('Error assigning project:', error);
    res.status(500).json({ message: 'Failed to assign project' });
  }
});

// 🔹 Route to get all assigned projects
router.get('/assignments', async (req, res) => {
  try {
    const assignments = await ProjectAssignment.find();
    res.json({ assignments });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ message: 'Failed to fetch assignments' });
  }
});

// 🔹 Route to get projects assigned to an employee by email
router.get('/projects/employee/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const assignments = await ProjectAssignment.find({ employees: email });

    // Optional: Populate project info from Project collection
    const detailedProjects = await Promise.all(
      assignments.map(async (assignment) => {
        const project = await Project.findById(assignment.projectId);
        return {
          _id: project?._id || assignment.projectId,
          projectName: assignment.projectName || project?.name || 'Unnamed Project',
          description: assignment.description || project?.description || '',
        };
      })
    );

    res.json({ projects: detailedProjects });
  } catch (err) {
    console.error('Error fetching employee projects:', err);
    res.status(500).json({ message: 'Failed to get projects for employee' });
  }
});

// 🔹 Route to submit a project update
router.post('/updates', async (req, res) => {
  try {
    const { employeeEmail, projectId, updateLink } = req.body;

    const update = new ProjectUpdate({
      employeeEmail,
      projectId,
      updateLink,
    });

    await update.save();
    res.status(201).json({ message: 'Project update submitted successfully' });
  } catch (error) {
    console.error('Error submitting update:', error);
    res.status(500).json({ message: 'Failed to submit update' });
  }
});

// 🔹 Route to get updates submitted by an employee
router.get('/updates/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const updates = await ProjectUpdate.find({ employeeEmail: email });
    res.json({ updates });
  } catch (err) {
    console.error('Error fetching updates:', err);
    res.status(500).json({ message: 'Failed to get updates' });
  }
});

// 🔹 Optional route to get all updates (admin/HR use)
router.get('/updates/all', async (req, res) => {
  try {
    const updates = await ProjectUpdate.find();
    res.json({ updates });
  } catch (error) {
    console.error('Error fetching updates:', error);
    res.status(500).json({ message: 'Failed to fetch updates' });
  }
});

module.exports = router;
