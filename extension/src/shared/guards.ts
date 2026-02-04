import { ExtensionMessage } from "./messages"

export function isExtensionMessage(
  message: unknown
): message is ExtensionMessage {
  return (
    typeof message === "object" &&
    message !== null &&
    "type" in message
  )
}
