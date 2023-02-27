package com.valencia.eshop.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.valencia.eshop.models.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
    
}
