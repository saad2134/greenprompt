export type AnalyzePromptMessage = {
  type: "ANALYZE_PROMPT"
  prompt: string
  token: string
}

export type ExtensionMessage =
  | AnalyzePromptMessage
