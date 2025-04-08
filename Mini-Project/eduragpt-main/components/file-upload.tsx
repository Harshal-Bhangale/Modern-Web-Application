"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, File, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
          isDragActive ? "border-primary bg-primary/5" : "hover:bg-muted/50"
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
        <p className="text-lg font-medium">{isDragActive ? "Drop the files here" : "Drag and drop files here"}</p>
        <p className="text-sm text-muted-foreground mt-1">or click to browse</p>
        <p className="text-xs text-muted-foreground mt-4">
          Supported formats: {acceptedFileTypes.join(", ")}
          <br />
          Maximum file size: {maxSize / (1024 * 1024)}MB
        </p>
      </div>

      {files.length > 0 && (
        <div>
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
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Uploading...</span>
            <span className="text-sm">{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

      <Button onClick={handleUpload} disabled={files.length === 0 || uploading} className="w-full">
        {uploading ? "Uploading..." : "Upload Files"}
      </Button>
    </div>
  )
}
