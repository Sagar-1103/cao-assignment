"use client"

import { BoothsAlgorithm } from "@/components/booths-algorithm"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calculator } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export default function BoothsPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

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
        <div className="absolute top-1/3 -right-40 w-80 h-80 bg-orange-400 rounded-full filter blur-[100px]"></div>
        <div className="absolute -bottom-40 left-1/3 w-80 h-80 bg-orange-300 rounded-full filter blur-[100px]"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 backdrop-blur-md bg-black/20 border-b border-white/5 z-50">
          <div className="container mx-auto py-4 px-4">
            <Link href="/">
              <Button variant="ghost" className="text-white hover:bg-white/10 -ml-4">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
              </Button>
            </Link>
          </div>
        </header>

        <div className="container mx-auto py-8 px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-orange-500 text-transparent bg-clip-text">
              Booth&apos;s Algorithm Visualizer
            </h1>
            <p className="text-gray-300 mb-8 max-w-2xl">
              Explore the step-by-step process of Booth&apos;s multiplication algorithm with interactive visualizations.
              This algorithm efficiently handles both positive and negative numbers in two&apos;s complement notation.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gradient-to-br from-black/90 to-black/70 backdrop-blur-md rounded-xl p-6 border border-orange-500/20 shadow-xl shadow-orange-500/5"
          >
            <BoothsAlgorithm />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
