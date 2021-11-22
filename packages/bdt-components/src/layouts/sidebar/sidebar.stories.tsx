import React from "react";
import { Meta } from "@storybook/react";
import Sidebar, { Side } from "./sidebar";

export default {
  title: "Layouts/Sidebar",
  component: Sidebar,
  argTypes: {
    side: {
      options: ["left", "right"],
      control: { type: "radio" },
    },
  },
} as Meta;

const Template = (args: { side?: Side; sideWidth?: string }) => (
  <Sidebar {...args}>
    <div style={{ border: "1px #000 solid" }}>Item 1</div>
    <div style={{ border: "1px #000 solid" }}>Item 2</div>
  </Sidebar>
);

export const SidebarLayoutDefault = Template.bind({});
SidebarLayoutDefault.args = { sideWidth: "" };

export const SidebarLayoutRight = Template.bind({});
SidebarLayoutRight.args = { side: "right", sideWidth: "" };
