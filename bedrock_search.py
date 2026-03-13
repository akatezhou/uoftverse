import boto3
import json

bedrock = boto3.client(
    "bedrock-runtime",
    region_name="us-west-2"
)

def get_embedding(text):

    body = json.dumps({
        "inputText": text
    })

    response = bedrock.invoke_model(
        body=body,
        modelId="amazon.titan-embed-text-v1",
        accept="application/json",
        contentType="application/json"
    )

    result = json.loads(response["body"].read())

    return result["embedding"]