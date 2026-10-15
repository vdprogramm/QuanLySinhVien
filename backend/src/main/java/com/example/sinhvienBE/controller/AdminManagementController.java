package com.example.sinhvienBE.controller;

import com.example.sinhvienBE.model.*;
import com.example.sinhvienBE.repository.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
public class AdminManagementController {
    private final UserAccountRepository accounts;
    private final StudentRepository students;
    private final CourseRepository courses;
    private final ClassroomRepository classes;
    private final PasswordEncoder encoder;
    public AdminManagementController(UserAccountRepository accounts, StudentRepository students, CourseRepository courses, ClassroomRepository classes, PasswordEncoder encoder) {
        this.accounts=accounts;this.students=students;this.courses=courses;this.classes=classes;this.encoder=encoder;
    }
    public record NewAccount(@NotBlank String username, @NotBlank String displayName,
          @NotBlank @Size(min=8) String password, @NotNull Role role, Long studentId) {}
    @PostMapping("/accounts")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String,Object> createAccount(@Valid @RequestBody NewAccount req) {
        if(accounts.findByUsername(req.username()).isPresent()) throw new ResponseStatusException(HttpStatus.CONFLICT,"Tên đăng nhập đã tồn tại");
        if(req.role()==Role.ADMIN && req.studentId()!=null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        UserAccount account=new UserAccount();
        account.setUsername(req.username());account.setDisplayName(req.displayName());
        account.setRole(req.role());account.setPasswordHash(encoder.encode(req.password()));
        if(req.role()==Role.STUDENT) {
            if(req.studentId()==null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Cần studentId");
            if(accounts.findByRole(Role.STUDENT).stream().anyMatch(a->a.getStudent()!=null && a.getStudent().getId().equals(req.studentId())))
                throw new ResponseStatusException(HttpStatus.CONFLICT,"Sinh viên đã có tài khoản");
            account.setStudent(students.findById(req.studentId()).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Không tìm thấy sinh viên")));
        } else if(req.studentId()!=null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        accounts.save(account);
        return Map.of("id", account.getId(), "username", account.getUsername(),"role",account.getRole());
    }
    @GetMapping("/accounts")
    public List<Map<String,Object>> accounts() {
        return accounts.findAll().stream().map(a -> {
            Map<String,Object> m=new LinkedHashMap<>();
            m.put("id",a.getId());m.put("username",a.getUsername());
            m.put("displayName",a.getDisplayName());m.put("role",a.getRole());
            m.put("studentId", a.getStudent()==null?null:a.getStudent().getId());
            return m;
        }).toList();
    }
    public record AssignLecturer(@NotNull Long lecturerId) {}
    @PutMapping("/courses/{courseId}/lecturer")
    public Map<String,Object> assign(@PathVariable Long courseId,@Valid @RequestBody AssignLecturer body) {
        var course=courses.findById(courseId).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND));
        var lecturer=accounts.findById(body.lecturerId()).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND));
        if(lecturer.getRole()!=Role.LECTURER) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Tài khoản không phải giảng viên");
        course.setLecturer(lecturer);courses.save(course);
        return Map.of("courseId",courseId,"lecturerId",lecturer.getId());
    }
    public record AssignClass(@NotNull Long classroomId) {}
    @PutMapping("/students/{studentId}/classroom")
    public Map<String,Object> assignClass(@PathVariable Long studentId, @Valid @RequestBody AssignClass body) {
        var student=students.findById(studentId).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND));
        student.setClassroom(classes.findById(body.classroomId()).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND)));
        students.save(student);
        return Map.of("studentId",studentId,"classroomId",body.classroomId());
    }
}
