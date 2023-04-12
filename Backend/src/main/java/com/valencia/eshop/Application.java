package com.valencia.eshop;

import com.valencia.eshop.config.RsaKeyProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cache.annotation.EnableCaching;

@EnableConfigurationProperties(RsaKeyProperties.class)
@EnableCaching
@SpringBootApplication
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
    
	// @Bean
	// CommandLineRunner commandLineRunner(CustomerRepository users, PasswordEncoder encoder) {
	// 	return args -> {
	// 		users.save(new Customer("John Jenkins","user",encoder.encode("password"),"ROLE_USER"));
	// 		users.save(new Customer("Luis Alarcon","lalarcon5",encoder.encode("password"),"ROLE_USER,ROLE_ADMIN"));
	// 	};
	// }
}
