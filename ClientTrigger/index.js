module.exports = async function (context, req) {
    try {
        context.log('JavaScript HTTP trigger function processed a request.');

        const filteredBody = validateFields(req.body);

        if (!filteredBody) {
            context.res = {
                status: 400,
                body: "Missing required field 'latitude' or 'longitude'"
            };
            return;
        }
        context.res = {
            status: 200, /* Defaults to 200 */
            body: filteredBody
        };
        context.bindings.cosmosDBOutput = req.body;
    }
    catch (error) {
        context.log("Failed to process request", error);
        context.res = {
            status: 500,
            body: error.message
        };
    }
}

const validateFields = (body) => {
    const fields = ['latitude', 'longitude'];
    let filteredBody = {};
    for (const field of fields) {
        if (!body[field]) {
            return false;
        }
        filteredBody[field] = body[field];
    }
    console.log(filteredBody);
    return filteredBody;
};