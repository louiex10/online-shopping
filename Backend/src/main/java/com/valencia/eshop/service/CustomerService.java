package com.valencia.eshop.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;

import com.valencia.eshop.exception.CustomerNotFoundEmailException;
import com.valencia.eshop.exception.CustomerNotFoundException;
import com.valencia.eshop.model.Customer;
import com.valencia.eshop.repository.CustomerRepository;

@Service
public class CustomerService {
    @Autowired
    private CustomerRepository repository;

    @CacheEvict(value="customers", allEntries=true)
    public Customer saveCustomer(Customer customer) {
        return repository.save(customer);
    }

    @Cacheable(value="customers")
    public List<Customer> getAllCustomers() {
        return repository.findAll();
    }

    @Cacheable(value="customers", key="#customerId")
    public Customer getOneCustomer(Long customerId) {
        return repository.findById(customerId)
        .orElseThrow( () -> new CustomerNotFoundException(customerId));
    }

    @Cacheable(value="customers", key="#customerUsername", unless="#result == null")
    public Customer findbyUsername(String customerUsername) {
        return repository.findByUsername(customerUsername).orElse(null);
    }

    @CachePut(value="customers", key="#customerId")
    public Customer updateCustomer(Customer newCustomer, Long customerId) {
        return repository.findById(customerId)
        .map(Customer -> {
          Customer.setName(newCustomer.getName());
          Customer.setEmail(newCustomer.getEmail());
          return repository.save(Customer);
        })
        .orElseGet(() -> {
          newCustomer.setId(customerId);
          return repository.save(newCustomer);
        });
    }

    @Caching(evict = {
        @CacheEvict(value="customers", key="#customerId"),
        @CacheEvict(value="customers", key="#customerUsername"),
        @CacheEvict(value="customers")
    })
    public void deleteCustomer(Long customerId) {
        repository.deleteById(customerId);
    }
}
