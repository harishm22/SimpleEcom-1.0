package com.simpleecom.userservice;

import com.simpleecom.userservice.model.Role;
import com.simpleecom.userservice.model.User;
import com.simpleecom.userservice.repository.RoleRepository;
import com.simpleecom.userservice.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class UserServiceIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setup() {
        userRepository.deleteAll();
        roleRepository.deleteAll();
    }

    @Test
    void testUserRegistration() throws Exception {
        String requestJson = "{ \"username\": \"testuser\", \"email\": \"testuser@example.com\", \"password\": \"password\", \"roles\": null }";

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestJson))
                .andExpect(status().isOk());
    }

    @Test
    void testUserLogin() throws Exception {
        // Create role first
        Role userRole = new Role("ROLE_USER");
        roleRepository.save(userRole);

        User user = new User("testuser", "testuser@example.com", passwordEncoder.encode("password"));
        try {
            java.lang.reflect.Field rolesField = User.class.getDeclaredField("roles");
            rolesField.setAccessible(true);
            @SuppressWarnings("unchecked")
            java.util.Set<Role> roles = (java.util.Set<Role>) rolesField.get(user);
            roles.add(userRole);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        userRepository.save(user);

        String loginPayload = "{ \"username\": \"testuser\", \"password\": \"password\" }";

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginPayload))
                .andExpect(status().isOk());
    }
}
