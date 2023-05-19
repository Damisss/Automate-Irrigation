import {
    APIGatewayProxyEvent, 
    APIGatewayProxyResult, 
    APIGatewayProxyEventQueryStringParameters
} from 'aws-lambda'
import {
    DynamoDBClient, 
    PutItemCommand, 
    DeleteItemCommand, 
    ScanCommand, 
    QueryCommand, 
    AttributeValue
} from '@aws-sdk/client-dynamodb'
import {ApiGatewayManagementApi, GoneException} from '@aws-sdk/client-apigatewaymanagementapi'


interface Body {
    action: string,
    type: string
    recipientNickname?:string
    body: {
        type?: string,
        pin?: string,
        mode?: string,
        status?: string
    } | string
} 

const dynamodbClient = new DynamoDBClient({})
const tableName = process.env['CLIENTS_TABLE_NAME'] || ''
const apiGatewayManagementApi = new ApiGatewayManagementApi({
    endpoint: process.env['WSSAPIGATEWAYENDPOINT']
})

const textEncoder = new TextEncoder()

export const handle = async(event:APIGatewayProxyEvent):Promise<APIGatewayProxyResult>=>{
    const connectionId = event.requestContext.connectionId as string
    const routeKey = event.requestContext.routeKey as string
    const body = event.body || ''

    switch (routeKey) {
        case '$connect':
            return handleConnect(connectionId, event.queryStringParameters)
        case '$disconnect':
            return handleDisconnect(connectionId)
        case 'msg':

            return handleMsg(
                connectionId, 
                parseSendMessageBody(body)
            )
    }

    return { statusCode: 200, body:'' }
}


const handleConnect = async(
    connectionId:string,
    queryParameters: APIGatewayProxyEventQueryStringParameters | null,
): Promise<APIGatewayProxyResult>=>{
    if (!queryParameters || !queryParameters["nickname"]) {
        return {"statusCode": 403, body: '' };
    }
    
    await dynamodbClient.send(
        new PutItemCommand({
            TableName: tableName,
            Item:{
                connectionId:{
                    S:connectionId
                },
                nickname:{
                    S:queryParameters['nickname'] 
                }
            }
        })
    )
    return { "statusCode": 200, body: '' }
}

const handleDisconnect = async(connectionId:string): Promise<APIGatewayProxyResult>=>{
    await dynamodbClient.send(
        new DeleteItemCommand({
            TableName: tableName,
            Key:{
                connectionId:{
                    S:connectionId
                }
            }
        })
    )
    return { "statusCode": 200, body: '' }
}


const handleMsg = async(connectionId:string, body:Body): Promise<APIGatewayProxyResult>=>{
    const recipientConnectionId = await getConnectionIdByNickname(
        body.recipientNickname as string,
    );

    if(recipientConnectionId !== connectionId){
        await message(recipientConnectionId as string, body)
    }else{
        await message(connectionId, {action:'msg', type: 'warning', body: 'no recipient'})
    }

    return { statusCode: 200, body: ''}
}

const message = async(connectionId:string, body:Body)=>{
    try {
        await apiGatewayManagementApi.postToConnection({
        ConnectionId: connectionId,
        Data: textEncoder.encode(JSON.stringify(body))
    })
        
    } catch (error) {
        if(error instanceof GoneException){
            handleDisconnect(connectionId)
            return
        }
        throw error
    }
}

const getConnectionIdByNickname = async (
  nickname: string,
): Promise<string | undefined> => {
  const output = await dynamodbClient.send(
    new QueryCommand({
        TableName: tableName,
        IndexName: "NicknameIndex",
        KeyConditionExpression: "#nickname = :nickname",
        ExpressionAttributeNames: {
            "#nickname": "nickname",
        },
        ExpressionAttributeValues: {
            ":nickname": {S: nickname},
        },
    })
  )
  
  return output.Items && output.Items.length > 0
    ? output.Items[0]['connectionId'].S
    : undefined
}

const parseSendMessageBody = (body: string | null): Body => {
  const sendMsgBody = JSON.parse(body || "{}") as Body

  if (!sendMsgBody || !sendMsgBody.recipientNickname) {
    throw new Error("invalid SendMessageBody")
  }

  return sendMsgBody;
};
