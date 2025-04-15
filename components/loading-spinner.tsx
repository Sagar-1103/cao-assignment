"use client"

interface LoadingSpinnerProps {
  color?: "orange" | "pink" | "purple"
  size?: "sm" | "md" | "lg"
  text?: string
}

export function LoadingSpinner({ color = "orange", size = "md", text }: LoadingSpinnerProps) {
  const getColor = () => {
    switch (color) {
      case "orange":
        return ["border-orange-500", "border-orange-400", "border-orange-300", "text-orange-400"]
      case "pink":
        return ["border-pink-500", "border-pink-400", "border-pink-300", "text-pink-400"]
      case "purple":
        return ["border-purple-500", "border-purple-400", "border-purple-300", "text-purple-400"]
      default:
        return ["border-orange-500", "border-orange-400", "border-orange-300", "text-orange-400"]
    }
  }

  const getSize = () => {
    switch (size) {
      case "sm":
        return "w-16 h-16"
      case "md":
        return "w-24 h-24"
      case "lg":
        return "w-32 h-32"
      default:
        return "w-24 h-24"
    }
  }

  const [outerRing, middleRing, innerRing, textColor] = getColor()
  const spinnerSize = getSize()

  return (
    <div className="text-center">
      <div className={`relative ${spinnerSize} mx-auto mb-8`}>
        <div className={`absolute inset-0 rounded-full border-t-2 ${outerRing} animate-spin`}></div>
        <div
          className={`absolute inset-2 rounded-full border-t-2 ${middleRing} animate-spin`}
          style={{ animationDuration: "1.5s" }}
        ></div>
        <div
          className={`absolute inset-4 rounded-full border-t-2 ${innerRing} animate-spin`}
          style={{ animationDuration: "2s" }}
        ></div>
      </div>
      {text && <p className={`${textColor} animate-pulse`}>{text}</p>}
    </div>
  )
}
