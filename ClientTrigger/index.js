// Get Cosmos Client
import { CosmosClient } from "@azure/cosmos";

export default async function (context, req) {
    try {

        context.req.query = setDefaultQueryParams(context.req.query);

        const filteredBody = req.body;


        if (!filteredBody) {
            const cosmosClient = new CosmosClient(process.env["MyAccount_COSMOSDB"]);
            const { database } = await cosmosClient.databases.createIfNotExists({ id: "GeoLog" });
            const { container } = await database.containers.createIfNotExists({
                id: "positions",
                partitionKey: {
                    paths: "/id"
                }
            });

            const querySpec = {
                query: "SELECT * FROM positions p WHERE p.timestamp > @minTimestamp AND p.timestamp < @maxTimestamp AND p.latitude > @minLatitude AND p.latitude < @maxLatitude AND p.longitude > @minLongitude AND p.longitude < @maxLongitude",
                parameters: [
                    {
                        name: "@minTimestamp",
                        value: parseInt(context.req.query["minTimestamp"])
                    },
                    {
                        name: "@maxTimestamp",
                        value: parseInt(context.req.query["maxTimestamp"])
                    },
                    {
                        name: "@minLatitude",
                        value: parseInt(context.req.query["minLatitude"])
                    },
                    {
                        name: "@maxLatitude",
                        value: parseInt(context.req.query["maxLatitude"])
                    },
                    {
                        name: "@minLongitude",
                        value: parseInt(context.req.query["minLongitude"])
                    },
                    {
                        name: "@maxLongitude",
                        value: parseInt(context.req.query["maxLongitude"])
                    }
                ]
            };
            const { resources } = await container.items.query(querySpec).fetchAll();

            context.res = {
                status: 200,
                body: resources
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

const setDefaultQueryParams = (query) => {
    const defaultQueryParams = {
        minTimestamp: 0,
        maxTimestamp: Date.now(),
        minLatitude: -90,
        maxLatitude: 90,
        minLongitude: -180,
        maxLongitude: 180
    };

    for (const key of Object.keys(defaultQueryParams)) {
        if (!query[key]) {
            query[key] = defaultQueryParams[key];
        }
    }

    return query;
}