import React from 'react'

interface ResumeDisplayProps {
  resume: string
}

export const ResumeDisplay: React.FC<ResumeDisplayProps> = ({ resume }) => {
  return (
    <div className="mt-4 p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Uploaded Resume:</h3>
      <pre className="whitespace-pre-wrap">{resume}</pre>
    </div>
  )
}

