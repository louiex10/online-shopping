package com.valencia.eshop.exceptions;

public class OrderDetailsNotFoundException extends RuntimeException {

  public OrderDetailsNotFoundException(Long id) {
    super("Could not find order " + id);
  }
}