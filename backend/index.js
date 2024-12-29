import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoute.js";
import tasksRoutes from "./routes/taskRoute.js";
dotenv.config();

const port = process.env.PORT || 5000;
const app = express();

// Connect to MongoDB
connectDB();

const corsOptions = {
  origin: "https://task-manager-todo-app.vercel.app",
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api", tasksRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
