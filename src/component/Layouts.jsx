
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layouts = () => {
  return (
    <>
      <Navbar></Navbar>

      <main>
        <Outlet />
      </main>

      <Footer></Footer>
    </>
  );
};

export default Layouts;
