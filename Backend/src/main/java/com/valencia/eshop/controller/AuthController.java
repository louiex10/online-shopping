package com.valencia.eshop.controller;

import com.valencia.eshop.model.Customer;
import com.valencia.eshop.model.LoginRequest;
import com.valencia.eshop.model.RegisterRequest;
import com.valencia.eshop.repository.CustomerRepository;
import com.valencia.eshop.service.TokenService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.crypto.password.PasswordEncoder;

@RestController
@RequestMapping("/api")
public class AuthController {

    private static final Logger LOG = LoggerFactory.getLogger(AuthController.class);

    private final TokenService tokenService;
    private final AuthenticationManager authenticationManager;
    private final CustomerRepository customerRepository;
    private final PasswordEncoder encoder;
    

    public AuthController(TokenService tokenService, 
                          AuthenticationManager authenticationManager, 
                          CustomerRepository customerRepository,
                          PasswordEncoder encoder) {
        this.tokenService = tokenService;
        this.authenticationManager = authenticationManager;
        this.customerRepository = customerRepository;
        this.encoder = encoder;
    }

    @PostMapping("/token")
    public String token(@RequestBody LoginRequest userLogin) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(userLogin.username(), userLogin.password()));
        LOG.debug("Token requested for user: '{}'", authentication.getName());
        String token = tokenService.generateToken(authentication);
        LOG.debug("Token generated: '{}'", token);
        return token;
    }

    @PostMapping("/register")   
    public ResponseEntity<String> register(@RequestBody RegisterRequest registerRequest) {
        Customer oldCustomer = customerRepository.findByUsername(registerRequest.email()).orElse(null);
        
        if (oldCustomer != null) {
            return new ResponseEntity<String>("User already exists", HttpStatus.BAD_REQUEST);
        }

        Customer newCustomer = new Customer(
                registerRequest.name(),
                registerRequest.email(),
                encoder.encode(registerRequest.password()),
                "ROLE_USER"
        );

        customerRepository.save(newCustomer);

        return new ResponseEntity<String>("User registered!", HttpStatus.OK);
    }

}