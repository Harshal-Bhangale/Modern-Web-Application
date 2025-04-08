"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, File, X, Check } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const { toast } = useToast()

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

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 5
      })
    }, 200)

    // Simulate upload completion
    setTimeout(() => {
      clearInterval(interval)
      setUploadProgress(100)

      setTimeout(() => {
        setUploading(false)
        setFiles([])
        setUploadProgress(0)
        toast({
          title: "Upload complete",
          description: "Your files have been uploaded and are being processed.",
          variant: "default",
        })
      }, 1000)
    }, 4000)
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Upload Study Materials</h1>
      <p className="text-muted-foreground mb-8">
        Upload your lecture slides, PDFs, notes, and textbooks. We'll organize and index everything for you.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Upload Files</CardTitle>
            <CardDescription>Supported formats: PDF, DOCX, PPTX, JPG, PNG</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="border-2 border-dashed rounded-lg p-10 text-center cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium">Drag and drop files here</p>
              <p className="text-sm text-muted-foreground mt-1">or click to browse</p>
              <input
                id="file-upload"
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.docx,.pptx,.jpg,.jpeg,.png"
              />
            </div>

            {files.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium mb-2">Selected Files ({files.length})</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-md">
                      <div className="flex items-center">
                        <File className="h-5 w-5 mr-2 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium truncate max-w-[200px] sm:max-w-[300px]">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeFile(index)} disabled={uploading}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {uploading && (
              <div className="mt-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Uploading...</span>
                  <span className="text-sm">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            <div className="mt-6">
              <Button onClick={handleUpload} disabled={files.length === 0 || uploading} className="w-full">
                {uploading ? "Uploading..." : "Upload Files"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upload Tips</CardTitle>
            <CardDescription>Get the most out of your uploads</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start">
              <div className="mr-2 mt-0.5">
                <Check className="h-5 w-5 text-green-500" />
              </div>
              <p className="text-sm">Upload complete documents rather than fragments for better context</p>
            </div>
            <div className="flex items-start">
              <div className="mr-2 mt-0.5">
                <Check className="h-5 w-5 text-green-500" />
              </div>
              <p className="text-sm">Include lecture slides, notes, and textbook chapters for comprehensive coverage</p>
            </div>
            <div className="flex items-start">
              <div className="mr-2 mt-0.5">
                <Check className="h-5 w-5 text-green-500" />
              </div>
              <p className="text-sm">Organize files by course or subject for better organization</p>
            </div>
            <div className="flex items-start">
              <div className="mr-2 mt-0.5">
                <Check className="h-5 w-5 text-green-500" />
              </div>
              <p className="text-sm">Maximum file size: 50MB per file</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
