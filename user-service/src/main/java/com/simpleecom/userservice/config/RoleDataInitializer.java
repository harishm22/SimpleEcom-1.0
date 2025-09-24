package com.simpleecom.userservice.config;

import com.simpleecom.userservice.model.Role;
import com.simpleecom.userservice.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class RoleDataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public void run(String... args) throws Exception {
        if (roleRepository.count() == 0) {
            Role superAdminRole = new Role();
            superAdminRole.setName("ROLE_SUPERADMIN");

            Role adminRole = new Role();
            adminRole.setName("ROLE_ADMIN");

            Role userRole = new Role();
            userRole.setName("ROLE_USER");

            roleRepository.saveAll(Arrays.asList(superAdminRole, adminRole, userRole));
            System.out.println("Initialized roles in the database.");
        }
    }
}
