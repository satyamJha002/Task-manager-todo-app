import mongoose from "mongoose";

const tasksScehma = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  priority: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "finished", "all"],
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Task = mongoose.model("Task", tasksScehma);

export default Task;
