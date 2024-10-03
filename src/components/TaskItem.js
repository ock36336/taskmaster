// src/components/TaskItem.js
import React from 'react';
import { ListItem, ListItemText, Checkbox, IconButton, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const TaskItem = ({ task, toggleComplete, deleteTask, openEditDialog }) => {
  return (
    <ListItem
      divider
      sx={{
        backgroundColor: task.completed ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.9)',
        borderRadius: '8px',
        mb: 1,
      }}
    >
      <Checkbox
        checked={task.completed}
        onChange={() => toggleComplete(task.id, task.completed)}
        color="primary"
      />
      <ListItemText
        primary={task.task}
        secondary={task.category}
        sx={{
          textDecoration: task.completed ? 'line-through' : 'none',
          color: 'black',
          transition: 'color 0.3s, text-decoration 0.3s',
        }}
      />
      {task.imageUrl && (
        <Box
          component="img"
          src={task.imageUrl}
          alt="Task"
          sx={{
            width: 80,
            height: 80,
            objectFit: 'cover',
            borderRadius: '8px',
            mr: 2,
            cursor: 'pointer',
          }}
          onClick={() => window.open(task.imageUrl, '_blank')}
        />
      )}
      <IconButton edge="end" aria-label="edit" onClick={() => openEditDialog(task)}>
        <EditIcon />
      </IconButton>
      <IconButton
        edge="end"
        aria-label="delete"
        onClick={() => deleteTask(task.id)}
        sx={{ color: 'error.main' }}
      >
        <DeleteIcon />
      </IconButton>
    </ListItem>
  );
};

export default TaskItem;
