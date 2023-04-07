package com.valencia.eshop.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.valencia.eshop.models.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategoryAndSize(String category, String size);
    List<Product> findByCategory(String category);
    List<Product> findBySize(String size);
    List<Product> findByCategoryIn(List<String> category);
    List<Product> findBySizeIn(List<String> size);
    List<Product> findByCategoryInAndSizeIn(List<String> category, List<String> size);
}