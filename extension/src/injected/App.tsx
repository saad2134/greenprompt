import { useState } from "react"
import "./app.css"

export default function App() {
  const [result, setResult] = useState<any>(null)

  const analyze = () => {
    const textarea = document.querySelector("textarea")
    if (!textarea) return

    chrome.runtime.sendMessage(
      {
        type: "ANALYZE_PROMPT",
        prompt: textarea.value,
        token: "DEV_TOKEN"
      },
      response => setResult(response.data)
    )
  }

  return (
    <div className="gp-panel">
      <button onClick={analyze}>Analyze Prompt</button>
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  )
}
