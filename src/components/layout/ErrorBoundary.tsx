"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode; fallback?: ReactNode };
type State = { hasError: boolean };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[Virtue Gems] UI error:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="mx-auto flex min-h-[40vh] max-w-md flex-col items-center justify-center px-6 py-16 text-center">
            <p className="text-lg font-semibold text-dark">Something went wrong</p>
            <p className="mt-2 text-sm text-dark/60">
              Please refresh the page. Your cart and data are saved locally.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 min-h-11 rounded-xl bg-gold px-6 py-2.5 text-sm font-semibold text-dark"
            >
              Refresh page
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
