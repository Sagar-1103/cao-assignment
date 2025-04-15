"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { motion, AnimatePresence } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Step {
  iteration: number
  substep: number
  action: string
  a: string
  q: string
  explanation: string
}

export function RestoringAlgorithm() {
  const [dividend, setDividend] = useState("")
  const [divisor, setDivisor] = useState("")
  const [error, setError] = useState("")
  const [steps, setSteps] = useState<Step[]>([])
  const [quotient, setQuotient] = useState("")
  const [remainder, setRemainder] = useState("")
  const [binaryDividend, setBinaryDividend] = useState("")
  const [binaryDivisor, setBinaryDivisor] = useState("")
  const [calculated, setCalculated] = useState(false)
  const [bitLength, setBitLength] = useState(8)

  const validateInput = () => {
    if (!dividend || !divisor) {
      setError("Both fields are required")
      return false
    }

    // Check if inputs are valid decimal numbers
    if (isNaN(Number(dividend)) || isNaN(Number(divisor))) {
      setError("Please enter valid decimal numbers")
      return false
    }

    if (Number(divisor) === 0) {
      setError("Cannot divide by zero")
      return false
    }

    // Check if numbers are within range for the selected bit length
    const maxValue = Math.pow(2, bitLength - 1) - 1
    const minValue = 0 // For division, we'll only handle positive numbers for simplicity

    if (Number(dividend) > maxValue || Number(dividend) < minValue) {
      setError(`Dividend must be between ${minValue} and ${maxValue} for ${bitLength}-bit representation`)
      return false
    }

    if (Number(divisor) > maxValue || Number(divisor) < minValue) {
      setError(`Divisor must be between ${minValue} and ${maxValue} for ${bitLength}-bit representation`)
      return false
    }

    return true
  }

  const handleCalculate = () => {
    if (!validateInput()) {
      return
    }

    setError("")

    // Convert decimal to binary
    const q = decimalToBinary(Number(dividend), bitLength)
    const m = decimalToBinary(Number(divisor), bitLength)

    setBinaryDividend(q)
    setBinaryDivisor(m)

    calculateRestoring(q, m)
    setCalculated(true)
  }

  const decimalToBinary = (decimal: number, bits: number): string => {
    // For division, we'll use unsigned binary representation for simplicity
    const binary = decimal.toString(2)
    // Pad with leading zeros
    return binary.padStart(bits, "0")
  }

  const binaryToDecimal = (binary: string): number => {
    // For division results, we'll use unsigned binary representation
    return Number.parseInt(binary, 2)
  }

  const calculateRestoring = (q: string, m: string) => {
    // Initialize variables
    let A = "0".repeat(bitLength)
    let Q = q
    const M = m

    const newSteps: Step[] = []

    // Initial step
    newSteps.push({
      iteration: 0,
      substep: 0,
      action: "Initial values",
      a: A,
      q: Q,
      explanation: "Initialize A to 0, Q to the dividend.",
    })

    // Restoring division algorithm
    for (let i = 0; i < bitLength; i++) {
      // Left shift A, Q
      A = A.slice(1) + Q[0]
      Q = Q.slice(1) + "0"

      newSteps.push({
        iteration: i + 1,
        substep: 1,
        action: "Left shift A, Q",
        a: A,
        q: Q,
        explanation: "Shift A and Q left by 1 bit. MSB of Q moves to LSB of A.",
      })

      // Subtract M from A
      const A_sub = subtractBinary(A, M)

      newSteps.push({
        iteration: i + 1,
        substep: 2,
        action: "A = A - M",
        a: A_sub,
        q: Q,
        explanation: "Subtract divisor from A.",
      })

      // Check if A is negative (MSB = 1)
      if (A_sub[0] === "1") {
        // Restore A
        newSteps.push({
          iteration: i + 1,
          substep: 3,
          action: "Restore A, Q[n-1] = 0",
          a: A,
          q: Q,
          explanation: "A is negative, restore A to previous value and set Q[n-1] = 0.",
        })
      } else {
        // A is positive, keep the subtraction and set Q[n-1] = 1
        A = A_sub
        Q = Q.slice(0, -1) + "1"

        newSteps.push({
          iteration: i + 1,
          substep: 3,
          action: "Keep A, Q[n-1] = 1",
          a: A,
          q: Q,
          explanation: "A is positive, keep the subtraction result and set Q[n-1] = 1.",
        })
      }
    }

    // Set the results
    setQuotient(Q)
    setRemainder(A)
    setSteps(newSteps)
  }

  const addBinary = (a: string, b: string): string => {
    let result = ""
    let carry = 0

    for (let i = a.length - 1; i >= 0; i--) {
      const sum = Number(a[i]) + Number(b[i]) + carry
      result = (sum % 2) + result
      carry = Math.floor(sum / 2)
    }

    return result
  }

  const subtractBinary = (a: string, b: string): string => {
    // Two's complement of b
    let inverted = ""
    for (let i = 0; i < b.length; i++) {
      inverted += b[i] === "0" ? "1" : "0"
    }

    // Add 1 to get two's complement
    const bComplement = addBinary(inverted, "1".padStart(b.length, "0"))

    // Add a and -b
    return addBinary(a, bComplement)
  }

  const handleReset = () => {
    setCalculated(false)
    setSteps([])
    setQuotient("")
    setRemainder("")
    setBinaryDividend("")
    setBinaryDivisor("")
  }

  const handleBitLengthChange = (length: number) => {
    setBitLength(length)
    if (calculated) {
      handleReset()
    }
  }

  const RegisterDisplay = ({ value }: { value: string }) => {
    return (
      <div className="flex">
        {value.split("").map((bit, idx) => (
          <motion.span
            key={idx}
            initial={{ backgroundColor: "transparent" }}
            animate={{ backgroundColor: "transparent" }}
            className={`inline-flex justify-center items-center w-6 h-6 border border-gray-200 ${
              bit === "1" ? "bg-primary/20 text-primary-foreground" : ""
            }`}
          >
            {bit}
          </motion.span>
        ))}
      </div>
    )
  }

  return (
  <>
    <Card>
      <CardHeader>
        <CardTitle>Restoring Division Algorithm</CardTitle>
        <CardDescription>
          Enter two decimal numbers to see the step-by-step division process using the restoring division algorithm.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {!calculated ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium">Bit Length:</div>
                <div className="flex space-x-2">
                  {[4, 8, 16].map((length) => (
                    <Button
                      key={length}
                      className={`${bitLength===length && "bg-gradient-to-r from-pink-500/80 to-pink-600/80 hover:from-pink-500 hover:to-pink-600"}`}
                      variant={bitLength === length ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleBitLengthChange(length)}
                    >
                      {length}-bit
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="dividend">Dividend (Q)</Label>
                  <Input
                    id="dividend"
                    placeholder="Enter decimal number"
                    value={dividend}
                    onChange={(e) => setDividend(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="divisor">Divisor (M)</Label>
                  <Input
                    id="divisor"
                    placeholder="Enter decimal number"
                    value={divisor}
                    onChange={(e) => setDivisor(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button onClick={handleCalculate} className="w-full bg-gradient-to-r from-pink-500/80 to-pink-600/80 hover:from-pink-500 hover:to-pink-600">
                Calculate
              </Button>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <div className="font-medium">Input Values:</div>
                  <div>
                    Dividend (Q) = {dividend} (Binary: {binaryDividend})
                  </div>
                  <div>
                    Divisor (M) = {divisor} (Binary: {binaryDivisor})
                  </div>
                </div>
                <Button variant="outline" onClick={handleReset}>
                  Try Different Numbers
                </Button>
              </div>

              <div className="space-y-2">
                <div className="font-medium">Final Result:</div>
                <div className="text-lg">
                  {dividend} ÷ {divisor} = {binaryToDecimal(quotient)} , Remainder {binaryToDecimal(remainder)} || (Quotient:{" "}
                  {quotient} Remainder {remainder})
                </div>
              </div>

                            <motion.div
                className="my-6 p-4 border rounded-lg bg-muted/30"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-lg font-medium mb-4">Visual Representation</h3>
                <div className="space-y-6">
                  <AnimatePresence mode="wait">
                    {steps.length > 0 && (
                      <motion.div
                        key="animation"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4"
                      >
                        <div className="flex flex-col space-y-2">
                          <div className="grid grid-cols-3 gap-4">
                          <div className="mt-4 space-y-2">
                            <div className="flex items-center space-x-2">
                              <p className="text-sm font-medium w-8">M:</p>
                              <div className="flex">
                                {binaryDivisor.split("").map((bit, idx) => (
                                  <motion.div
                                    key={idx}
                                    className={`w-8 h-8 flex items-center justify-center border ${
                                      bit === "1" ? "bg-primary/20 text-primary-foreground" : ""
                                    }`}
                                  >
                                    {bit}
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <p className="text-sm font-medium w-8">A:</p>
                              <div className="flex">
                                {steps.length > 0 &&
                                  steps[steps.length - 1].a.split("").map((bit, idx) => (
                                    <motion.div
                                      key={idx}
                                      initial={{ backgroundColor: "transparent" }}
                                      animate={{
                                        backgroundColor: bit === "1" ? "rgba(var(--primary), 0.2)" : "transparent",
                                        transition: { delay: idx * 0.05 },
                                      }}
                                      className={`w-8 h-8 flex items-center justify-center border`}
                                    >
                                      {bit}
                                    </motion.div>
                                  ))}
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <p className="text-sm font-medium w-8">Q:</p>
                              <div className="flex">
                                {steps.length > 0 &&
                                  steps[steps.length - 1].q.split("").map((bit, idx) => (
                                    <motion.div
                                      key={idx}
                                      initial={{ backgroundColor: "transparent" }}
                                      animate={{
                                        backgroundColor: bit === "1" ? "rgba(var(--primary), 0.2)" : "transparent",
                                        transition: { delay: idx * 0.05 },
                                      }}
                                      className={`w-8 h-8 flex items-center justify-center border`}
                                    >
                                      {bit}
                                    </motion.div>
                                  ))}
                              </div>
                            </div>
                          </div>
                        </div>                 
                        </div>                 
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              <div className="rounded-lg border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Step</TableHead>
                      <TableHead className="w-[120px]">Action</TableHead>
                      <TableHead>
                        <div className="flex items-center space-x-1">
                          <span>A</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-3 w-3" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="w-[200px] text-xs">
                                  Accumulator register that holds the remainder during calculation
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center space-x-1">
                          <span>Q</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-3 w-3" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="w-[200px] text-xs">
                                  Register that initially holds the dividend and eventually the quotient
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableHead>
                      <TableHead>Explanation</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {steps.map((step, index) => (
                        <motion.tr
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={index % 2 === 0 ? "bg-muted/50" : ""}
                        >
                          <TableCell>
                            {step.action === "Initial values" ? "-" : `${step.iteration}.${step.substep}`}
                          </TableCell>
                          <TableCell>{step.action}</TableCell>
                          <TableCell className="font-mono text-xs">
                            <RegisterDisplay value={step.a} />
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            <RegisterDisplay value={step.q} />
                          </TableCell>
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
  </>
  )
}
