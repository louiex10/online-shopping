package com.valencia.eshop.models;

import java.util.Objects;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
public class Product {
    
    private @Id @GeneratedValue long id;
    private String name;
    private String description;
    private String image_url;
    private Double price;
    private Integer inventory;

    Product() {}

    public Product(String name, String description, String image_url,
     Double price, Integer inventory) {

        this.name = name;
        this.description = description;
        this.image_url = image_url;
        this.price = price;
        this.inventory = inventory;
     }
     
    public Long getId() {
        return this.id;
   }

    public String getName() {
    return this.name;
  }

    public String getDescription() {
    return this.description;
  }

    public String getImage_url() {
    return this.image_url;
  }

  public Double getPrice() {
    return this.price;
  }

  public Integer getInventory() {
    return this.inventory;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public void setName(String name) {
    this.name = name;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public void setImage_url(String image_url) {
    this.image_url = image_url;
  }

  public void setPrice(Double price) {
    this.price = price;
  }

  public void setInventory(Integer inventory) {
    this.inventory = inventory;
  }

  @Override
  public boolean equals(Object o) {

    if (this == o)
      return true;
    if (!(o instanceof Product))
      return false;
    Product product = (Product) o;
    return Objects.equals(this.id, product.id) && Objects.equals(this.name, product.name) 
    && Objects.equals(this.description, product.description) && Objects.equals(this.image_url, product.image_url) 
    && Objects.equals(this.price, product.price) && Objects.equals(this.inventory, product.inventory);
  }

  @Override
  public int hashCode() {
    return Objects.hash(this.id, this.name, this.description, this.image_url, this.price, this.inventory);
  }

  @Override
  public String toString() {
    return "Product{" + "id=" + this.id + ", name='" + this.name + '\'' + ", description='" + this.description + '\'' 
    + ", image_url='" + this.image_url + '\'' + ", price='" + this.price + '\'' + ", inventory= '" + this.inventory +  '\'' + '}';
  }
  
}
