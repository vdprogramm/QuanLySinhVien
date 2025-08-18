package com.example.sinhvienBE.service;

import com.example.sinhvienBE.model.AdminUser;
import com.example.sinhvienBE.repository.AdminUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {
    @Autowired
    private AdminUserRepository adminUserRepository;

    public boolean login(String username, String password) {
        Optional<AdminUser> user = adminUserRepository.findByUsername(username);
        return user.isPresent() && user.get().getPassword().equals(password);
    }
}
