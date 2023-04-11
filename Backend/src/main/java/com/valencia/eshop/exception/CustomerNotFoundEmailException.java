package com.valencia.eshop.exception;

public class CustomerNotFoundEmailException extends RuntimeException {

  public CustomerNotFoundEmailException(String username) {
    super("Could not find employee " + username);
  }
}