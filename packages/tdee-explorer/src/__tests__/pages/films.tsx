import React from "react";
import renderer from "react-test-renderer";
import FilmsPage from "../../pages/films";

describe("Films", () => {
  it("renders correctly", () => {
    const data = {
      bdt: {
        posts: {
          nodes: [
            {
              date: "2020-05-20T22:18:04",
              watchOf: {
                name: "FILM",
                rating: 4,
                review: "REVIEW",
                url: "https://example.com/simonscarfe/film/21-jump-street/",
              },
            },
            {
              date: "2020-05-10T21:17:00",
              watchOf: {
                name: "A FILM I JUST WATCHED",
                rating: 3.5,
                review: null,
                url: "https://example.com/simonscarfe/film/thunder-road-2018/",
              },
            },
          ],
        },
      },
    };

    const tree = renderer.create(<FilmsPage data={data} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
