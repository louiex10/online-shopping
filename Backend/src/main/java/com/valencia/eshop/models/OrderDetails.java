package com.valencia.eshop.models;

import java.util.Objects;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
public class OrderDetails {

  private @Id @GeneratedValue Long id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "customer_id", nullable = false)
  @OnDelete(action = OnDeleteAction.CASCADE)
  private Customer customer;

  @JsonIgnoreProperties({"orderDetails"})
  @OneToMany(fetch=FetchType.LAZY, cascade = CascadeType.ALL, mappedBy="orderDetails")
  private Set<OrderItem> orderItems = new HashSet<OrderItem>();

  private String orderStatus;

  @Temporal(TemporalType.TIMESTAMP)
  @CreationTimestamp
  private Date orderDate;

  OrderDetails() {}

  public OrderDetails(String orderStatus){
    this.orderStatus = orderStatus;
  }

  public void addOrderItem(OrderItem orderItem){
    orderItems.add(orderItem);
  }

  public void removeOrderItem(OrderItem orderItem){
    orderItems.remove(orderItem);
  }

  public Long getId() {
    return this.id;
  }

  public String getOrderStatus() {
    return this.orderStatus;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public void setOrderStatus(String orderStatus) {
    this.orderStatus = orderStatus;
  }

  public Customer getCustomer(){
    return this.customer;
  }

  public void setCustomer(Customer customer){
    this.customer = customer;
  }

  public Date getOrderDate(){
    return this.orderDate;
  }

  public void setOrderDate(Date orderDate){
    this.orderDate = orderDate;    
  }

  public Set<OrderItem> getOrderItems() {
    return orderItems;
  }

  public void setProducts(Set<OrderItem> orderItems) {
      this.orderItems = orderItems;
  }

  @Override
  public boolean equals(Object o) {

    if (this == o)
      return true;
    if (!(o instanceof OrderDetails))
      return false;
    OrderDetails OrderDetails = (OrderDetails) o;
    return Objects.equals(this.id, OrderDetails.id) && Objects.equals(this.orderStatus, OrderDetails.orderStatus);
  }

  @Override
  public int hashCode() {
    return Objects.hash(this.id, this.orderStatus);
  }

  @Override
  public String toString() {
    return "OrderDetails{" + "id=" + this.id + '\'' + '}';
  }
}