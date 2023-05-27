import React, { useEffect } from "react";
import Navbar from "./Navbar";
import Head from "next/head";
import jwtDecode from 'jwt-decode';


type BaseProps = {
  children: React.ReactNode;
  title: string;
};

class Base extends React.Component<BaseProps> {

  state = {}

  componentDidMount() {

    require("../../node_modules/bootstrap/dist/js/bootstrap.js");

    const token = localStorage.getItem("token");
    if(token) {
      const user = jwtDecode(token);
      localStorage.setItem("user", JSON.stringify(user));
    }

  }

  render() {
    const { children, title } = this.props;

    return (
      <>
        <Head>
          <title>{title}</title>
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
            integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />
        </Head>

        <Navbar />

        {children}
      </>
    );
  }
}

export default Base;
