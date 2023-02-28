package com.valencia.eshop.exceptions;

public class ProductNotFoundException extends RuntimeException {
    
    public ProductNotFoundException(long id) {
        super("Could not find product" + id);
        
    }
}