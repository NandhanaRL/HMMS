import { Component } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an unhandled error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#060C1B] text-[#F8FAFC] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-[#111827] border border-white/[0.08] rounded-3xl p-8 text-center space-y-6 shadow-2xl shadow-black/50">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Something went wrong
              </h2>
              <p className="text-sm text-slate-400 font-normal">
                An unexpected interface error occurred. You can refresh the view or navigate back to safety.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="p-3 bg-[#0F172A] rounded-xl border border-white/10 text-xs text-rose-300 font-mono text-left overflow-x-auto max-h-24">
                {this.state.error.message}
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={this.handleReload}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#2563EB] hover:bg-blue-500 text-white font-medium text-sm transition cursor-pointer shadow-soft"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Page
              </button>
              <button
                type="button"
                onClick={this.handleHome}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#171F35] hover:bg-[#1C2440] border border-white/10 text-white font-medium text-sm transition cursor-pointer"
              >
                <Home className="w-4 h-4" />
                Return Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
