import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Report() {
  const [reportData, setReportData] = useState({
    totalStudents: 0,
    totalCourses: 0,
    totalClasses: 0,
    averageGrade: 0
  });

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/reports/summary');
      setReportData(response.data);
    } catch (error) {
      console.error('Error fetching report data:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Summary Report</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-600 bg-opacity-75">
              <svg className="h-8 w-8 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-sm text-gray-600">Total Students</h2>
              <p className="text-2xl font-semibold text-gray-700">{reportData.totalStudents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-600 bg-opacity-75">
              <svg className="h-8 w-8 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-sm text-gray-600">Total Courses</h2>
              <p className="text-2xl font-semibold text-gray-700">{reportData.totalCourses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-600 bg-opacity-75">
              <svg className="h-8 w-8 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-sm text-gray-600">Total Classes</h2>
              <p className="text-2xl font-semibold text-gray-700">{reportData.totalClasses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-600 bg-opacity-75">
              <svg className="h-8 w-8 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-sm text-gray-600">Average Grade</h2>
              <p className="text-2xl font-semibold text-gray-700">{reportData.averageGrade.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">System Overview</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-gray-600">Student Management Status</span>
            <span className="text-green-600 font-semibold">Active</span>
          </div>
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-gray-600">Course Management Status</span>
            <span className="text-green-600 font-semibold">Active</span>
          </div>
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-gray-600">Grade Management Status</span>
            <span className="text-green-600 font-semibold">Active</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">System Health</span>
            <span className="text-green-600 font-semibold">Good</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Report;