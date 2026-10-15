package com.example.sinhvienBE.config;

import com.example.sinhvienBE.repository.UserAccountRepository;
import java.util.List;
import org.springframework.context.annotation.*;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.*;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.bcrypt.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.*;

@Configuration
public class SecurityConfig {
    @Bean PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }
    @Bean UserDetailsService userDetailsService(UserAccountRepository repository) {
        return username -> repository.findByUsername(username)
            .map(u -> User.withUsername(u.getUsername()).password(u.getPasswordHash())
                .roles(u.getRole().name()).build())
            .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy tài khoản"));
    }
    @Bean SecurityFilterChain filterChain(HttpSecurity http, @org.springframework.beans.factory.annotation.Qualifier("corsConfigurationSource") CorsConfigurationSource corsSource) throws Exception {
        http.csrf(csrf -> csrf.disable())
          .cors(cors -> cors.configurationSource(corsSource))
          .authorizeHttpRequests(auth -> auth
            .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/health").permitAll()
            .requestMatchers("/api/login", "/api/me").authenticated()
            .requestMatchers("/api/admin/**").hasRole("ADMIN")
            .requestMatchers("/api/lecturer/**").hasRole("LECTURER")
            .requestMatchers("/api/student/**").hasRole("STUDENT")
            .requestMatchers(HttpMethod.GET, "/api/courses").authenticated()
            .requestMatchers("/api/**").hasRole("ADMIN")
            .anyRequest().authenticated())
          .httpBasic(Customizer.withDefaults())
          .sessionManagement(s -> s.sessionCreationPolicy(org.springframework.security.config.http.SessionCreationPolicy.STATELESS));
        return http.build();
    }
    @Bean CorsConfigurationSource corsConfigurationSource(@org.springframework.beans.factory.annotation.Value("${app.cors.allowed-origins}") String origins) {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(origins.split(",")));
        config.setAllowedMethods(List.of("GET","POST","PUT","PATCH","DELETE","OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization","Content-Type"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**",config);
        return source;
    }
}
