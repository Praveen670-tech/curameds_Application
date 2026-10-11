package com.curameds.controller;

import com.curameds.dto.FamilyMemberDto;
import com.curameds.entity.FamilyMember;
import com.curameds.repository.FamilyMemberRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/family")
@RequiredArgsConstructor
public class FamilyMemberController {

    private final FamilyMemberRepository familyRepository;

    @GetMapping
    public ResponseEntity<List<FamilyMember>> getFamilyMembers(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(familyRepository.findByGuardianUsername(principal.getName()));
    }

    @PostMapping
    public ResponseEntity<?> addFamilyMember(@Valid @RequestBody FamilyMemberDto req, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }

        FamilyMember member = new FamilyMember();
        member.setRelativeName(req.getRelativeName());
        member.setRelationship(req.getRelationship());
        member.setAge(req.getAge());
        member.setContactPhone(req.getContactPhone());
        member.setMedicalConditions(req.getMedicalConditions());
        member.setCurrentMedications(req.getCurrentMedications());
        member.setGuardianUsername(principal.getName());

        FamilyMember saved = familyRepository.save(member);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFamilyMember(@PathVariable Long id) {
        if (!familyRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        familyRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Family member profile removed"));
    }
}
