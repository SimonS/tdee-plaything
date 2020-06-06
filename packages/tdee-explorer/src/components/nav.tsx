import React from "react";
import { Link } from "gatsby";
import Stack from "../layouts/stack";
import { mainMenu, current } from "./nav.module.css";

const Nav = ({ url = "" }: { url?: string }): JSX.Element => (
  <nav className={mainMenu}>
    <Stack as="ul">
      <li>
        <Link className={url === "/" ? current : ""} to="/">
          Home
        </Link>
      </li>
      <li>
        <Link className={/^\/films/.test(url) ? current : ""} to="/films">
          Films Seen
        </Link>
      </li>
    </Stack>
  </nav>
);

export default Nav;
