import React from "react";
import Chat from "../components/Chat";
import { GetServerSideProps } from "next";

const Index = () => (
  <Chat/>
);

export default Index;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
    },
  };
};