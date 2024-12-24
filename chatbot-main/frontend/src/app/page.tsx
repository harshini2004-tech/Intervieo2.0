import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { ArrowRight, Briefcase, FileText, Users, Edit3, List, Star } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-6xl font-extrabold mb-6">Welcome to Intervieo</h1>
            <p className="text-2xl mb-8 text-gray-100">Your AI-powered interview preparation platform</p>
            <div className="flex justify-center space-x-4">
              <Button asChild size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-gray-900">
                <Link href="/resumeo">Upload Resume</Link>
              </Button>
              <Button asChild size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-gray-900">
                <Link href="/http://localhost:5173/">Create Resume</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-yellow-500 bg-yellow-500 text-gray-900">
                <Link href="/jobs">Browse Jobs</Link>
              </Button>
              <Button asChild size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-gray-900">
                <Link href="/interview-experiences">Experiences</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-12 text-center text-black">Why Choose Intervieo?</h2>
            <div className="grid md:grid-cols-4 gap-8">
              
              <FeatureCard 
                icon={<Users className="w-12 h-12 text-red-500" />}
                title="Mock Interviews"
                description="Practice with our AI interviewer and improve your interview skills."
              />
              <FeatureCard 
                icon={<Edit3 className="w-12 h-12 text-red-500" />}
                title="AI Resume Maker"
                description="Create a professional resume with our AI-powered resume maker."
              />
              
              <FeatureCard 
                icon={<List className="w-12 h-12 text-red-500" />}
                title="Jobs Lister"
                description="Browse through a list of job openings tailored to your profile."
              />
              <FeatureCard 
                icon={<Star className="w-12 h-12 text-red-500" />}
                title="Interview Experience"
                description="Read and share interview experiences to better prepare yourself."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6 text-gray-100">Ready to Ace Your Next Interview?</h2>
            <p className="text-2xl mb-8 text-gray-100">Join Intervieo today and take the first step towards your dream job.</p>
            <Button asChild size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-gray-900">
              <Link href="/resumeo">
                Get Started <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-white py-6 text-center text-gray-400">
        <p>&copy; 2024 Intervieo. All rights reserved.</p>
      </footer>
    </div>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-purple-700 p-6 rounded-lg text-center shadow-lg">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-2xl font-semibold mb-2 text-yellow-400">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  )
}

