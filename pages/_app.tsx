import { AppProps } from "next/app";
import Head from "next/head";
import Link from "next/link";
import { Layout, Typography } from "antd";

const { Header, Content } = Layout;

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <>
      <Head>
        <title>OpenAI API</title>
      </Head>
      <Layout style={{ background: "transparent" }}>
        <Header>
          <Link href="/">
            <Typography.Text style={{ color: "white" }}>Home</Typography.Text>
          </Link>
        </Header>
        <Content style={{ padding: "16px" }}>
          <Component {...pageProps} />
        </Content>
      </Layout>
    </>
  );
}

export default MyApp;
