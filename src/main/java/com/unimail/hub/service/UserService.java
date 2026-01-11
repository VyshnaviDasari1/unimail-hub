package com.unimail.hub.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.unimail.hub.entity.User;
import com.unimail.hub.repository.UserRepository;

@Service
public class UserService {
	
	@Autowired
	private UserRepository userRepository;
	
	//Registration
	
	public User register(User user) throws Exception {
		Optional<User> existingUser  = userRepository.findByEmail(user.getEmail());
		if(existingUser.isPresent()) {
			throw new Exception("Email already exists");
		}
		return userRepository.save(user);		
	}
	//Login
	public User login(String email, String password) throws Exception {
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new Exception("Invalid email or password"));
		
		if(!user.getPassword().equals(password)) {
			throw new Exception("Invalid email or password");
		}
		return user;
	}
}
