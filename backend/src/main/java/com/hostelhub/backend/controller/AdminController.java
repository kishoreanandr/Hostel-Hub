package com.hostelhub.backend.controller;

import com.hostelhub.backend.config.SecurityConfig;
import com.hostelhub.backend.dto.RegisterRequest;
import com.hostelhub.backend.model.Role;
import com.hostelhub.backend.model.User;
import com.hostelhub.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;

public class AdminController {

    @Autowired
    private SecurityConfig securityConfig;

    @Autowired
    private UserRepository userRepository;

    public String createAdmin(@RequestBody RegisterRequest request){
        User user=User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(securityConfig.passwordEncoder().encode(request.getPassword()))
                .role(Role.ADMIN)
                .build();
        userRepository.save(user);
        return "Admin created Successfully!..";
    }
}
