"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Send, Upload, User } from 'lucide-react';
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import Markdown from "react-markdown";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import QuestionTracker from '@/components/QuestionTracker';
import { autoResizeTextarea, MAX_TEXTAREA_HEIGHT } from "../../../utils/textareaUtils";
import BubbleAnimation from '../../components/BubbleAnimation';
import React from "react";

// Set up the worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface ResumeData {
  skills?: string[];
  experience?: Array<{
    company: string;
    role: string;
    duration: string;
    responsibilities: string[];
  }>;
  education?: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
  achievements?: string[];
}

interface Message {
  sender: string;
  content: string;
  type: 'question' | 'answer' | 'feedback';
}

export default function InterviewPrepPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      content: "Welcome to the Interview Preparation Chatbot! Please upload your resume to get started.",
      type: 'question'
    },
  ]);
  const [input, setInput] = useState("");
  const [isResumeUploaded, setIsResumeUploaded] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [interviewQuestions, setInterviewQuestions] = useState<string[]>([]);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (input === "" && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [input]);

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPdfFile(file);
      const formData = new FormData();
      formData.append('resume', file);

      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/parse-resume', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          setIsResumeUploaded(true);
          setResumeData(data.resume_data || {});
          toast.success("Resume uploaded and analyzed successfully!");
          setInterviewQuestions(data.questions || []);
          setIsBotTyping(true);
          await new Promise(resolve => setTimeout(resolve, 1000));
          setMessages(prevMessages => [
            ...prevMessages,
            {
              sender: "bot",
              content: "Great! I've analyzed your resume.",
              type: 'question'
            },
          ]);
          await new Promise(resolve => setTimeout(resolve, 1000));
          setMessages(prevMessages => [
            ...prevMessages,
            {
              sender: "bot",
              content: data.questions && data.questions.length > 0 ? data.questions[0] : "No questions available.",
              type: 'question'
            }
          ]);
          setCurrentQuestionIndex(0);
          setIsBotTyping(false);
        } else {
          const errorData = await response.json();
          toast.error(errorData.error || "Failed to upload resume. Please try again.");
        }
      } catch (error) {
        console.error('Error uploading resume:', error);
        toast.error("An error occurred while uploading your resume.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSendMessage = useCallback(async () => {
    if (input.trim() === "") return;

    setMessages(prevMessages => [
      ...prevMessages,
      { sender: "user", content: input, type: 'answer' }
    ]);
    setInput("");

    setIsLoading(true);
    setIsBotTyping(true);
    try {
      const response = await fetch('http://localhost:5000/api/evaluate-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: interviewQuestions[currentQuestionIndex],
          answer: input
        }),
      });

      if (response.ok) {
        const data = await response.json();
        await new Promise(resolve => setTimeout(resolve, 1000));
        setMessages(prevMessages => [
          ...prevMessages,
          { sender: "bot", content: data.feedback, type: 'feedback' }
        ]);

        await new Promise(resolve => setTimeout(resolve, 1000));

        if (currentQuestionIndex < interviewQuestions.length - 1) {
          setCurrentQuestionIndex(prevIndex => prevIndex + 1);
          setMessages(prevMessages => [
            ...prevMessages,
            { sender: "bot", content: interviewQuestions[currentQuestionIndex + 1], type: 'question' }
          ]);
        } else {
          setMessages(prevMessages => [
            ...prevMessages,
            { sender: "bot", content: "Great job! You've completed all the interview questions. Would you like to review your answers or start over?", type: 'question' }
          ]);
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to evaluate answer. Please try again.");
      }
    } catch (error) {
      console.error('Error evaluating answer:', error);
      toast.error("An error occurred while evaluating your answer.");
    } finally {
      setIsLoading(false);
      setIsBotTyping(false);
    }
  }, [input, interviewQuestions, currentQuestionIndex]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const handleResumeButtonClick = () => {
    fileInputRef.current?.click();
  };

  const MemoizedPDFPreview = useMemo(() => (
    pdfFile && (
      <div className="bg-gray-700 p-4 rounded-lg shadow-md">
        <iframe
          src={URL.createObjectURL(pdfFile) + '#toolbar=0'}
          className="w-full h-[400px] rounded-lg"
          title="Resume Preview"
        />
      </div>
    )
  ), [pdfFile]);

  const MemoizedQuestionTracker = React.memo(QuestionTracker);

  return (
    <div className="flex h-screen w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 text-white">
      <div className="flex flex-col w-full max-w-screen-2xl mx-auto p-4 lg:p-6 h-full">
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-700 via-pink-600 to-red-600 text-white rounded-t-xl shadow-lg">
          <div className="flex items-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#dca7ff] text-[#161616] flex items-center justify-center font-bold text-lg sm:text-xl mr-2 sm:mr-3 shadow-md">
              IP
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#fefefe]">Interview Prep</h2>
              <p className="text-xs sm:text-sm text-[#fefefe] opacity-75">AI-powered interview assistant</p>
            </div>
          </div>
          {isResumeUploaded && (
            <Button
              onClick={handleResumeButtonClick}
              className="bg-[#dca7ff] text-[#161616] py-2 px-4 rounded-md font-bold flex items-center justify-center hover:bg-[#c28aff] shadow-md"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#161616]"></div>
              ) : (
                <>
                  <Upload size={20} className="mr-2" />
                  Update Resume
                </>
              )}
            </Button>
          )}
        </div>
        <div className="flex flex-1 bg-gray-800 border-gray-700 rounded-b-xl overflow-hidden shadow-lg">
          <div className="flex flex-col w-full lg:w-2/3 border-r border-gray-700 h-[calc(100vh-8rem)]">
            <input
              type="file"
              accept=".pdf"
              onChange={handleResumeUpload}
              className="hidden"
              ref={fileInputRef}
            />
            {!isResumeUploaded && (
              <Button
                onClick={handleResumeButtonClick}
                className="mb-4 bg-[#dca7ff] text-[#161616] py-2 px-4 rounded-md font-bold flex items-center justify-center hover:bg-[#c28aff] shadow-md"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#161616]"></div>
                ) : (
                  <>
                    <Upload size={20} className="mr-2" />
                    Upload Resume
                  </>
                )}
              </Button>
            )}
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-auto p-4 space-y-4 mb-14 lg:mb-0 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
            >
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md xl:max-w-lg rounded-lg p-3 shadow-md ${
                      message.sender === "user"
                        ? "bg-[#dca7ff] text-[#161616]"
                        : "bg-purple-600 text-white"
                    }`}
                  >
                    <div className="prose prose-invert max-w-none">
                      <Markdown>{message.content}</Markdown>
                    </div>
                  </div>
                </div>
              ))}
              {isBotTyping && <BubbleAnimation />}
              <div ref={messagesEndRef} />
            </div>
            <div className="fixed lg:relative bottom-14 lg:bottom-0 left-0 right-0 lg:left-auto lg:right-auto p-4 border-t border-gray-700 bg-purple-600 text-white shadow-lg">
              <div className="flex items-center bg-white rounded-full overflow-hidden shadow-md">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    autoResizeTextarea(e.target, MAX_TEXTAREA_HEIGHT);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={isResumeUploaded ? "Type your answer..." : "Upload your resume to start the interview"}
                  className="flex-grow p-3 bg-transparent focus:outline-none text-[#161616] placeholder-gray-400 resize-none max-h-[150px] overflow-y-auto"
                  disabled={!isResumeUploaded || isLoading}
                  rows={1}
                />
                <Button
                  onClick={handleSendMessage}
                  className={`p-3 ${
                    !isResumeUploaded || isLoading
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-[#dca7ff] hover:text-[#fefefe]"
                  }`}
                  disabled={!isResumeUploaded || isLoading}
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#dca7ff]"></div>
                  ) : (
                    <Send size={20} />
                  )}
                </Button>
              </div>
            </div>
          </div>
          <div className="hidden lg:block lg:w-1/3 p-4 overflow-auto">
            <h3 className="text-xl font-bold mb-4 flex items-center text-white">
              Resume Preview
            </h3>
            <div className="space-y-4">
              {MemoizedPDFPreview}
              <div className="p-4 rounded-lg bg-purple-600 shadow-md">
                <h4 className="font-semibold mb-2 text-white">Questions Progress</h4>
                <MemoizedQuestionTracker 
                  currentQuestion={currentQuestionIndex + 1}
                  totalQuestions={interviewQuestions.length}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer 
        position="bottom-right"
        theme="dark"
        toastClassName="bg-gray-700 text-white shadow-md"
      />
    </div>
  );
}

