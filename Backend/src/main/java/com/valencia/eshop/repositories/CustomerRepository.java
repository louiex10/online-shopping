package com.valencia.eshop.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.valencia.eshop.models.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

}