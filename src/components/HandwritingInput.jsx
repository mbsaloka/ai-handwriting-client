import { useState, useRef, useEffect } from "react"
import { Stage, Layer, Line } from "react-konva"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Undo2, Trash2, Send } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useStyleContext } from "@/context/StyleContext"

function HandwritingInput() {
  const [lines, setLines] = useState([])
  const [strokes, setStrokes] = useState([])
  const [isDrawing, setIsDrawing] = useState(false)
  const [styleName, setStyleName] = useState("")
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 })
  const [textContent, setTextContent] = useState("")
  const containerRef = useRef(null)

  const { addStyle } = useStyleContext()

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth
        setDimensions({
          width: width,
          height: Math.min(400, window.innerHeight - 200),
        })
      }
    }
    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  const handleMouseDown = (e) => {
    setIsDrawing(true)
    const pos = e.target.getStage().getPointerPosition()
    setLines([...lines, { points: [pos.x, pos.y] }])
    setStrokes([...strokes, [0, Math.round(pos.x), Math.round(pos.y)]])
  }

  const handleMouseMove = (e) => {
    if (!isDrawing) return
    const stage = e.target.getStage()
    const point = stage.getPointerPosition()
    const lastLine = lines[lines.length - 1]
    if (lastLine) {
      const lastPoints = lastLine.points
      const lastX = lastPoints[lastPoints.length - 2]
      const lastY = lastPoints[lastPoints.length - 1]
      const dx = point.x - lastX
      const dy = point.y - lastY
      const distance = Math.sqrt(dx * dx + dy * dy)

      const threshold = 2.0
      if (distance > threshold) {
        lastLine.points = lastLine.points.concat([point.x, point.y])
        setLines([...lines.slice(0, -1), lastLine])
        setStrokes([...strokes, [0, Math.round(point.x), Math.round(point.y)]])
      }
    }
  }

  const handleMouseUp = (e) => {
    setIsDrawing(false)
    const pos = e.target.getStage().getPointerPosition()
    setStrokes([...strokes, [1, Math.round(pos.x), Math.round(pos.y)]])
  }

  const handleClear = () => {
    setLines([])
    setStrokes([])
    setStyleName("")
    setTextContent("")
  }

  const handleUndo = () => {
    if (lines.length === 0) return
    let lastPenUpIndex = strokes.length - 1
    while (lastPenUpIndex >= 0 && strokes[lastPenUpIndex][0] !== 1) {
      lastPenUpIndex--
    }
    let previousPenUpIndex = lastPenUpIndex - 1
    while (previousPenUpIndex >= 0 && strokes[previousPenUpIndex][0] !== 1) {
      previousPenUpIndex--
    }
    const newStrokes = previousPenUpIndex >= 0 ? strokes.slice(0, previousPenUpIndex + 1) : []
    setStrokes(newStrokes)
    setLines(lines.slice(0, -1))
  }

  const handleSubmit = () => {
    if (!styleName.trim()) {
      alert("Please enter a style name.")
      return
    }

    if (!textContent.trim()) {
      alert("Please enter the text content.")
      return
    }

    const styleData = {
      id: `custom_${Date.now()}`,
      name: styleName.trim(),
      stroke: strokes,
      text: textContent.trim(),
    }

    addStyle(styleData)
    alert(`Style "${styleData.name}" saved!`)
    handleClear()
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Handwriting Input</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Enter style name..."
          value={styleName}
          onChange={(e) => setStyleName(e.target.value)}
        />
        <div ref={containerRef} className="w-full">
          <Stage
            width={dimensions.width}
            height={dimensions.height}
            onMouseDown={handleMouseDown}
            onMousemove={handleMouseMove}
            onMouseup={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
            className="border border-gray-200 rounded-md bg-white touch-none"
          >
            <Layer>
              {lines.map((line, i) => (
                <Line
                  key={i}
                  points={line.points}
                  stroke="#000"
                  strokeWidth={2.5}
                  tension={0.5}
                  lineCap="round"
                  lineJoin="round"
                />
              ))}
            </Layer>
          </Stage>
          <Input
            className="mt-4"
            placeholder="Enter the written text..."
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="space-x-2">
          <Button variant="outline" onClick={handleUndo} disabled={lines.length === 0}>
            <Undo2 className="w-4 h-4 mr-2" />
            Undo
          </Button>
          <Button variant="outline" onClick={handleClear} disabled={lines.length === 0}>
            <Trash2 className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </div>
        <Button onClick={handleSubmit} disabled={strokes.length === 0}>
          <Send className="w-4 h-4 mr-2" />
          Submit
        </Button>
      </CardFooter>
    </Card>
  )
}

export default HandwritingInput
