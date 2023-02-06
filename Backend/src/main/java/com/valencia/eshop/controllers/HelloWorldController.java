package com.valencia.eshop.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloWorldController {

	@RequestMapping({ "/api/hello" })
	public String firstPage() {
		return "Hello World";
	}

}