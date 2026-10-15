package com.example.sinhvienBE.config;

import com.example.sinhvienBE.model.Role;
import com.example.sinhvienBE.model.UserAccount;
import com.example.sinhvienBE.repository.UserAccountRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@Profile("prod")
public class BootstrapAdminConfig {
    @Bean
    CommandLineRunner bootstrapAdmin(UserAccountRepository accounts,
                                     PasswordEncoder encoder,
                                     @Value("${app.bootstrap-admin.username:admin}") String username,
                                     @Value("${app.bootstrap-admin.password:}") String password) {
        return args -> {
            // Never overwrite a pre-existing administrator password.
            if (!accounts.findByRole(Role.ADMIN).isEmpty()) return;
            if (password == null || password.length() < 12 || password.equals("DemoPass123!")) {
                throw new IllegalStateException(
                    "Set APP_BOOTSTRAP_ADMIN_PASSWORD (>=12 chars, not the public demo password) before deploying");
            }
            if (accounts.findByUsername(username).isPresent()) {
                throw new IllegalStateException("Bootstrap admin username already belongs to another role");
            }
            UserAccount admin = new UserAccount();
            admin.setUsername(username);
            admin.setDisplayName("Quản trị viên");
            admin.setRole(Role.ADMIN);
            admin.setPasswordHash(encoder.encode(password));
            accounts.save(admin);
        };
    }
}
