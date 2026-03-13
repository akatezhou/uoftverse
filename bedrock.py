import boto3
import json

bedrock = boto3.client("bedrock-runtime", region_name="us-west-2")

def embed(text):

    body = json.dumps({
        "inputText": text
    })

    response = bedrock.invoke_model(
        modelId="amazon.titan-embed-text-v1",
        body=body,
        contentType="application/json",
        accept="application/json"
    )

    result = json.loads(response["body"].read())

    return result["embedding"]