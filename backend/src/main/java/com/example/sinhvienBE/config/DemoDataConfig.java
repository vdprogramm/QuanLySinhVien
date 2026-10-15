package com.example.sinhvienBE.config;

import com.example.sinhvienBE.model.*;
import com.example.sinhvienBE.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DemoDataConfig {
 @Bean CommandLineRunner demo(@Value("${app.seed-demo:false}") boolean enabled,
    @Value("${app.demo-password:}") String password,
    UserAccountRepository accounts,StudentRepository students,CourseRepository courses,
    ClassroomRepository classes,PasswordEncoder encoder) {
    return args->{
        if(!enabled) return;
        if(password.length()<8) throw new IllegalStateException("APP_DEMO_PASSWORD cần tối thiểu 8 ký tự");
        if(classes.count()==0){var c=new Classroom(); c.setCode("CNTT-K13A");c.setName("Công nghệ thông tin K13A");classes.save(c);}
        if(students.count()==0){var s=new Student();s.setStudentId("SV001");s.setName("Nguyễn Văn A");s.setMajor("Công nghệ thông tin");s.setEmail("sv001@example.com");s.setClassroom(classes.findAll().get(0));students.save(s);}
        if(courses.count()==0){var c=new Course();c.setCode("JAVA101");c.setName("Lập trình Java");courses.save(c);}
        for(Role role:Role.values()){
            String username=switch(role){case ADMIN->"admin";case LECTURER->"giangvien";case STUDENT->"sinhvien";};
            if(accounts.findByUsername(username).isPresent()) continue;
            UserAccount u=new UserAccount();u.setUsername(username);
            u.setDisplayName(switch(role){case ADMIN->"Quản trị viên";case LECTURER->"Giảng viên demo";case STUDENT->"Sinh viên demo";});
            u.setRole(role);u.setPasswordHash(encoder.encode(password));
            if(role==Role.STUDENT)u.setStudent(students.findAll().get(0));
            accounts.save(u);
        }
        if(courses.findAll().get(0).getLecturer()==null){
            var c=courses.findAll().get(0);c.setLecturer(accounts.findByUsername("giangvien").orElseThrow());courses.save(c);
        }
    };
 }
}
