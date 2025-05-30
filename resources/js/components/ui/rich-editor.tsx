"use client"

import { useRef, useCallback, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Link,
  ImageIcon,
  Undo,
  Redo,
} from "lucide-react"

interface RichTextEditorProps {
  placeholder?: string
  defaultValue?: string
  onChange?: (content: string) => void
  className?: string
}

export default function RichTextEditor({
  placeholder = "Start typing...",
  defaultValue = "",
  onChange,
  className = "",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Add useEffect to set initial content
  useEffect(() => {
    if (editorRef.current && !isInitialized && defaultValue) {
      editorRef.current.innerHTML = defaultValue
      setIsInitialized(true)
    }
  }, [defaultValue, isInitialized])

  const executeCommand = useCallback(
    (command: string, value?: string) => {
      document.execCommand(command, false, value)
      editorRef.current?.focus()

      // Trigger onChange if provided
      if (onChange && editorRef.current) {
        onChange(editorRef.current.innerHTML)
      }
    },
    [onChange],
  )

  const handleInput = useCallback(() => {
    if (onChange && editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }, [onChange])

  const insertLink = useCallback(() => {
    const url = prompt("Enter URL:")
    if (url) {
      executeCommand("createLink", url)
    }
  }, [executeCommand])


  const formatButtons = [
    { icon: Bold, command: "bold", title: "Bold" },
    { icon: Italic, command: "italic", title: "Italic" },
    { icon: Underline, command: "underline", title: "Underline" },
    { icon: Strikethrough, command: "strikeThrough", title: "Strikethrough" },
  ]

  const alignButtons = [
    { icon: AlignLeft, command: "justifyLeft", title: "Align Left" },
    { icon: AlignCenter, command: "justifyCenter", title: "Align Center" },
    { icon: AlignRight, command: "justifyRight", title: "Align Right" },
  ]

  const listButtons = [
    { icon: List, command: "insertUnorderedList", title: "Bullet List" },
    { icon: ListOrdered, command: "insertOrderedList", title: "Numbered List" },
  ]

  return (
    <div
      className={`border rounded-lg overflow-hidden rich-text-editor-container ${isFocused ? "ring-2 ring-ring ring-offset-2" : ""} ${className}`}
    >
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b bg-muted/50">
        {/* Undo/Redo */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => executeCommand("undo")}
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => executeCommand("redo")}
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        {/* Format buttons */}
        {formatButtons.map(({ icon: Icon, command, title }) => (
          <Button
            key={command}
            type="button"
            variant="ghost"
            size="sm"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => executeCommand(command)}
            title={title}
          >
            <Icon className="h-4 w-4" />
          </Button>
        ))}

        <Separator orientation="vertical" className="h-6" />

        {/* Alignment buttons */}
        {alignButtons.map(({ icon: Icon, command, title }) => (
          <Button
            key={command}
            type="button"
            variant="ghost"
            size="sm"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => executeCommand(command)}
            title={title}
          >
            <Icon className="h-4 w-4" />
          </Button>
        ))}

        <Separator orientation="vertical" className="h-6" />

        {/* List buttons */}
        {listButtons.map(({ icon: Icon, command, title }) => (
          <Button
            key={command}
            type="button"
            variant="ghost"
            size="sm"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => executeCommand(command)}
            title={title}
          >
            <Icon className="h-4 w-4" />
          </Button>
        ))}

        <Separator orientation="vertical" className="h-6" />

        {/* Link and Image */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => e.preventDefault()}
          onClick={insertLink}
          title="Insert Link"
        >
          <Link className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        className="min-h-[200px] p-4 focus:outline-none prose max-w-none editor-content"
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        suppressContentEditableWarning={true}
        style={{
          wordWrap: "break-word",
          overflowWrap: "break-word",
        }}
      />

   
    </div>
  )
}
