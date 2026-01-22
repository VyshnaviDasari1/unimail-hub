package com.unimail.hub.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Email {
	
	@Id
	@GeneratedValue(strategy =  GenerationType.IDENTITY)
	private Long id;
	
	private String sender;
	private String subject;
	private String body;
	private LocalDateTime receivedAt;
	@Column(name = "is_read", nullable = false)
	private boolean read =  false ;
	
	@Column(name = "is_starred", nullable = false)
	private boolean starred = false;
	
	@Column(name = "is_important", nullable = false)
	private boolean important = false;

}
