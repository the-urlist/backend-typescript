import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { CosmosClient } from "@azure/cosmos";

const endpoint: string = process.env.COSMOS_ENDPOINT;
const key: string = process.env.COSMOS_KEY;

const client = new CosmosClient({ endpoint, key });

const database = client.database("theurlist");
const collection = database.container("linkBundles");

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const vanityUrl = req.params.vanityUrl;

    const query = await collection.items.query(`
        SELECT * 
        FROM linkbundles lb 
        WHERE LOWER(lb.vanityUrl) = LOWER(${vanityUrl})`
    );

    const links = await query.fetchAll();

    context.res = {
        body: links
    };
};

export default httpTrigger;
