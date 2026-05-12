import { Bot, Brain,Users } from "lucide-react"
import * as React from "react"
import { useTranslation } from "react-i18next"
import { Outlet } from "react-router-dom"

import { cn } from "@/lib/utils"

type AuthLayoutProps = {
  children?: React.ReactNode
  className?: string
}

function AuthLayout({ children, className }: AuthLayoutProps) {
  const { t } = useTranslation("auth")
  return (
    <div className={cn("min-h-screen w-full flex bg-background", className)}>
      {/* Left Column - Hero Image*/}
      <div className="hidden lg:flex lg:w-1/2 relative bg-muted items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0 transition-transform duration-1000 hover:scale-105"
          style={{
            backgroundImage: "url('/images/auth-bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        
        {/* Gradient Overlays for high aesthetic contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 z-10" />
        <div className="absolute inset-0 bg-primary/15 mix-blend-overlay z-10" />

        {/* Floating Content over image */}
        <div className="relative z-20 flex flex-col justify-end h-full w-full p-12 lg:p-16 text-white">
          <div className="bg-black/30 backdrop-blur-2xl border border-white/10 p-8 lg:p-10 rounded-3xl max-w-lg shadow-2xl animate-in slide-in-from-bottom-8 duration-700 space-y-6">
            {/* Main Project Title */}
            <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight border-b border-white/10 pb-4">
              {t("layout.hero_title")}
            </h2>

            {/* Factual Feature List */}
            <div className="space-y-5 pt-2">
              {/* Feature 1 - AI Memory */}
              <div className="flex gap-4 items-start">
                <div className="p-2.5 bg-primary/20 rounded-xl text-primary border border-primary/30 backdrop-blur-md shadow-sm shrink-0">
                  <Brain className="size-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-white text-base leading-snug">{t("layout.features.client_storage.title")}</h3>
                  <p className="text-white/70 text-sm leading-relaxed">{t("layout.features.client_storage.desc")}</p>
                </div>
              </div>

              {/* Feature 2 - Product Matching */}
              <div className="flex gap-4 items-start">
                <div className="p-2.5 bg-white/5 rounded-xl text-white/90 border border-white/10 backdrop-blur-md shadow-sm shrink-0">
                  <Bot className="size-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-white text-base leading-snug">{t("layout.features.property_matching.title")}</h3>
                  <p className="text-white/70 text-sm leading-relaxed">{t("layout.features.property_matching.desc")}</p>
                </div>
              </div>

              {/* Feature 3 - CRM */}
              <div className="flex gap-4 items-start">
                <div className="p-2.5 bg-white/5 rounded-xl text-white/90 border border-white/10 backdrop-blur-md shadow-sm shrink-0">
                  <Users className="size-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-white text-base leading-snug">{t("layout.features.internal_management.title")}</h3>
                  <p className="text-white/70 text-sm leading-relaxed">{t("layout.features.internal_management.desc")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-[420px] animate-in fade-in zoom-in-95 duration-500 relative z-10">
          {children || <Outlet />}
        </div>
      </div>
    </div>
  )
}

export { AuthLayout }
