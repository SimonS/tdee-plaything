import React from "react";
import { render } from "@testing-library/react";
import { ActivityEntry } from "./activity-entry";

const baseActivity = {
  title: "Test Activity",
  activityType: "Run",
  startDateLocalIso: "2024-05-05T10:00:00",
};

describe("ActivityEntry distance display", () => {
  it("formats 1000 metres as 1.00 km", () => {
    const { container } = render(
      <ActivityEntry activity={{ ...baseActivity, distanceMeters: 1000 }} />,
    );
    expect(container).toHaveTextContent("1.00 km");
  });

  it("formats 500 metres as 0.50 km", () => {
    const { container } = render(
      <ActivityEntry activity={{ ...baseActivity, distanceMeters: 500 }} />,
    );
    expect(container).toHaveTextContent("0.50 km");
  });

  it("formats 12345 metres as 12.35 km", () => {
    const { container } = render(
      <ActivityEntry activity={{ ...baseActivity, distanceMeters: 12345 }} />,
    );
    expect(container).toHaveTextContent("12.35 km");
  });

  it("does not display Distance section when distanceMeters is not provided", () => {
    const { container } = render(<ActivityEntry activity={baseActivity} />);
    expect(container).not.toHaveTextContent("Distance");
  });
});

describe("ActivityEntry time display", () => {
  it("formats 65 seconds as 1:05", () => {
    const { container } = render(
      <ActivityEntry activity={{ ...baseActivity, movingTimeSeconds: 65 }} />,
    );
    expect(container).toHaveTextContent("1:05");
  });

  it("formats 59 seconds as 0:59 with zero-padded seconds", () => {
    const { container } = render(
      <ActivityEntry activity={{ ...baseActivity, movingTimeSeconds: 59 }} />,
    );
    expect(container).toHaveTextContent("0:59");
  });

  it("formats 3661 seconds as 1:01:01 with hours", () => {
    const { container } = render(
      <ActivityEntry activity={{ ...baseActivity, movingTimeSeconds: 3661 }} />,
    );
    expect(container).toHaveTextContent("1:01:01");
  });

  it("formats 3600 seconds as 1:00:00 exactly one hour", () => {
    const { container } = render(
      <ActivityEntry activity={{ ...baseActivity, movingTimeSeconds: 3600 }} />,
    );
    expect(container).toHaveTextContent("1:00:00");
  });

  it("does not display Time section when movingTimeSeconds is not provided", () => {
    const { container } = render(<ActivityEntry activity={baseActivity} />);
    expect(container).not.toHaveTextContent("Time");
  });
});
