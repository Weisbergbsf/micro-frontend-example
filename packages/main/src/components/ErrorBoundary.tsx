import React from "react";

interface ErrorBoundaryProps {
    children: React.ReactNode;
    componentName: string;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
    state = { hasError: false, errorMessage: "" };

    static getDerivedStateFromError(error: Error): { hasError: boolean } {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        this.setState({ errorMessage: error.message });
        console.error(`Erro no micro-frontend ${this.props.componentName}:`, error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div>
                    Erro ao carregar o micro-frontend: <strong>{this.props.componentName}</strong>.
                    <br />
                    Detalhes: {this.state.errorMessage || "Erro desconhecido."}
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;