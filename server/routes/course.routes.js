import express from 'express';
import { createCourse, getAllCourses } from '../controllers/course.controller.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { checkRole } from '../middleware/checkRole.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.get('/', getAllCourses);

router.post(
  '/',
  upload.array('files', 10),
  createCourse
);

export default router;
