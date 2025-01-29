package com.biblioteca.user_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable() // Desactiva CSRF para permitir solicitudes como DELETE
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll() // Permite todas las solicitudes
            );
        return http.build();
    }
}
