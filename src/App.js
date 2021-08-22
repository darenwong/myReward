import "react-perfect-scrollbar/dist/css/styles.css";
import React from "react";
import { createMuiTheme, ThemeProvider, colors } from "@material-ui/core";
import GlobalStyles from "src/components/GlobalStyles";
import "src/mixins/chartjs";
import theme from "src/theme";
import Routes from "src/routes";
import { AuthProvider } from "./contexts/AuthContext";
import { OfferProvider } from "./contexts/OfferContext";
import { LoadingProvider } from "./contexts/LoadingContext";
import { FirebaseStorageProvider } from "./contexts/FirebaseStorageContext";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <AuthProvider>
        <FirebaseStorageProvider>
          <OfferProvider>
            <LoadingProvider>
              <Routes />
            </LoadingProvider>
          </OfferProvider>
        </FirebaseStorageProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
