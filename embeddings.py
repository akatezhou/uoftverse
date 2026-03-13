import boto3
import json

bedrock = boto3.client(
    service_name="bedrock-runtime",
    region_name="us-west-2"
)

def embed(text):

    body = json.dumps({
        "inputText": text
    })

    response = bedrock.invoke_model(
        modelId="amazon.titan-embed-text-v1",
        body=body
    )

    response_body = json.loads(response["body"].read())

    return response_body["embedding"]