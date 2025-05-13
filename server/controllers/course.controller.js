import Course from '../models/Course.js';

export const createCourse = async (req, res) => {
  try {
    const { title, description , createdBy , classroom } = req.body;
    const files = req.files.map(file => `/uploads/courses/${file.filename}`);

    const newCourse = new Course({
      title,
      description,
      createdBy,
      classroom,
      files
    });

    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('createdBy', 'name email');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
