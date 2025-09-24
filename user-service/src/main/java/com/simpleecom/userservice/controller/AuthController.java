package com.simpleecom.userservice.controller;

import com.simpleecom.userservice.model.Role;
import com.simpleecom.userservice.model.User;
import com.simpleecom.userservice.repository.RoleRepository;
import com.simpleecom.userservice.repository.UserRepository;
import com.simpleecom.userservice.security.JwtUtil;
import com.simpleecom.userservice.service.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.HashSet;
import java.util.Set;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/test")
    public ResponseEntity<?> test() {
        return ResponseEntity.ok("Auth service is working!");
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody com.simpleecom.userservice.payload.RegistrationRequest signUpRequest) {
        try {
            if (userRepository.existsByUsername(signUpRequest.getUsername())) {
                return ResponseEntity.badRequest().body("Error: Username is already taken!");
            }
            if (userRepository.existsByEmail(signUpRequest.getEmail())) {
                return ResponseEntity.badRequest().body("Error: Email is already in use!");
            }

            // Creating New User
            User user = new User(signUpRequest.getUsername(),
                    signUpRequest.getEmail(),
                    passwordEncoder.encode(signUpRequest.getPassword()));

            Set<Role> roles = new HashSet<>();

            if (signUpRequest.getRoles() == null || signUpRequest.getRoles().isEmpty()) {
                Role userRole = roleRepository.findByName("ROLE_USER")
                        .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                roles.add(userRole);
            } else {
                signUpRequest.getRoles().forEach(role -> {
                    switch (role.toUpperCase()) {
                        case "SUPERADMIN":
                            Role superAdminRole = roleRepository.findByName("ROLE_SUPERADMIN")
                                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                            roles.add(superAdminRole);
                            break;
                        case "ADMIN":
                            Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                            roles.add(adminRole);
                            break;
                        default:
                            Role userRole = roleRepository.findByName("ROLE_USER")
                                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                            roles.add(userRole);
                    }
                });
            }

            user.setRoles(roles);

            userRepository.save(user);

            return ResponseEntity.ok("User registered successfully!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody User loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtil.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        return ResponseEntity.ok(new JwtResponse(jwt, userDetails.getUsername(), userDetails.getAuthorities()));
    }

    // JwtResponse class for login response
    public static class JwtResponse {
        private String token;
        private String username;
        private Object roles;

        public JwtResponse(String token, String username, Object roles) {
            this.token = token;
            this.username = username;
            this.roles = roles;
        }

        public String getToken() {
            return token;
        }

        public String getUsername() {
            return username;
        }

        public Object getRoles() {
            return roles;
        }
    }
}
