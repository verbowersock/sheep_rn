import 'react-native-reanimated'
import { registerRootComponent } from "expo";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store/Config";
import ErrorBoundary from "react-native-error-boundary";

import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import GlobalError from "./components/GlobalError";

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: "#68c25a",
    secondary: "#c2875a",
    accent: "#9C27B0",
    background: "#ffffff",
    text: "#000000",
    disabled: "#bdb8b5",
    placeholder: "#bdb8b5",
    error: "#ba1a1a",
  },
};

const AppWithRedux = () => {
  return (
    <PaperProvider theme={theme}>
      <ErrorBoundary FallbackComponent={GlobalError}>
        <Provider store={store}>
          <App />
        </Provider>
      </ErrorBoundary>
    </PaperProvider>
  );
};

registerRootComponent(AppWithRedux);
