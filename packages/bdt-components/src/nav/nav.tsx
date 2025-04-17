import React from "react";
import { mainMenu, current } from "./nav.module.css";

export const Nav = ({ url }: { url: URL }): JSX.Element => {
  const makeLink = (href: string, text: string, i: number) => (
    <li key={`nav-${i + 1}`}>
      <a
        className={new RegExp(`^.*\/${href}`).test(url.pathname) ? current : ""}
        href={`/${href}`}
      >
        {text}
      </a>
    </li>
  );
  return (
    <nav className={mainMenu}>
      <ul>
        <li key={`nav-0`}>
          <a className={url?.pathname === "/" ? current : ""} href="/">
            Home
          </a>
        </li>
        {[
          ["lifelog", "Everything"],
          ["films", "Films"],
          ["podcasts", "Podcasts"],
          ["weight", "Weigh ins"],
          ["now", "Now"],
        ].map(([href, text], i) => makeLink(href, text, i))}
      </ul>
    </nav>
  );
};

export default Nav;
