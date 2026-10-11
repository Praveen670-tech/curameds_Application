package com.curameds.controller;

import com.curameds.dto.UserDto;
import com.curameds.entity.User;
import com.curameds.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Not authenticated"));
        }
        User user = userRepository.findByUsername(principal.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        UserDto dto = new UserDto(
            user.getId(),
            user.getName(),
            user.getUsername(),
            user.getEmail(),
            user.getRole().name(),
            user.getPhone(),
            user.getAge(),
            user.getCreatedAt()
        );
        return ResponseEntity.ok(dto);
    }
}
