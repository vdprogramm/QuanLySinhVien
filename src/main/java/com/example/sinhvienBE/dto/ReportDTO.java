package com.example.sinhvienBE.dto;

public class ReportDTO {
    private long totalStudents;
    private long totalCourses;
    private long totalClasses;
    private double averageGrade;

    public ReportDTO(long totalStudents, long totalCourses, long totalClasses, double averageGrade) {
        this.totalStudents = totalStudents;
        this.totalCourses = totalCourses;
        this.totalClasses = totalClasses;
        this.averageGrade = averageGrade;
    }

    // Getter, Setter
    public long getTotalStudents() { return totalStudents; }
    public void setTotalStudents(long totalStudents) { this.totalStudents = totalStudents; }

    public long getTotalCourses() { return totalCourses; }
    public void setTotalCourses(long totalCourses) { this.totalCourses = totalCourses; }

    public long getTotalClasses() { return totalClasses; }
    public void setTotalClasses(long totalClasses) { this.totalClasses = totalClasses; }

    public double getAverageGrade() { return averageGrade; }
    public void setAverageGrade(double averageGrade) { this.averageGrade = averageGrade; }
}
