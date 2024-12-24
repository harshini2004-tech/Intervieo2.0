import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

interface FileUploadProps {
  onUpload: (text: string) => void
}

export const FileUpload: React.FC<FileUploadProps> = ({ onUpload }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    const reader = new FileReader()

    reader.onabort = () => console.log('file reading was aborted')
    reader.onerror = () => console.log('file reading has failed')
    reader.onload = () => {
      const text = reader.result as string
      onUpload(text)
    }

    reader.readAsText(file)
  }, [onUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'text/plain': ['.txt'] } })

  return (
    <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer">
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the resume file here ...</p> :
          <p>Drag 'n' drop a resume file here, or click to select a file</p>
      }
    </div>
  )
}

