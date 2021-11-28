import React from "react";

import Stack from "../layouts/stack/stack";
import Sidebar from "../layouts/sidebar/sidebar";

const MediaObject = ({
  imgObj,
  children,
}: {
  imgObj: { src: string; alt: string };
  children: React.ReactElement[];
}) => (
  <Sidebar as="article" side="right" sideWidth="154px">
    <Stack className="h-entry">{children}</Stack>
    <img src={imgObj.src} alt={imgObj.alt} className="poster-image" />
  </Sidebar>
);

export default MediaObject;
