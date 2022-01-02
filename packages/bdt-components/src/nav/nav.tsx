import React from "react";
import { mainMenu, current } from "./nav.module.css";

export const Nav = ({ url = "" }: { url?: string }): JSX.Element => {
  const makeLink = (href: string, text: string) => (
    <li>
      <a
        className={new RegExp(`^\/${href}`).test(url) ? current : ""}
        href={`/${href}`}
      >
        {text}
      </a>
    </li>
  );
  return (
    <nav className={mainMenu}>
      <ul className="stack compressed">
        <li>
          <a className={url === "/" ? current : ""} href="/">
            Home
          </a>
        </li>
        {[
          ["films", "Films"],
          ["podcasts", "Podcasts"],
          ["now", "Now"],
        ].map(([href, text]) => makeLink(href, text))}
      </ul>
    </nav>
  );
};

export default Nav;
