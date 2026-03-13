import boto3

dynamodb = boto3.resource("dynamodb", region_name="us-west-2")

table = dynamodb.Table("posts")

def get_posts():
    response = table.scan()
    return response["Items"]