"use client";

interface Task {
  _id: string;
  title: string;
  priority: number;
  status: "Pending" | "Finished";
  startTime: string;
  endTime: string;
  totalTime: number;
  userId: string;
}

import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Toggle } from "@/components/ui/toggle";

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<number | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Partial<Task>>({});

  useEffect(() => {
    fetchTasks(currentPage);
  }, [currentPage, statusFilter, priorityFilter]);

  const fetchTasks = async (page: number) => {
    try {
      setIsLoading(true);
      const url = new URL("http://localhost:5000/api/tasks");
      url.searchParams.append("page", page.toString());
      url.searchParams.append("limit", totalPage.toString());
      if (statusFilter) {
        url.searchParams.append("status", statusFilter);
      }

      if (priorityFilter !== null) {
        url.searchParams.append("priority", priorityFilter.toString());
      }

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data = await response.json();
      console.log(data);
      setTasks(data.tasks);
      setTotalPage(data.totalPages);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = () => {
    setCurrentTask({});
    setIsDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    setIsDialogOpen(true);
  };

  const handleSaveTask = () => {
    setIsDialogOpen(false);
    alert("Task saved successfully");
  };

  const handleSort = (
    field: "startTime" | "endTime" | "reset",
    order?: "asc" | "desc"
  ) => {
    if (field === "reset") {
      setTasks([...tasks].sort((a, b) => a._id.localeCompare(b._id)));
      return;
    }

    setTasks(
      [...tasks].sort((a, b) => {
        const dateA = new Date(a[field]);
        const dateB = new Date(b[field]);
        return order === "asc"
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      })
    );
  };

  const handleTaskSelect = (taskId: string) => {
    setSelectedTasks(
      selectedTasks.includes(taskId)
        ? selectedTasks.filter((id) => id !== taskId)
        : [...selectedTasks, taskId]
    );
  };

  const handleDeleteSelected = () => {
    setTasks(tasks.filter((task) => !selectedTasks.includes(task._id)));
    setSelectedTasks([]);
  };

  const handleStatusChange = (status: string) => {
    const statusLowerCase = status.toLowerCase();

    setStatusFilter(statusLowerCase);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Task list</h1>
      </div>

      <div className="flex justify-between items-center">
        <div className="space-x-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddTask}>
                <Plus className="w-4 h-4 mr-2" />
                Add task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle className="text-lg font-medium">
                {currentTask._id ? "Edit Task" : "Add Task"}
              </DialogTitle>
              <form className="space-y-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium ">Title</label>
                  <input
                    type="text"
                    value={currentTask.title || ""}
                    onChange={(e) =>
                      setCurrentTask({ ...currentTask, title: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium ">Priority</label>
                  <input
                    type="number"
                    value={currentTask.priority || 1}
                    onChange={(e) =>
                      setCurrentTask({
                        ...currentTask,
                        priority: Number(e.target.value),
                      })
                    }
                    min={1}
                    max={5}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium ">Status</label>
                  <Toggle
                    pressed={currentTask.status === "Finished"}
                    onPressedChange={(pressed) =>
                      setCurrentTask({
                        ...currentTask,
                        status: pressed ? "Finished" : "Pending",
                      })
                    }
                    className="mt-1"
                  />
                </div>

                <div className="flex justify-between">
                  <div className="mb-4">
                    <label className="block text-sm font-medium">
                      Start Time
                    </label>
                    <input
                      type="datetime-local"
                      value={currentTask.startTime}
                      onChange={(e) =>
                        setCurrentTask({
                          ...currentTask,
                          startTime: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium">
                      End Time
                    </label>
                    <input
                      type="datetime-local"
                      value={currentTask.endTime}
                      onChange={(e) =>
                        setCurrentTask({
                          ...currentTask,
                          endTime: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                {/* Add other fields as needed */}
              </form>
              <DialogFooter>
                <Button
                  variant="secondary"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveTask}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button
            variant="destructive"
            disabled={selectedTasks.length === 0}
            onClick={handleDeleteSelected}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete selected
          </Button>
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary">Sort</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleSort("startTime", "asc")}>
                Start time: ASC
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort("startTime", "desc")}>
                Start time: DESC
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort("endTime", "asc")}>
                End time: ASC
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort("endTime", "desc")}>
                End time: DESC
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleSort("reset")}
                className="text-red-500"
              >
                Remove sort
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Priority</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setPriorityFilter(1)}>
                1
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPriorityFilter(2)}>
                2
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPriorityFilter(3)}>
                3
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPriorityFilter(4)}>
                4
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPriorityFilter(5)}>
                5
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPriorityFilter(null)}>
                All
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Status</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleStatusChange("pending")}>
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange("finished")}>
                Finished
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No tasks found</p>
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox />
                </TableHead>
                <TableHead>Task ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>End Time</TableHead>
                <TableHead>Total time to finish (hrs)</TableHead>
                <TableHead>Edit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task._id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedTasks.includes(task._id)}
                      onCheckedChange={() => handleTaskSelect(task._id)}
                    />
                  </TableCell>
                  <TableCell>{task._id}</TableCell>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.priority}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        task.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {task.status}
                    </span>
                  </TableCell>
                  <TableCell>{task.startTime}</TableCell>
                  <TableCell>{task.endTime}</TableCell>
                  <TableCell>{task.totalTime}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <Pencil
                        className="w-4 h-4"
                        onClick={() => {
                          handleEditTask(task);
                          setIsDialogOpen(true);
                        }}
                      />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              Previous
            </Button>
            <span>
              Page {currentPage} of {totalPage}
            </span>
            <Button
              variant="outline"
              disabled={currentPage === totalPage}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPage))
              }
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
