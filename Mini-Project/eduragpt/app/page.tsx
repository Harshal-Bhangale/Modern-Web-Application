"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { FileText, MessageSquare, Network, FileCheck, ArrowRight, BookOpen, Upload } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { motion, useInView, useAnimation } from "framer-motion"

export default function Home() {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  }

  const featureCardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  }

  // Function to create particles
  useEffect(() => {
    const createParticles = () => {
      const particlesContainer = document.querySelector(".particles")
      if (!particlesContainer) return

      // Clear existing particles
      particlesContainer.innerHTML = ""

      // Create new particles
      for (let i = 0; i < 20; i++) {
        const particle = document.createElement("div")
        particle.classList.add("particle")

        // Random position
        const posX = Math.random() * 100
        const posY = Math.random() * 100

        // Random size
        const size = Math.random() * 10 + 5

        // Random animation duration
        const duration = Math.random() * 10 + 10

        // Random animation delay
        const delay = Math.random() * 5

        particle.style.left = `${posX}%`
        particle.style.top = `${posY}%`
        particle.style.width = `${size}px`
        particle.style.height = `${size}px`
        particle.style.animationDuration = `${duration}s`
        particle.style.animationDelay = `${delay}s`

        particlesContainer.appendChild(particle)
      }
    }

    createParticles()

    // Recreate particles on window resize
    window.addEventListener("resize", createParticles)

    return () => {
      window.removeEventListener("resize", createParticles)
    }
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative w-full py-20 md:py-32 overflow-hidden animated-bg">
          <div className="particles"></div>
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-10 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-4 max-w-3xl"
              >
                <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary mb-4">
                  <span className="animate-pulse">AI-Powered Learning Revolution</span>
                </div>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                  Transform Study Materials into Knowledge
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Upload your study materials, ask questions, and get contextually relevant answers powered by AI.
                  Visualize connections and generate personalized cheat sheets.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button asChild size="lg" className="bg-gradient-primary hover:opacity-90 transition-opacity">
                  <Link href="/upload">
                    <Upload className="mr-2 h-5 w-5" />
                    Upload Materials
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/10">
                  <Link href="/chat">
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Start Chatting
                  </Link>
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="relative w-full max-w-5xl mt-10"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-xl blur-xl"></div>
                <div className="relative rounded-xl overflow-hidden border shadow-xl">
                  <img
                    src="/placeholder.svg?height=600&width=1200"
                    alt="EduRAGPT Dashboard"
                    className="w-full h-auto"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Problem Statement Section */}
        <section className="w-full py-20 bg-gradient-secondary dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <motion.div
              ref={ref}
              initial="hidden"
              animate={controls}
              variants={containerVariants}
              className="grid gap-10 lg:grid-cols-2 lg:gap-12 items-center"
            >
              <motion.div variants={itemVariants} className="space-y-4">
                <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                  The Problem
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Overcome Information Overload</h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Students struggle with scattered study materials across multiple platforms. Finding relevant content
                  during revision is frustrating and time-consuming, as traditional search methods fail to capture
                  context.
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 h-5 w-5 flex items-center justify-center rounded-full bg-primary/20">
                      <span className="h-2 w-2 rounded-full bg-primary"></span>
                    </div>
                    <span>Overloaded with study materials spread across platforms</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 h-5 w-5 flex items-center justify-center rounded-full bg-primary/20">
                      <span className="h-2 w-2 rounded-full bg-primary"></span>
                    </div>
                    <span>Ineffective keyword searches that don't understand context</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 h-5 w-5 flex items-center justify-center rounded-full bg-primary/20">
                      <span className="h-2 w-2 rounded-full bg-primary"></span>
                    </div>
                    <span>Time-consuming process leading to frustration and poor retention</span>
                  </li>
                </ul>
              </motion.div>
              <motion.div variants={itemVariants} className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-xl blur-lg"></div>
                <div className="relative rounded-xl overflow-hidden border shadow-lg">
                  <img
                    src="/placeholder.svg?height=400&width=600"
                    alt="Student struggling with information overload"
                    className="w-full h-auto"
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">Key Features</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Everything You Need to Enhance Learning
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Our AI-powered platform transforms how you interact with your study materials
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">Upload Any Format</h3>
                    <p className="mt-2 text-muted-foreground">
                      PDFs, diagrams, presentations - our system automatically organizes and indexes everything.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <MessageSquare className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">Intelligent Chat</h3>
                    <p className="mt-2 text-muted-foreground">
                      Ask questions in natural language and get relevant answers instantly from your materials.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Network className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">Dynamic Visualization</h3>
                    <p className="mt-2 text-muted-foreground">
                      Visual tools map connections between concepts, helping identify patterns and relationships.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <FileCheck className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">Smart Cheat Sheets</h3>
                    <p className="mt-2 text-muted-foreground">
                      Generate personalized cheat sheets summarizing key concepts for efficient revision.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-20 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="space-y-2"
              >
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Transform Your Study Experience?
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Upload your materials now and experience the power of AI-enhanced learning.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button asChild size="lg" className="bg-gradient-primary hover:opacity-90 transition-opacity">
                  <Link href="/upload">
                    <Upload className="mr-2 h-5 w-5" />
                    Get Started Now
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/chat">
                    Learn More
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <div className="flex items-center">
            <BookOpen className="h-5 w-5 text-primary mr-2" />
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} EduRAGPT. All rights reserved.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
