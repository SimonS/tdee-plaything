import React from "react";
import { Meta } from "@storybook/react/types-6-0";
import HelloComponent from "./hello";

export default {
  title: "Components/Hello",
  component: HelloComponent,
} as Meta;

export const Hello = () => <HelloComponent name="Si" />;
