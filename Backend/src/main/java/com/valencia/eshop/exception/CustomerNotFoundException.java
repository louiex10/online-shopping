package com.valencia.eshop.exception;

public class CustomerNotFoundException extends RuntimeException {

  public CustomerNotFoundException(Long id) {
    super("Could not find employee " + id);
  }
}