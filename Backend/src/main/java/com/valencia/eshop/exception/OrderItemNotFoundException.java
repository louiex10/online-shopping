package com.valencia.eshop.exception;

public class OrderItemNotFoundException extends RuntimeException {

  public OrderItemNotFoundException(Long id) {
    super("Could not find order item " + id);
  }
}