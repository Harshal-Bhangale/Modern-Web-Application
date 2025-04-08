"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, type File } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"

interface FileUploadProps {
  onUploadComplete?: (files: File[]) => void
  maxFiles?: number
  maxSize?: number // in bytes
  acceptedFileTypes?: string[]
}

export function FileUpload({
  onUploadComplete,
  maxFiles = 10,
  maxSize = 50 * 1024 * 1024, // 50MB default
  acceptedFileTypes = [".pdf", ".docx", ".pptx", ".jpg", ".jpeg", ".png"],
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const { toast } = useToast()

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (files.length + acceptedFiles.length > maxFiles) {
        toast({
          title: "Too many files",
          description: `You can only upload a maximum of ${maxFiles} files at once.`,
          variant: "destructive",
        })
        return
      }

      const oversizedFiles = acceptedFiles.filter((file) => file.size > maxSize)
      if (oversizedFiles.length > 0) {
        toast({
          title: "Files too large",
          description: `Some files exceed the maximum size of ${maxSize / (1024 * 1024)}MB.`,
          variant: "destructive",
        })
        return
      }

      setFiles((prev) => [...prev, ...acceptedFiles])
    },
    [files, maxFiles, maxSize, toast],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce(
      (acc, type) => {
        acc[type] = []
        return acc
      },
      {} as Record<string, string[]>,
    ),
    maxFiles,
    maxSize,
  })

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

    // Simulate upload completion
    setTimeout(() => {
      clearInterval(interval)
      setUploadProgress(100)

      setTimeout(() => {
        setUploading(false)
        if (onUploadComplete) {
          onUploadComplete(files)
        }
        toast({
          title: "Upload complete",
          description: `Successfully uploaded ${files.length} file${files.length !== 1 ? "s" : ""}.`,
        })
        setFiles([])
        setUploadProgress(0)
      }, 1000)
    }, 4000)
  }

  return (
    <div className="space-y-6">
      <motion.div
        whileHover={{ boxShadow: "0 0 0 2px rgba(124, 58, 237, 0.3)" }}
        className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
          isDragActive ? "border-primary bg-primary/5" : "hover:bg-muted/50 hover:border-primary/50"
        }`}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <motion.div
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          className="flex flex-col items-center"
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <p className="text-lg font-medium">
            {isDragActive ? "Drop the files here" : "Drag and drop files here"}
          </p>
          <p className="text-sm text-muted-foreground mt-1">or click to browse</p>
          <p className="text-xs text-muted-foreground mt-4">
            \
