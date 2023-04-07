package com.valencia.eshop.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.valencia.eshop.models.OrderItem;

public interface OrderItemsRepository extends JpaRepository<OrderItem, Long> {
    OrderItem findByOrderDetailsId(Long orderDetailId);
    OrderItem findByOrderDetailsIdAndProductId(Long orderDetailId, Long productId);
}