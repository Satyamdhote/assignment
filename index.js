const express = require('express');
const { Sequelize, DataTypes, Op } = require('sequelize');
const taskModel = require('./models/task');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();

app.use(bodyParser.json());

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  });
  const Task = taskModel(sequelize, DataTypes);
  sequelize.sync();
  
app.get('/tasks', async (req, res) => {
    const { page = 1, pageSize = 5 } = req.query;
    try {
        const tasks = await Task.findAndCountAll({
        offset: (page - 1) * pageSize,
        limit: pageSize,
        });
        res.status(200).json(tasks);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/tasks', async (req, res) => {
    try {
      const { title, description, status } = req.body;
      const newTask = await Task.create({
        title,
        description,
        status,
      });
      res.status(201).json(newTask);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Define a route to update a task by its ID
app.put('/tasks/:taskId', async (req, res) => {
    try {
      const taskId = req.params.taskId; // Get the task ID from the URL parameters
      const { title, description, status } = req.body;
  
      // Check if the task with the given ID exists
      const existingTask = await Task.findByPk(taskId);
  
      if (!existingTask) {
        return res.status(404).json({ error: 'Task not found' });
      }
  
      // Update the task with the new data
      existingTask.title = title;
      existingTask.description = description;
      existingTask.status = status;
  
      // Save the updated task to the database
      await existingTask.save();
  
      // Send the updated task as the response
      res.status(200).json(existingTask);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Define a route to delete a task by its ID
app.delete('/tasks/:taskId', async (req, res) => {
    try {
      const taskId = req.params.taskId; // Get the task ID from the URL parameters
  
      // Check if the task with the given ID exists
      const existingTask = await Task.findByPk(taskId);
  
      if (!existingTask) {
        return res.status(404).json({ error: 'Task not found' });
      }
  
      // Delete the task from the database
      await existingTask.destroy();
  
      // Send a success response
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

  // Define a route to get task metrics
app.get('/task-metrics', async (req, res) => {
    try {
      // Define the date range for the metrics (e.g., July 2023 to August 2023)
      const startDate = new Date('September 1, 2023');
      const endDate = new Date('September 31, 2023');
  
      // Retrieve task metrics for each status (open, inprogress, completed) within the date range
      const metrics = await Task.findAll({
        attributes: [
          'status',
          [sequelize.fn('COUNT', sequelize.col('status')), 'count'],
          [sequelize.fn('date_trunc', 'month', sequelize.col('createdAt')), 'month'],
        ],
        where: {
          createdAt: {
            [Op.between]: [startDate, endDate],
          },
        },
        group: ['status', 'month'],
      });
  
      // Organize the metrics into the desired format
      const result = {
        open_tasks: 0,
        inprogress_tasks: 0,
        completed_tasks: 0,
      };
  
      const timelineMetrics = [];
  
      metrics.forEach((metric) => {
        const status = metric.getDataValue('status');
        const count = metric.getDataValue('count');
        const monthYear = metric.getDataValue('month');
  
        result[`${status}_tasks`] += count;
  
        const existingTimelineMetric = timelineMetrics.find(
          (entry) => entry.date === monthYear
        );
  
        if (existingTimelineMetric) {
          existingTimelineMetric.metrics[`${status}_tasks`] = count;
        } else {
          const newTimelineMetric = {
            date: monthYear,
            metrics: {
              open_tasks: 0,
              inprogress_tasks: 0,
              completed_tasks: 0,
            },
          };
  
          newTimelineMetric.metrics[`${status}_tasks`] = count;
          timelineMetrics.push(newTimelineMetric);
        }
      });
  
      // Send the metrics as a JSON response
      res.json({
        summary: result,
        timeline: timelineMetrics,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

app.listen(3000, () => {
    console.log('Connected to port 3000');
})