package com.unimail.hub.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.unimail.hub.entity.Email;
import com.unimail.hub.repository.EmailRepository;


@Service
public class EmailService {
	
	private final EmailRepository emailRepository;
	
	public EmailService(EmailRepository emailRepository) {
		this.emailRepository = emailRepository;
	}
	
	// 1️⃣ Get all email's (Inbox)
    public List<Email> getInbox() {
        return emailRepository.findAll();
    }

    // 2️⃣ Get single email by ID
    public Email getEmailById(Long id) {
        return emailRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Email not found"));
    }

    // 3️⃣ Mark email as read
    public Email markAsRead(Long id) {
        Email email = getEmailById(id);
        email.setRead(true);
        return emailRepository.save(email);	
	}
 // Get unread emails
    public List<Email> getUnreadEmails() {
        return emailRepository.findByReadFalse();
    }
 // 4️⃣ Star / Unstar email
    public Email toggleStar(Long id) {
        Email email = getEmailById(id);
        email.setStarred(!email.isStarred());
        return emailRepository.save(email);
    }
 // 4️⃣ Delete email
    public void deleteEmail(Long id) {
        emailRepository.deleteById(id);
    }
 // 5️⃣ Priority inbox (starred)
    public List<Email> getStarredEmails() {
        return emailRepository.findByStarredTrue();
    }
 // 6️⃣ Search emails
    public List<Email> searchEmails(String keyword) {
        return emailRepository
                .findBySenderContainingIgnoreCaseOrSubjectContainingIgnoreCaseOrBodyContainingIgnoreCase(
                        keyword, keyword, keyword
                );
    }





}
