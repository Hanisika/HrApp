const express = require('express');
const router = express.Router();
const Employee=require('../model/Employee')

// 🔹 PUT /assign-project (update employee with project info)
router.put('/assign-project', async (req, res) => {
  try {
    const { employeeEmail, projectName, team, reportingManager } = req.body;

    const employee = await Employee.findOne({ email: employeeEmail });

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    employee.projectName = projectName;
    employee.team = team;
    employee.reportingManager = reportingManager;

    await employee.save();

    res.status(200).json({
      success: true,
      message: 'Project assigned successfully',
      data: employee,
    });
  } catch (err) {
    console.error('Assign project error:', err);
    res.status(500).json({ success: false, message: 'Failed to assign project' });
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
    const employee = await User.findOne({ email });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json({
      projectName: employee.projectName,
      team: employee.team,
      reportingManager: employee.reportingManager,
    });
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
