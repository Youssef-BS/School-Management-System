import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.route.js'
import userRoutes from './routes/user.routes.js';
import courseRoutes from './routes/course.routes.js';
import classroomRoutes from './routes/classroom.route.js';
import messageRoutes from './routes/message.route.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/classrooms', classroomRoutes);
app.use('/api/messages', messageRoutes);

connectDB();

const PORT =  5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
