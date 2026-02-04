import { createRoot } from "react-dom/client"

function Popup() {
  return <div>GreenPrompt  active</div>
}

createRoot(document.getElementById("root")!).render(<Popup />)
