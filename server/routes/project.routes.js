import express from 'express';
import { body, validationResult } from 'express-validator';
import { protect, adminOnly } from '../middleware/auth.js';
import Project from '../models/Project.js';
import User from '../models/User.js';

const router = express.Router();

// @route   GET /api/projects
// @desc    Get all projects
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let projects;
    if (req.user.role === 'admin') {
      projects = await Project.find({})
        .populate('createdBy', 'firstName email')
        .populate('members.user', 'firstName email');
    } else {
      projects = await Project.find({ 'members.user': req.user._id })
        .populate('createdBy', 'firstName email')
        .populate('members.user', 'firstName email');
    }
    res.json({ success: true, count: projects.length, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/projects
// @desc    Create new project
// @access  Private (Admin only)
router.post('/', protect, adminOnly, [
  body('name').trim().notEmpty().withMessage('Project name is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, description, priority, endDate } = req.body;

    const project = await Project.create({
      name,
      description,
      priority,
      endDate,
      createdBy: req.user._id,
      members: [{ user: req.user._id, role: 'owner' }]
    });

    await project.populate('createdBy', 'firstName email');

    res.status(201).json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/projects/:id
// @desc    Get project by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('createdBy', 'firstName email')
      .populate('members.user', 'firstName email')
      .populate('teams');
    
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Check if user is member of project
    const isMember = project.members.some(m => m.user._id.toString() === req.user._id.toString());
    if (req.user.role !== 'admin' && !isMember) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this project' });
    }

    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Only admin or project owner can update
    const isOwner = project.members.some(m => 
      m.user.toString() === req.user._id.toString() && m.role === 'owner'
    );
    
    if (req.user.role !== 'admin' && !isOwner) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this project' });
    }

    const { name, description, status, priority, endDate } = req.body;
    
    project.name = name || project.name;
    project.description = description || project.description;
    project.status = status || project.status;
    project.priority = priority || project.priority;
    project.endDate = endDate || project.endDate;

    await project.save();
    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/projects/:id/members
// @desc    Add member to project
// @access  Private (Admin only)
router.post('/:id/members', protect, adminOnly, async (req, res) => {
  try {
    const { userId, role } = req.body;
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Check if user already in project
    const alreadyMember = project.members.some(m => m.user.toString() === userId);
    if (alreadyMember) {
      return res.status(400).json({ success: false, message: 'User already a member of this project' });
    }

    project.members.push({ user: userId, role: role || 'member' });
    await project.save();

    // Update user's projects
    await User.findByIdAndUpdate(userId, { $push: { projects: project._id } });

    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Private (Admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    await project.deleteOne();
    res.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
