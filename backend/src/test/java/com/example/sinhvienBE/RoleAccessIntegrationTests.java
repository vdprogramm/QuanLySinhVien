package com.example.sinhvienBE;

import com.example.sinhvienBE.model.*;
import com.example.sinhvienBE.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class RoleAccessIntegrationTests {
    private static final String SECRET = "ExamplePass123!";
    @Autowired MockMvc mvc;
    @Autowired UserAccountRepository accounts;
    @Autowired StudentRepository students;
    @Autowired CourseRepository courses;
    @Autowired PasswordEncoder encoder;

    private Student student;
    private Course course;

    private UserAccount account(String username, Role role, Student linkedStudent) {
        UserAccount u = new UserAccount();
        u.setUsername(username);
        u.setDisplayName(username);
        u.setPasswordHash(encoder.encode(SECRET));
        u.setRole(role);
        u.setStudent(linkedStudent);
        return accounts.save(u);
    }

    @BeforeEach
    void setup() {
        account("admin-ci", Role.ADMIN, null);
        UserAccount lecturer = account("lecturer-ci", Role.LECTURER, null);
        student = new Student();
        student.setStudentId("TEST001");
        student.setName("Test Student");
        student = students.save(student);
        account("student-ci", Role.STUDENT, student);
        course = new Course();
        course.setCode("TEST101");
        course.setName("Test course");
        course.setLecturer(lecturer);
        course = courses.save(course);
    }

    @Test
    void adminApiRequiresAuthenticationAndAdminRole() throws Exception {
        mvc.perform(get("/api/students")).andExpect(status().isUnauthorized());
        mvc.perform(get("/api/students").with(httpBasic("student-ci",SECRET)))
            .andExpect(status().isForbidden());
        mvc.perform(get("/api/students").with(httpBasic("lecturer-ci",SECRET)))
            .andExpect(status().isForbidden());
        mvc.perform(get("/api/students").with(httpBasic("admin-ci",SECRET)))
            .andExpect(status().isOk());
    }

    @Test
    void lecturerMustOnlyAccessLecturerPortal() throws Exception {
        mvc.perform(get("/api/lecturer/courses").with(httpBasic("lecturer-ci",SECRET)))
            .andExpect(status().isOk());
        mvc.perform(get("/api/lecturer/courses").with(httpBasic("student-ci",SECRET)))
            .andExpect(status().isForbidden());
        mvc.perform(get("/api/student/profile").with(httpBasic("lecturer-ci",SECRET)))
            .andExpect(status().isForbidden());
    }

    @Test
    void studentRegistrationAndLecturerGradeFlow() throws Exception {
        String studentAuth = "student-ci";
        String lecturerAuth = "lecturer-ci";
        mvc.perform(post("/api/student/enrollments")
                .with(httpBasic(studentAuth,SECRET))
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"courseId\":" + course.getId() + "}"))
            .andExpect(status().isCreated());
        mvc.perform(post("/api/student/enrollments")
                .with(httpBasic(studentAuth,SECRET))
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"courseId\":" + course.getId() + "}"))
            .andExpect(status().isConflict());
        mvc.perform(put("/api/lecturer/courses/" + course.getId() + "/grades")
                .with(httpBasic(lecturerAuth,SECRET))
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"studentId\":" + student.getId() + ",\"grade\":8.5}"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.grade").value(8.5));
        mvc.perform(get("/api/student/grades").with(httpBasic(studentAuth,SECRET)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].grade").value(8.5));
    }
}
