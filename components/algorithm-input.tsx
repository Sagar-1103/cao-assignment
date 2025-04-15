"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { motion, AnimatePresence } from "framer-motion"

interface AlgorithmInputProps {
  type: "multiplication" | "division"
  onSubmit: (value1: string, value2: string) => void
  label1: string
  label2: string
}

export function AlgorithmInput({ type, onSubmit, label1, label2 }: AlgorithmInputProps) {
  const [value1, setValue1] = useState("")
  const [value2, setValue2] = useState("")
  const [error, setError] = useState("")

  const validateInput = () => {
    if (!value1 || !value2) {
      setError("Both fields are required")
      return false
    }

    // Check if inputs are valid binary numbers
    const binaryRegex = /^[0-1]+$/
    if (!binaryRegex.test(value1) || !binaryRegex.test(value2)) {
      setError("Please enter valid binary numbers (0s and 1s only)")
      return false
    }

    if (type === "division" && value2 === "0") {
      setError("Cannot divide by zero")
      return false
    }

    return true
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (validateInput()) {
      onSubmit(value1, value2)
    }
  }

  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      variants={formVariants}
      initial="hidden"
      animate="visible"
    >
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      <div className="space-y-4">
        <motion.div className="grid gap-2" variants={itemVariants}>
          <Label htmlFor="value1">{label1} (Binary)</Label>
          <div className="relative">
            <Input
              id="value1"
              placeholder="Enter binary number (e.g., 1010)"
              value={value1}
              onChange={(e) => setValue1(e.target.value)}
              className="pr-10"
            />
            <AnimatePresence>
              {value1 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-green-500"
                >
                  {/^[0-1]+$/.test(value1) ? "✓" : "!"}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div className="grid gap-2" variants={itemVariants}>
          <Label htmlFor="value2">{label2} (Binary)</Label>
          <div className="relative">
            <Input
              id="value2"
              placeholder="Enter binary number (e.g., 1101)"
              value={value2}
              onChange={(e) => setValue2(e.target.value)}
              className="pr-10"
            />
            <AnimatePresence>
              {value2 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-green-500"
                >
                  {/^[0-1]+$/.test(value2) ? "✓" : "!"}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <Button
          type="submit"
          className="w-full relative overflow-hidden group"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.span
            className="absolute inset-0 w-full h-full bg-primary/10"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.5 }}
          />
          Calculate
          <motion.span
            className="absolute right-4 opacity-0 group-hover:opacity-100"
            initial={{ x: -10 }}
            whileHover={{ x: 0 }}
            transition={{ duration: 0.2 }}
          >
            →
          </motion.span>
        </Button>
      </motion.div>
    </motion.form>
  )
}
