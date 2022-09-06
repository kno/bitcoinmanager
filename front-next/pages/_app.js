import { AppContextProvider } from "../store";
import '../styles/globals.css'

const MyApp = ({Component, pageProps}) => {
  return (
    <AppContextProvider>
      <Component {...pageProps} />
    </AppContextProvider>
  )
};

export default MyApp;
