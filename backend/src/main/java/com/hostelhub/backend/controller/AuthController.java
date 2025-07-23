package com.hostelhub.backend.controller;


import com.hostelhub.backend.dto.LoginRequest;
import com.hostelhub.backend.dto.LoginResponse;
import com.hostelhub.backend.dto.RegisterRequest;
import com.hostelhub.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest registerRequest){
        return userService.registerUser(registerRequest);
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest loginRequest){
        return userService.loginUser(loginRequest);
    }
}
