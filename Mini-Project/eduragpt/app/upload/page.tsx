"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, File, X, Check, ArrowRight, Loader2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { Navbar } from "@/components/navbar"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useStudyMaterialsStore } from "@/lib/store"

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadComplete, setUploadComplete] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const { addMaterials } = useStudyMaterialsStore()

  const containerRef = useRef<HTMLDivElement>(null)

  // Animation to scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one file to upload.",
        variant: "destructive",
      })
      return
    }

    setUploading(true)

    // Simulate upload progress with acceleration
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        // Accelerate progress as it gets closer to completion
        const increment = 1 + (100 - prev) / 20
        return Math.min(prev + increment, 99.5)
      })
    }, 200)

    // Simulate processing the files
    setTimeout(() => {
      clearInterval(interval)
      setUploadProgress(100)

      // Add files to the global store
      const studyMaterials = files.map((file) => ({
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: file.type,
        size: file.size,
        pages: Math.floor(Math.random() * 30) + 5, // Mock page count
        uploadDate: new Date().toISOString(),
        content: `This is the content of ${file.name}`, // Mock content
      }))

      addMaterials(studyMaterials)

      setTimeout(() => {
        setUploadComplete(true)

        toast({
          title: "Upload complete",
          description: "Your files have been uploaded and are being processed.",
          variant: "default",
        })

        // Redirect after a short delay
        setTimeout(() => {
          router.push("/chat")
        }, 2000)
      }, 1000)
    }, 4000)
  }

  const uploadSteps = [
    { id: 1, title: "Upload Files", description: "Select your study materials" },
    { id: 2, title: "Processing", description: "Extracting text and knowledge" },
    { id: 3, title: "Indexing", description: "Making your content searchable" },
    { id: 4, title: "Ready", description: "Your materials are ready to use" },
  ]

  const currentStep = uploading ? (uploadProgress < 33 ? 1 : uploadProgress < 66 ? 2 : uploadProgress < 100 ? 3 : 4) : 1

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 pt-16">
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                Upload Study Materials
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Upload your lecture slides, PDFs, notes, and textbooks. We'll organize and index everything for you,
                making it easy to find what you need when you need it.
              </p>
            </div>

            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                {uploadSteps.map((step, index) => (
                  <div key={step.id} className="flex flex-col items-center relative">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center border-2 z-10",
                        currentStep >= step.id
                          ? "bg-primary border-primary text-primary-foreground"
                          : "bg-background border-muted text-muted-foreground",
                      )}
                    >
                      {currentStep > step.id ? (
                        <Check className="h-5 w-5" />
                      ) : currentStep === step.id && uploading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        step.id
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-xs mt-2 text-center w-20",
                        currentStep >= step.id ? "text-primary font-medium" : "text-muted-foreground",
                      )}
                    >
                      {step.title}
                    </span>

                    {/* Connector line */}
                    {index < uploadSteps.length - 1 && (
                      <div className="absolute left-[50px] top-[19px] w-[calc(100vw/5)] h-0.5 bg-muted -z-10">
                        <div
                          className="h-full bg-primary origin-left transition-all duration-500"
                          style={{
                            transform:
                              currentStep > step.id
                                ? "scaleX(1)"
                                : currentStep === step.id && uploadProgress > 0
                                  ? `scaleX(${uploadProgress / 100})`
                                  : "scaleX(0)",
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <AnimatePresence mode="wait">
                {!uploadComplete ? (
                  <motion.div
                    key="upload-form"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="md:col-span-2"
                  >
                    <Card className="overflow-hidden">
                      <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
                        <CardTitle>Upload Files</CardTitle>
                        <CardDescription>Supported formats: PDF, DOCX, PPTX, JPG, PNG</CardDescription>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div
                          className={cn(
                            "border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-all duration-300",
                            uploading ? "opacity-50 pointer-events-none" : "hover:bg-muted/50 hover:border-primary/50",
                          )}
                          onClick={() => document.getElementById("file-upload")?.click()}
                        >
                          <motion.div
                            initial={{ scale: 1 }}
                            whileHover={{ scale: 1.05 }}
                            className="flex flex-col items-center"
                          >
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                              <Upload className="h-8 w-8 text-primary" />
                            </div>
                            <p className="text-lg font-medium">Drag and drop files here</p>
                            <p className="text-sm text-muted-foreground mt-1">or click to browse</p>
                            <input
                              id="file-upload"
                              type="file"
                              multiple
                              className="hidden"
                              onChange={handleFileChange}
                              accept=".pdf,.docx,.pptx,.jpg,.jpeg,.png"
                              disabled={uploading}
                            />
                          </motion.div>
                        </div>

                        <AnimatePresence>
                          {files.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="mt-6 overflow-hidden"
                            >
                              <h3 className="font-medium mb-2">Selected Files ({files.length})</h3>
                              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                {files.map((file, index) => (
                                  <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex items-center justify-between p-3 bg-muted rounded-md"
                                  >
                                    <div className="flex items-center">
                                      <File className="h-5 w-5 mr-2 text-muted-foreground" />
                                      <div>
                                        <p className="text-sm font-medium truncate max-w-[200px] sm:max-w-[300px]">
                                          {file.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                          {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                      </div>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => removeFile(index)}
                                      disabled={uploading}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </motion.div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {uploading && (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
                            <div className="flex justify-between mb-2">
                              <span className="text-sm font-medium">
                                {uploadProgress < 33
                                  ? "Uploading..."
                                  : uploadProgress < 66
                                    ? "Processing..."
                                    : uploadProgress < 100
                                      ? "Indexing..."
                                      : "Complete!"}
                              </span>
                              <span className="text-sm">{Math.round(uploadProgress)}%</span>
                            </div>
                            <Progress value={uploadProgress} className="h-2" />
                            <p className="text-xs text-muted-foreground mt-2">
                              {uploadProgress < 33
                                ? "Uploading your files to our secure servers"
                                : uploadProgress < 66
                                  ? "Extracting text and knowledge from your documents"
                                  : uploadProgress < 100
                                    ? "Creating vector embeddings for semantic search"
                                    : "Your materials are ready to use!"}
                            </p>
                          </motion.div>
                        )}

                        <div className="mt-6">
                          <Button
                            onClick={handleUpload}
                            disabled={files.length === 0 || uploading}
                            className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                          >
                            {uploading ? "Processing..." : "Upload Files"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ) : (
                  <motion.div
                    key="upload-complete"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="md:col-span-2"
                  >
                    <Card className="overflow-hidden">
                      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                        <CardTitle className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-2">
                            <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                          </div>
                          Upload Complete!
                        </CardTitle>
                        <CardDescription>Your files have been processed successfully</CardDescription>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="text-center py-6">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4"
                          >
                            <Check className="h-10 w-10 text-green-600 dark:text-green-400" />
                          </motion.div>
                          <h3 className="text-xl font-bold mb-2">Your materials are ready!</h3>
                          <p className="text-muted-foreground mb-6">
                            We've processed your files and they're now ready for you to search, chat, and visualize.
                          </p>
                          <Button asChild className="bg-gradient-primary hover:opacity-90 transition-opacity">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <span className="flex items-center">
                                Continue to Chat
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </span>
                            </motion.div>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              <Card>
                <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
                  <CardTitle>Upload Tips</CardTitle>
                  <CardDescription>Get the most out of your uploads</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <motion.div className="space-y-4">
                    {[
                      "Upload complete documents rather than fragments for better context",
                      "Include lecture slides, notes, and textbook chapters for comprehensive coverage",
                      "Organize files by course or subject for better organization",
                      "Maximum file size: 50MB per file",
                    ].map((tip, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-start"
                      >
                        <div className="mr-2 mt-0.5">
                          <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                            <Check className="h-3 w-3 text-primary" />
                          </div>
                        </div>
                        <p className="text-sm">{tip}</p>
                      </motion.div>
                    ))}
                  </motion.div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
