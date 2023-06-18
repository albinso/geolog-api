import httpTrigger from "../index";
import { Context } from "@azure/functions";

describe("Test for Demo Function", () => {
  let context: Context;

  beforeEach(() => {
    context = ({ log: jest.fn() } as unknown) as Context;
  });

  const sampleRequest = {
    query: {},
    body: {
      longitude: "12",
      latitude: "12"
    },
  };

  // Here our test will be written
  it("should return a 200", async () => {
    // Arrange
    const request = sampleRequest;

    // Action
    await httpTrigger(context, request);

    // Assertion
    expect(context.log).toBeCalledTimes(1);
    expect(context.res.status).toEqual(200);
  });

  it("must have longitude", async () => {

    // Arrange
    const request = {
      query: {},
      body: {
        latitude: "12"
      },
    };

    // Action
    await httpTrigger(context, request);

    // Assertion
    expect(context.res.status).toEqual(400);
  });

  it("must have latitude", async () => {

    // Arrange
    const request = {
      query: {},
      body: {
        longitude: "12"
      },
    };

    // Action
    await httpTrigger(context, request);

    // Assertion
    expect(context.res.status).toEqual(400);
  });

});