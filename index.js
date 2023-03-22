import { registerRootComponent } from "expo";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store/Config";
import ErrorBoundary from "react-native-error-boundary";
import Error from "./components/Error";
import { Provider as PaperProvider } from "react-native-paper";

const AppWithRedux = () => {
  return (
    <PaperProvider>
      <ErrorBoundary FallbackComponent={Error}>
        <Provider store={store}>
          <App />
        </Provider>
      </ErrorBoundary>
    </PaperProvider>
  );
};

registerRootComponent(AppWithRedux);
