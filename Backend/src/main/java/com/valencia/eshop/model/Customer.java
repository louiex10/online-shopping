package com.valencia.eshop.model;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
public class Customer implements Serializable {
    @Id @GeneratedValue
    private Long id;
    private String name;
    @Column(unique = true, nullable = false)
    private String username;
    private String email;
    private String password;
    private String roles;

    public Customer() {}

    public Customer(String name, String username, String password, String roles) {
        this.name = name;
        this.email = username;
        this.username = username;
        this.password = password;
        this.roles = roles;
        System.out.println(username);
    }

    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }


    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUsername() {
        return this.username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return this.password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRoles() {
        return this.roles;
    }

    public void setRoles(String roles) {
        this.roles = roles;
    }

    @Override
    public String toString() {
        return "{" +
            " id='" + getId() + "'" +
            ", name='" + getName() + "'" +
            ", username='" + getUsername() + "'" +
            ", password='" + getPassword() + "'" +
            ", roles='" + getRoles() + "'" +
            "}";
    }

}
