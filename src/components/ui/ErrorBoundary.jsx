import React from "react";
import { AlertCircle } from "lucide-react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(_error, errorInfo) {
    console.error("Error Boundary caught:", errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
    this.props.onRetry?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-center text-red-400">
          <div className="mb-4 flex flex-col items-center">
            <AlertCircle className="h-8 w-8 mb-2" />
            <p className="text-lg font-medium">Something went wrong</p>
          </div>
          <button
            onClick={this.handleRetry}
            className="px-4 py-2 bg-red-500/20 border border-red-500/40 rounded-lg hover:bg-red-500/30 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
