package com.valencia.eshop.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.valencia.eshop.exceptions.OrderItemNotFoundException;
import com.valencia.eshop.models.OrderItem;
import com.valencia.eshop.repositories.OrderItemsRepository;

@RestController
class OrderItemController {

  private final OrderItemsRepository repository;

  OrderItemController(OrderItemsRepository repository) {
    this.repository = repository;
  }

  // Aggregate root
  // tag::get-aggregate-root[]
  @GetMapping("/api/orderItem")
  List<OrderItem> all() {
    return repository.findAll();
  }
  // end::get-aggregate-root[]

  @PostMapping("/api/orderItem/{id}/increment")
  OrderItem incrementQuantity(@PathVariable Long id) {
    OrderItem orderItem = repository.findById(id)
      .orElseThrow(() -> new OrderItemNotFoundException(id));
    
    orderItem.incrementQuantity();
    return repository.save(orderItem);
  }

  @PostMapping("/api/orderItem/{id}/decrement")
  OrderItem decrementQuantity(@PathVariable Long id) {
    OrderItem orderItem = repository.findById(id)
      .orElseThrow(() -> new OrderItemNotFoundException(id));
    
    orderItem.decrementQuantity();
    return repository.save(orderItem);
  }

  // Single item
  
  @GetMapping("/api/orderItem/{id}")
  OrderItem one(@PathVariable Long id) {
    
    return repository.findById(id)
      .orElseThrow(() -> new OrderItemNotFoundException(id));
  }
}