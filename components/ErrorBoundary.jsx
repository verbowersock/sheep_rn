import React from 'react';
import { View, Text, ScrollView } from 'react-native';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log('=== ERROR BOUNDARY CAUGHT ===');
    console.log('Error:', error);
    console.log('Error message:', error.message);
    console.log('Error stack:', error.stack);
    console.log('Component stack:', errorInfo.componentStack);
    console.log('=== END ERROR BOUNDARY ===');
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, padding: 20, backgroundColor: 'white' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'red' }}>
            Something went wrong!
          </Text>
          <ScrollView style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 12, fontFamily: 'monospace' }}>
              {this.state.error && this.state.error.toString()}
            </Text>
            <Text style={{ fontSize: 10, fontFamily: 'monospace', marginTop: 10 }}>
              {this.state.errorInfo.componentStack}
            </Text>
          </ScrollView>
        </View>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;