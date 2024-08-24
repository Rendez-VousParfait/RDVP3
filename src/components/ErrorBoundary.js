import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Vous pouvez logger l'erreur dans un service de reporting
    console.error("ErrorBoundary caught an error", error, errorInfo);

    // Mettre à jour l'état pour pouvoir afficher les détails dans le rendu
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // Vous pouvez personnaliser le rendu de l'erreur ici
      return (
        <div>
          <h1>Something went wrong.</h1>
          <details style={{ whiteSpace: "pre-wrap" }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
