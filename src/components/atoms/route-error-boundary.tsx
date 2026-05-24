import * as React from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/atoms/button";
import { logger } from "@/utils/logger";

interface ClassProps {
  children?: React.ReactNode;
  t: (key: string) => string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class RouteErrorBoundaryClass extends React.Component<ClassProps, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error("Route UI Crash:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  public render() {
    const { t } = this.props;

    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] h-full w-full p-6 text-center animate-in fade-in zoom-in-95 duration-300">
          <div className="size-16 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
            <AlertTriangle className="size-8 text-destructive" />
          </div>
          <h2 className="text-xl font-bold mb-2">{t("errors.serverError.title")}</h2>
          <p className="text-muted-foreground max-w-md mb-8">
            {t("errors.serverError.description")}
          </p>
          <Button onClick={this.handleReset} variant="outline" className="gap-2">
            <RefreshCcw className="size-4" />
            {t("actions.retry")}
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export const RouteErrorBoundary = ({ children }: { children?: React.ReactNode }) => {
  const { t } = useTranslation("common");
  return <RouteErrorBoundaryClass t={t}>{children}</RouteErrorBoundaryClass>;
}
