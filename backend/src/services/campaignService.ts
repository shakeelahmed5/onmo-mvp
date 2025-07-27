import { DynamoDBClient, PutItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const ddb = new DynamoDBClient({});
const TABLE_NAME = process.env.CAMPAIGNS_TABLE!;

export const saveCampaign = async (campaign: any) => {
    const item = Object.entries(campaign).reduce((acc, [key, val]) => {
        acc[key] = { S: String(val) };
        return acc;
    }, {} as Record<string, any>);

    const cmd = new PutItemCommand({
        TableName: TABLE_NAME,
        Item: item
    });

    await ddb.send(cmd);
};

export const listUserCampaigns = async (userId: string) => {
    const cmd = new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: "userId = :uid",
        ExpressionAttributeValues: {
            ":uid": { S: userId }
        }
    });

    const result = await ddb.send(cmd);
    return result.Items?.map(item => unmarshall(item));
};
