/* background.js (the controller)

Runs outside the page

Handles:
- API calls
- Auth tokens
- Long-running tasks
- Cannot touch the DOM

Think of it as your mini backend in the browser. */

import browser from "webextension-polyfill"
import { isExtensionMessage } from "./shared/guards"

browser.runtime.onMessage.addListener(
  (message, sender, sendResponse) => {

    if (!isExtensionMessage(message)) {
      sendResponse({ ok: false, error: "Invalid message" })
      return true
    }

    if (message.type === "ANALYZE_PROMPT") {
      fetch("https://api.greenprompt.dev/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${message.token}`
        },
        body: JSON.stringify({ prompt: message.prompt })
      })
        .then(r => r.json())
        .then(data => sendResponse({ ok: true, data }))
        .catch(err =>
          sendResponse({ ok: false, error: err.message })
        )
    }

    return true
  }
)
