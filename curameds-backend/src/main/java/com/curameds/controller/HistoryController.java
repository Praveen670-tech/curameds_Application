package com.curameds.controller;

import com.curameds.entity.TransactionRecord;
import com.curameds.entity.User;
import com.curameds.repository.TransactionRecordRepository;
import com.curameds.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/history")
@RequiredArgsConstructor
public class HistoryController {

    private final TransactionRecordRepository transactionRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<TransactionRecord>> getHistory(Principal principal) {
        if (principal == null) {
            return ResponseEntity.ok(transactionRepository.findAllByOrderByCreatedAtDesc());
        }

        User user = userRepository.findByUsername(principal.getName()).orElse(null);
        if (user != null && "ADMIN".equalsIgnoreCase(user.getRole().name())) {
            return ResponseEntity.ok(transactionRepository.findAllByOrderByCreatedAtDesc());
        }

        List<TransactionRecord> myRecords = transactionRepository.findByPerformedByOrderByCreatedAtDesc(principal.getName());
        if (myRecords.isEmpty()) {
            return ResponseEntity.ok(transactionRepository.findAllByOrderByCreatedAtDesc());
        }
        return ResponseEntity.ok(myRecords);
    }
}
