module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const name = (req.query.name || (req.body && req.body.name));
    const responseMessage = 'Got request: ' + JSON.stringify(req.body);

    if (!req.body.latitude || !req.body.longitude) {
        context.res = {
            status: 400,
            body: "Missing required field 'latitude' or 'longitude'"
        };
        return;
    }
    context.res = {
        status: 200, /* Defaults to 200 */
        body: responseMessage
    };
}