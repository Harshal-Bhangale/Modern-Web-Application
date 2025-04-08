"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, ZoomIn, ZoomOut, Download } from "lucide-react"
import { Input } from "@/components/ui/input"

// Mock data for the knowledge graph
type Node = {
  id: string
  label: string
  group: string
}

type Edge = {
  from: string
  to: string
  label?: string
}

export default function VisualizePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [zoomLevel, setZoomLevel] = useState(1)
  const [selectedCourse, setSelectedCourse] = useState("all")

  // Mock data
  const nodes: Node[] = [
    { id: "1", label: "Machine Learning", group: "ml" },
    { id: "2", label: "Neural Networks", group: "ml" },
    { id: "3", label: "Deep Learning", group: "ml" },
    { id: "4", label: "Supervised Learning", group: "ml" },
    { id: "5", label: "Unsupervised Learning", group: "ml" },
    { id: "6", label: "Data Structures", group: "cs" },
    { id: "7", label: "Arrays", group: "cs" },
    { id: "8", label: "Linked Lists", group: "cs" },
    { id: "9", label: "Trees", group: "cs" },
    { id: "10", label: "Graphs", group: "cs" },
    { id: "11", label: "Algorithms", group: "cs" },
    { id: "12", label: "Sorting", group: "cs" },
    { id: "13", label: "Searching", group: "cs" },
    { id: "14", label: "Dynamic Programming", group: "cs" },
  ]

  const edges: Edge[] = [
    { from: "1", to: "2" },
    { from: "1", to: "3" },
    { from: "1", to: "4" },
    { from: "1", to: "5" },
    { from: "2", to: "3" },
    { from: "6", to: "7" },
    { from: "6", to: "8" },
    { from: "6", to: "9" },
    { from: "6", to: "10" },
    { from: "11", to: "12" },
    { from: "11", to: "13" },
    { from: "11", to: "14" },
    { from: "9", to: "10" },
    { from: "3", to: "4" },
  ]

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.save()
    ctx.scale(zoomLevel, zoomLevel)

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

    // Calculate positions (simple force-directed layout simulation)
    const positions: Record<string, { x: number; y: number }> = {}

    // Initialize positions in a circle
    const centerX = canvas.width / (2 * zoomLevel)
    const centerY = canvas.height / (2 * zoomLevel)
    const radius = Math.min(centerX, centerY) * 0.8

    filteredNodes.forEach((node, index) => {
      const angle = (index / filteredNodes.length) * 2 * Math.PI
      positions[node.id] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      }
    })

    // Draw edges
    ctx.strokeStyle = "#ccc"
    ctx.lineWidth = 1

    filteredEdges.forEach((edge) => {
      const fromPos = positions[edge.from]
      const toPos = positions[edge.to]

      if (fromPos && toPos) {
        ctx.beginPath()
        ctx.moveTo(fromPos.x, fromPos.y)
        ctx.lineTo(toPos.x, toPos.y)
        ctx.stroke()

        // Draw arrow
        const angle = Math.atan2(toPos.y - fromPos.y, toPos.x - fromPos.x)
        const arrowSize = 10

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
        ctx.fillStyle = "#ccc"
        ctx.fill()
      }
    })

    // Draw nodes
    filteredNodes.forEach((node) => {
      const pos = positions[node.id]
      if (!pos) return

      // Draw circle
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, 20, 0, 2 * Math.PI)

      // Set color based on group
      if (node.group === "ml") {
        ctx.fillStyle = "rgba(59, 130, 246, 0.8)" // blue
      } else if (node.group === "cs") {
        ctx.fillStyle = "rgba(16, 185, 129, 0.8)" // green
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
  }, [searchTerm, zoomLevel, selectedCourse])

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

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Visualize Knowledge Connections</h1>
      <p className="text-muted-foreground mb-8">Discover relationships between concepts in your study materials.</p>

      <Card>
        <CardHeader>
          <CardTitle>Knowledge Graph</CardTitle>
          <CardDescription>Explore connections between concepts across your study materials</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
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
              <div className="w-full sm:w-48">
                <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Courses</SelectItem>
                    <SelectItem value="ml">Machine Learning</SelectItem>
                    <SelectItem value="cs">Computer Science</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="relative border rounded-md h-[500px] bg-muted/20">
              <canvas ref={canvasRef} className="w-full h-full" />

              <div className="absolute bottom-4 right-4 flex gap-2">
                <Button variant="outline" size="icon" onClick={handleZoomOut}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleZoomIn}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleDownload}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>

              <div className="absolute bottom-4 left-4 flex items-center gap-4 bg-background/80 p-2 rounded-md">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-xs">Machine Learning</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-xs">Computer Science</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
