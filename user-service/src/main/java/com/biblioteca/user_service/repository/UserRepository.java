package com.biblioteca.user_service.repository;

import com.biblioteca.user_service.entity.User;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Buscar por ID institucional
    Optional<User> findByIdInstitucional(String idInstitucional);

    // Eliminar por ID institucional
    void deleteByIdInstitucional(String idInstitucional);
    
    // Buscar usuarios por rol
    List<User> findByRole(Integer role);

    // Buscar todos los usuarios habilitados
    List<User> findByStatus(Boolean status);

    // Verifica si un usuario con el ID institucional existe
    boolean existsByIdInstitucional(String idInstitucional);


    Optional<User> findByUsername(String username);

}

