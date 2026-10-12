package com.restaurant.billing.repository;

import com.restaurant.billing.entity.Role;
import com.restaurant.billing.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Optional<User> findByPhone(String phone);

    @Query("SELECT u FROM User u WHERE LOWER(u.username) = LOWER(:login) OR (u.email IS NOT NULL AND LOWER(u.email) = LOWER(:login)) OR (u.phone IS NOT NULL AND u.phone = :login) ORDER BY u.id DESC")
    List<User> findAllMatchingLogin(@Param("login") String login);

    default Optional<User> findFirstMatchingLogin(String login) {
        List<User> list = findAllMatchingLogin(login);
        return list.isEmpty() ? Optional.empty() : Optional.of(list.get(0));
    }

    boolean existsByUsername(String username);
    List<User> findByRole(Role role);
}
