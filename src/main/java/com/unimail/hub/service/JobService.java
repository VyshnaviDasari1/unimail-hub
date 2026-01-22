package com.unimail.hub.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.unimail.hub.entity.Email;
import com.unimail.hub.entity.Job;
import com.unimail.hub.repository.EmailRepository;
import com.unimail.hub.repository.JobRepository;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final EmailRepository emailRepository;

    // 🔹 TEMP USER PREFERENCES (DEMO MODE)
    private static final List<String> USER_SKILLS =
            List.of("java", "backend", "spring", "microservices");

    private static final String USER_LOCATION = "texas";

    public JobService(JobRepository jobRepository, EmailRepository emailRepository) {
        this.jobRepository = jobRepository;
        this.emailRepository = emailRepository;
    }

    // 🔍 Skill matching
    private boolean matchesSkill(Job job) {
        String text = (
            (job.getTitle() != null ? job.getTitle() : "") + " " +
            (job.getDescription() != null ? job.getDescription() : "")
        ).toLowerCase();

        return USER_SKILLS.stream().anyMatch(text::contains);
    }

    // 📍 Location matching
    private boolean matchesLocation(Job job) {
        return job.getLocation() != null &&
               job.getLocation().toLowerCase().contains(USER_LOCATION);
    }

    // 1️⃣ CREATE JOB + AUTO ALERT
    public Job createJob(Job job) {

        Job savedJob = jobRepository.save(job);

        boolean skillMatch = matchesSkill(savedJob);
        boolean locationMatch = matchesLocation(savedJob);

        // 🚨 AUTO ALERT ONLY IF MATCHES PROFILE
        if (skillMatch && locationMatch) {

            Email alert = new Email();
            alert.setSender("alerts@unimailhub.com");
            alert.setSubject("🎯 Job Match Alert: " + savedJob.getTitle());
            alert.setBody(
                "A job matching your profile was found!\n\n" +
                "Company: " + savedJob.getCompany() + "\n" +
                "Role: " + savedJob.getTitle() + "\n" +
                "Location: " + savedJob.getLocation() + "\n\n" +
                "Matched Skills: Java / Backend / Spring\n\n" +
                "Open UniMail Hub to apply."
            );
            alert.setReceivedAt(LocalDateTime.now());
            alert.setRead(false);
            alert.setStarred(false);
            alert.setImportant(true); // shows in Alerts

            emailRepository.save(alert);
        }

        return savedJob;
    }

    // 2️⃣ Get all jobs
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    // 3️⃣ Get job by ID
    public Job getJobById(Long id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
    }

    // 4️⃣ Save / Unsave job
    public Job toggleSave(Long id) {
        Job job = getJobById(id);
        job.setSaved(!job.isSaved());
        return jobRepository.save(job);
    }

    // 5️⃣ Apply / Unapply job
    public Job toggleApply(Long id) {
        Job job = getJobById(id);
        job.setApplied(!job.isApplied());
        return jobRepository.save(job);
    }

    // 6️⃣ Manual Important → Alert
    public Job toggleImportant(Long id) {

        Job job = getJobById(id);
        boolean nowImportant = !job.isImportant();
        job.setImportant(nowImportant);
        jobRepository.save(job);

        if (nowImportant) {
            Email alert = new Email();
            alert.setSender("jobs@unimailhub.com");
            alert.setSubject("🚨 Job Alert: " + job.getTitle());
            alert.setBody(
                "You marked this job as important:\n\n" +
                "Company: " + job.getCompany() + "\n" +
                "Role: " + job.getTitle() + "\n" +
                "Location: " + job.getLocation()
            );
            alert.setReceivedAt(LocalDateTime.now());
            alert.setRead(false);
            alert.setStarred(false);
            alert.setImportant(true);

            emailRepository.save(alert);
        }

        return job;
    }

    // 7️⃣ Saved jobs
    public List<Job> getSavedJobs() {
        return jobRepository.findBySavedTrue();
    }

    // 8️⃣ Applied jobs
    public List<Job> getAppliedJobs() {
        return jobRepository.findByAppliedTrue();
    }

    // 9️⃣ Important jobs
    public List<Job> getImportantJobs() {
        return jobRepository.findByImportantTrue();
    }

    // 🔟 Search jobs
    public List<Job> searchJobs(String keyword) {
        return jobRepository
                .findByCompanyContainingIgnoreCaseOrTitleContainingIgnoreCase(
                        keyword, keyword);
    }

    // 1️⃣1️⃣ Delete job
    public void deleteJob(Long id) {
        jobRepository.deleteById(id);
    }
}
