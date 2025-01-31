import { useEffect } from "react";

export const useConditionalKeyboardShortcut = (key: string, ctrlKey: boolean, callback: () => void, isActive: boolean) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isActive && event.key.toLowerCase() === key.toLowerCase() && event.ctrlKey === ctrlKey) {
        event.preventDefault()
        callback()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [key, ctrlKey, callback, isActive])
}