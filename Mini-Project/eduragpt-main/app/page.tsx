import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { FileText, MessageSquare, Network, FileCheck } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-primary">EduRAGPT</h1>
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <Link href="/" className="text-sm font-medium">
              Home
            </Link>
            <Link href="/upload" className="text-sm font-medium">
              Upload
            </Link>
            <Link href="/chat" className="text-sm font-medium">
              Chat
            </Link>
            <Link href="/visualize" className="text-sm font-medium">
              Visualize
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Transform Your Study Materials into Knowledge
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Upload your study materials, ask questions, and get contextually relevant answers powered by AI.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg">
                  <Link href="/upload">Upload Materials</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/chat">Start Chatting</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Overcome Information Overload</h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Students struggle with scattered study materials across multiple platforms. EduRAGPT organizes
                    everything in one place, making knowledge retrieval efficient and personalized.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">AI-Powered Learning</h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Our RAG-based solution analyzes the semantic meaning of your queries and retrieves the most relevant
                    information from your materials, providing comprehensive answers grounded in your sources.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Key Features</h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Everything you need to enhance your learning experience
                </p>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
                <Card className="flex flex-col items-center text-center">
                  <CardHeader>
                    <FileText className="h-10 w-10 text-primary" />
                    <CardTitle>Upload Any Format</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      PDFs, diagrams, presentations - our system automatically organizes and indexes everything.
                    </CardDescription>
                  </CardContent>
                </Card>
                <Card className="flex flex-col items-center text-center">
                  <CardHeader>
                    <MessageSquare className="h-10 w-10 text-primary" />
                    <CardTitle>Chatbot Integration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Ask questions in natural language and get relevant answers instantly from your materials.
                    </CardDescription>
                  </CardContent>
                </Card>
                <Card className="flex flex-col items-center text-center">
                  <CardHeader>
                    <Network className="h-10 w-10 text-primary" />
                    <CardTitle>Discover Relationships</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Visual tools map connections between documents and concepts, helping identify patterns.
                    </CardDescription>
                  </CardContent>
                </Card>
                <Card className="flex flex-col items-center text-center">
                  <CardHeader>
                    <FileCheck className="h-10 w-10 text-primary" />
                    <CardTitle>Generate Cheat Sheets</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Quickly generate personalized cheat sheets summarizing key concepts for efficient revision.
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} EduRAGPT. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
