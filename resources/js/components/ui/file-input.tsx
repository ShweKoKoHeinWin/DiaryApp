"use client"

import * as React from "react"
import { Upload, X, File, ImageIcon, FileText, Text, Files, VideoIcon, Image } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { DiaryOldFileProp } from "@/types/types"

export interface FileWithCaption {
  id: string
  file: File
  caption: string
  preview?: string
}

interface FileUploadProps {
  files: FileWithCaption[];
  onChange: React.Dispatch<React.SetStateAction<FileWithCaption[]>>;
  maxFiles?: number
  maxSize?: number // in bytes
  accept?: Record<string, string[]>
  className?: string,
  [key: string] : any,
}

export function FileUpload({
  existingFiles = [],
  setExistingFiles = () => {},
  files,
  onChange,
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024, // 5MB default
  accept,
  className,
}: FileUploadProps) {
  
  const [isDragOver, setIsDragOver] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const generateId = () => Math.random().toString(36).substr(2, 9)
  
  const handleFiles = async (newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles)
    const validFiles = fileArray.filter((file) => {
      if (file.size > maxSize) {
        alert(`File "${file.name}" is too large. Maximum size is ${Math.round(maxSize / 1024 / 1024)}MB.`)
        return false
      }
      return true
    })

    if (files.length + validFiles.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} files.`)
      return
    }

    const filesWithCaptions: FileWithCaption[] = await Promise.all(
      validFiles.map(async (file) => ({
        id: generateId(),
        file,
        caption: "",
        preview: await createFilePreview(file),
      })),
    )

    onChange([...files, ...filesWithCaptions])
  }

  const removeFile = (id: string) => {
    onChange(files.filter((file) => file.id !== id))
  }

  const updateCaption = (id: string, caption: string) => {
    onChange(files.map((file) => (file.id === id ? { ...file, caption } : file)))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }

  const getFileIcon = (file: File|null = null, type: string = '') => {
    if(type) {
      if(type === 'image') return ImageIcon;
      if(type === 'text') return Text;
      return FileText;
    }
    if(file !== null) {
      if (file.type.startsWith("image/")) return ImageIcon
      if (file.type.includes("pdf")) return FileText
    }
    return File
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

 const createFilePreview = (file: File): Promise<string | undefined> => {
  return new Promise((resolve) => {
    const reader = new FileReader()

    if (file.type.startsWith("image/") || file.type.startsWith("video/") || file.type.startsWith("text/") || file.type === "application/pdf") {
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.onerror = () => resolve(undefined)

      // Choose reading method based on file type
      if (file.type.startsWith("text/")) {
        reader.readAsText(file)
      } else {
        reader.readAsDataURL(file) // For images, video, PDF preview
      }
    } else {
      // No preview (e.g., .docx, .xls)
      resolve(undefined)
    }
  })
}


  const rendarFilePreview = (file: any, type: string) => {
    if(type === 'image' || type.startsWith('image/')) {
      if(file.path) {
        return <img
                  src={file.path || "/placeholder.svg"}
                  alt={file.caption}
                  className="w-full h-full object-cover"/> 
      } else if(!file.path && file.preview) {
        return <img
                    src={file.preview || "/placeholder.svg"}
                    alt={file.file.name}
                    className="w-full h-full object-cover"
                  />
      } else {
        return <Image className="w-full h-full" />
      }
      
    } else if (type === 'video' || type.startsWith('video/')) {
      if(file.path) {
        return <video src={file.path} controls className="w-full h-full" />
      } else if(!file.path && file.preview) {
        return <video
                    src={file.preview || "/placeholder.svg"}
                     controls
                    className="w-full h-full object-cover"
                  />
      } else {
        return <VideoIcon className="w-full h-full" />
      }
    } else {
      return <Text className="w-full h-full" />
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Area */}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer",
          isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
          files.length >= maxFiles && "opacity-50 cursor-not-allowed",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => files.length < maxFiles && fileInputRef.current?.click()}
      >
        <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground mb-1">
          {files.length >= maxFiles
            ? `Maximum ${maxFiles} files reached`
            : "Drag and drop files here, or click to select"}
        </p>
        <p className="text-xs text-muted-foreground">
          Max {Math.round(maxSize / 1024 / 1024)}MB per file • {maxFiles - files.length} slots remaining
        </p>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={accept ? Object.keys(accept).join(",") : undefined}
          onChange={handleFileSelect}
          className="hidden"
          disabled={files.length >= maxFiles}
        />
      </div>

      {/* File Existed */}
      {existingFiles.length > 0 && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">Old Files ({existingFiles.length})</Label>
          <div className="grid gap-3">
            {existingFiles.map((fileItem: DiaryOldFileProp) => {
              const FileIcon = getFileIcon(null, fileItem.type);

              return (
                <Card key={fileItem.id} className="p-3">
                  <CardContent className="p-0">
                    <div className="flex gap-3">
                      {/* File Preview/Icon */}
                      <div className="flex-shrink-0">
                        {fileItem.path ? (
                          <div className="w-16 h-16 rounded-md overflow-hidden bg-muted">
                            {
                              rendarFilePreview(fileItem, fileItem.type)
                            }

                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center">
                            <FileIcon className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      {/* File Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            {/* <p className="text-sm font-medium truncate" title={fileItem.file.name}>
                              {fileItem.file.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(fileItem.file.size)} • {fileItem.file.type || "Unknown type"}
                            </p> */}
                          </div>

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 flex-shrink-0"
                            onClick={() => setExistingFiles(JSON.stringify(existingFiles.filter((f: DiaryOldFileProp) => f.id != fileItem.id)))}
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Remove file</span>
                          </Button>
                        </div>

                        {/* Caption Input */}
                        <div className="mt-2">
                          <Input
                            placeholder="Add a caption (optional)"
                            value={fileItem.caption}
                            onChange={(e) => setExistingFiles(JSON.stringify([...existingFiles.map((f: DiaryOldFileProp) => {
                              if(f.id == fileItem.id) {
                                return {...f, caption: e.target.value}
                              }
                              return f;
                            })]))}
                            className="text-xs h-8"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">New Files ({files.length})</Label>
          <div className="grid gap-3">
            {files.map((fileItem) => {
              const FileIcon = getFileIcon(fileItem.file)

              return (
                <Card key={fileItem.id} className="p-3">
                  <CardContent className="p-0">
                    <div className="flex gap-3">
                      {/* File Preview/Icon */}
                      <div className="flex-shrink-0">
                          <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center">
                            {rendarFilePreview(fileItem, fileItem.file.type)}
                          </div>
                      </div>

                      {/* File Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium truncate" title={fileItem.file.name}>
                              {fileItem.file.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(fileItem.file.size)} • {fileItem.file.type || "Unknown type"}
                            </p>
                          </div>

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 flex-shrink-0"
                            onClick={() => removeFile(fileItem.id)}
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Remove file</span>
                          </Button>
                        </div>

                        {/* Caption Input */}
                        <div className="mt-2">
                          <Input
                            placeholder="Add a caption (optional)"
                            value={fileItem.caption}
                            onChange={(e) => updateCaption(fileItem.id, e.target.value)}
                            className="text-xs h-8"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
