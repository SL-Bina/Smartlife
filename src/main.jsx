import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@material-tailwind/react";
import { Provider } from "react-redux";
import { store } from "@/store";
import { ReduxInitializer } from "@/components/ReduxInitializer";
import "@/styles/tailwind.css";
import "leaflet/dist/leaflet.css";
import "./i18n/i18n";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <ThemeProvider>
          <ReduxInitializer>
            <App />
          </ReduxInitializer>
        </ThemeProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
