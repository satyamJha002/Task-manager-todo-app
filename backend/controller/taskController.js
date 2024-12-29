import e from "express";
import Task from "../models/tasksSchema.js";

export const postTasks = async (req, res) => {
  const { title, startTime, endTime, priority, status } = req.body;
  const userId = req.user.id;

  try {
    if (!title || !startTime || !endTime || !priority || !status) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    const newTask = new Task({
      title,
      startTime,
      endTime,
      priority,
      status,
      userId,
    });

    await newTask.save();

    res.status(201).json({
      message: "Task added successfully",
      task: newTask,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const getAllTasks = async (req, res) => {
  const userId = req.user.id;

  try {
    const tasks = await Task.find({ userId });

    if (!tasks) {
      return res.status(404).json({
        message: "No tasks found",
      });
    }

    res.status(200).json({
      message: "Tasks fetched successfully",
      tasks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, startTime, endTime, priority, status } = req.body;
  const userId = req.user.id;

  try {
    const task = await Task.findOneAndUpdate(
      { _id: id, userId },
      { title, startTime, endTime, priority, status },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const getTasks = async (req, res) => {
  const { status, priority, sortBy, page = 1, limit = 10 } = req.query;
  const userId = req.user.id;

  try {
    const query = { userId };

    if (status) query.status = status;
    if (priority) query.priority = priority;

    const tasks = await Task.find(query)
      .sort(sortBy ? { [sortBy]: 1 } : { createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Task.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      message: "Tasks fetched successfully",
      tasks,
      totalPages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const getTaskStats = async (req, res) => {
  const userId = req.user.id;

  try {
    const tasks = await Task.find({ userId });
    const totalCounts = tasks.length;

    const completedTasks = tasks.filter((task) => task.status === "finished");
    const percentCompleted =
      Math.round((completedTasks.length / totalCounts) * 100) || 0;
    const percentPending = 100 - percentCompleted;

    const avgCompletionTime =
      completedTasks.reduce((acc, task) => {
        const duration =
          new Date(task.endTime).getTime() - new Date(task.startTime).getTime();
        return acc + duration / (1000 * 60 * 60);
      }, 0) / (completedTasks.length || 1);

    const pendingStat = {};
    for (let i = 1; i <= 5; i++) {
      const priorityTasks = tasks.filter(
        (task) => task.priority === i && task.status === "pending"
      );

      const lapsed = priorityTasks.reduce((acc, task) => {
        const elapsed = Date.now() - new Date(task.startTime).getTime();
        return acc + elapsed / (1000 * 60 * 60);
      }, 0);

      const balance = priorityTasks.reduce((acc, task) => {
        const remaining = new Date(task.endTime).getTime() - Date.now();
        return acc + Math.max(0, remaining / (1000 * 60 * 60));
      }, 0);

      pendingStat[i] = { lapsed, balance };
    }

    res.status(200).json({
      totalCounts,
      percentCompleted,
      percentPending,
      avgCompletionTime: Math.round(avgCompletionTime * 10) / 10,
      pendingStat,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};
