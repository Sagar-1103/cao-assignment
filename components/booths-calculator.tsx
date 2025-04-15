"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { motion, AnimatePresence } from "framer-motion"

interface Step {
  cycle: number
  a: string
  q: string
  q1: string
  m: string
  operation: string
  explanation: string
}

export function BoothsCalculator() {
  const [multiplicand, setMultiplicand] = useState("")
  const [multiplier, setMultiplier] = useState("")
  const [error, setError] = useState("")
  const [steps, setSteps] = useState<Step[]>([])
  const [result, setResult] = useState("")
  const [calculated, setCalculated] = useState(false)

  const validateInput = (value: string) => {
    return /^[0-1]{4}$/.test(value)
  }

  const handleCalculate = () => {
    if (!validateInput(multiplicand) || !validateInput(multiplier)) {
      setError("Please enter valid 4-bit binary numbers (e.g., 0101)")
      return
    }

    setError("")
    calculateBooth()
    setCalculated(true)
  }

  const calculateBooth = () => {
    // Initialize variables
    let A = "0000"
    let Q = multiplier
    let Q1 = "0"
    const M = multiplicand
    const newSteps: Step[] = []

    // Add initial values
    newSteps.push({
      cycle: 0,
      a: A,
      q: Q,
      q1: Q1,
      m: M,
      operation: "Initial values",
      explanation: "Set up initial values: A = 0000, Q = multiplier, Q₋₁ = 0, M = multiplicand",
    })

    // Perform 4 cycles
    for (let i = 0; i < 4; i++) {
      const qn = Q[Q.length - 1]
      let operation = ""
      let explanation = ""

      // Check Q0Q-1
      if (qn === "0" && Q1 === "1") {
        // Add M to A
        A = addBinary(A, M)
        operation = "A ← A+M"
        explanation = "Q₀Q₋₁ = 01: Add multiplicand to A"
      } else if (qn === "1" && Q1 === "0") {
        // Subtract M from A
        A = subtractBinary(A, M)
        operation = "A ← A-M"
        explanation = "Q₀Q₋₁ = 10: Subtract multiplicand from A"
      } else {
        operation = "No operation"
        explanation = `Q₀Q₋₁ = ${qn}${Q1}: No arithmetic operation needed`
      }

      newSteps.push({
        cycle: i + 1,
        a: A,
        q: Q,
        q1: Q1,
        m: M,
        operation,
        explanation,
      })

      // Arithmetic right shift
      const sign = A[0]
      Q1 = Q[Q.length - 1]
      Q = A[A.length - 1] + Q.slice(0, -1)
      A = sign + A.slice(0, -1)

      newSteps.push({
        cycle: i + 1,
        a: A,
        q: Q,
        q1: Q1,
        m: M,
        operation: "Shift",
        explanation: "Arithmetic right shift [A, Q, Q₋₁]",
      })
    }

    setSteps(newSteps)
    setResult(A + Q)
  }

  const addBinary = (a: string, b: string): string => {
    let result = ""
    let carry = 0

    for (let i = a.length - 1; i >= 0; i--) {
      const sum = Number(a[i]) + Number(b[i]) + carry
      result = (sum % 2) + result
      carry = Math.floor(sum / 2)
    }

    return result.slice(-4)
  }

  const subtractBinary = (a: string, b: string): string => {
    // Two's complement of b
    const bComplement = b
      .split("")
      .map((bit) => (bit === "0" ? "1" : "0"))
      .join("")
    return addBinary(a, addBinary(bComplement, "0001"))
  }

  const binaryToDecimal = (binary: string): number => {
    if (binary[0] === "1") {
      // Negative number in two's complement
      const inverted = binary
        .split("")
        .map((bit) => (bit === "0" ? "1" : "0"))
        .join("")
      return -(Number.parseInt(inverted, 2) + 1)
    }
    return Number.parseInt(binary, 2)
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Booth&apos;s Multiplication Algorithm</CardTitle>
          <CardDescription>
            Enter two 4-bit binary numbers in two&apos;s complement notation to see the step-by-step multiplication
            process.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {!calculated ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="multiplicand">Multiplicand (M)</Label>
                    <Input
                      id="multiplicand"
                      placeholder="Enter 4-bit binary (e.g., 0111)"
                      value={multiplicand}
                      onChange={(e) => setMultiplicand(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="multiplier">Multiplier (Q)</Label>
                    <Input
                      id="multiplier"
                      placeholder="Enter 4-bit binary (e.g., 0101)"
                      value={multiplier}
                      onChange={(e) => setMultiplier(e.target.value)}
                    />
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button onClick={handleCalculate} className="w-full">
                  Calculate
                </Button>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="font-medium">Input Values:</div>
                    <div>
                      Multiplicand (M) = {multiplicand} ({binaryToDecimal(multiplicand)})
                    </div>
                    <div>
                      Multiplier (Q) = {multiplier} ({binaryToDecimal(multiplier)})
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => setCalculated(false)}>
                    Try Different Numbers
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="font-medium">Final Result:</div>
                  <div className="text-lg">
                    {binaryToDecimal(multiplicand)} × {binaryToDecimal(multiplier)} = {binaryToDecimal(result)} (
                    {result})
                  </div>
                </div>

                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Cycle</TableHead>
                        <TableHead className="w-[80px]">A</TableHead>
                        <TableHead className="w-[80px]">Q</TableHead>
                        <TableHead className="w-[80px]">Q₋₁</TableHead>
                        <TableHead className="w-[80px]">M</TableHead>
                        <TableHead className="w-[120px]">Operation</TableHead>
                        <TableHead>Explanation</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <AnimatePresence>
                        {steps.map((step, index) => (
                          <motion.tr
                            key={`${step.cycle}-${step.operation}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={index % 2 === 0 ? "bg-muted/50" : ""}
                          >
                            <TableCell>{step.operation === "Initial values" ? "-" : step.cycle}</TableCell>
                            <TableCell className="font-mono">{step.a}</TableCell>
                            <TableCell className="font-mono">{step.q}</TableCell>
                            <TableCell className="font-mono">{step.q1}</TableCell>
                            <TableCell className="font-mono">{step.m}</TableCell>
                            <TableCell>{step.operation}</TableCell>
                            <TableCell>{step.explanation}</TableCell>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </TableBody>
                  </Table>
                </div>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
