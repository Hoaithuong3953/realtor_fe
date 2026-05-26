import { Alert as UIAlert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Info, CheckCircle2, XCircle } from "lucide-react"

export interface AlertProps {
  variant?: "default" | "warning" | "destructive" | "success" | "info"
  title?: string
  message: string
  className?: string
}

export const Alert = ({ variant = "info", title, message, className }: AlertProps) => {
  const getShadcnVariant = () => {
    if (variant === "destructive") return "destructive"
    return "default"
  }

  const getCustomStyles = () => {
    switch (variant) {
      case "warning":
        return "bg-amber-50 text-amber-800 border-amber-200 [&>svg]:text-amber-600"
      case "success":
        return "bg-emerald-50 text-emerald-800 border-emerald-200 [&>svg]:text-emerald-600"
      case "info":
        return "bg-blue-50 text-blue-800 border-blue-200 [&>svg]:text-blue-600"
      default:
        return ""
    }
  }

  const getIcon = () => {
    switch (variant) {
      case "warning": return <AlertCircle className="h-4 w-4" />
      case "destructive": return <XCircle className="h-4 w-4" />
      case "success": return <CheckCircle2 className="h-4 w-4" />
      default: return <Info className="h-4 w-4" />
    }
  }

  return (
    <UIAlert variant={getShadcnVariant()} className={`${getCustomStyles()} ${className || ""}`}>
      {getIcon()}
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{message}</AlertDescription>
    </UIAlert>
  )
}
