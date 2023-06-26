import httpTrigger from "../index";

describe("Test for Demo Function", () => {
  let context;

  beforeEach(() => {
    context = ({ log: jest.fn() });
    context.bindings = { cosmosDBOutput: null};
    context.req = { query: {} };
  });

  const sampleRequest = {
    query: {},
    body: {
      "altitude": 30.600000381469727,
      "heading": 0,
      "altitudeAccuracy": 3.693948745727539,
      "latitude": 59.3814359,
      "speed": 0.04701415076851845,
      "longitude": 18.0018654,
      "accuracy": 20.024999618530273,
      "timestamp": 1687437504336,
      "id": "foo",
    },
  };

  // Here our test will be written
  it("should return a 200", async () => {
    // Arrange
    const request = sampleRequest;

    // Action
    await httpTrigger(context, request);

    // Assertion
    expect(context.res.status).toEqual(200);
    expect(context.bindings.cosmosDBOutput).toEqual(request.body);
  });
  

});