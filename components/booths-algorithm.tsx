"use client"

import { useState, useEffect } from "react"
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
  action: string
  a: string
  q: string
  q_1: string
  explanation: string
}

export function BoothsAlgorithm({ multiplicand, multiplier }: { multiplicand?: string; multiplier?: string }) {
  const [multiplicandState, setMultiplicand] = useState(multiplicand || "")
  const [multiplierState, setMultiplier] = useState(multiplier || "")
  const [error, setError] = useState("")
  const [steps, setSteps] = useState<Step[]>([])
  const [result, setResult] = useState("")
  const [binaryMultiplicand, setBinaryMultiplicand] = useState("")
  const [binaryMultiplier, setBinaryMultiplier] = useState("")
  const [calculated, setCalculated] = useState(false)
  const [bitLength, setBitLength] = useState(8)

  // Update state when props change
  useEffect(() => {
    if (multiplicand) setMultiplicand(multiplicand)
    if (multiplier) setMultiplier(multiplier)
  }, [multiplicand, multiplier])

  const validateInput = () => {
    if (!multiplicandState || !multiplierState) {
      setError("Both fields are required")
      return false
    }

    // Check if inputs are valid decimal numbers
    if (isNaN(Number(multiplicandState)) || isNaN(Number(multiplierState))) {
      setError("Please enter valid decimal numbers")
      return false
    }

    // Check if numbers are within range for the selected bit length
    const maxValue = Math.pow(2, bitLength - 1) - 1
    const minValue = -Math.pow(2, bitLength - 1)

    if (Number(multiplicandState) > maxValue || Number(multiplicandState) < minValue) {
      setError(`Multiplicand must be between ${minValue} and ${maxValue} for ${bitLength}-bit representation`)
      return false
    }

    if (Number(multiplierState) > maxValue || Number(multiplierState) < minValue) {
      setError(`Multiplier must be between ${minValue} and ${maxValue} for ${bitLength}-bit representation`)
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
    const m = decimalToBinary(Number(multiplicandState), bitLength)
    const q = decimalToBinary(Number(multiplierState), bitLength)

    setBinaryMultiplicand(m)
    setBinaryMultiplier(q)

    calculateBooth(m, q)
    setCalculated(true)
  }

  const decimalToBinary = (decimal: number, bits: number): string => {
    if (decimal >= 0) {
      // Positive number
      const binary = decimal.toString(2)
      // Pad with leading zeros
      return binary.padStart(bits, "0")
    } else {
      // Negative number - two's complement
      // Get absolute value in binary
      const binary = Math.abs(decimal).toString(2).padStart(bits, "0")

      // Invert all bits
      let inverted = ""
      for (let i = 0; i < binary.length; i++) {
        inverted += binary[i] === "0" ? "1" : "0"
      }

      // Add 1 to get two's complement
      let carry = 1
      let result = ""
      for (let i = inverted.length - 1; i >= 0; i--) {
        const sum = Number(inverted[i]) + carry
        result = (sum % 2) + result
        carry = Math.floor(sum / 2)
      }

      return result
    }
  }

  const binaryToDecimal = (binary: string): number => {
    // Check if it's a negative number (MSB = 1)
    if (binary[0] === "1") {
      // Invert all bits
      let inverted = ""
      for (let i = 0; i < binary.length; i++) {
        inverted += binary[i] === "0" ? "1" : "0"
      }

      // Add 1 to get the magnitude
      let carry = 1
      let magnitude = ""
      for (let i = inverted.length - 1; i >= 0; i--) {
        const sum = Number(inverted[i]) + carry
        magnitude = (sum % 2) + magnitude
        carry = Math.floor(sum / 2)
      }

      // Convert to decimal and negate
      return -Number.parseInt(magnitude, 2)
    } else {
      // Positive number
      return Number.parseInt(binary, 2)
    }
  }

  const calculateBooth = (m: string, q: string) => {
    // Initialize variables
    let A = "0".repeat(bitLength)
    let Q = q
    let Q_1 = "0"
    const M = m

    const newSteps: Step[] = []

    // Initial step
    newSteps.push({
      iteration: 0,
      action: "Initial values",
      a: A,
      q: Q,
      q_1: Q_1,
      explanation: "Initialize A to 0, Q to the multiplier, and Q₋₁ to 0.",
    })

    // Booth's algorithm
    for (let i = 0; i < bitLength; i++) {
      const qn = Q[Q.length - 1]
      let action = ""
      let explanation = ""

      // Check the last bit of Q and Q_-1
      if (qn === "0" && Q_1 === "1") {
        // Add M to A
        A = addBinary(A, M)
        action = "A = A + M"
        explanation = "Q₀ = 0, Q₋₁ = 1: Add multiplicand to A"
      } else if (qn === "1" && Q_1 === "0") {
        // Subtract M from A
        A = subtractBinary(A, M)
        action = "A = A - M"
        explanation = "Q₀ = 1, Q₋₁ = 0: Subtract multiplicand from A"
      } else {
        action = "No operation"
        explanation = `Q₀ = ${qn}, Q₋₁ = ${Q_1}: No arithmetic operation needed`
      }

      newSteps.push({
        iteration: i + 1,
        action,
        a: A,
        q: Q,
        q_1: Q_1,
        explanation,
      })

      // Right shift the combined A, Q, Q_-1
      const lastBitOfA = A[A.length - 1]
      Q_1 = Q[Q.length - 1]

      // Arithmetic right shift
      Q = A[A.length - 1] + Q.slice(0, -1)
      A = A[0] + A.slice(0, -1)

      newSteps.push({
        iteration: i + 1,
        action: "Arithmetic right shift",
        a: A,
        q: Q,
        q_1: Q_1,
        explanation: "Perform arithmetic right shift on [A, Q, Q₋₁]",
      })
    }

    // Set the result
    setResult(A + Q)
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
    setResult("")
    setBinaryMultiplicand("")
    setBinaryMultiplier("")
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
        <CardTitle>Booth&apos;s Multiplication Algorithm</CardTitle>
        <CardDescription>
          Enter two decimal numbers to see the step-by-step multiplication process using Booth&apos;s algorithm.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {!calculated ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium">Bit Length:</div>
                <div className="flex space-x-2">
                  {[4, 8, 16]?.map((length) => (
                    <Button
                      key={length}
                      className={`${bitLength===length && "bg-gradient-to-r from-orange-500/80 to-orange-600/80 hover:from-orange-500 hover:to-orange-600"}`}
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
                  <Label htmlFor="multiplicand">Multiplicand (M)</Label>
                  <Input
                    id="multiplicand"
                    placeholder="Enter decimal number"
                    value={multiplicandState}
                    onChange={(e) => setMultiplicand(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="multiplier">Multiplier (Q)</Label>
                  <Input
                    id="multiplier"
                    placeholder="Enter decimal number"
                    value={multiplierState}
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

              <Button onClick={handleCalculate} className="w-full bg-gradient-to-r from-orange-500/80 to-orange-600/80 hover:from-orange-500 hover:to-orange-600">
                Calculate
              </Button>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <div className="font-medium">Input Values:</div>
                  <div>
                    Multiplicand (M) = {multiplicandState} (Binary: {binaryMultiplicand})
                  </div>
                  <div>
                    Multiplier (Q) = {multiplierState} (Binary: {binaryMultiplier})
                  </div>
                </div>
                <Button variant="outline" onClick={handleReset}>
                  Try Different Numbers
                </Button>
              </div>

              <div className="space-y-2">
                <div className="font-medium">Final Result:</div>
                <div className="text-lg">
                  {multiplicandState} x {multiplierState} = {binaryToDecimal(result)} (Binary: {result})
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
                                {binaryMultiplicand.split("").map((bit, idx) => (
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

                            <div className="flex items-center space-x-2">
                              <p className="text-sm font-medium w-8">Q₋₁:</p>
                              <div className="flex">
                                {steps.length > 0 && (
                                  <motion.div
                                    initial={{ backgroundColor: "transparent" }}
                                    animate={{
                                      backgroundColor:
                                        steps[steps.length - 1].q_1 === "1"
                                          ? "rgba(var(--primary), 0.2)"
                                          : "transparent",
                                    }}
                                    className={`w-8 h-8 flex items-center justify-center border`}
                                  >
                                    {steps[steps.length - 1].q_1}
                                  </motion.div>
                                )}
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
                                  Accumulator register that holds the left half of the product during calculation
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
                                  Register that initially holds the multiplier and eventually the right half of the
                                  product
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center space-x-1">
                          <span>Q₋₁</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-3 w-3" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="w-[200px] text-xs">
                                  Extra bit to the right of Q that helps determine the operation
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
                          transition={{ delay: index * 0.5 }}
                          className={index % 2 === 0 ? "bg-muted/50" : ""}
                        >
                          <TableCell>
                            {step.action === "Initial values"
                              ? "-"
                              : `${Math.ceil(step.iteration / 2)}.${step.action === "Arithmetic right shift" ? "2" : "1"}`}
                          </TableCell>
                          <TableCell>{step.action}</TableCell>
                          <TableCell className="font-mono text-xs">
                            <RegisterDisplay value={step.a} />
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            <RegisterDisplay value={step.q} />
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            <RegisterDisplay value={step.q_1} />
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
