import React from "react";
import { Meta } from "@storybook/react/types-6-0";
import Stack from "./stack";

export default {
  title: "Layouts/Stack",
  component: Stack,
} as Meta;

export const StackLayout = () => (
  <Stack>
    <div style={{ border: "1px #000 solid" }}>Item 1</div>
    <div style={{ border: "1px #000 solid" }}>Item 2</div>
    <div style={{ border: "1px #000 solid" }}>Item 3</div>
  </Stack>
);
