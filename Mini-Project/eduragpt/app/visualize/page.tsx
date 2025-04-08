"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, ZoomIn, ZoomOut, Download, Sparkles, Network } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Navbar } from "@/components/navbar"
import { motion } from "framer-motion"
import { useStudyMaterialsStore } from "@/lib/store"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

// Mock data for the knowledge graph
type Node = {
  id: string
  label: string
  group: string
  size?: number
}

type Edge = {
  from: string
  to: string
  label?: string
  width?: number
  color?: string
}

export default function VisualizePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [zoomLevel, setZoomLevel] = useState(1)
  const [selectedCourse, setSelectedCourse] = useState("all")
  const [viewMode, setViewMode] = useState<"graph" | "force">("force")
  const [isGenerating, setIsGenerating] = useState(false)
  const [questionInput, setQuestionInput] = useState("")
  const { materials } = useStudyMaterialsStore()
  const { toast } = useToast()

  // Animation to scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Mock data
  const generateNodes = (): Node[] => {
    const baseNodes: Node[] = [
      { id: "1", label: "Machine Learning", group: "ml", size: 25 },
      { id: "2", label: "Neural Networks", group: "ml", size: 20 },
      { id: "3", label: "Deep Learning", group: "ml", size: 20 },
      { id: "4", label: "Supervised Learning", group: "ml", size: 18 },
      { id: "5", label: "Unsupervised Learning", group: "ml", size: 18 },
      { id: "6", label: "Data Structures", group: "cs", size: 25 },
      { id: "7", label: "Arrays", group: "cs", size: 15 },
      { id: "8", label: "Linked Lists", group: "cs", size: 15 },
      { id: "9", label: "Trees", group: "cs", size: 18 },
      { id: "10", label: "Graphs", group: "cs", size: 18 },
      { id: "11", label: "Algorithms", group: "cs", size: 25 },
      { id: "12", label: "Sorting", group: "cs", size: 15 },
      { id: "13", label: "Searching", group: "cs", size: 15 },
      { id: "14", label: "Dynamic Programming", group: "cs", size: 18 },
    ]

    // Add nodes from uploaded materials
    const materialNodes = materials.map((material, index) => ({
      id: `m-${index}`,
      label: material.name.replace(/\.(pdf|docx|pptx|jpg|png)$/i, ""),
      group: "materials",
      size: 15,
    }))

    return [...baseNodes, ...materialNodes]
  }

  const generateEdges = (nodes: Node[]): Edge[] => {
    const baseEdges: Edge[] = [
      { from: "1", to: "2", width: 3 },
      { from: "1", to: "3", width: 3 },
      { from: "1", to: "4", width: 2 },
      { from: "1", to: "5", width: 2 },
      { from: "2", to: "3", width: 3 },
      { from: "6", to: "7", width: 2 },
      { from: "6", to: "8", width: 2 },
      { from: "6", to: "9", width: 3 },
      { from: "6", to: "10", width: 3 },
      { from: "11", to: "12", width: 2 },
      { from: "11", to: "13", width: 2 },
      { from: "11", to: "14", width: 3 },
      { from: "9", to: "10", width: 2 },
      { from: "3", to: "4", width: 2 },
    ]

    // Add edges from materials to related concepts
    const materialEdges: Edge[] = []
    const materialNodeIds = nodes.filter((n) => n.group === "materials").map((n) => n.id)

    materialNodeIds.forEach((materialId) => {
      // Connect to 2-3 random concepts
      const numConnections = Math.floor(Math.random() * 2) + 2
      const conceptNodes = nodes.filter((n) => n.group !== "materials")

      for (let i = 0; i < numConnections; i++) {
        const randomIndex = Math.floor(Math.random() * conceptNodes.length)
        materialEdges.push({
          from: materialId,
          to: conceptNodes[randomIndex].id,
          width: 1,
          color: "rgba(139, 92, 246, 0.6)",
        })
      }
    })

    return [...baseEdges, ...materialEdges]
  }

  const [nodes, setNodes] = useState<Node[]>(generateNodes())
  const [edges, setEdges] = useState<Edge[]>(generateEdges(generateNodes()))

  // Force-directed graph simulation
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Filter nodes based on search and selected course
    const filteredNodes = nodes.filter(
      (node) =>
        node.label.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedCourse === "all" || node.group === selectedCourse),
    )

    // Get IDs of filtered nodes
    const filteredNodeIds = filteredNodes.map((node) => node.id)

    // Filter edges that connect filtered nodes
    const filteredEdges = edges.filter(
      (edge) => filteredNodeIds.includes(edge.from) && filteredNodeIds.includes(edge.to),
    )

    // Calculate positions
    const positions: Record<string, { x: number; y: number; vx: number; vy: number }> = {}

    // Initialize positions
    const centerX = canvas.width / (2 * zoomLevel)
    const centerY = canvas.height / (2 * zoomLevel)

    if (viewMode === "graph") {
      // Circular layout
      const radius = Math.min(centerX, centerY) * 0.8
      filteredNodes.forEach((node, index) => {
        const angle = (index / filteredNodes.length) * 2 * Math.PI
        positions[node.id] = {
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle),
          vx: 0,
          vy: 0,
        }
      })
    } else {
      // Force-directed layout - initialize with random positions
      filteredNodes.forEach((node) => {
        positions[node.id] = {
          x: centerX + (Math.random() - 0.5) * centerX,
          y: centerY + (Math.random() - 0.5) * centerY,
          vx: 0,
          vy: 0,
        }
      })

      // Run force simulation
      const simulation = () => {
        // Apply forces
        for (let i = 0; i < 10; i++) {
          // Run multiple iterations for stability
          // Repulsive force between nodes
          filteredNodes.forEach((node1) => {
            filteredNodes.forEach((node2) => {
              if (node1.id !== node2.id) {
                const pos1 = positions[node1.id]
                const pos2 = positions[node2.id]
                const dx = pos2.x - pos1.x
                const dy = pos2.y - pos1.y
                const distance = Math.sqrt(dx * dx + dy * dy)

                if (distance > 0 && distance < 200) {
                  const repulsiveForce = 500 / (distance * distance)
                  const fx = (dx / distance) * repulsiveForce
                  const fy = (dy / distance) * repulsiveForce

                  pos1.vx -= fx
                  pos1.vy -= fy
                  pos2.vx += fx
                  pos2.vy += fy
                }
              }
            })
          })

          // Attractive force along edges
          filteredEdges.forEach((edge) => {
            const pos1 = positions[edge.from]
            const pos2 = positions[edge.to]
            if (pos1 && pos2) {
              const dx = pos2.x - pos1.x
              const dy = pos2.y - pos1.y
              const distance = Math.sqrt(dx * dx + dy * dy)

              if (distance > 0) {
                const attractiveForce = 0.05 * distance
                const fx = (dx / distance) * attractiveForce
                const fy = (dy / distance) * attractiveForce

                pos1.vx += fx
                pos1.vy += fy
                pos2.vx -= fx
                pos2.vy -= fy
              }
            }
          })

          // Center gravity
          filteredNodes.forEach((node) => {
            const pos = positions[node.id]
            pos.vx += (centerX - pos.x) * 0.01
            pos.vy += (centerY - pos.y) * 0.01
          })

          // Update positions with velocity and damping
          filteredNodes.forEach((node) => {
            const pos = positions[node.id]
            pos.x += pos.vx * 0.1
            pos.y += pos.vy * 0.1
            pos.vx *= 0.9
            pos.vy *= 0.9

            // Boundary constraints
            const nodeSize = node.size || 20
            pos.x = Math.max(nodeSize, Math.min(canvas.width / zoomLevel - nodeSize, pos.x))
            pos.y = Math.max(nodeSize, Math.min(canvas.height / zoomLevel - nodeSize, pos.y))
          })
        }
      }

      simulation()
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.save()
    ctx.scale(zoomLevel, zoomLevel)

    // Draw edges
    filteredEdges.forEach((edge) => {
      const fromPos = positions[edge.from]
      const toPos = positions[edge.to]

      if (fromPos && toPos) {
        ctx.beginPath()
        ctx.moveTo(fromPos.x, fromPos.y)
        ctx.lineTo(toPos.x, toPos.y)

        // Edge styling
        ctx.strokeStyle = edge.color || "#ccc"
        ctx.lineWidth = edge.width || 1

        ctx.stroke()

        // Draw arrow
        const angle = Math.atan2(toPos.y - fromPos.y, toPos.x - fromPos.x)
        const arrowSize = 8

        // Only draw arrows for certain edges
        if (edge.width && edge.width > 1) {
          ctx.beginPath()
          ctx.moveTo(toPos.x, toPos.y)
          ctx.lineTo(
            toPos.x - arrowSize * Math.cos(angle - Math.PI / 6),
            toPos.y - arrowSize * Math.sin(angle - Math.PI / 6),
          )
          ctx.lineTo(
            toPos.x - arrowSize * Math.cos(angle + Math.PI / 6),
            toPos.y - arrowSize * Math.sin(angle + Math.PI / 6),
          )
          ctx.closePath()
          ctx.fillStyle = edge.color || "#ccc"
          ctx.fill()
        }
      }
    })

    // Draw nodes
    filteredNodes.forEach((node) => {
      const pos = positions[node.id]
      if (!pos) return

      // Draw glow for highlighted nodes
      if (node.label.toLowerCase().includes(searchTerm.toLowerCase()) && searchTerm) {
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, (node.size || 20) + 5, 0, 2 * Math.PI)
        ctx.fillStyle = "rgba(139, 92, 246, 0.3)"
        ctx.fill()
      }

      // Draw circle
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, node.size || 20, 0, 2 * Math.PI)

      // Set color based on group
      if (node.group === "ml") {
        ctx.fillStyle = "rgba(124, 58, 237, 0.8)" // purple
      } else if (node.group === "cs") {
        ctx.fillStyle = "rgba(16, 185, 129, 0.8)" // green
      } else if (node.group === "materials") {
        ctx.fillStyle = "rgba(59, 130, 246, 0.8)" // blue
      } else {
        ctx.fillStyle = "rgba(209, 213, 219, 0.8)" // gray
      }

      ctx.fill()
      ctx.strokeStyle = "#fff"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw label
      ctx.fillStyle = "#fff"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      // Wrap text if needed
      const words = node.label.split(" ")
      if (words.length > 1 && node.label.length > 10) {
        const line1 = words.slice(0, Math.ceil(words.length / 2)).join(" ")
        const line2 = words.slice(Math.ceil(words.length / 2)).join(" ")
        ctx.fillText(line1, pos.x, pos.y - 6)
        ctx.fillText(line2, pos.x, pos.y + 6)
      } else {
        ctx.fillText(node.label, pos.x, pos.y)
      }
    })

    ctx.restore()
  }, [searchTerm, zoomLevel, selectedCourse, nodes, edges, viewMode])

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.1, 2))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.1, 0.5))
  }

  const handleDownload = () => {
    if (!canvasRef.current) return

    const link = document.createElement("a")
    link.download = "knowledge-graph.png"
    link.href = canvasRef.current.toDataURL("image/png")
    link.click()
  }

  const handleGenerateFromQuestion = () => {
    if (!questionInput.trim()) {
      toast({
        title: "Question required",
        description: "Please enter a question to generate a visualization.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    // Simulate generating a new visualization based on the question
    setTimeout(() => {
      // Create new nodes and edges based on the question
      const newNodes = generateNodes()

      // Add some question-specific nodes
      if (questionInput.toLowerCase().includes("machine learning")) {
        newNodes.push(
          { id: "ml-1", label: "Gradient Descent", group: "ml", size: 18 },
          { id: "ml-2", label: "Backpropagation", group: "ml", size: 18 },
          { id: "ml-3", label: "Feature Engineering", group: "ml", size: 16 },
        )
      } else if (questionInput.toLowerCase().includes("data structure")) {
        newNodes.push(
          { id: "ds-1", label: "Hash Tables", group: "cs", size: 18 },
          { id: "ds-2", label: "Heaps", group: "cs", size: 16 },
          { id: "ds-3", label: "Stacks & Queues", group: "cs", size: 17 },
        )
      }

      setNodes(newNodes)
      setEdges(generateEdges(newNodes))

      setIsGenerating(false)

      toast({
        title: "Visualization Generated",
        description: "Knowledge graph has been updated based on your question.",
      })
    }, 2000)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 pt-16">
        <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                Visualize Knowledge Connections
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover relationships between concepts in your study materials through interactive knowledge graphs.
              </p>
            </div>

            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle>Knowledge Graph</CardTitle>
                    <CardDescription>Explore connections between concepts across your study materials</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "graph" | "force")}>
                      <TabsList className="grid w-[180px] grid-cols-2">
                        <TabsTrigger value="force">
                          <Network className="h-4 w-4 mr-2" />
                          Force Layout
                        </TabsTrigger>
                        <TabsTrigger value="graph">
                          <Network className="h-4 w-4 mr-2" />
                          Circle Layout
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search concepts..."
                          className="pl-8"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                        <SelectTrigger>
                          <SelectValue placeholder="Filter by category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="ml">Machine Learning</SelectItem>
                          <SelectItem value="cs">Computer Science</SelectItem>
                          <SelectItem value="materials">My Materials</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <div className="relative border rounded-md h-[500px] bg-muted/20 overflow-hidden animated-border">
                        <canvas ref={canvasRef} className="w-full h-full" />

                        <div className="absolute bottom-4 right-4 flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={handleZoomOut}
                            className="bg-background/80 backdrop-blur-sm"
                          >
                            <ZoomOut className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={handleZoomIn}
                            className="bg-background/80 backdrop-blur-sm"
                          >
                            <ZoomIn className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={handleDownload}
                            className="bg-background/80 backdrop-blur-sm"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="absolute bottom-4 left-4 flex items-center gap-4 bg-background/80 backdrop-blur-sm p-2 rounded-md">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                            <span className="text-xs">Machine Learning</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-600"></div>
                            <span className="text-xs">Computer Science</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                            <span className="text-xs">My Materials</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">Generate from Question</CardTitle>
                          <CardDescription>
                            Ask a question to generate a visualization based on your query
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Input
                                placeholder="E.g., How are neural networks related to deep learning?"
                                value={questionInput}
                                onChange={(e) => setQuestionInput(e.target.value)}
                              />
                            </div>
                            <Button
                              onClick={handleGenerateFromQuestion}
                              className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                              disabled={isGenerating}
                            >
                              {isGenerating ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Generating...
                                </>
                              ) : (
                                <>
                                  <Sparkles className="mr-2 h-4 w-4" />
                                  Generate Visualization
                                </>
                              )}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">Insights</CardTitle>
                          <CardDescription>Key relationships discovered in your materials</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 }}
                              className="p-3 bg-muted/50 rounded-lg"
                            >
                              <h4 className="font-medium text-sm">Strong Connections</h4>
                              <div className="mt-2 flex flex-wrap gap-2">
                                <Badge variant="secondary">Neural Networks ↔ Deep Learning</Badge>
                                <Badge variant="secondary">Trees ↔ Graphs</Badge>
                              </div>
                            </motion.div>

                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 }}
                              className="p-3 bg-muted/50 rounded-lg"
                            >
                              <h4 className="font-medium text-sm">Central Concepts</h4>
                              <div className="mt-2 flex flex-wrap gap-2">
                                <Badge variant="secondary">Machine Learning</Badge>
                                <Badge variant="secondary">Data Structures</Badge>
                                <Badge variant="secondary">Algorithms</Badge>
                              </div>
                            </motion.div>

                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 }}
                              className="p-3 bg-muted/50 rounded-lg"
                            >
                              <h4 className="font-medium text-sm">Suggested Study Path</h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                Based on your materials and questions
                              </p>
                              <div className="mt-2 text-sm">
                                Data Structures → Algorithms → Machine Learning → Neural Networks
                              </div>
                            </motion.div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
