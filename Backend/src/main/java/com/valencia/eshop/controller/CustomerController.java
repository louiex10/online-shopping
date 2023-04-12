package com.valencia.eshop.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.valencia.eshop.model.Customer;
import com.valencia.eshop.service.CustomerService;

@RestController
@RequestMapping("/api/customers")
class CustomerController {

  @Autowired
  private CustomerService customerService;

  // Aggregate root
  // tag::get-aggregate-root[]
  @GetMapping
  List<Customer> all() {
    return customerService.getAllCustomers();
  }
  // end::get-aggregate-root[]
  
  @PreAuthorize("hasAuthority('SCOPE_ROLE_ADMIN')")
  @PostMapping
  Customer newCustomer(@RequestBody Customer newCustomer) {
    return customerService.saveCustomer(newCustomer);
  }

  // Single item
  @GetMapping("/{id}")
  Customer one(@PathVariable Long id) {
    return customerService.getOneCustomer(id);
  }

  // Get Customer object from logged in user
  @GetMapping("/me")
  Customer findByUsername(Principal principal) {
    return customerService.findbyUsername(principal.getName());
  }

  @PreAuthorize("hasAuthority('SCOPE_ROLE_ADMIN')")
  @PutMapping("/{id}")
  Customer replaceCustomer(@RequestBody Customer newCustomer, @PathVariable Long id) {
    return customerService.updateCustomer(newCustomer, id);
  }
  
  @PreAuthorize("hasAuthority('SCOPE_ROLE_ADMIN')")
  @DeleteMapping("/{id}")
  void deleteCustomer(@PathVariable Long id) {
    customerService.deleteCustomer(id);
  }
}