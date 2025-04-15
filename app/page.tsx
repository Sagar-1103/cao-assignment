"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calculator, Divide, Star, Sparkles, X } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-[#0F0F0F] via-[#1A0A1F] to-[#0F0F0F] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full border-t-2 border-orange-500 animate-spin"></div>
            <div
              className="absolute inset-2 rounded-full border-t-2 border-pink-500 animate-spin"
              style={{ animationDuration: "1.5s" }}
            ></div>
            <div
              className="absolute inset-4 rounded-full border-t-2 border-purple-500 animate-spin"
              style={{ animationDuration: "2s" }}
            ></div>
            <Calculator className="absolute inset-0 m-auto h-8 w-8 text-white/50" />
          </div>
          <p className="text-white/70 animate-pulse">Loading AlgoSolver...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white overflow-hidden">
      {/* Gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0F0F0F] via-[#1A0A1F] to-[#0F0F0F] opacity-80 z-0"></div>

      {/* Animated background elements */}
      <div className="fixed inset-0 z-0 overflow-hidden opacity-20">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-orange-500 rounded-full filter blur-[100px]"></div>
        <div className="absolute top-1/3 -right-40 w-80 h-80 bg-pink-500 rounded-full filter blur-[100px]"></div>
        <div className="absolute -bottom-40 left-1/3 w-80 h-80 bg-purple-500 rounded-full filter blur-[100px]"></div>
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <header className="sticky top-0 backdrop-blur-md bg-black/20 border-b border-white/5 z-50">
          <div className="container mx-auto py-4 px-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Calculator className="h-6 w-6 text-orange-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-orange-400 to-pink-400 text-transparent bg-clip-text">
                AlgoSolver
              </span>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="container mx-auto px-4 py-10 text-center"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="max-w-4xl mx-auto"
            >
              <div className="inline-block bg-black/30 backdrop-blur-md rounded-full px-4 py-1 mb-6 border border-orange-500/20">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-orange-500" />
                  <span className="text-sm text-orange-500">Visualizing Binary Algorithms</span>
                </div>
              </div>

              <motion.h1
                className="text-5xl md:text-7xl font-bold leading-tight"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <span className="bg-gradient-to-r from-orange-500 to-orange-400 text-transparent bg-clip-text">
                  Calculate.{" "}
                </span>
                <span className="bg-gradient-to-r from-pink-500 to-pink-400 text-transparent bg-clip-text">
                  Visualize.{" "}
                </span>
                <span className="bg-gradient-to-r from-purple-500 to-purple-400 text-transparent bg-clip-text">
                  Learn.
                </span>
              </motion.h1>
            </motion.div>
          </motion.div>
        </section>

        {/* Algorithm Cards */}
        <section id="algorithms" className="relative mb-20">
          <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/50 to-black/0 z-0"></div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.p
              className="text-center text-gray-400 max-w-2xl mx-auto mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Explore different binary computation algorithms with our interactive visualizers. Select an algorithm to
              get started with step-by-step breakdowns and animations.
            </motion.p>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {/* Booth's Algorithm Card */}
              <motion.div variants={item}>
                <div className="bg-gradient-to-br from-black/90 to-black/70 backdrop-blur-md border border-orange-500/20 overflow-hidden rounded-lg group hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 hover:-translate-y-2">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="flex flex-col space-y-1.5 p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-semibold leading-none tracking-tight text-orange-400">
                        Booth&apos;s Algorithm
                      </h3>
                      <Sparkles className="h-5 w-5 text-orange-500/50 group-hover:text-orange-500 transition-colors" />
                    </div>
                    <p className="text-sm text-muted-foreground text-gray-400">
                      Binary multiplication algorithm that handles both positive and negative numbers
                      <span className="text-transparent">  when subtraction yields a negative result</span>
                    </p>
                  </div>
                  <div className="p-6 pt-0">
                    <div className="h-32 flex items-center justify-center text-orange-500/20 group-hover:text-orange-500/40 transition-colors">
                      <X className="h-16 w-16" />
                    </div>
                  </div>
                  <div className="flex items-center p-6 pt-0">
                    <Link href="/algorithms/booths" className="w-full">
                      <Button className="w-full bg-gradient-to-r from-orange-500/80 to-orange-600/80 hover:from-orange-500 hover:to-orange-600 text-white group-hover:shadow-lg group-hover:shadow-orange-500/20 transition-all">
                        Explore <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>

              {/* Restoring Division Card */}
              <motion.div variants={item}>
                <div className="bg-gradient-to-br from-black/90 to-black/70 backdrop-blur-md border border-pink-500/20 overflow-hidden rounded-lg group hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-300 hover:-translate-y-2">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="flex flex-col space-y-1.5 p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-semibold leading-none tracking-tight text-pink-400">
                        Restoring Division
                      </h3>
                      <Sparkles className="h-5 w-5 text-pink-500/50 group-hover:text-pink-500 transition-colors" />
                    </div>
                    <p className="text-sm text-muted-foreground text-gray-400">
                      Binary division algorithm that restores the remainder when subtraction yields a negative result
                      <span className="text-transparent">  when subtraction yields a negative result</span>
                    </p>
                  </div>
                  <div className="p-6 pt-0">
                    <div className="h-32 flex items-center justify-center text-pink-500/20 group-hover:text-pink-500/40 transition-colors">
                      <Divide className="h-16 w-16" />
                    </div>
                  </div>
                  <div className="flex items-center p-6 pt-0">
                    <Link href="/algorithms/restoring" className="w-full">
                      <Button className="w-full bg-gradient-to-r from-pink-500/80 to-pink-600/80 hover:from-pink-500 hover:to-pink-600 text-white group-hover:shadow-lg group-hover:shadow-pink-500/20 transition-all">
                        Explore <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>

              {/* Non-Restoring Division Card */}
              <motion.div variants={item}>
                <div className="bg-gradient-to-br from-black/90 to-black/70 backdrop-blur-md border border-purple-500/20 overflow-hidden rounded-lg group hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-2">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="flex flex-col space-y-1.5 p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-semibold leading-none tracking-tight text-purple-400">
                        Non-Restoring Division
                      </h3>
                      <Sparkles className="h-5 w-5 text-purple-500/50 group-hover:text-purple-500 transition-colors" />
                    </div>
                    <p className="text-sm text-muted-foreground text-gray-400">
                      Optimized binary division algorithm that avoids the restore step for improved efficiency
                    </p>
                  </div>
                  <div className="p-6 pt-0">
                    <div className="h-32 flex items-center justify-center text-purple-500/20 group-hover:text-purple-500/40 transition-colors">
                      <Divide className="h-16 w-16" />
                    </div>
                  </div>
                  <div className="flex items-center p-6 pt-0">
                    <Link href="/algorithms/non-restoring" className="w-full">
                      <Button className="w-full bg-gradient-to-r from-purple-500/80 to-purple-600/80 hover:from-purple-500 hover:to-purple-600 text-white group-hover:shadow-lg group-hover:shadow-purple-500/20 transition-all">
                        Explore <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <footer className="fixed bottom-0 w-full z-10 border-t border-white/5 bg-black/20 backdrop-blur-md">
          <div className="container mx-auto px-4 py-6 text-center text-sm text-white/60">
            Made by <span className="text-orange-400 font-medium">Sagar Shirgaonkar</span>
          </div>
        </footer>
      </div>
    </div>
  )
}
