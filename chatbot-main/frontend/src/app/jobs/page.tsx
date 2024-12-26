"use client"; // Add this line at the top

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// List of job data with Indian jobs for Python, AI/ML, and Java developers
const jobs = [
  { id: 1, title: 'Software Engineer', company: 'Tech Co', location: 'San Francisco, CA', skills: ['JavaScript', 'React'] },
  { id: 2, title: 'Product Manager', company: 'Startup Inc', location: 'New York, NY', skills: ['Leadership', 'Product Strategy'] },
  { id: 3, title: 'Data Scientist', company: 'Big Data Corp', location: 'Seattle, WA', skills: ['Python', 'Machine Learning'] },
  {
    id: 4,
    title: 'Senior Frontend Developer',
    company: 'TechCorp Inc',
    location: 'San Francisco, CA',
    salary: '$120,000 - $150,000',
    image: '/placeholder.svg?height=200&width=400',
    skills: ['JavaScript', 'React', 'CSS'],
  },
  {
    id: 5,
    title: 'Backend Engineer',
    company: 'DataFlow Systems',
    location: 'New York, NY',
    salary: '$130,000 - $160,000',
    image: '/placeholder.svg?height=200&width=400',
    skills: ['Node.js', 'Java'],
  },
  {
    id: 6,
    title: 'Full Stack Developer',
    company: 'Innovation Labs',
    location: 'Austin, TX',
    salary: '$110,000 - $140,000',
    image: '/placeholder.svg?height=200&width=400',
    skills: ['React', 'Node.js', 'Express'],
  },
  { id: 7, title: 'UX Designer', company: 'Creative Studio', location: 'Los Angeles, CA', skills: ['UX Design', 'Figma'] },
  { id: 8, title: 'DevOps Engineer', company: 'Cloud Solutions', location: 'Denver, CO', skills: ['AWS', 'Docker'] },
  { id: 9, title: 'Mobile Developer', company: 'AppWorks', location: 'Chicago, IL', skills: ['Flutter', 'Dart'] },
  { id: 10, title: 'QA Engineer', company: 'Quality Assurance Ltd', location: 'Boston, MA', skills: ['Testing', 'Automation'] },
  { id: 11, title: 'Systems Analyst', company: 'Enterprise Systems', location: 'Dallas, TX', skills: ['SQL', 'System Design'] },
  { id: 12, title: 'IT Support Specialist', company: 'Tech Support Co', location: 'Miami, FL', skills: ['Networking', 'Troubleshooting'] },

  // Indian jobs for Python, AI/ML, and Java developers
  { id: 13, title: 'Python Developer', company: 'Data Solutions Pvt Ltd', location: 'Bangalore, India', skills: ['Python', 'Django', 'Machine Learning'] },
  { id: 14, title: 'AI/ML Engineer', company: 'Tech Innovators', location: 'Hyderabad, India', skills: ['Python', 'TensorFlow', 'AI'] },
  { id: 15, title: 'Java Developer', company: 'Software Giants', location: 'Mumbai, India', skills: ['Java', 'Spring Boot', 'Microservices'] },
  { id: 16, title: 'AI Engineer', company: 'Artificial Intelligence Labs', location: 'Chennai, India', skills: ['Python', 'AI', 'Deep Learning'] },
  { id: 17, title: 'Machine Learning Engineer', company: 'Innovative Solutions', location: 'Pune, India', skills: ['Python', 'Machine Learning', 'Data Analysis'] },
  { id: 18, title: 'Backend Developer', company: 'Data Tech Solutions', location: 'Bangalore, India', skills: ['Java', 'Spring Boot', 'Microservices'] },
  { id: 19, title: 'Full Stack Developer', company: 'Tech Enterprises', location: 'Delhi, India', skills: ['JavaScript', 'React', 'Node.js', 'Java'] },
  { id: 20, title: 'Data Scientist', company: 'AI and Data Inc', location: 'Kolkata, India', skills: ['Python', 'R', 'Machine Learning'] },
  { id: 21, title: 'Java Developer', company: 'Enterprise Systems', location: 'Mumbai, India', skills: ['Java', 'Hibernate', 'Spring'] },
];

export default function JobListings() {
  const [location, setLocation] = useState<string>('');
  const [filteredJobs, setFilteredJobs] = useState<any[]>([]);

  // Handle location input change
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
  };

  // Handle form submission to filter jobs by location
  const handleSubmit = () => {
    if (location.trim() === "") {
      setFilteredJobs([]); // If no location, don't show any jobs
    } else {
      const filtered = jobs.filter(job => 
        job.location.toLowerCase().includes(location.toLowerCase())
      );
      setFilteredJobs(filtered);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-purple-600">Job Listings</h1>
      
      <div className="mb-8 text-center">
        <input
          type="text"
          placeholder="Enter location"
          value={location}
          onChange={handleLocationChange}
          className="border p-2 rounded-md"
        />
        <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md">Search</Button>
      </div>

      {/* Display job cards only after submitting */}
      {filteredJobs.length > 0 && (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="bg-purple-800 text-white border-gray-700 shadow-lg transform transition duration-500 hover:scale-105">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold">{job.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-yellow-400 text-lg">{job.company}</p>
                <p className="text-green-400 text-lg">{job.location}</p>
                {job.salary && <p className="text-gray-400 text-lg">{job.salary}</p>}
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-pink-600 hover:bg-pink-700 text-lg py-2">Apply Now</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
