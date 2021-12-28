import React from "react";
import { mainMenu, current } from "./nav.module.css";

export const Nav = ({ url = "" }: { url?: string }): JSX.Element => (
  <nav className={mainMenu}>
    <ul className="stack compressed">
      <li>
        <a className={url === "/" ? current : ""} href="/">
          Home
        </a>
      </li>
      <li>
        <a className={/^\/films/.test(url) ? current : ""} href="/films">
          Films
        </a>
      </li>
      <li>
        <a className={/^\/podcasts/.test(url) ? current : ""} href="/podcasts">
          Podcasts
        </a>
      </li>
    </ul>
  </nav>
);

export default Nav;
