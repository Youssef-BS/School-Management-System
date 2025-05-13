import express from 'express';
import {
  createClassroom,
  getAllClassrooms,
  getClassroomById,
  updateClassroom,
  deleteClassroom , 
  getTeacherClasses
} from '../controllers/classroom.controller.js';

const router = express.Router();

router.post('/', createClassroom);
router.get('/', getAllClassrooms);
router.get('/:id', getClassroomById);
router.put('/:id', updateClassroom);
router.delete('/:id', deleteClassroom);
router.get('/my-classes/:id', getTeacherClasses);

export default router;
