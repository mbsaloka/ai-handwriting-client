import { createContext, useContext, useEffect, useState } from "react"

const StyleContext = createContext()

const predefinedStyles = Array.from({ length: 11 }, (_, i) => ({
  id: String(i + 1),
  name: `Style ${i + 1}`,
}))

const randomStyle = { id: "0", name: "Random" }

export const StyleProvider = ({ children }) => {
  const [styleOptions, setStyleOptions] = useState([randomStyle, ...predefinedStyles])

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("customStyles")) || []
    const validCustomStyles = saved.map((style, i) => ({
      id: style.id || `custom_${i + 1}`,
      name: style.name || `Custom ${i + 1}`,
      stroke: style.stroke || null,
      text: style.text || "",
    }))
    setStyleOptions([randomStyle, ...predefinedStyles, ...validCustomStyles])
  }, [])

  const addStyle = (newStyle) => {
    const updatedCustomStyles = [
      ...styleOptions.filter(s => !["0", ...predefinedStyles.map(p => p.id)].includes(s.id)),
      newStyle
    ]
    setStyleOptions([randomStyle, ...predefinedStyles, ...updatedCustomStyles])
    localStorage.setItem("customStyles", JSON.stringify(updatedCustomStyles))
  }

  return (
    <StyleContext.Provider value={{ styleOptions, addStyle }}>
      {children}
    </StyleContext.Provider>
  )
}

export const useStyleContext = () => useContext(StyleContext)
