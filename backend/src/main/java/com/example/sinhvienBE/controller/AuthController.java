package com.example.sinhvienBE.controller;

import com.example.sinhvienBE.repository.UserAccountRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class AuthController {
    private final UserAccountRepository users;
    public AuthController(UserAccountRepository users) { this.users=users; }
    @GetMapping("/me")
    public Map<String,Object> me(Authentication authentication) {
        var user=users.findByUsername(authentication.getName()).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        return Map.of("id",user.getId(),"username",user.getUsername(),"displayName",user.getDisplayName(),
             "role",user.getRole().name());
    }
    @PostMapping("/login")
    public Map<String,Object> login(Authentication authentication) { return me(authentication); }
}
