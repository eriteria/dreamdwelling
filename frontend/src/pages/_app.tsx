import "@/app/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "@/app/store";
import AuthProvider from "@/components/AuthProvider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </Provider>
  );
}
