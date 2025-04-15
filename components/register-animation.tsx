"use client"

import { motion } from "framer-motion"

interface RegisterAnimationProps {
  label: string
  value: string
  highlight?: number
  tooltip?: string
}

export function RegisterAnimation({ label, value, highlight = -1, tooltip }: RegisterAnimationProps) {
  return (
    <div className="flex items-center space-x-2">
      <div className="font-medium text-sm w-8">{label}:</div>
      <div className="flex">
        {value.split("").map((bit, idx) => (
          <motion.div
            key={idx}
            initial={{ backgroundColor: "transparent" }}
            animate={{
              backgroundColor:
                highlight === idx
                  ? "rgba(var(--primary), 0.4)"
                  : bit === "1"
                    ? "rgba(var(--primary), 0.2)"
                    : "transparent",
              scale: highlight === idx ? 1.1 : 1,
            }}
            transition={{ duration: 0.3 }}
            className="w-8 h-8 flex items-center justify-center border border-gray-200"
          >
            {bit}
          </motion.div>
        ))}
      </div>
      {tooltip && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-muted-foreground">
          {tooltip}
        </motion.div>
      )}
    </div>
  )
}

interface OperationAnimationProps {
  type: "add" | "subtract" | "shift-left" | "shift-right" | "set-bit" | "restore" | "none"
  value?: string
  direction?: "left" | "right"
}

export function OperationAnimation({ type, value, direction = "left" }: OperationAnimationProps) {
  if (type === "none") return null

  return (
    <div className="relative h-16 border rounded-lg p-2 bg-background">
      {type === "add" && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center text-green-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex items-center">
            <span className="text-xl">Addition</span>
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: 1.2 }}
              transition={{ repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", duration: 0.5 }}
              className="ml-2 text-2xl"
            >
              +
            </motion.div>
          </div>
        </motion.div>
      )}

      {type === "subtract" && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center text-red-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex items-center">
            <span className="text-xl">Subtraction</span>
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: 1.2 }}
              transition={{ repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", duration: 0.5 }}
              className="ml-2 text-2xl"
            >
              -
            </motion.div>
          </div>
        </motion.div>
      )}

      {type === "shift-left" && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center text-primary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex items-center">
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: direction === "left" ? -20 : 20 }}
              transition={{ repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", duration: 0.8 }}
              className="text-2xl"
            >
              {direction === "left" ? "←" : "→"}
            </motion.div>
            <span className="ml-2">Shift {direction === "left" ? "Left" : "Right"}</span>
          </div>
        </motion.div>
      )}

      {type === "shift-right" && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center text-primary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex items-center">
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: 20 }}
              transition={{ repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", duration: 0.8 }}
              className="text-2xl"
            >
              →
            </motion.div>
            <span className="ml-2">Arithmetic Right Shift</span>
          </div>
        </motion.div>
      )}

      {type === "set-bit" && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center text-blue-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex items-center">
            <span>Set Bit to {value}</span>
            <motion.div
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{ repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", duration: 0.5 }}
              className="ml-2 text-xl"
            >
              {value}
            </motion.div>
          </div>
        </motion.div>
      )}

      {type === "restore" && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center text-purple-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex items-center">
            <span>Restore Value</span>
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
              className="ml-2 text-xl"
            >
              ⟳
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
