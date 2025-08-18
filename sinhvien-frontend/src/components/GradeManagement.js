import React, { useState, useEffect } from 'react';
import { gradeAPI, studentAPI, courseAPI } from '../services/api';

function GradeManagement() {
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    student: { id: '' },
    course: { id: '' },
    grade: ''
  });

  useEffect(() => {
    fetchGrades();
    fetchStudents();
    fetchCourses();
  }, []);

  const fetchGrades = async () => {
    try {
      const response = await gradeAPI.getAll();
      setGrades(response.data);
    } catch (error) {
      console.error('Error fetching grades:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await studentAPI.getAll();
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await courseAPI.getAll();
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const gradeData = {
        student: { id: parseInt(formData.student.id) },
        course: { id: parseInt(formData.course.id) },
        grade: parseFloat(formData.grade)
      };
      await gradeAPI.create(gradeData);
      fetchGrades();
      setShowForm(false);
      setFormData({ student: { id: '' }, course: { id: '' }, grade: '' });
    } catch (error) {
      console.error('Error creating grade:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Grade Management</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setFormData({ student: { id: '' }, course: { id: '' }, grade: '' });
          }}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add New Grade
        </button>
      </div>

      {showForm && (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-xl font-bold mb-4">Add New Grade</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Student
              </label>
              <select
                value={formData.student.id}
                onChange={(e) => setFormData({ ...formData, student: { id: e.target.value } })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
                <option value="">Select a student</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name} ({student.studentId})
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Course
              </label>
              <select
                value={formData.course.id}
                onChange={(e) => setFormData({ ...formData, course: { id: e.target.value } })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
                <option value="">Select a course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name} ({course.code})
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Grade
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Course
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Grade
              </th>
            </tr>
          </thead>
          <tbody>
            {grades.map((grade) => (
              <tr key={grade.id}>
                <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                  {grade.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                  {grade.student ? `${grade.student.name} (${grade.student.studentId})` : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                  {grade.course ? `${grade.course.name} (${grade.course.code})` : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                  {grade.grade}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GradeManagement;