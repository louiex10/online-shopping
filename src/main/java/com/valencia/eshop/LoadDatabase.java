package com.valencia.eshop;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
class LoadDatabase {

  private static final Logger log = LoggerFactory.getLogger(LoadDatabase.class);

  @Bean
  CommandLineRunner initDatabase(CustomerRepository repository) {

    return args -> {
      log.info("Preloading " + repository.save(new Customer("John Jenkins", "jjenkins@email.com")));
      log.info("Preloading " + repository.save(new Customer("Luis Alarcon", "luis@email.com")));
      log.info("Preloading " + repository.save(new Customer("William Delatorre", "will@email.com")));
      log.info("Preloading " + repository.save(new Customer("Diego Zegarra", "diego@email.com")));
      log.info("Preloading " + repository.save(new Customer("Jamar Wallen", "jamar@email.com")));
      log.info("Preloading " + repository.save(new Customer("Rashawn Miller", "rmiller@email.com")));
    };
  }
}