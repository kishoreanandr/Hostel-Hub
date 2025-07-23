package com.hostelhub.backend.service;

import com.hostelhub.backend.dto.LoginRequest;
import com.hostelhub.backend.dto.LoginResponse;
import com.hostelhub.backend.dto.RegisterRequest;
import com.hostelhub.backend.model.Role;
import com.hostelhub.backend.model.User;
import com.hostelhub.backend.repository.UserRepository;
import com.hostelhub.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
public class UserService {

    @Autowired
    private JwtUtil jwtUtil;


    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public String registerUser(RegisterRequest request){

        if(userRepository.findByEmail(request.getEmail()).isPresent()){
            return "User already exists!..";
        }

        User user=User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();
        userRepository.save(user);
        return "User Registered Successfully";
    }

    public LoginResponse loginUser(LoginRequest request){
        System.out.println("Trying to login: "+request.getEmail());
        Optional<User> user=userRepository.findByEmail(request.getEmail());
        if(user.isEmpty()){
            return new LoginResponse(null,"User Not Found");
        }
        if(!passwordEncoder.matches(request.getPassword(),user.get().getPassword())){
            return new LoginResponse(null,"Invalid Password!");
        }
        String token=jwtUtil.
                generateToken(user);
        return new LoginResponse(token,"Logined Successfully. welcome "+user.get().getName());
    }

//    public String loginUser(LoginRequest request){
//        Optional<User> user=userRepository.findByEmail(request.getEmail());
//        if(user.isEmpty()){
//            return "User not found!";
//        }
//        if(!passwordEncoder.matches(request.getPassword(),user.get().getPassword())){
//            return "Invalid Password!.";
//        }
//        return "Login Successfully!. welcome"+user.get().getName();
//    }

}
