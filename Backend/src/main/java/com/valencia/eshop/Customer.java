package com.valencia.eshop;

import java.util.Objects;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
class Customer {

  private @Id @GeneratedValue Long id;
  private String name;
  private String email;

  Customer() {}

  Customer(String name, String email) {

    this.name = name;
    this.email = email;
  }

  public Long getId() {
    return this.id;
  }

  public String getName() {
    return this.name;
  }

  public String getEmail() {
    return this.email;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public void setName(String name) {
    this.name = name;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  @Override
  public boolean equals(Object o) {

    if (this == o)
      return true;
    if (!(o instanceof Customer))
      return false;
    Customer customer = (Customer) o;
    return Objects.equals(this.id, customer.id) && Objects.equals(this.name, customer.name)
        && Objects.equals(this.email, customer.email);
  }

  @Override
  public int hashCode() {
    return Objects.hash(this.id, this.name, this.email);
  }

  @Override
  public String toString() {
    return "Customer{" + "id=" + this.id + ", name='" + this.name + '\'' + ", email='" + this.email + '\'' + '}';
  }
}