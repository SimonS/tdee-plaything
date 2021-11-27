import React from "react";
import Stack from "../layouts/stack/stack";
import { mainMenu, current } from "./nav.module.css";

export const Nav = ({ url = "" }: { url?: string }): JSX.Element => (
  <nav className={mainMenu}>
    <Stack as="ul">
      <li>
        <a className={url === "/" ? current : ""} href="/">
          Home
        </a>
      </li>
      <li>
        <a className={/^\/films/.test(url) ? current : ""} href="/films">
          Films Seen
        </a>
      </li>
    </Stack>
  </nav>
);

export default Nav;
