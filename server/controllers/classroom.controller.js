import Classroom from '../models/Classroom.js';
import User from '../models/User.js';
import Course from '../models/Course.js';

export const createClassroom = async (req, res) => {
  try {
    const { name, studentIds, teacherIds, schedule } = req.body;

    const classroom = new Classroom({
      name,
      students: studentIds,
      teachers: teacherIds,
      schedule
    });

    await classroom.save();

    await User.updateMany(
      { _id: { $in: [...studentIds, ...teacherIds] } },
      { $push: { classes: classroom._id } }
    );

    res.status(201).json(classroom);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllClassrooms = async (req, res) => {
  try {
    const classes = await Classroom.find()
      .populate('students', 'name email role')
      .populate('teachers', 'name email role');
    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getClassroomById = async (req, res) => {
  try {
    const classroom = await Classroom.findById(req.params.id)
      .populate('students', 'name email role')
      .populate('teachers', 'name email role');

    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }

    res.json(classroom);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateClassroom = async (req, res) => {
  try {
    const { name, studentIds, teacherIds, schedule } = req.body;

    const updated = await Classroom.findByIdAndUpdate(
      req.params.id,
      {
        name,
        students: studentIds,
        teachers: teacherIds,
        schedule
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteClassroom = async (req, res) => {
  try {
    const classroom = await Classroom.findByIdAndDelete(req.params.id);

    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }

    await User.updateMany(
      { _id: { $in: [...classroom.students, ...classroom.teachers] } },
      { $pull: { classes: classroom._id } }
    );

    res.json({ message: 'Classroom deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getTeacherClasses = async (req, res) => {
  try {
    const teacherId = req.params.id; 

    const classes = await Classroom.find({ teachers: teacherId })
      .populate('students', 'name email role')
      .populate('teachers', 'name email role');

    const classesWithCourses = await Promise.all(
      classes.map(async (cls) => {
        const courses = await Course.find({ classroom: cls._id });
        return {
          ...cls.toObject(),
          courses
        };
      })
    );

    res.json(classesWithCourses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
