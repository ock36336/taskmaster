// src/components/TaskList.js
import React, { useEffect, useState, useCallback, lazy, Suspense } from 'react';
import { db, storage, auth } from '../firebase';
import { ref as dbRef, onValue, push, remove, update } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  Button,
  TextField,
  List,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { toast } from 'react-toastify';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import Header from './Header'; // Import Header component

// Lazy load TaskItem component
const TaskItem = lazy(() => import('./TaskItem'));

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [categories] = useState(['Work', 'Personal', 'Others']);
  const [filter, setFilter] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [editedTask, setEditedTask] = useState('');
  const [editedCategory, setEditedCategory] = useState('');
  const [dueDateTime, setDueDateTime] = useState(dayjs().add(1, 'hour'));

  useEffect(() => {
    const userId = auth.currentUser.uid;
    const tasksRef = dbRef(db, `tasks/${userId}`);
    onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();
      const tasksArray = [];
      for (let id in data) {
        tasksArray.push({ id, ...data[id] });
      }
      setTasks(tasksArray);
    });
  }, []);

  // ฟังก์ชันสำหรับแจ้งเตือน
  useEffect(() => {
    const interval = setInterval(() => {
      const now = dayjs();
      tasks.forEach(task => {
        if (task.dueDateTime && !task.notified) {
          const taskTime = dayjs(task.dueDateTime);
          const diff = taskTime.diff(now, 'minute');
          if (diff === 5) { // หากเหลือเวลา 5 นาที
            toast.info(
              <div>
                <strong>Reminder</strong>
                <div>{task.task}</div>
                <div>at {taskTime.format('hh:mm A')} Today</div>
              </div>
            );
            // อัปเดต task ว่าได้รับการแจ้งเตือนแล้ว
            const userId = auth.currentUser.uid;
            const taskRef = dbRef(db, `tasks/${userId}/${task.id}`);
            update(taskRef, { notified: true });
          }
        }
      });
    }, 10000); // ตรวจสอบทุก 0.6 นาที

    return () => clearInterval(interval);
  }, [tasks]);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const addTask = async () => {
    if (newTask.trim() === '') {
      toast.error('กรุณากรอกงานที่ต้องทำ');
      return;
    }
    setUploading(true);

    let imageUrl = null;
    if (image) {
      const userId = auth.currentUser.uid;
      const imageRef = storageRef(storage, `task_images/${userId}/${Date.now()}_${image.name}`);
      try {
        const snapshot = await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(snapshot.ref);
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error('การอัปโหลดรูปภาพล้มเหลว');
        setUploading(false);
        return;
      }
    }

    const userId = auth.currentUser.uid;
    const tasksRef = dbRef(db, `tasks/${userId}`);
    push(tasksRef, {
      task: newTask,
      completed: false,
      createdAt: Date.now(),
      imageUrl: imageUrl || null,
      category: 'Others',
      dueDateTime: dueDateTime.toISOString(),
      notified: false, // ฟิลด์เพื่อบันทึกว่ามีการแจ้งเตือนแล้วหรือยัง
    });
    setNewTask('');
    setImage(null);
    setDueDateTime(dayjs().add(1, 'hour'));
    setUploading(false);
    toast.success('เพิ่มงานสำเร็จ!');
  };

  const toggleComplete = useCallback((id, currentStatus) => {
    const userId = auth.currentUser.uid;
    const taskRef = dbRef(db, `tasks/${userId}/${id}`);
    update(taskRef, { completed: !currentStatus });
  }, []);

  const deleteTask = useCallback((id) => {
    const userId = auth.currentUser.uid;
    const taskRef = dbRef(db, `tasks/${userId}/${id}`);
    remove(taskRef);
    toast.success('ลบงานสำเร็จ!');
  }, []);

  const openEditDialog = (task) => {
    setEditingTask(task);
    setEditedTask(task.task);
    setEditedCategory(task.category);
    setDueDateTime(dayjs(task.dueDateTime));
  };

  const closeEditDialog = () => {
    setEditingTask(null);
    setEditedTask('');
    setEditedCategory('');
    setDueDateTime(dayjs().add(1, 'hour'));
  };

  const saveEditedTask = () => {
    if (editingTask) {
      const userId = auth.currentUser.uid;
      const taskRef = dbRef(db, `tasks/${userId}/${editingTask.id}`);
      update(taskRef, {
        task: editedTask,
        category: editedCategory,
        dueDateTime: dueDateTime.toISOString(),
        notified: false, // รีเซ็ตการแจ้งเตือนเมื่อแก้ไขงานใหม่
      });
      closeEditDialog();
      toast.success('แก้ไขงานสำเร็จ!');
    }
  };

  const filteredTasks = filter
    ? tasks.filter((task) => task.category === filter)
    : tasks;

  return (
    <>
    <Header /> {/* Include Header at the top */}
      <Paper
        elevation={6}
        sx={{
          padding: '30px',
          maxWidth: '900px',
          margin: '20px auto',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
        }}
      >
      {/* Header with Title and Logout Button */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" gutterBottom>
          บันทึกแจ้งเตือนงาน
        </Typography>
       
      </Box>

      {/* Add Task Section */}
      <Box display="flex" flexDirection="column" mb={4}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <TextField
              label="เพิ่มงานใหม่"
              variant="outlined"
              fullWidth
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="กำหนดวันที่และเวลา"
                value={dueDateTime}
                onChange={(newValue) => setDueDateTime(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box display="flex" alignItems="center">
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="icon-button-file"
                type="file"
                onChange={handleImageChange}
              />
              <label htmlFor="icon-button-file">
                <Button
                  component="span"
                  startIcon={<AddPhotoAlternateIcon />}
                  variant="contained"
                  color="primary"
                >
                  อัปโหลดรูปภาพ
                </Button>
              </label>
              <Button
                variant="contained"
                color="success"
                onClick={addTask}
                sx={{ ml: 2 }}
                disabled={uploading}
              >
                {uploading ? <CircularProgress size={24} color="inherit" /> : 'เพิ่มงาน'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Filter Section */}
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="filter-label">กรองตามประเภท</InputLabel>
          <Select
            labelId="filter-label"
            value={filter}
            label="กรองตามประเภท"
            onChange={(e) => setFilter(e.target.value)}
          >
            <MenuItem value="">ทั้งหมด</MenuItem>
            {categories.map((category, index) => (
              <MenuItem value={category} key={index}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Task List */}
      <List>
        <Suspense fallback={<div>Loading tasks...</div>}>
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              toggleComplete={toggleComplete}
              deleteTask={deleteTask}
              openEditDialog={openEditDialog}
            />
          ))}
        </Suspense>
      </List>

      {/* Edit Task Dialog */}
      <Dialog open={Boolean(editingTask)} onClose={closeEditDialog}>
        <DialogTitle>แก้ไขงาน</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={3} mt={1}>
            <TextField
              label="งาน"
              variant="outlined"
              fullWidth
              value={editedTask}
              onChange={(e) => setEditedTask(e.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel id="edit-category-label">ประเภท</InputLabel>
              <Select
                labelId="edit-category-label"
                value={editedCategory}
                label="ประเภท"
                onChange={(e) => setEditedCategory(e.target.value)}
              >
                {categories.map((category, index) => (
                  <MenuItem value={category} key={index}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="กำหนดวันที่และเวลา"
                value={dueDateTime}
                onChange={(newValue) => setDueDateTime(newValue)}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
            <Button variant="contained" color="primary" onClick={saveEditedTask}>
              บันทึก
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Paper>
    </>
  );
};

export default TaskList;
