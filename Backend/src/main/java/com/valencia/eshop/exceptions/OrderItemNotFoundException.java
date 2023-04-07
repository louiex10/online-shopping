package com.valencia.eshop.exceptions;

public class OrderItemNotFoundException extends RuntimeException {

  public OrderItemNotFoundException(Long id) {
    super("Could not find order item " + id);
  }
}