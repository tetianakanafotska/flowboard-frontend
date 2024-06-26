import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Grid, Button } from "@mui/material";
import TaskList from "../components/TaskList";
import TaskEditor from "./TaskEditor";
import AddTask from "./AddTask";
import tasksService from "../services/task.service";
import { DragDropContext } from "react-beautiful-dnd";

function Dashboard({ withAddTask }) {
  const [toDoTasks, setToDoTasks] = useState([]);
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [doneTasks, setDoneTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]);

  const [openEditor, setOpenEditor] = useState(null);
  const [addTask, setAddTask] = useState(null);
  const { taskId } = useParams();
  const navigate = useNavigate();

  console.log("dashboard updated", allTasks);

  useEffect(() => {
    const fetchTasksByType = async () => {
      try {
        const toDo = await tasksService.getByType("toDo");
        const inProgress = await tasksService.getByType("inProgress");
        const done = await tasksService.getByType("done");
        setToDoTasks(toDo.data);
        setInProgressTasks(inProgress.data);
        setDoneTasks(done.data);
      } catch (error) {
        console.error("Failed to fetch and set tasks:", error);
      }
    };
    fetchTasksByType();
  }, []);

  useEffect(() => {
    setAllTasks([...toDoTasks, ...inProgressTasks, ...doneTasks]);
  }, [toDoTasks, inProgressTasks, doneTasks]);

  useEffect(() => {
    if (taskId && allTasks.some((task) => task._id === taskId)) {
      setOpenEditor(true);
    } else if (typeof taskId !== "undefined") {
      navigate("*");
    }
  }, [taskId]);

  useEffect(() => {
    setAddTask(withAddTask);
  }, [withAddTask]);

  const handleDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;
    const { index: sourceIndex, droppableId: sourceId } = source;
    const { index: destIndex, droppableId: destId } = destination;

    if (sourceId === destId && sourceIndex === destIndex) return;

    console.log(sourceIndex, sourceId, "-->", destIndex, destId);

    const taskMap = {
      toDo: allTasks.filter((task) => task.type === "toDo"),
      inProgress: allTasks.filter((task) => task.type === "inProgress"),
      done: allTasks.filter((task) => task.type === "done"),
    };

    const sourceTasks = [...taskMap[sourceId]];
    const destTasks = sourceId === destId ? sourceTasks : [...taskMap[destId]];
    const [movedTask] = sourceTasks.splice(sourceIndex, 1);
    const taskLeft = destTasks[destIndex - 1];
    const taskRight = destTasks[destIndex];
    const leftPosition = taskLeft ? taskLeft.position : 0;
    const rightPosition = taskRight ? taskRight.position : leftPosition + 2;
    const newPosition = (leftPosition + rightPosition) / 2;

    const updatedTask = { ...movedTask, type: destId, position: newPosition };
    destTasks.splice(destIndex, 0, updatedTask);

    const updateState = (sourceId, destId, sourceTasks, destTasks) => {
      const setters = {
        toDo: setToDoTasks,
        inProgress: setInProgressTasks,
        done: setDoneTasks,
      };
      setters[destId](destTasks);
      setters[sourceId](sourceTasks);
    };
    updateState(sourceId, destId, sourceTasks, destTasks);
    await tasksService.put(movedTask._id, updatedTask);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      {openEditor && (
        <TaskEditor
          setOpenEditor={setOpenEditor}
          allTasks={allTasks}
          setAllTasks={setAllTasks}
        />
      )}
      {addTask && (
        <AddTask
          setAddTask={setAddTask}
          allTasks={allTasks}
          setAllTasks={setAllTasks}
        />
      )}
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="flex-start"
        component="main"
        width="calc(100vw - 80px)"
        className="dashboard-main"
      >
        <Grid item lg={4} md={4} sm={12} xs={12}>
          <TaskList
            listType="toDo"
            setOpenEditor={setOpenEditor}
            tasks={allTasks.filter((task) => task.type === "toDo")}
          />
        </Grid>

        <Grid item lg={4} md={4} sm={12} xs={12}>
          <TaskList
            listType="inProgress"
            setOpenEditor={setOpenEditor}
            tasks={allTasks.filter((task) => task.type === "inProgress")}
          />
        </Grid>

        <Grid item lg={4} md={4} sm={12} xs={12}>
          <TaskList
            listType="done"
            setOpenEditor={setOpenEditor}
            tasks={allTasks.filter((task) => task.type === "done")}
          />
        </Grid>
        <Button
          id="btn-add-task"
          size="large"
          variant="contained"
          aria-label="add a task"
          startIcon={<AddCircleOutlineIcon />}
          onClick={() => {
            navigate("/addTask");
          }}
        >
          Add a task
        </Button>
      </Grid>
    </DragDropContext>
  );
}

export default Dashboard;
