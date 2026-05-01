import express from 'express';
import { body, validationResult } from 'express-validator';
import { protect, adminOnly } from '../middleware/auth.js';
import Team from '../models/Team.js';
import Project from '../models/Project.js';
import User from '../models/User.js';

const router = express.Router();

// @route   GET /api/teams
// @desc    Get all teams
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const teams = await Team.find({})
      .populate('project', 'name')
      .populate('leader', 'firstName email')
      .populate('members.user', 'firstName email');
    res.json({ success: true, count: teams.length, teams });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/teams/project/:projectId
// @desc    Get teams by project
// @access  Private
router.get('/project/:projectId', protect, async (req, res) => {
  try {
    const teams = await Team.find({ project: req.params.projectId })
      .populate('project', 'name')
      .populate('leader', 'firstName email')
      .populate('members.user', 'firstName email');
    res.json({ success: true, count: teams.length, teams });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/teams
// @desc    Create new team
// @access  Private (Admin only)
router.post('/', protect, adminOnly, [
  body('name').trim().notEmpty().withMessage('Team name is required'),
  body('project').notEmpty().withMessage('Project ID is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, description, project, leader } = req.body;

    // Check if project exists
    const projectExists = await Project.findById(project);
    if (!projectExists) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const team = await Team.create({
      name,
      description,
      project,
      leader: leader || req.user._id,
      members: [{ user: leader || req.user._id }]
    });

    // Add team to project
    projectExists.teams.push(team._id);
    await projectExists.save();

    // Add team to leader's teams
    await User.findByIdAndUpdate(leader || req.user._id, { $push: { teams: team._id } });

    await team.populate('project', 'name');
    await team.populate('leader', 'firstName email');

    res.status(201).json({ success: true, team });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/teams/:id
// @desc    Get team by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('project', 'name')
      .populate('leader', 'firstName email')
      .populate('members.user', 'firstName email');
    
    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    res.json({ success: true, team });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/teams/:id/members
// @desc    Add member to team
// @access  Private (Admin only)
router.post('/:id/members', protect, adminOnly, async (req, res) => {
  try {
    const { userId } = req.body;
    const team = await Team.findById(req.params.id);
    
    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    // Check if user already in team
    const alreadyMember = team.members.some(m => m.user.toString() === userId);
    if (alreadyMember) {
      return res.status(400).json({ success: false, message: 'User already in team' });
    }

    team.members.push({ user: userId });
    await team.save();

    // Add team to user's teams
    await User.findByIdAndUpdate(userId, { $push: { teams: team._id } });

    res.json({ success: true, team });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/teams/:id/members/:userId
// @desc    Remove member from team
// @access  Private (Admin only)
router.delete('/:id/members/:userId', protect, adminOnly, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    
    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    team.members = team.members.filter(m => m.user.toString() !== req.params.userId);
    await team.save();

    // Remove team from user's teams
    await User.findByIdAndUpdate(req.params.userId, { $pull: { teams: team._id } });

    res.json({ success: true, team });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/teams/:id
// @desc    Delete team
// @access  Private (Admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    
    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    // Remove team from project
    await Project.findByIdAndUpdate(team.project, { $pull: { teams: team._id } });

    // Remove team from all members
    for (const member of team.members) {
      await User.findByIdAndUpdate(member.user, { $pull: { teams: team._id } });
    }

    await team.deleteOne();
    res.json({ success: true, message: 'Team deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
