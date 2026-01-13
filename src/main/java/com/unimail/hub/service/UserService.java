package com.unimail.hub.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.unimail.hub.entity.User;
import com.unimail.hub.repository.UserRepository;

@Service
public class UserService {
	
	@Autowired
	private UserRepository userRepository;
	private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
	
	//Registration
	
	public User register(User user) throws Exception {
		 if (userRepository.findByEmail(user.getEmail()).isPresent()) {
	            throw new Exception("Email already exists");
	        }

	        // 🔐 Encrypt password
	        user.setPassword(encoder.encode(user.getPassword()));

	        return userRepository.save(user);
	}
	//Login
	public User login(String email, String password) throws Exception {
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new Exception("Invalid email or password"));
		
		// 🔐 Compare encrypted password
        if (!encoder.matches(password, user.getPassword())) {
            throw new Exception("Invalid email or password");
        }

        return user;
	}
}
