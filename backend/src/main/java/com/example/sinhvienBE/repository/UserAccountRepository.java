package com.example.sinhvienBE.repository;

import com.example.sinhvienBE.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface UserAccountRepository extends JpaRepository<UserAccount, Long> {
    Optional<UserAccount> findByUsername(String username);
    List<UserAccount> findByRole(Role role);
}
