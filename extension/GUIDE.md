Run:
```bash
npm install
npm run dev
```

You don’t “render” an extension, you inject it.

React code becomes:
- A widget injected into someone else’s page
- Mounted via content script
- Talking to background via message passing

---

manifest.json (the brainstem)

Declares:
- Permissions
- Which scripts run where
- UI entry points
- Browser compatibility 

---

content.js (the spy)

Runs inside the webpage
- Can read & modify the DOM
- Cannot access secrets directly

Use it to:
- Read the prompt textarea
- Detect “send” clicks
- Inject your UI panel
- Send messages to background

---

background.js (the controller)

Runs outside the page

Handles:
- API calls
- Auth tokens
- Long-running tasks
- Cannot touch the DOM

Think of it as your mini backend in the browser.

---

popup.html
popup.js
(the button UI)
- Shown when user clicks extension icon
- Simple UI: login status, toggle, settings

---

styles.css
assets/
