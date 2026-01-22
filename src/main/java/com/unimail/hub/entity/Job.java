package com.unimail.hub.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String company;
    
    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false)
    private String location;
    
    @Column
    private String description;

    private boolean applied;
    private boolean saved;
    private boolean important;
    
}
