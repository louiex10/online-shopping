package com.valencia.eshop.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.valencia.eshop.model.OrderItem;

public interface OrderItemsRepository extends JpaRepository<OrderItem, Long> {
    OrderItem findByOrderDetailsId(Long orderDetailId);
    OrderItem findByOrderDetailsIdAndProductId(Long orderDetailId, Long productId);
}