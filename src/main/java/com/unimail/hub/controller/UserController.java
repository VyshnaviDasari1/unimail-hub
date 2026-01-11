package com.unimail.hub.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.unimail.hub.service.UserService;
import com.unimail.hub.entity.User;

@RestController
@RequestMapping("/users")
public class UserController {
	
	@Autowired
	private UserService userService;
	
	//Register API
	@PostMapping("/register")
	public User register(@RequestBody User user) throws Exception {
		return userService.register(user);
	}
	
    //Login API 
	@PostMapping("/login")
	public User login(@RequestBody User user) throws Exception {
		return userService.login(user.getEmail(), user.getPassword());
	}

}
