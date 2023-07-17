import type { AppContext, AppProps } from "next/app";
import App, { AppInitialProps } from "next/app";
import Layout from "../components/Layout";

type MyAppProps = AppProps & {
};

const MyApp = ({ Component, pageProps }: MyAppProps) => {

  return (
    <Layout>
    <Component {... pageProps}/>
    </Layout>
  );
};

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);
  const props: AppInitialProps = { ...appProps };

  return {
    ...props
  };
};

export default MyApp;
