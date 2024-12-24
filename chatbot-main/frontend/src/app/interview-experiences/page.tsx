"use client"; // Ensures client-side rendering for state management
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import Image from "next/image";

const experiences = [
  {
    id: 1,
    company: 'Fractal',
    role: 'Senior Frontend Developer',
    author: 'Prachi',
    date: 'December 15, 2023',
    image: '/fractal.webp',
    experience: `The interview process at Fractal was comprehensive and well-structured. It consisted of:

1. Initial Phone Screen (45 minutes)
- Basic JavaScript concepts
- DOM manipulation
- Event handling

2. Technical Round 1 (1 hour)
- Algorithm problem solving
- Data structures
- Time complexity analysis

3. Technical Round 2 (1 hour)
- System design
- Scalability considerations
- Performance optimization

4. Final Round (1 hour)
- Behavioral questions
- Team fit assessment
- Project discussions

Key Tips:
- Focus on clean code
- Think aloud during problem-solving
- Ask clarifying questions
- Discuss trade-offs in your solutions`
  },
  {
    id: 2,
    company: 'Oracle',
    role: 'Full Stack Developer',
    author: 'Shashi',
    date: 'December 10, 2023',
    image: '/oracle.webp',
    experience: `Oracle's interview process was thorough and focused on both technical skills. The process included:

1. Recruiter Call (30 minutes)
- Background discussion
- Role overview
- Initial screening

2. Technical Assessment
- Coding challenge
- Architecture design
- API design principles

3. Virtual Onsite (4 hours)
- System design
- Coding rounds
- Behavioral interview

Key Learnings:
- Practice system design
- Review core CS concepts
- Prepare real-world examples
- Focus on scalability`,
  },
  {
    id: 3,
    company: 'Phonepe',
    role: 'Software Development Engineer',
    author: 'Suyyash',
    date: 'December 5, 2023',
    image: '/phonepe.webp',
    experience: `The interview process at Phonepe was challenging and rewarding. It included:

1. Initial HR Screen (30 minutes)
- Background check
- Role expectations

2. Technical Round 1 (1 hour)
- Coding problems
- Data structures and algorithms

3. Technical Round 2 (1 hour)
- System design
- Problem-solving approach

4. Final Round (1 hour)
- Behavioral questions
- Team fit assessment

Key Tips:
- Practice coding problems
- Understand system design basics
- Communicate your thought process`
  },
  {
    id: 4,
    company: 'Fivetran',
    role: 'Backend Developer',
    author: 'Siddharth',
    date: 'November 30, 2023',
    image: '/fivetran.webp',
    experience: `Fivetran's interview process was rigorous and focused on backend skills. The stages were:

1. Recruiter Screen (30 minutes)
- Role discussion
- Experience overview

2. Technical Round 1 (1 hour)
- Coding challenge
- Database design

3. Technical Round 2 (1 hour)
- API design
- System architecture

4. Final Round (1 hour)
- Behavioral interview
- Cultural fit

Key Learnings:
- Brush up on database concepts
- Practice API design
- Be clear and concise in explanations`
  },
  {
    id: 5,
    company: 'Inmobi',
    role: 'DevOps Engineer',
    author: 'Rohan',
    date: 'November 25, 2023',
    image: '/inmobi.webp',
    experience: `The interview process at Inmobi was detailed and focused on DevOps skills. It included:

1. HR Screen (30 minutes)
- Role and experience discussion

2. Technical Round 1 (1 hour)
- Scripting and automation
- Infrastructure as code

3. Technical Round 2 (1 hour)
- CI/CD pipelines
- Cloud services

4. Final Round (1 hour)
- Behavioral questions
- Team collaboration

Key Tips:
- Understand CI/CD tools
- Practice cloud services
- Focus on automation`
  },
  {
    id: 6,
    company: 'Avalara',
    role: 'Data Scientist',
    author: 'Ansh Jain',
    date: 'November 20, 2023',
    image: '/avalara.webp',
    experience: `Avalara's interview process was comprehensive and data-focused. The stages were:

1. Initial Screen (30 minutes)
- Background and role discussion

2. Technical Round 1 (1 hour)
- Data analysis
- Machine learning algorithms

3. Technical Round 2 (1 hour)
- Statistical methods
- Data modeling

4. Final Round (1 hour)
- Behavioral interview
- Project discussion

Key Learnings:
- Review machine learning concepts
- Practice data analysis
- Prepare to discuss past projects`
  },
];

// Modal Component
function ExperienceModal({ isOpen, onClose, content }: any) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 text-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Interview Experience</h2>
        <div className="overflow-y-auto mb-4 pr-2" style={{ maxHeight: "65vh" }}>
          <p className="whitespace-pre-line">{content}</p>
        </div>
        <div className="mt-auto">
          <Button
            className="bg-purple-500 text-white hover:bg-purple-600 w-full py-2 rounded-md"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function InterviewExperiences() {
  const [modalContent, setModalContent] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (experience: string) => {
    setModalContent(experience);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent("");
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black p-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-purple-700">Interview Experiences</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        {experiences.map(exp => (
          <Card key={exp.id} className="bg-white border border-gray-300 shadow-lg overflow-hidden rounded-lg">
            <CardHeader className="p-0 bg-gray-200">
              <Image
                src={exp.image}
                alt={exp.company}
                width={400}
                height={200}
                className="object-contain w-full h-48"
              />
            </CardHeader>
            <CardContent className="p-6">
              <h3 className="text-gray-900 text-xl font-semibold mb-2">{exp.company}</h3>
              <p className="text-lg mb-2 text-gray-700">{exp.role}</p>
              <p className="text-sm text-gray-500">
                By {exp.author} on {exp.date}
              </p>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <Button
                className="w-full bg-purple-500 border border-purple-500 text-white hover:bg-purple-600 py-2 rounded-md"
                onClick={() => openModal(exp.experience || "No experience provided.")}
              >
                Read Experience
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      {/* Modal */}
      <ExperienceModal
        isOpen={isModalOpen}
        onClose={closeModal}
        content={modalContent}
      />
    </div>
  );
}

