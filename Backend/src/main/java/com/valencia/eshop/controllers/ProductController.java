package com.valencia.eshop.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.valencia.eshop.exceptions.ProductNotFoundException;
import com.valencia.eshop.models.Product;
import com.valencia.eshop.repositories.ProductRepository;

@RestController
class ProductController {

    private final ProductRepository repository;

    ProductController(ProductRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/api/products")
    List<Product> all(@RequestParam(value="category", required = false) String category,
                      @RequestParam(value="size", required = false) String size) {
        if (category != null && size  != null){
            return repository.findByCategoryAndSize(category, size);
        } else if (category != null){
            return repository.findByCategory(category);
        } else if (size != null) {
            return repository.findBySize(size);
        } else {
            return repository.findAll();
        }
    }

    @PostMapping("/api/products")
    Product newProduct(@RequestBody Product newProduct) {
        return repository.save(newProduct);
    }

    @GetMapping("/api/products/{id}")
    Product one(@PathVariable long id) {

        return repository.findById(id)
            .orElseThrow( () -> new ProductNotFoundException(id));
    }

    @PutMapping("/api/products/{id}")
    Product replaceProduct(@RequestBody Product newProduct, @PathVariable long id) {

        return repository.findById(id)
            .map(Product -> {
                Product.setName(newProduct.getName());
                Product.setDescription(newProduct.getDescription());
                Product.setImage_url(newProduct.getImage_url());
                Product.setPrice(newProduct.getPrice());
                Product.setInventory(newProduct.getInventory());
                Product.setCategory(newProduct.getCategory());
                Product.setSize(newProduct.getSize());
                return repository.save(Product);
            })
            .orElseGet(() -> {
                newProduct.setId(id);
                return repository.save(newProduct);
            });  
    }

    @DeleteMapping("/api/products/{id}")
    void deleteProduct(@PathVariable long id) {
        repository.deleteById(id);
    }
}