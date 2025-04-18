import React from "react"
import { ChevronLeft } from "lucide-react"
import { Link } from "react-router-dom"
import HandwritingInput from "@/components/HandwritingInput"

function CustomStylePage() {
  return (
    <main className="container mx-auto py-10 px-4">
        <div className="mb-8">
          <Link
            to="/generator"
            className="text-muted-foreground hover:text-primary flex items-center group transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1 transition-colors group-hover:text-primary" />
            <span className="text-base">Back to Generator</span>
          </Link>
        </div>
      <HandwritingInput />
    </main>
  )
}

export default CustomStylePage
