"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, Download, Printer, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type CheatSheetItem = {
  id: string
  title: string
  content: string
  source: string
  page: number
}

export default function CheatSheetPage() {
  const [selectedCourse, setSelectedCourse] = useState("machine-learning")
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [generating, setGenerating] = useState(false)
  const [cheatSheet, setCheatSheet] = useState<CheatSheetItem[]>([])
  const { toast } = useToast()

  // Mock data for topics
  const topics = {
    "machine-learning": [
      "Supervised Learning",
      "Unsupervised Learning",
      "Neural Networks",
      "Decision Trees",
      "Support Vector Machines",
      "Clustering",
      "Dimensionality Reduction",
      "Evaluation Metrics",
    ],
    "data-structures": ["Arrays", "Linked Lists", "Stacks", "Queues", "Trees", "Graphs", "Hash Tables", "Heaps"],
    algorithms: [
      "Sorting Algorithms",
      "Searching Algorithms",
      "Dynamic Programming",
      "Greedy Algorithms",
      "Graph Algorithms",
      "Divide and Conquer",
      "Backtracking",
      "String Algorithms",
    ],
  }

  // Mock data for cheat sheet content
  const mockCheatSheetContent: Record<string, CheatSheetItem[]> = {
    "Supervised Learning": [
      {
        id: "1",
        title: "Definition",
        content:
          "Supervised learning is a type of machine learning where the algorithm learns from labeled training data to make predictions or decisions.",
        source: "Machine Learning Lecture 1.pdf",
        page: 5,
      },
      {
        id: "2",
        title: "Types",
        content: "Classification: Predicting discrete class labels\nRegression: Predicting continuous values",
        source: "Machine Learning Lecture 1.pdf",
        page: 7,
      },
      {
        id: "3",
        title: "Common Algorithms",
        content:
          "- Linear Regression\n- Logistic Regression\n- Decision Trees\n- Random Forests\n- Support Vector Machines\n- Neural Networks",
        source: "Machine Learning Lecture 2.pdf",
        page: 12,
      },
    ],
    "Neural Networks": [
      {
        id: "4",
        title: "Definition",
        content:
          "Neural networks are computing systems inspired by the biological neural networks in animal brains, consisting of artificial neurons that can learn from and make decisions based on input data.",
        source: "Machine Learning Lecture 5.pdf",
        page: 3,
      },
      {
        id: "5",
        title: "Components",
        content: "- Input Layer\n- Hidden Layers\n- Output Layer\n- Weights and Biases\n- Activation Functions",
        source: "Machine Learning Lecture 5.pdf",
        page: 5,
      },
      {
        id: "6",
        title: "Training Process",
        content:
          "1. Forward Propagation: Input data passes through the network\n2. Loss Calculation: Compare output with expected result\n3. Backpropagation: Calculate gradients\n4. Weight Update: Adjust weights using an optimizer",
        source: "Machine Learning Lecture 6.pdf",
        page: 8,
      },
    ],
  }

  const handleTopicToggle = (topic: string) => {
    setSelectedTopics((prev) => (prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]))
  }

  const handleSelectAll = () => {
    if (selectedCourse in topics) {
      setSelectedTopics(topics[selectedCourse as keyof typeof topics])
    }
  }

  const handleDeselectAll = () => {
    setSelectedTopics([])
  }

  const handleGenerateCheatSheet = () => {
    if (selectedTopics.length === 0) {
      toast({
        title: "No topics selected",
        description: "Please select at least one topic to generate a cheat sheet.",
        variant: "destructive",
      })
      return
    }

    setGenerating(true)

    // Simulate generation delay
    setTimeout(() => {
      const generatedContent: CheatSheetItem[] = []

      selectedTopics.forEach((topic) => {
        if (topic in mockCheatSheetContent) {
          generatedContent.push(...mockCheatSheetContent[topic])
        } else {
          // Generate mock content for topics without predefined content
          generatedContent.push({
            id: `generated-${topic}-${Date.now()}`,
            title: "Key Concepts",
            content: `This is generated content for ${topic}. In a real implementation, this would be generated using RAG from your study materials.`,
            source: "Generated from multiple sources",
            page: 0,
          })
        }
      })

      setCheatSheet(generatedContent)
      setGenerating(false)
    }, 2000)
  }

  const handleCopyToClipboard = () => {
    const textContent = cheatSheet
      .map((item) => `${item.title}\n${item.content}\nSource: ${item.source} (p. ${item.page})\n\n`)
      .join("")

    navigator.clipboard.writeText(textContent).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "Cheat sheet content has been copied to your clipboard.",
      })
    })
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    const textContent = cheatSheet
      .map((item) => `${item.title}\n${item.content}\nSource: ${item.source} (p. ${item.page})\n\n`)
      .join("")

    const blob = new Blob([textContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${selectedCourse}-cheatsheet.txt`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Generate Cheat Sheets</h1>
      <p className="text-muted-foreground mb-8">
        Create personalized cheat sheets from your study materials to help with revision.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Select Topics</CardTitle>
            <CardDescription>Choose the topics you want to include in your cheat sheet</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="course">Course</Label>
                <Select
                  value={selectedCourse}
                  onValueChange={(value) => {
                    setSelectedCourse(value)
                    setSelectedTopics([])
                  }}
                >
                  <SelectTrigger id="course">
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="machine-learning">Machine Learning</SelectItem>
                    <SelectItem value="data-structures">Data Structures</SelectItem>
                    <SelectItem value="algorithms">Algorithms</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Topics</Label>
                  <div className="space-x-2">
                    <Button variant="link" size="sm" className="h-auto p-0" onClick={handleSelectAll}>
                      Select All
                    </Button>
                    <Button variant="link" size="sm" className="h-auto p-0" onClick={handleDeselectAll}>
                      Deselect All
                    </Button>
                  </div>
                </div>

                <ScrollArea className="h-[300px] rounded-md border p-4">
                  <div className="space-y-2">
                    {selectedCourse in topics &&
                      topics[selectedCourse as keyof typeof topics].map((topic) => (
                        <div key={topic} className="flex items-center space-x-2">
                          <Checkbox
                            id={`topic-${topic}`}
                            checked={selectedTopics.includes(topic)}
                            onCheckedChange={() => handleTopicToggle(topic)}
                          />
                          <Label htmlFor={`topic-${topic}`} className="cursor-pointer">
                            {topic}
                          </Label>
                        </div>
                      ))}
                  </div>
                </ScrollArea>
              </div>

              <Button
                className="w-full"
                onClick={handleGenerateCheatSheet}
                disabled={selectedTopics.length === 0 || generating}
              >
                {generating ? "Generating..." : "Generate Cheat Sheet"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Your Cheat Sheet</CardTitle>
                <CardDescription>Personalized summary of key concepts from your study materials</CardDescription>
              </div>
              {cheatSheet.length > 0 && (
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={handleCopyToClipboard}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={handlePrint}>
                    <Printer className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleDownload}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {cheatSheet.length > 0 ? (
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-6">
                  {cheatSheet.map((item) => (
                    <div key={item.id} className="space-y-2">
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      <div className="whitespace-pre-line text-sm">{item.content}</div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <FileText className="h-3 w-3 mr-1" />
                        Source: {item.source} {item.page > 0 && `(p. ${item.page})`}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center h-[500px] text-center">
                <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No cheat sheet generated yet</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-md">
                  Select topics from your study materials and click "Generate Cheat Sheet" to create a personalized
                  summary.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
