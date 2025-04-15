"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlgorithmInput } from "@/components/algorithm-input"
import { BoothsAlgorithm } from "@/components/booths-algorithm"
import { RestoringAlgorithm } from "@/components/restoring-algorithm"
import { NonRestoringAlgorithm } from "@/components/non-restoring-algorithm"
import { motion, AnimatePresence } from "framer-motion"

export function AlgorithmDemo() {
  const [boothsInputs, setBoothsInputs] = useState({ multiplicand: "", multiplier: "" })
  const [restoringInputs, setRestoringInputs] = useState({ dividend: "", divisor: "" })
  const [nonRestoringInputs, setNonRestoringInputs] = useState({ dividend: "", divisor: "" })

  const [boothsCalculated, setBoothsCalculated] = useState(false)
  const [restoringCalculated, setRestoringCalculated] = useState(false)
  const [nonRestoringCalculated, setNonRestoringCalculated] = useState(false)
  const [activeTab, setActiveTab] = useState("booths")

  const handleBoothsSubmit = (multiplicand: string, multiplier: string) => {
    setBoothsInputs({ multiplicand, multiplier })
    setBoothsCalculated(true)
  }

  const handleRestoringSubmit = (dividend: string, divisor: string) => {
    setRestoringInputs({ dividend, divisor })
    setRestoringCalculated(true)
  }

  const handleNonRestoringSubmit = (dividend: string, divisor: string) => {
    setNonRestoringInputs({ dividend, divisor })
    setNonRestoringCalculated(true)
  }

  return (
    <Tabs defaultValue="booths" className="w-full max-w-4xl mx-auto" onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-3 mb-8">
        <TabsTrigger value="booths">Booth&apos;s Algorithm</TabsTrigger>
        <TabsTrigger value="restoring">Restoring Division</TabsTrigger>
        <TabsTrigger value="non-restoring">Non-Restoring Division</TabsTrigger>
      </TabsList>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <TabsContent value="booths" forceMount={activeTab === "booths"}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} transition={{ duration: 0.2 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Booth&apos;s Algorithm</CardTitle>
                  <CardDescription>
                    Booth&apos;s algorithm is a multiplication algorithm that handles both positive and negative numbers
                    in two&apos;s complement notation.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AnimatePresence mode="wait">
                    {!boothsCalculated ? (
                      <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <AlgorithmInput
                          type="multiplication"
                          onSubmit={handleBoothsSubmit}
                          label1="Multiplicand"
                          label2="Multiplier"
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="result"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6"
                      >
                        <div className="flex justify-between">
                          <h3 className="text-lg font-medium">Step-by-Step Solution</h3>
                          <motion.button
                            className="text-sm text-primary hover:underline"
                            onClick={() => setBoothsCalculated(false)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Try different numbers
                          </motion.button>
                        </div>
                        <BoothsAlgorithm
                          multiplicand={boothsInputs.multiplicand}
                          multiplier={boothsInputs.multiplier}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="restoring" forceMount={activeTab === "restoring"}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} transition={{ duration: 0.2 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Restoring Division Algorithm</CardTitle>
                  <CardDescription>
                    The restoring division algorithm performs binary division by repeatedly subtracting and restoring
                    when necessary.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AnimatePresence mode="wait">
                    {!restoringCalculated ? (
                      <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <AlgorithmInput
                          type="division"
                          onSubmit={handleRestoringSubmit}
                          label1="Dividend"
                          label2="Divisor"
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="result"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6"
                      >
                        <div className="flex justify-between">
                          <h3 className="text-lg font-medium">Step-by-Step Solution</h3>
                          <motion.button
                            className="text-sm text-primary hover:underline"
                            onClick={() => setRestoringCalculated(false)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Try different numbers
                          </motion.button>
                        </div>
                        <RestoringAlgorithm dividend={restoringInputs.dividend} divisor={restoringInputs.divisor} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="non-restoring" forceMount={activeTab === "non-restoring"}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} transition={{ duration: 0.2 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Non-Restoring Division Algorithm</CardTitle>
                  <CardDescription>
                    The non-restoring division algorithm is an optimization of the restoring algorithm that avoids the
                    restore step.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AnimatePresence mode="wait">
                    {!nonRestoringCalculated ? (
                      <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <AlgorithmInput
                          type="division"
                          onSubmit={handleNonRestoringSubmit}
                          label1="Dividend"
                          label2="Divisor"
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="result"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6"
                      >
                        <div className="flex justify-between">
                          <h3 className="text-lg font-medium">Step-by-Step Solution</h3>
                          <motion.button
                            className="text-sm text-primary hover:underline"
                            onClick={() => setNonRestoringCalculated(false)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Try different numbers
                          </motion.button>
                        </div>
                        <NonRestoringAlgorithm
                          dividend={nonRestoringInputs.dividend}
                          divisor={nonRestoringInputs.divisor}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </motion.div>
      </AnimatePresence>
    </Tabs>
  )
}
