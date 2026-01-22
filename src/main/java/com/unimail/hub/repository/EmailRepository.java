package com.unimail.hub.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.unimail.hub.entity.Email;

public interface EmailRepository extends JpaRepository<Email, Long>{
	Optional<Email> findById(Long id);
	
	List<Email> findByReadFalse(); // unread emails
	
	List<Email> findByStarredTrue();
	long countByImportantTrueAndReadFalse();
	
	boolean existsBySubject(String subject);

	List<Email> findBySenderContainingIgnoreCaseOrSubjectContainingIgnoreCaseOrBodyContainingIgnoreCase(
	        String sender,
	        String subject,
	        String body
	);
	List<Email> findByImportantTrue();
	
	

}
