// Sección de Entity sin cambios

package com.biblioteca.user_service.controller;

import com.biblioteca.user_service.dto.LoginRequest;
import com.biblioteca.user_service.entity.User;
import com.biblioteca.user_service.service.UserService;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    //Método para eliminar un usuario
    @DeleteMapping("/{idInstitucional}")
    public ResponseEntity<Void> deleteUser(@PathVariable String idInstitucional) {
        userService.deleteUserByIdInstitucional(idInstitucional);
        return ResponseEntity.noContent().build();
    }



    // Método para verificar si el usuario es Administrador
    private boolean isAdmin(User user) {
        return user.getRole() == 1; // 1 representa el rol de Administrador
    }

    // Endpoint para Login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        boolean isAuthenticated = userService.authenticateUser(loginRequest.getUsername(), loginRequest.getPassword());
        if (isAuthenticated) {
            User user = userService.getUserByUsername(loginRequest.getUsername())
                    .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
            // Devuelve el mensaje y el rol en la respuesta
            return ResponseEntity.ok(Map.of(
                    "message", "Usuario autenticado con éxito",
                    "role", user.getRole() // Incluye el rol del usuario en la respuesta
            ));
        } else {
            return ResponseEntity.status(401).body("Credenciales incorrectas");
        }
    }

    // Obtener todos los usuarios (solo para Administrador)
    @GetMapping
    public ResponseEntity<?> getAllUsers(@RequestHeader("username") String username) {
        System.out.println("Username recibido: " + username); // Depuración
        User currentUser = userService.getUserByUsername(username).orElse(null);
        if (currentUser == null || !isAdmin(currentUser)) {
            return ResponseEntity.status(403).body("Acceso denegado. Solo el Administrador puede gestionar usuarios.");
        }
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // Obtener usuario por ID institucional (solo para Administrador)
    @GetMapping("/{idInstitucional}")
    public ResponseEntity<?> getUserByIdInstitucional(@RequestHeader("username") String username,
            @PathVariable String idInstitucional) {
        User currentUser = userService.getUserByUsername(username).orElse(null);
        if (currentUser == null || !isAdmin(currentUser)) {
            return ResponseEntity.status(403).body("Acceso denegado. Solo el Administrador puede gestionar usuarios.");
        }
        return userService.getUserByIdInstitucional(idInstitucional)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Crear un nuevo usuario (solo para Administrador)
    @PostMapping
    public ResponseEntity<?> createUser(@RequestHeader("username") String username, @RequestBody User user) {
        User currentUser = userService.getUserByUsername(username).orElse(null);
        if (currentUser == null || !isAdmin(currentUser)) {
            return ResponseEntity.status(403).body("Acceso denegado. Solo el Administrador puede gestionar usuarios.");
        }
        try {
            System.out.println("Intentando crear usuario: " + user); // Log del usuario recibido
            User newUser = userService.createUser(user);
            return ResponseEntity.ok(newUser);
        } catch (Exception e) {
            e.printStackTrace(); // Log completo del error
            return ResponseEntity.status(500).body("Error al crear el usuario: " + e.getMessage());
        }
    }
    
    
    

    // Suspender un usuario (solo para Administrador)
    @PutMapping("/{idInstitucional}/suspend")
    public ResponseEntity<?> suspendUser(@RequestHeader("username") String username,
            @PathVariable String idInstitucional) {
        User currentUser = userService.getUserByUsername(username).orElse(null);
        if (currentUser == null || !isAdmin(currentUser)) {
            return ResponseEntity.status(403).body("Acceso denegado. Solo el Administrador puede gestionar usuarios.");
        }
        userService.suspendUserByIdInstitucional(idInstitucional);
        return ResponseEntity.ok().build();
    }

    // Activar un usuario (solo para Administrador)
    @PutMapping("/{idInstitucional}/activate")
    public ResponseEntity<?> activateUser(@RequestHeader("username") String username,
            @PathVariable String idInstitucional) {
        User currentUser = userService.getUserByUsername(username).orElse(null);
        if (currentUser == null || !isAdmin(currentUser)) {
            return ResponseEntity.status(403).body("Acceso denegado. Solo el Administrador puede gestionar usuarios.");
        }
        userService.activateUserByIdInstitucional(idInstitucional);
        return ResponseEntity.ok().build();
    }

/*     // Actualizar un usuario (solo para Administrador)
    @PutMapping("/{idInstitucional}")
    public ResponseEntity<?> updateUser(@RequestHeader("username") String username, @PathVariable String idInstitucional, @RequestBody User updatedUser) {
        User currentUser = userService.getUserByUsername(username).orElse(null);
        if (currentUser == null || !isAdmin(currentUser)) {
            return ResponseEntity.status(403).body("Acceso denegado. Solo el Administrador puede gestionar usuarios.");
        }
        User user = userService.updateUserByIdInstitucional(idInstitucional, updatedUser);
        return ResponseEntity.ok(user);
    } */

// ✅ Actualizar usuario (solo Administrador) con validación y manejo de errores
@PutMapping("/{idInstitucional}")
public ResponseEntity<?> updateUser(@RequestHeader("username") String username,
                                    @PathVariable String idInstitucional, 
                                    @RequestBody User updatedUser) {
    User currentUser = userService.getUserByUsername(username).orElse(null);
    
    // Verificar si el usuario que intenta actualizar es administrador
    if (!isAdmin(currentUser)) {
        return ResponseEntity.status(403).body("Acceso denegado. Solo el Administrador puede gestionar usuarios.");
    }

    // Validar si el usuario existe antes de actualizar
    if (!userService.existsByIdInstitucional(idInstitucional)) {
        return ResponseEntity.status(404).body("Usuario no encontrado.");
    }

    try {
        User user = userService.updateUserByIdInstitucional(idInstitucional, updatedUser);
        return ResponseEntity.ok(user);
    } catch (Exception e) {
        return ResponseEntity.status(500).body("Error al actualizar el usuario: " + e.getMessage());
    }
}


}
