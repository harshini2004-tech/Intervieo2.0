'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { jsPDF } from 'jspdf'

export default function GenerateResume() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    skills: '',
    certifications: '',
    experience: '',
    education: '',
  })

  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const generatePDF = () => {
    const doc = new jsPDF()

    doc.setFont("helvetica", "normal")

    // Title
    doc.setFontSize(20)
    doc.text('Resume', 20, 20)

    // Name
    doc.setFontSize(12)
    doc.text(`Name: ${formData.name}`, 20, 30)

    // Email
    doc.text(`Email: ${formData.email}`, 20, 40)

    // Phone
    doc.text(`Phone: ${formData.phone}`, 20, 50)

    // Skills
    doc.text('Skills:', 20, 60)
    doc.text(formData.skills, 20, 70)

    // Certifications
    doc.text('Certifications:', 20, 90)
    doc.text(formData.certifications, 20, 100)

    // Work Experience
    doc.text('Experience:', 20, 120)
    doc.text(formData.experience, 20, 130)

    // Education
    doc.text('Education:', 20, 150)
    doc.text(formData.education, 20, 160)

    // Save the PDF
    doc.save(`${formData.name}_Resume.pdf`)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Generate the resume PDF
    generatePDF()

    // Optionally, navigate to a different page if needed (e.g., preview page)
    // router.push('/resume-preview')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-purple-700">Generate Resume</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-lg text-purple-600">Full Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border border-purple-300 rounded-md focus:ring-2 focus:ring-purple-500"
            placeholder="Enter your full name"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-lg text-purple-600">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-purple-300 rounded-md focus:ring-2 focus:ring-purple-500"
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-lg text-purple-600">Phone Number</label>
          <input
            id="phone"
            name="phone"
            type="text"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-3 border border-purple-300 rounded-md focus:ring-2 focus:ring-purple-500"
            placeholder="Enter your phone number"
            required
          />
        </div>

        <div>
          <label htmlFor="skills" className="block text-lg text-purple-600">Skills</label>
          <textarea
            id="skills"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            className="w-full p-3 border border-purple-300 rounded-md focus:ring-2 focus:ring-purple-500"
            placeholder="Enter your skills"
            rows={4}
            required
          />
        </div>

        <div>
          <label htmlFor="certifications" className="block text-lg text-purple-600">Certifications</label>
          <textarea
            id="certifications"
            name="certifications"
            value={formData.certifications}
            onChange={handleChange}
            className="w-full p-3 border border-purple-300 rounded-md focus:ring-2 focus:ring-purple-500"
            placeholder="Enter your certifications"
            rows={4}
            required
          />
        </div>

        <div>
          <label htmlFor="experience" className="block text-lg text-purple-600">Work Experience</label>
          <textarea
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            className="w-full p-3 border border-purple-300 rounded-md focus:ring-2 focus:ring-purple-500"
            placeholder="Enter your work experience"
            rows={4}
            required
          />
        </div>

        <div>
          <label htmlFor="education" className="block text-lg text-purple-600">Education</label>
          <textarea
            id="education"
            name="education"
            value={formData.education}
            onChange={handleChange}
            className="w-full p-3 border border-purple-300 rounded-md focus:ring-2 focus:ring-purple-500"
            placeholder="Enter your education details"
            rows={4}
            required
          />
        </div>

        <Button
          variant="outline"
          type="submit"
          className="mt-4 w-full text-white bg-purple-500 hover:bg-purple-600 focus:ring-2 focus:ring-purple-600"
        >
          Generate Resume
        </Button>
      </form>
    </div>
  )
}
