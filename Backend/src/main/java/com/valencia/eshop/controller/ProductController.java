package com.valencia.eshop.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.valencia.eshop.model.Product;
import com.valencia.eshop.service.ProductService;

@RestController
@RequestMapping("/api/products")
class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    List<Product> all(@RequestParam(value="category", required = false) List<String> category,
                      @RequestParam(value="size", required = false) List<String> size) {
        return productService.getAllProducts(category, size);
    }
    
    @PreAuthorize("hasAuthority('SCOPE_ROLE_ADMIN')")
    @PostMapping
    Product newProduct(@RequestBody Product newProduct) {
        return productService.saveProduct(newProduct);
    }

    @GetMapping("/{id}")
    Product one(@PathVariable long id) {
        return productService.getOneProduct(id);
    }

    @PreAuthorize("hasAuthority('SCOPE_ROLE_ADMIN')")
    @PutMapping("/{id}")
    Product replaceProduct(@RequestBody Product newProduct, @PathVariable long id) {
        return productService.updateProduct(newProduct, id);
    }

    @PreAuthorize("hasAuthority('SCOPE_ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    void deleteProduct(@PathVariable long id) {
        productService.deleteProduct(id);
    }

}