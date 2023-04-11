package com.valencia.eshop.exception;

public class OrderDetailsNotFoundException extends RuntimeException {

  public OrderDetailsNotFoundException(Long id) {
    super("Could not find order " + id);
  }
}