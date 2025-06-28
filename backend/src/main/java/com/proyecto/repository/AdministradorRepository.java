package com.proyecto.repository;

import com.proyecto.model.Administrador;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdministradorRepository extends JpaRepository<Administrador, Integer> {
    boolean existsByNombreAdministradorAndContraseña(String nombreAdministrador, String contraseña);
}