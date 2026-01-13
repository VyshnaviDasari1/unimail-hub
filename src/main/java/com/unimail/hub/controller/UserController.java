package com.unimail.hub.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.unimail.hub.service.UserService;

import jakarta.validation.Valid;

import com.unimail.hub.dto.LoginRequest;
import com.unimail.hub.dto.RegisterRequest;
import com.unimail.hub.entity.User;

@RestController
@RequestMapping("/users")
public class UserController {
	
	@Autowired
	private UserService userService;
	
	//Register API
	@PostMapping("/register")
	public User register(@RequestBody RegisterRequest request) throws Exception {
		 User user = new User();
		    user.setName(request.getName());
		    user.setEmail(request.getEmail());
		    user.setPassword(request.getPassword());

		    return userService.register(user);
		}
    //Login API 
	@PostMapping("/login")
	public User login(@RequestBody LoginRequest request) throws Exception {
		return userService.login(request.getEmail(), request.getPassword());
	}

}
