package com.valencia.eshop.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.valencia.eshop.exception.OrderDetailsNotFoundException;
import com.valencia.eshop.exception.OrderItemNotFoundException;
import com.valencia.eshop.exception.ProductNotFoundException;
import com.valencia.eshop.model.Customer;
import com.valencia.eshop.model.OrderDetails;
import com.valencia.eshop.model.OrderItem;
import com.valencia.eshop.model.Product;
import com.valencia.eshop.repository.CustomerRepository;
import com.valencia.eshop.repository.OrderDetailsRepository;
import com.valencia.eshop.repository.OrderItemsRepository;
import com.valencia.eshop.repository.ProductRepository;

@RestController
class OrderDetailsController {

  private final OrderDetailsRepository orepository;
  private final ProductRepository prepository;
  private final OrderItemsRepository oirepository;
  private final CustomerRepository crepository;

  OrderDetailsController(OrderDetailsRepository orepository, 
                         ProductRepository prepository, 
                         OrderItemsRepository oirepository,
                         CustomerRepository crepository) {
    this.orepository = orepository;
    this.prepository = prepository;
    this.oirepository = oirepository;
    this.crepository = crepository;
  }

  // Aggregate root
  // tag::get-aggregate-root[]
  @GetMapping("/api/orderDetails")
  List<OrderDetails> all(@RequestParam(value="orderStatus", required = false) String orderStatus,
                         @RequestParam(value="customerId", required = false) Long customerId) {
    //@TODO: Use logged in customer to find order
    if(orderStatus != null && customerId != null){
      Customer customer = crepository.findById(customerId)
      .orElseThrow(() -> new OrderDetailsNotFoundException(customerId));
      return orepository.findByCustomerAndOrderStatus(customer, orderStatus);
    }
    else if(customerId != null){
      Customer customer = crepository.findById(customerId)
      .orElseThrow(() -> new OrderDetailsNotFoundException(customerId));
      return orepository.findByCustomer(customer);
    }
    else if(orderStatus != null){
      return orepository.findByOrderStatus(orderStatus);
    }else{
      return orepository.findAll();     
    }
  }
  // end::get-aggregate-root[]

  @PostMapping("/api/orderDetails")
  OrderDetails newOrderDetails(@RequestBody OrderDetails newOrderDetails) {
    return orepository.save(newOrderDetails);
  }

  // Single item
  
  @GetMapping("/api/orderDetails/{id}")
  OrderDetails one(@PathVariable Long id) {
    
    return orepository.findById(id)
      .orElseThrow(() -> new OrderDetailsNotFoundException(id));
  }

  @PostMapping("/api/orderDetails/{id}/addProduct/{productId}")
  OrderDetails addProduct(@PathVariable Long id, @PathVariable Long productId) {
    
    OrderDetails order = orepository.findById(id)
      .orElseThrow(() -> new OrderDetailsNotFoundException(id));
    
    Product product = prepository.findById(productId)
    .orElseThrow(() -> new ProductNotFoundException(productId));
    
    OrderItem orderItem = oirepository.findByOrderDetailsIdAndProductId(id,productId);

    System.out.println(orderItem);

    if(orderItem == null){
      OrderItem orderItemNew = new OrderItem(product, order, 1);
      order.addOrderItem(orderItemNew);
      return orepository.save(order);
    }else{
      orderItem.incrementQuantity();
    }

    return orepository.save(order);
  }

  @PutMapping("/api/orderDetails/{id}")
  OrderDetails changeStatus(@RequestBody OrderDetails newOrderDetails, @PathVariable Long id) {
    
    return orepository.findById(id)
      .map(OrderDetails -> {
        OrderDetails.setOrderStatus(newOrderDetails.getOrderStatus());
        return orepository.save(OrderDetails);
      })
      .orElseGet(() -> {
        newOrderDetails.setId(id);
        return orepository.save(newOrderDetails);
      });
  }

  @DeleteMapping("/api/orderDetails/{id}")
  void deleteOrderDetails(@PathVariable Long id) {
    orepository.deleteById(id);
  }

  @DeleteMapping("/api/orderDetails/{id}/removeItem/{orderItemId}")
  OrderDetails deleteOrderItem(@PathVariable Long id,@PathVariable Long orderItemId) {
    OrderDetails order = orepository.findById(id)
      .orElseThrow(() -> new OrderDetailsNotFoundException(id));
    OrderItem orderItem = oirepository.findById(orderItemId)
      .orElseThrow(() -> new OrderItemNotFoundException(id));
    order.removeOrderItem(orderItem);
    oirepository.deleteById(orderItem.getId());
    
    return orepository.save(order);
  }
}