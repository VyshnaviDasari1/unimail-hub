package com.unimail.hub.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.unimail.hub.entity.Email;
import com.unimail.hub.service.EmailService;

@RestController
@RequestMapping("/api/emails")
@CrossOrigin
public class EmailController {
	
	private final EmailService emailService;
	
	 public EmailController(EmailService emailService) {
		 this.emailService = emailService;
	 }
	 
	// 1️⃣ Inbox API
	    @GetMapping("/inbox")
	    public List<Email> inbox() {
	        return emailService.getInbox();
	    }

	    // 2️⃣ Open email by ID
	    @GetMapping("/{id}")
	    public Email getEmail(@PathVariable Long id) {
	        return emailService.getEmailById(id);
	    }

	    // 3️⃣ Mark email as read
	    @PutMapping("/{id}/read")
	    public Email markAsRead(@PathVariable Long id) {
	        return emailService.markAsRead(id);
	    }
	 // 4️⃣ Get unread emails
	    @GetMapping("/unread")
	    public List<Email> unreadEmails() {
	        return emailService.getUnreadEmails();
	    }
	 // ⭐ Star email
	    @PutMapping("/{id}/star")
	    public Email toggleStar(@PathVariable Long id) {
	        return emailService.toggleStar(id);
	    }
	 // 4️⃣ Delete email
	    @DeleteMapping("/{id}")
	    public void deleteEmail(@PathVariable Long id) {
	        emailService.deleteEmail(id);
	    }
	 // 5️⃣ Priority inbox API
	    @GetMapping("/starred")
	    public List<Email> getStarredEmails() {
	        return emailService.getStarredEmails();
	    }
	 // 6️⃣ Search API
	    @GetMapping("/search")
	    public List<Email> searchEmails(@RequestParam String q) {
	        return emailService.searchEmails(q);
	    }



}
