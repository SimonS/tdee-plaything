import React from "react";

import Sidebar from "../layouts/sidebar/sidebar";

const MediaObject = ({
  imgObj,
  children,
}: {
  imgObj: { src: string; alt: string };
  children: React.ReactElement[];
}) => (
  <Sidebar as="article" side="right" sideWidth="154px">
    <div className="h-entry stack compressed">{children}</div>
    <img src={imgObj.src} alt={imgObj.alt} className="poster-image" />
  </Sidebar>
);

export default MediaObject;
