import React from "react";
import ChatTopic from "../components/ChatTopic";
import { GetServerSideProps } from "next";

const Page = () => (
  <ChatTopic/>
);

export default Page;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
    },
  };
};