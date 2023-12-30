import React, { PropsWithChildren } from "react";
import Navigation from "./Navigation/Navigation";
import { Header } from "./Header/Header";

export const Layout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Header />
      <div className={"layout"}>
        <Navigation />
        <main>{children}</main>
      </div>
    </>
  );
};
