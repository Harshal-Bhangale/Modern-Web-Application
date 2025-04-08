"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, FileText, Loader2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

type Message = {
  id: string
  content: string
  role: "user" | "assistant"
  sources?: {
    title: string
    page: number
  }[]
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your EduRAGPT assistant. Ask me anything about your study materials.",
      role: "assistant",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Mock data for uploaded files
  const uploadedFiles = [
    { id: "1", name: "Machine Learning Lecture 1.pdf", pages: 24 },
    { id: "2", name: "Data Structures Notes.pdf", pages: 45 },
    { id: "3", name: "Algorithms Textbook Chapter 5.pdf", pages: 32 },
  ]

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response with RAG
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: generateMockResponse(input),
        role: "assistant",
        sources: [
          { title: "Machine Learning Lecture 1.pdf", page: 12 },
          { title: "Data Structures Notes.pdf", page: 8 },
        ],
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 2000)
  }

  const generateMockResponse = (query: string): string => {
    // This is a mock function that would be replaced with actual RAG implementation
    const responses = [
      "Based on your lecture materials, this concept refers to the process of training a model on data to make predictions or decisions without being explicitly programmed. The key steps involve data preparation, feature selection, model training, and evaluation.",
      "According to your notes, this algorithm has a time complexity of O(n log n) in the average case, making it more efficient than bubble sort but less efficient than some specialized sorting algorithms in certain scenarios.",
      "Your textbook explains that this principle is fundamental to object-oriented programming, allowing for code reuse and establishing a relationship between a parent class and its children.",
      "From your study materials, I can see that this theorem states that for any continuous function f(x) on a closed interval [a,b], if f(a) and f(b) have opposite signs, then there exists at least one point c in the interval where f(c) = 0.",
    ]

    return responses[Math.floor(Math.random() * responses.length)]
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Chat with Your Materials</h1>
      <p className="text-muted-foreground mb-8">
        Ask questions about your uploaded study materials and get contextually relevant answers.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3">
          <CardContent className="p-0">
            <div className="flex flex-col h-[600px]">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                        <Avatar className="h-8 w-8">
                          {message.role === "assistant" ? (
                            <>
                              <AvatarImage src="/placeholder.svg?height=32&width=32" />
                              <AvatarFallback>AI</AvatarFallback>
                            </>
                          ) : (
                            <>
                              <AvatarImage src="/placeholder.svg?height=32&width=32" />
                              <AvatarFallback>U</AvatarFallback>
                            </>
                          )}
                        </Avatar>
                        <div>
                          <div
                            className={`rounded-lg p-4 ${
                              message.role === "assistant" ? "bg-muted" : "bg-primary text-primary-foreground"
                            }`}
                          >
                            <p>{message.content}</p>
                          </div>
                          {message.sources && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {message.sources.map((source, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  <FileText className="h-3 w-3 mr-1" />
                                  {source.title} (p. {source.page})
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex gap-3 max-w-[80%]">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg?height=32&width=32" />
                          <AvatarFallback>AI</AvatarFallback>
                        </Avatar>
                        <div className="rounded-lg p-4 bg-muted">
                          <Loader2 className="h-5 w-5 animate-spin" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              <div className="p-4 border-t">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    placeholder="Ask a question about your study materials..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={isLoading || !input.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <Tabs defaultValue="materials">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="materials">Materials</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
              <TabsContent value="materials" className="mt-4">
                <h3 className="font-medium mb-2">Your Uploaded Materials</h3>
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-2">
                    {uploadedFiles.map((file) => (
                      <div key={file.id} className="flex items-center p-2 rounded-md hover:bg-muted">
                        <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{file.pages} pages</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
              <TabsContent value="history" className="mt-4">
                <h3 className="font-medium mb-2">Recent Questions</h3>
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-2">
                    {messages
                      .filter((msg) => msg.role === "user")
                      .map((msg) => (
                        <div key={msg.id} className="p-2 rounded-md hover:bg-muted cursor-pointer">
                          <p className="text-sm truncate">{msg.content}</p>
                        </div>
                      ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
