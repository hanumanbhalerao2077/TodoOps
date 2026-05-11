const Todo = require("../models/todoModel");
const { body, validationResult } = require('express-validator');
const logger = require('../utils/logger');

// Input validation middleware
const validateTodoInput = [
  body('task')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Task must be between 1 and 500 characters')
    .matches(/^[^<>&"']*$/)
    .withMessage('Task contains invalid characters'),
];

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errorMessage: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Base route to welcome users
exports.baseRoot = (req, res) => {
  res
    .status(200)
    .send(
      `<h1>✅ Welcome to MERN-Todofy! </h1><p>See Live Web URL for this Server - <a href="https://mern-todofy.netlify.app">https://mern-todofy.netlify.app</a></p>`
    );
};

exports.getTask = async (req, res) => {
  try {
    const allTask = await Todo.find().select('-__v'); // Exclude version field
    logger.info(`Fetched ${allTask.length} tasks`, { ip: req.ip, userAgent: req.get('User-Agent') });
    res.status(200).json(allTask);
  } catch (err) {
    logger.error('Error fetching tasks:', { error: err.message, stack: err.stack });
    res.status(500).json({ errorMessage: 'Failed to fetch tasks' });
  }
};

exports.createTask = [
  validateTodoInput,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { task } = req.body;

      logger.info('Task created successfully', {
        taskId: newList._id,
        task: task.substring(0, 50),
        ip: req.ip
      });
      res.status(201).json({
        message: "Task created successfully.",
        newList: {
          _id: newList._id,
          task: newList.task,
          isCompleted: newList.isCompleted,
          createdAt: newList.createdAt
        }
      });
    } catch (err) {
      logger.error('Error creating task:', { error: err.message, stack: err.stack, task: req.body.task }
      console.error('Error creating task:', err);
      res.status(500).json({ errorMessage: 'Failed to create task' });
    }
  }
];

exportlogger.warn('Invalid task ID format attempted', { id, ip: req.ip });
      return res.status(400).json({ errorMessage: 'Invalid task ID format' });
    }

    const deleted = await Todo.findByIdAndDelete(id);
    if (!deleted) {
      logger.warn('Task not found for deletion', { id, ip: req.ip });
      return res.status(404).json({ errorMessage: "Task not found." });
    }
    logger.info('Task deleted successfully', { taskId: id, ip: req.ip });
    res.status(200).json({ message: "Task deleted successfully." });
  } catch (err) {
    logger.error('Error deleting task:', { error: err.message, stack: err.stack, taskId: req.params.id }ete(id);
    if (!deleted) {
      return res.status(404).json({ errorMessage: "Task not found." });
    }
    res.status(200).json({ message: "Task deleted successfully." });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ errorMessage: 'Failed to delete task' });
  }
};

exports.updateTask = [
  validateTodoInput,
  handlelogger.warn('Invalid task ID format for update', { id, ip: req.ip });
        return res.status(400).json({ errorMessage: 'Invalid task ID format' });
      }

      // Validate isCompleted if provided
      if (isCompleted !== undefined && typeof isCompleted !== 'boolean') {
        logger.warn('Invalid isCompleted value', { isCompleted, type: typeof isCompleted, ip: req.ip });
        return res.status(400).json({ errorMessage: 'isCompleted must be a boolean' });
      }

      const updateData = {};
      if (task !== undefined) updateData.task = task;
      if (isCompleted !== undefined) updateData.isCompleted = isCompleted;

      const updated = await Todo.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
      });

      if (!updated) {
        logger.warn('Task not found for update', { id, ip: req.ip });
        return res.status(404).json({ errorMessage: "Task not found." });
      }

      logger.info('Task updated successfully', {
        taskId: id,
        updates: updateData,
        ip: req.ip
      });
      res.status(200).json({
        message: "Task updated successfully.",
        updatedTask: {
          _id: updated._id,
          task: updated.task,
          isCompleted: updated.isCompleted,
          updatedAt: updated.updatedAt
        }
      });
    } catch (err) {
      logger.error('Error updating task:', {
        error: err.message,
        stack: err.stack,
        taskId: req.params.id,
        updates: req.body
      }
          _id: updated._id,
          task: updated.task,
          isCompleted: updated.isCompleted,
          updatedAt: updated.updatedAt
        }
      });
    } catch (err) {
      console.error('Error updating task:', err);
      res.status(500).json({ errorMessage: 'Failed to update task' });
    }
  }
];
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ errorMessage: "Task not found." });
    }

    res.status(200).json({ message: "Task updated successfully.", updated });
  } catch (err) {
    res.status(500).json({ errorMessage: err.message });
  }
};
