import React, { ReactNode } from "react";
import Centered from "./centered";
import Sidebar from "./sidebar";
import Stack from "./stack";

import "../styles/global.css";

const Layout = ({ children }: { children: ReactNode }): JSX.Element => (
  <Centered className="layout">
    <Sidebar>
      <div className="logo">BreakfastDinnerTea</div>
      <Stack as="main">
        {children}
        <footer>
          <span className="footer-item">
            <a
              rel="license"
              href="http://creativecommons.org/licenses/by-sa/3.0/"
            >
              <img
                alt="This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 Unported License"
                src="https://i.creativecommons.org/l/by-sa/3.0/80x15.png"
              />
            </a>
          </span>

          <span className="footer-item">&copy; Simon Scarfe 2007-2020</span>
        </footer>
      </Stack>
    </Sidebar>
  </Centered>
);

export default Layout;
