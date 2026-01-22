package com.unimail.hub.model;

import java.util.List;

public class UserPreferences {

    private List<String> skills;
    private String location;

    public UserPreferences(List<String> skills, String location) {
        this.skills = skills;
        this.location = location;
    }

    public List<String> getSkills() {
        return skills;
    }

    public String getLocation() {
        return location;
    }
}
