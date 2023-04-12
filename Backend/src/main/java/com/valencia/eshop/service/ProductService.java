package com.valencia.eshop.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;

import com.valencia.eshop.exception.ProductNotFoundException;
import com.valencia.eshop.model.Product;
import com.valencia.eshop.repository.ProductRepository;

@Service
public class ProductService {
    @Autowired
    private ProductRepository repository;

    public Product saveProduct(Product product) {
        return repository.save(product);
    }

    @Cacheable(value="products", key="#productId")
    public Product getOneProduct(Long productId) {
        return repository.findById(productId)
        .orElseThrow( () -> new ProductNotFoundException(productId));
    }

    @CachePut(value="products", key="#productId")
    public Product updateProduct(Product newProduct, Long productId) {
        return repository.findById(productId)
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
                newProduct.setId(productId);
                return repository.save(newProduct);
            });          
    }


    @Cacheable(value="products")
    public List<Product> getAllProducts(List<String> category, List<String> size) {
        if (category != null && size  != null){
            return repository.findByCategoryInAndSizeIn(category, size);
        } else if (category != null){
            return repository.findByCategoryIn(category);
        } else if (size != null) {
            return repository.findBySizeIn(size);
        } else {
            return repository.findAll();
        }
    }

    @Caching(evict = {
        @CacheEvict(value="products", key="#productId"),
        @CacheEvict(value="products", allEntries = true)
    })
    public void deleteProduct(Long productId) {
        repository.deleteById(productId);
    }
}
