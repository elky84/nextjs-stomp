import Layout from "../components/Layout";
import React from "react";
import Chat from "../components/Chat";

const Index = props => (
  <Layout>
    <Chat/>
  </Layout>
);

Index.getInitialProps = async function() {
  return {};
};

export default Index;