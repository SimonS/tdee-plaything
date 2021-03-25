import fetch from "node-fetch";
import postToBDT from "./postToBDT";

jest.mock("node-fetch");

test("makes a request using the correct attributes", async () => {
  postToBDT("content", "https://example.com/ere", "letmein");

  expect(fetch as jest.MockedFunction<typeof fetch>).toHaveBeenCalledWith(
    "https://example.com/ere",
    {
      method: "POST",
      body: "content",
      headers: {
        authorization: "Bearer letmein",
        "Content-Type": "application/json",
      },
    }
  );
});
