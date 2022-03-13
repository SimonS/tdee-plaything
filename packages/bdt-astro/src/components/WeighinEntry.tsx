import { Weighin } from "@bdt-types/bdt";

interface WeighinProps {
  weighin: Weighin;
}

export const WeighinEntry = ({ weighin }: WeighinProps): JSX.Element => {
  return (
    <article className="sidebar right">
      <div>
        <div>
          <div className="h-entry stack compressed">
            <header>
              <h2>Weighed in at {weighin.weight} kg</h2>
            </header>
            <dl>
              <dt>Weigh in time</dt>
              <dd>
                <time className="dt-published" dateTime={weighin.weighinTime}>
                  {new Date(weighin.weighinTime).toDateString()}
                </time>
              </dd>
              <dt>Weight</dt>
              <dd>{weighin.weight}</dd>
              <dt>Bodyfat Percentage</dt>
              <dd>{weighin.bodyFatPercentage}</dd>
            </dl>
          </div>
        </div>
        <div style={{ maxWidth: "154px" }}></div>
      </div>
    </article>
  );
};
