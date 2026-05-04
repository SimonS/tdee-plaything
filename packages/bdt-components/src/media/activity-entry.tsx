import React from "react";
import { Activity } from "@tdee/types/src/bdt";

interface ActivityProps {
  activity: Activity;
}

const formatDistance = (metres: number): string =>
  `${(metres / 1000).toFixed(2)} km`;

const formatDuration = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
    : `${m}:${String(s).padStart(2, "0")}`;
};

export const ActivityEntry = ({ activity }: ActivityProps): JSX.Element => {
  return (
    <article className="sidebar right">
      <div>
        <div>
          <div className="h-entry stack compressed">
            <header>
              <h2>{activity.title}</h2>
            </header>
            <dl>
              <dt>Date</dt>
              <dd>
                <time
                  className="dt-published"
                  dateTime={activity.startDateLocalIso}
                >
                  {new Date(activity.startDateLocalIso).toDateString()}
                </time>
              </dd>
              <dt>Type</dt>
              <dd>{activity.activityType}</dd>
              {activity.distanceMeters ? (
                <>
                  <dt>Distance</dt>
                  <dd>{formatDistance(activity.distanceMeters)}</dd>
                </>
              ) : null}
              {activity.movingTimeSeconds ? (
                <>
                  <dt>Time</dt>
                  <dd>{formatDuration(activity.movingTimeSeconds)}</dd>
                </>
              ) : null}
            </dl>
          </div>
        </div>
        <div style={{ maxWidth: "154px" }} />
      </div>
    </article>
  );
};
