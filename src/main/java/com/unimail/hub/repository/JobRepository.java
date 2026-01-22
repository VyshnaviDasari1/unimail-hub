package com.unimail.hub.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.unimail.hub.entity.Job;

public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findBySavedTrue();
    List<Job> findByAppliedTrue();

    List<Job> findByCompanyContainingIgnoreCaseOrTitleContainingIgnoreCase(
            String company, String title);
    
    List<Job> findByImportantTrue();
}
