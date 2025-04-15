"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BoothsAlgorithm } from "@/components/booths-algorithm"
import { RestoringAlgorithm } from "@/components/restoring-algorithm"
import { NonRestoringAlgorithm } from "@/components/non-restoring-algorithm"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight } from "lucide-react"

export function AlgorithmSelector() {
  const [activeTab, setActiveTab] = useState("booths")

  return (
    <Tabs defaultValue="booths" className="w-full max-w-4xl mx-auto" onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-3 mb-8">
        {["booths", "restoring", "non-restoring"].map((tab) => (
          <motion.div key={tab} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <TabsTrigger value={tab} className={activeTab === tab ? "relative" : ""}>
              {tab === "booths" && "Booth's Algorithm"}
              {tab === "restoring" && "Restoring Division"}
              {tab === "non-restoring" && "Non-Restoring Division"}
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  initial={false}
                />
              )}
            </TabsTrigger>
          </motion.div>
        ))}
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
            <BoothsAlgorithm />
          </TabsContent>

          <TabsContent value="restoring" forceMount={activeTab === "restoring"}>
            <RestoringAlgorithm />
          </TabsContent>

          <TabsContent value="non-restoring" forceMount={activeTab === "non-restoring"}>
            <NonRestoringAlgorithm />
          </TabsContent>
        </motion.div>
      </AnimatePresence>
      <motion.div
        className="mt-8 flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>Tip: Try different bit lengths and input values to see how the algorithms behave</span>
          <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}>
            <ArrowRight className="h-4 w-4" />
          </motion.div>
        </div>
      </motion.div>
    </Tabs>
  )
}
