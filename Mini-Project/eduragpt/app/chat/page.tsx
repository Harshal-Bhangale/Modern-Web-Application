"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, FileText, Loader2, Bot, User, Search, X, ChevronRight, MessageSquare } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useStudyMaterialsStore } from "@/lib/store"
import { generateRAGResponse } from "@/lib/rag-utils"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useToast } from "@/hooks/use-toast"

type Message = {
  id: string
  content: string
  role: "user" | "assistant"
  sources?: {
    title: string
    page: number
  }[]
  timestamp: Date
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm your EduRAGPT assistant. Ask me anything about your study materials.",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { materials } = useStudyMaterialsStore()
  const { toast } = useToast()

  // Animation to scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Generate response using RAG
      const response = await generateRAGResponse(input)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.text,
        role: "assistant",
        sources: response.sources,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Trigger visualization update based on the question
      if (
        input.toLowerCase().includes("relationship") ||
        input.toLowerCase().includes("connection") ||
        input.toLowerCase().includes("compare")
      ) {
        toast({
          title: "Visualization Updated",
          description: "A new knowledge graph has been generated based on your question.",
          action: (
            <Button variant="outline" size="sm" asChild>
              <a href="/visualize">View</a>
            </Button>
          ),
        })
      }
    } catch (error) {
      console.error("Error generating response:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I encountered an error processing your request. Please try again.",
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const filteredMaterials = materials.filter((material) =>
    material.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 pt-16">
        <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                Chat with Your Materials
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Ask questions about your uploaded study materials and get contextually relevant answers with source
                citations.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-span-3"
              >
                <Card className="overflow-hidden border-2 animated-border">
                  <CardContent className="p-0">
                    <div className="flex flex-col h-[600px]">
                      <ScrollArea className="flex-1 p-4">
                        <div className="space-y-6">
                          {messages.map((message) => (
                            <motion.div
                              key={message.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}
                              >
                                <div className="flex-shrink-0 mt-1">
                                  <Avatar
                                    className={cn(
                                      "h-8 w-8",
                                      message.role === "assistant" && "bg-primary/10 text-primary",
                                    )}
                                  >
                                    {message.role === "assistant" ? (
                                      <>
                                        <Bot className="h-5 w-5" />
                                        <AvatarFallback>AI</AvatarFallback>
                                      </>
                                    ) : (
                                      <>
                                        <User className="h-5 w-5" />
                                        <AvatarFallback>U</AvatarFallback>
                                      </>
                                    )}
                                  </Avatar>
                                </div>
                                <div>
                                  <div
                                    className={cn(
                                      "rounded-lg p-4",
                                      message.role === "assistant"
                                        ? "bg-muted"
                                        : "bg-gradient-primary text-primary-foreground",
                                    )}
                                  >
                                    <p className="whitespace-pre-wrap">{message.content}</p>
                                  </div>

                                  {message.sources && message.sources.length > 0 && (
                                    <div className="mt-2">
                                      <Accordion type="single" collapsible className="w-full">
                                        <AccordionItem value="sources" className="border-none">
                                          <AccordionTrigger className="py-1 text-xs text-muted-foreground hover:text-foreground">
                                            <div className="flex items-center">
                                              <FileText className="h-3 w-3 mr-1" />
                                              Sources ({message.sources.length})
                                            </div>
                                          </AccordionTrigger>
                                          <AccordionContent>
                                            <div className="flex flex-wrap gap-2 pt-1">
                                              {message.sources.map((source, index) => (
                                                <Badge key={index} variant="outline" className="text-xs">
                                                  <FileText className="h-3 w-3 mr-1" />
                                                  {source.title} (p. {source.page})
                                                </Badge>
                                              ))}
                                            </div>
                                          </AccordionContent>
                                        </AccordionItem>
                                      </Accordion>
                                    </div>
                                  )}

                                  <div className="mt-1 text-xs text-muted-foreground">
                                    {new Date(message.timestamp).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                          {isLoading && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex justify-start"
                            >
                              <div className="flex gap-3 max-w-[80%]">
                                <Avatar className="h-8 w-8 bg-primary/10 text-primary">
                                  <Bot className="h-5 w-5" />
                                  <AvatarFallback>AI</AvatarFallback>
                                </Avatar>
                                <div className="rounded-lg p-4 bg-muted min-w-[60px]">
                                  <div className="flex items-center space-x-1 loading-dots">
                                    <span className="h-2 w-2 rounded-full bg-muted-foreground"></span>
                                    <span className="h-2 w-2 rounded-full bg-muted-foreground"></span>
                                    <span className="h-2 w-2 rounded-full bg-muted-foreground"></span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                          <div ref={messagesEndRef} />
                        </div>
                      </ScrollArea>
                      <div className="p-4 border-t">
                        <form onSubmit={handleSendMessage} className="flex gap-2">
                          <Input
                            ref={inputRef}
                            placeholder="Ask a question about your study materials..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={isLoading}
                            className="flex-1"
                          />
                          <Button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="bg-gradient-primary hover:opacity-90 transition-opacity"
                          >
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                          </Button>
                        </form>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card className="overflow-hidden">
                  <CardContent className="p-4">
                    <Tabs defaultValue="materials">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="materials">Materials</TabsTrigger>
                        <TabsTrigger value="history">History</TabsTrigger>
                      </TabsList>
                      <TabsContent value="materials" className="mt-4">
                        <div className="mb-4">
                          <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Search materials..."
                              className="pl-8"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1.5 h-7 w-7"
                                onClick={() => setSearchTerm("")}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>

                        <ScrollArea className="h-[400px] pr-4">
                          <AnimatePresence>
                            {filteredMaterials.length > 0 ? (
                              <div className="space-y-2">
                                {filteredMaterials.map((file, index) => (
                                  <motion.div
                                    key={file.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2, delay: index * 0.05 }}
                                    className="flex items-center p-2 rounded-md hover:bg-muted group cursor-pointer"
                                    onClick={() => {
                                      setInput(`Tell me about ${file.name}`)
                                      inputRef.current?.focus()
                                    }}
                                  >
                                    <FileText className="h-5 w-5 mr-2 text-primary" />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium truncate">{file.name}</p>
                                      <p className="text-xs text-muted-foreground">{file.pages} pages</p>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </motion.div>
                                ))}
                              </div>
                            ) : (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center h-[200px] text-center p-4"
                              >
                                {materials.length === 0 ? (
                                  <>
                                    <FileText className="h-10 w-10 text-muted-foreground mb-2" />
                                    <p className="text-sm font-medium">No materials uploaded yet</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      Upload your study materials to get started
                                    </p>
                                    <Button asChild variant="link" size="sm" className="mt-2">
                                      <a href="/upload">Upload Materials</a>
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    <Search className="h-10 w-10 text-muted-foreground mb-2" />
                                    <p className="text-sm font-medium">No matching materials</p>
                                    <p className="text-xs text-muted-foreground mt-1">Try a different search term</p>
                                  </>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </ScrollArea>
                      </TabsContent>
                      <TabsContent value="history" className="mt-4">
                        <ScrollArea className="h-[450px] pr-4">
                          {messages.filter((msg) => msg.role === "user").length > 0 ? (
                            <div className="space-y-2">
                              {messages
                                .filter((msg) => msg.role === "user")
                                .reverse()
                                .map((msg, index) => (
                                  <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2, delay: index * 0.05 }}
                                    className="p-2 rounded-md hover:bg-muted cursor-pointer group"
                                    onClick={() => setInput(msg.content)}
                                  >
                                    <div className="flex items-center justify-between">
                                      <p className="text-sm truncate flex-1">{msg.content}</p>
                                      <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                      {new Date(msg.timestamp).toLocaleString([], {
                                        month: "short",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </p>
                                  </motion.div>
                                ))}
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-[200px] text-center p-4">
                              <MessageSquare className="h-10 w-10 text-muted-foreground mb-2" />
                              <p className="text-sm font-medium">No chat history yet</p>
                              <p className="text-xs text-muted-foreground mt-1">Your questions will appear here</p>
                            </div>
                          )}
                        </ScrollArea>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
