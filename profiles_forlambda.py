import boto3
import json
from decimal import Decimal

dynamo = boto3.resource('dynamodb', region_name='us-west-2')
table = dynamo.Table('uoftverse-profiles')

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return int(obj)
        return super().default(obj)

def lambda_handler(event, context):
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    }

    method = event.get('requestContext', {}).get('http', {}).get('method', 'GET')
    path = event.get('rawPath', '/')
    parts = path.strip('/').split('/')
    profile_id = parts[1] if len(parts) > 1 else None

    try:
        if method == 'GET' and profile_id:
            result = table.get_item(Key={'profileid': profile_id})
            item = result.get('Item')
            if not item:
                return {'statusCode': 404, 'headers': headers, 'body': json.dumps({'error': 'Profile not found'})}
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps(item, cls=DecimalEncoder)}

        elif method == 'GET':
            result = table.scan()
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps(result['Items'], cls=DecimalEncoder)}

        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            if not body.get('profileid') or not body.get('name'):
                return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'profileid and name are required'})}
            table.put_item(Item=body)
            return {'statusCode': 201, 'headers': headers, 'body': json.dumps({'message': f"Profile created for {body['name']}"})}

        else:
            return {'statusCode': 405, 'headers': headers, 'body': json.dumps({'error': 'Method not allowed'})}

    except Exception as e:
        return {'statusCode': 500, 'headers': headers, 'body': json.dumps({'error': str(e)})}