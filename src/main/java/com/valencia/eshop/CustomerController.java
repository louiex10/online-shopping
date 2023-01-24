package com.valencia.eshop;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
class CustomerController {

  private final CustomerRepository repository;

  CustomerController(CustomerRepository repository) {
    this.repository = repository;
  }

  // Aggregate root
  // tag::get-aggregate-root[]
  @GetMapping("/api/customers")
  List<Customer> all() {
    return repository.findAll();
  }
  // end::get-aggregate-root[]

  @PostMapping("/api/customers")
  Customer newCustomer(@RequestBody Customer newCustomer) {
    return repository.save(newCustomer);
  }

  // Single item
  
  @GetMapping("/api/customers/{id}")
  Customer one(@PathVariable Long id) {
    
    return repository.findById(id)
      .orElseThrow(() -> new CustomerNotFoundException(id));
  }

  @PutMapping("/api/customers/{id}")
  Customer replaceCustomer(@RequestBody Customer newCustomer, @PathVariable Long id) {
    
    return repository.findById(id)
      .map(Customer -> {
        Customer.setName(newCustomer.getName());
        Customer.setEmail(newCustomer.getEmail());
        return repository.save(Customer);
      })
      .orElseGet(() -> {
        newCustomer.setId(id);
        return repository.save(newCustomer);
      });
  }

  @DeleteMapping("/api/customers/{id}")
  void deleteCustomer(@PathVariable Long id) {
    repository.deleteById(id);
  }
}