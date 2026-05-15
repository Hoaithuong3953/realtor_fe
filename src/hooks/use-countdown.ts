import * as React from "react"

export function useCountdown(initialCount: number) {
  const [count, setCount] = React.useState(0)
  const [isRunning, setIsRunning] = React.useState(false)

  React.useEffect(() => {
    let timer: ReturnType<typeof setInterval>

    if (isRunning && count > 0) {
      timer = setInterval(() => {
        setCount((prev) => prev - 1)
      }, 1000)
    } else if (count === 0) {
      setIsRunning(false)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isRunning, count])

  const startCountdown = React.useCallback(() => {
    setCount(initialCount)
    setIsRunning(true)
  }, [initialCount])

  return { count, isRunning, startCountdown }
}
