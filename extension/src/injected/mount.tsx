// Injected React UI (this is what users see)

import React from "react"
import { createRoot } from "react-dom/client"
import App from "./App"

const container = document.getElementById("promptonomics-root")
if (container) {
  createRoot(container).render(<App />)
}
