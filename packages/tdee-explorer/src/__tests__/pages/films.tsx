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
                name: "21 Jump Street (2012)",
                rating: 4,
                review:
                  "Way better than I was expecting. Funny and self-aware.",
                url: "https://letterboxd.com/simonscarfe/film/21-jump-street/",
              },
            },
            {
              date: "2020-05-10T21:17:00",
              watchOf: {
                name: "Thunder Road (2018)",
                rating: 3.5,
                review: null,
                url:
                  "https://letterboxd.com/simonscarfe/film/thunder-road-2018/",
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
