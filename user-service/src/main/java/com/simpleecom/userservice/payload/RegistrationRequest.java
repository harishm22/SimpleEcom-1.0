package com.simpleecom.userservice.payload;

import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class RegistrationRequest {

    private String username;
    private String email;
    private String password;
    private Set<String> roles;
}
