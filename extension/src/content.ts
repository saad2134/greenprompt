/* content.js (the spy)

Runs inside the webpage
-Can read & modify the DOM
-Cannot access secrets directly

Use it to:
-Read the prompt textarea
-Detect “send” clicks
-Inject your UI panel
-Send messages to background */

const rootId = "greenprompt-root"

if (!document.getElementById(rootId)) {
  const root = document.createElement("div")
  root.id = rootId
  document.body.appendChild(root)

  const script = document.createElement("script")
  script.src = chrome.runtime.getURL("injected.js")
  document.body.appendChild(script)
}
