import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";

function TaskCard({ task }) {
  const navigate = useNavigate();

  const convertDates = (createdAt, dueAt) => {
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
      });
    };
    const createdAtFormatted = formatDate(createdAt);
    const dueAtFormatted = formatDate(dueAt);
    if (dueAt) {
      return `${createdAtFormatted} - ${dueAtFormatted}`;
    } else return createdAtFormatted;
  };

  return (
    <Paper
      className="task-card"
      sx={{
        mb: 1,
        p: "10px 20px",
        position: "relative",
        bgcolor: "#fff",
      }}
    >
      <Chip label={task.priority} value={task.priority} />
      <Typography
        variant="body1"
        component="h4"
        sx={{ margin: "7px 0 10px", fontWeight: "700" }}
      >
        {task.title}
      </Typography>
      <Typography variant="body2" gutterBottom>
        {task.description}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
          margin: "10px 0 5px",
        }}
      >
        <AccessTimeIcon sx={{ width: "15px" }} />
        {convertDates(task.createdAt, task.dueAt)}
      </Typography>

      <IconButton
        id="btn-edit-task"
        onClick={() => {
          navigate(`tasks/${task._id}`);
        }}
        aria-label="edit the task"
      >
        <EditIcon sx={{ width: 17, height: 17 }} />
      </IconButton>
    </Paper>
  );
}

export default TaskCard;
