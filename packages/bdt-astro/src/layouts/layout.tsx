import { ReactNode } from "react";

import Centered from "@components/layouts/centered/centered";
import Sidebar from "@components/layouts/sidebar/sidebar";
import Stack from "@components/layouts/stack/stack";

const Layout = ({ children }: { children?: ReactNode }) => (
  <Centered>
    <Sidebar>
      <Stack>
        <p>Logo</p>
        <ul>
          <li>nav</li>
        </ul>
      </Stack>
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

          <span className="footer-item">&copy; Simon Scarfe 2007-2021</span>
        </footer>
      </Stack>
    </Sidebar>
  </Centered>
);

export default Layout;
