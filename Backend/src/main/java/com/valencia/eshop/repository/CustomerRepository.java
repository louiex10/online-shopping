package com.valencia.eshop.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.valencia.eshop.model.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findByUsername(String username);
}
