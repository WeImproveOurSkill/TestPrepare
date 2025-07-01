package com.example.usersservice.repository;

import com.example.usersservice.entiry.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {
    Optional<User> findByUsername(String username);

    Optional<User> findByOauth2Id(String oauth2Id);

    boolean existsByUsername(String username);
}
