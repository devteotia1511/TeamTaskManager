import express from 'express';
import { body, validationResult } from 'express-validator';
import { protect, adminOnly } from '../middleware/auth.js';
import Task from '../models/Task.js';
import User from '../models/User.js';
import Project from '../models/Project.js';

const router = express.Router();

// @route   GET /api/tasks
// @desc    Get all tasks (admin) or user's tasks (member)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let tasks;
    if (req.user.role === 'admin') {
      tasks = await Task.find({})
        .populate('assignedTo', 'firstName email')
        .populate('assignedBy', 'firstName email')
        .populate('project', 'name')
        .populate('team', 'name');
    } else {
      tasks = await Task.find({ assignedTo: req.user._id })
        .populate('assignedTo', 'firstName email')
        .populate('assignedBy', 'firstName email')
        .populate('project', 'name')
        .populate('team', 'name');
    }
    res.json({ success: true, count: tasks.length, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/tasks/project/:projectId
// @desc    Get tasks by project
// @access  Private
router.get('/project/:projectId', protect, async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId })
      .populate('assignedTo', 'firstName email')
      .populate('assignedBy', 'firstName email');
    res.json({ success: true, count: tasks.length, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/tasks/my-tasks
// @desc    Get current user's tasks with stats
// @access  Private
router.get('/my-tasks', protect, async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id })
      .populate('project', 'name')
      .populate('assignedBy', 'firstName email');
    
    const stats = {
      new: tasks.filter(t => t.status === 'new').length,
      active: tasks.filter(t => t.status === 'active').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      failed: tasks.filter(t => t.status === 'failed').length,
      overdue: tasks.filter(t => t.isOverdue).length
    };

    res.json({ success: true, stats, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/tasks
// @desc    Create new task
// @access  Private (Admin only)
router.post('/', protect, adminOnly, [
  body('title').trim().notEmpty().withMessage('Task title is required'),
  body('assignedTo').notEmpty().withMessage('Assignee is required'),
  body('dueDate').notEmpty().withMessage('Due date is required'),
  body('project').notEmpty().withMessage('Project is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { title, description, category, priority, dueDate, assignedTo, project, team } = req.body;

    const task = await Task.create({
      title,
      description,
      category: category || 'Development',
      priority: priority || 'medium',
      dueDate,
      assignedTo,
      assignedBy: req.user._id,
      project,
      team
    });

    // Update user's task counts
    const assignedUser = await User.findById(assignedTo);
    if (assignedUser) {
      assignedUser.taskCounts.newTask += 1;
      await assignedUser.save();
    }

    // Update project task counts
    await Project.findByIdAndUpdate(project, { 
      $inc: { 'taskCount.total': 1, 'taskCount.pending': 1 } 
    });

    await task.populate('assignedTo', 'firstName email');
    await task.populate('project', 'name');

    res.status(201).json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/tasks/:id
// @desc    Get task by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'firstName email')
      .populate('assignedBy', 'firstName email')
      .populate('project', 'name')
      .populate('team', 'name');
    
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Check if user is authorized (admin or assigned user)
    if (req.user.role !== 'admin' && task.assignedTo._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this task' });
    }

    res.json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update task
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Only admin or assigned user can update
    if (req.user.role !== 'admin' && task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this task' });
    }

    const { title, description, category, priority, dueDate } = req.body;
    
    task.title = title || task.title;
    task.description = description || task.description;
    task.category = category || task.category;
    task.priority = priority || task.priority;
    task.dueDate = dueDate || task.dueDate;

    await task.save();
    res.json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/tasks/:id/status
// @desc    Update task status (accept, complete, fail)
// @access  Private
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Only assigned user or admin can change status
    if (req.user.role !== 'admin' && task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const previousStatus = task.status;
    task.status = status;

    if (status === 'completed') {
      task.completedAt = new Date();
      // Update project counts
      await Project.findByIdAndUpdate(task.project, { 
        $inc: { 'taskCount.completed': 1, 'taskCount.pending': -1 } 
      });
    } else if (status === 'active' && previousStatus === 'new') {
      // Update project counts
      await Project.findByIdAndUpdate(task.project, { 
        $inc: { 'taskCount.inProgress': 1, 'taskCount.pending': -1 } 
      });
    }

    await task.save();

    // Update user's task counts
    const user = await User.findById(task.assignedTo);
    if (user) {
      if (previousStatus === 'new') user.taskCounts.newTask -= 1;
      if (previousStatus === 'active') user.taskCounts.active -= 1;
      
      if (status === 'active') user.taskCounts.active += 1;
      if (status === 'completed') user.taskCounts.completed += 1;
      if (status === 'failed') user.taskCounts.failed += 1;
      
      await user.save();
    }

    res.json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete task
// @access  Private (Admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    await task.deleteOne();
    res.json({ success: true, message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
