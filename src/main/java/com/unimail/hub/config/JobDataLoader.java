package com.unimail.hub.config;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

import com.unimail.hub.entity.Job;
import com.unimail.hub.repository.JobRepository;

@Component
public class JobDataLoader {

    private final JobRepository jobRepository;

    public JobDataLoader(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    @PostConstruct
    public void loadJobs() {

        if (jobRepository.count() > 0) return; // avoid duplicates

        Job j1 = new Job();
        j1.setCompany("Google");
        j1.setTitle("Software Engineer");
        j1.setLocation("USA");
        j1.setDescription("Backend + Distributed systems");
        j1.setSaved(false);
        j1.setApplied(false);

        Job j2 = new Job();
        j2.setCompany("Amazon");
        j2.setTitle("Java Developer");
        j2.setLocation("Remote");
        j2.setDescription("Spring Boot, Microservices");
        j2.setSaved(true);
        j2.setApplied(false);

        Job j3 = new Job();
        j3.setCompany("Microsoft");
        j3.setTitle("Full Stack Engineer");
        j3.setLocation("Seattle");
        j3.setDescription("React + Java");
        j3.setSaved(false);
        j3.setApplied(true);

        jobRepository.save(j1);
        jobRepository.save(j2);
        jobRepository.save(j3);
    }
}
