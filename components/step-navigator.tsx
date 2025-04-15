"use client"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw } from "lucide-react"

interface StepNavigatorProps {
  totalSteps: number
  currentStep: number
  onStepChange: (step: number) => void
  isPlaying: boolean
  onPlayPause: () => void
  onReset: () => void
}

export function StepNavigator({
  totalSteps,
  currentStep,
  onStepChange,
  isPlaying,
  onPlayPause,
  onReset,
}: StepNavigatorProps) {
  return (
    <div className="flex items-center justify-between border rounded-lg p-2 bg-muted/20">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onStepChange(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0 || isPlaying}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Button variant="outline" size="icon" onClick={onPlayPause}>
          <AnimatePresence mode="wait">
            <motion.div
              key={isPlaying ? "pause" : "play"}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.2 }}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </motion.div>
          </AnimatePresence>
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => onStepChange(Math.min(totalSteps - 1, currentStep + 1))}
          disabled={currentStep === totalSteps - 1 || isPlaying}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        <Button variant="outline" size="icon" onClick={onReset} disabled={isPlaying}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="text-sm">
          Step <span className="font-medium">{currentStep + 1}</span> of{" "}
          <span className="font-medium">{totalSteps}</span>
        </div>

        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </div>
  )
}
