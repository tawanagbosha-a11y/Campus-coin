import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('CampusCoin App Error Caught by Boundary:', error, errorInfo);
  }

  public handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl p-6 border border-slate-200 shadow-xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto text-xl font-bold">
              !
            </div>
            <h2 className="text-lg font-black text-slate-900">Application Recovered</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Campus Coin encountered a temporary rendering or sync issue. You can reload the app or reset local cache to continue.
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-2.5 px-4 rounded-xl bg-[#0f2e69] text-white text-xs font-bold hover:bg-[#0a1f44] transition-colors"
              >
                Reload Campus Coin
              </button>
              <button
                onClick={this.handleReset}
                className="w-full py-2 px-4 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors"
              >
                Reset Cache & Reload
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
