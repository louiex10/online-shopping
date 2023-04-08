package com.valencia.eshop.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.valencia.eshop.models.Customer;
import com.valencia.eshop.models.OrderDetails;

public interface OrderDetailsRepository extends JpaRepository<OrderDetails, Long> {
    List<OrderDetails> findByOrderStatus(String orderStatus);
    List<OrderDetails> findByCustomer(Customer customer);
    List<OrderDetails> findByCustomerAndOrderStatus(Customer customer, String orderStatus);
}