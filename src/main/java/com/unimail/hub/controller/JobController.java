package com.unimail.hub.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.unimail.hub.entity.Job;
import com.unimail.hub.service.JobService;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    // 1️⃣ CREATE JOB (THIS FIXES YOUR POSTMAN ERROR)
    @PostMapping
    public Job createJob(@RequestBody Job job) {
        return jobService.createJob(job);
    }

    // 2️⃣ Get all jobs
    @GetMapping
    public List<Job> getAllJobs() {
        return jobService.getAllJobs();
    }

    // 3️⃣ Get job by ID
    @GetMapping("/{id}")
    public Job getJob(@PathVariable Long id) {
        return jobService.getJobById(id);
    }

    // 4️⃣ Save / Unsave job
    @PutMapping("/{id}/save")
    public Job toggleSave(@PathVariable Long id) {
        return jobService.toggleSave(id);
    }

    // 5️⃣ Apply / Unapply job
    @PutMapping("/{id}/apply")
    public Job toggleApply(@PathVariable Long id) {
        return jobService.toggleApply(id);
    }

    // 6️⃣ Mark important (manual alert)
    @PutMapping("/{id}/important")
    public Job toggleImportant(@PathVariable Long id) {
        return jobService.toggleImportant(id);
    }

    // 7️⃣ Saved jobs
    @GetMapping("/saved")
    public List<Job> savedJobs() {
        return jobService.getSavedJobs();
    }

    // 8️⃣ Applied jobs
    @GetMapping("/applied")
    public List<Job> appliedJobs() {
        return jobService.getAppliedJobs();
    }

    // 9️⃣ Important jobs
    @GetMapping("/important")
    public List<Job> importantJobs() {
        return jobService.getImportantJobs();
    }

    // 🔟 Search jobs
    @GetMapping("/search")
    public List<Job> search(@RequestParam String q) {
        return jobService.searchJobs(q);
    }

    // 1️⃣1️⃣ Delete job
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        jobService.deleteJob(id);
    }
}
