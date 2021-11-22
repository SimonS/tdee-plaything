import React from "react";
import { Meta } from "@storybook/react/types-6-0";
import Centered from "./centered";

export default {
  title: "Layouts/Centered",
  component: Centered,
} as Meta;

export const CenteredLayout = () => (
  <Centered>
    <div style={{ border: "1px #000 solid" }}>Centered item</div>
  </Centered>
);
