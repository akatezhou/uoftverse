import boto3
import json
from decimal import Decimal

# Connect to DynamoDB in us-west-2
dynamo = boto3.resource('dynamodb', region_name='us-west-2')

# Two separate tables
profiles_table = dynamo.Table('uoftverse-profiles')
listings_table = dynamo.Table('posts')

# Converts DynamoDB Decimal to int for JSON serialization
class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return int(obj)
        return super().default(obj)

# Replaces db.py — fetches directly from DynamoDB instead
def get_posts():
    result = listings_table.scan()
    return result['Items']

def get_profiles():
    result = profiles_table.scan()
    return result['Items']

# Shorthand aliases so users can type "ece" instead of full department name
DEPARTMENT_ALIASES = {
    "cs": "computer science",
    "computer science": "computer science",
    "ece": "electrical & computer engineering",
    "electrical": "electrical & computer engineering",
    "mechanical": "mechanical engineering",
    "mech": "mechanical engineering",
    "chemical": "chemical engineering",
    "chem": "chemical engineering",
    "biomedical": "biomedical engineering",
    "bio": "biomedical engineering",
    "civil": "civil engineering",
    "environmental": "environmental science",
    "env": "environmental science"
}

def search(query=None, type=None, department=None, entity="all"):
    results = []
    listings = []
    profiles = []

    # Decide what to fetch based on entity filter
    if entity in ["all", "listings"]:
        listings = get_posts()
    if entity in ["all", "profiles"]:
        profiles = get_profiles()

    # Normalize department shorthand to full name
    if department:
        department = DEPARTMENT_ALIASES.get(department.lower(), department.lower())

    # ---- SEARCH LISTINGS ----
    for post in listings:
        # Listings are stored as a JSON string inside the 'id' field — parse it out
        try:
            post = json.loads(post["id"])
        except (json.JSONDecodeError, KeyError):
            continue

        text = (post.get("title", "") + " " + post.get("description", "")).lower()
        words = text.split()

        match = True

        # Prefix keyword matching — "rob" matches "robotics"
        if query:
            match = False
            for word in words:
                if word.startswith(query.lower()):
                    match = True
                    break

        if not match:
            continue

        # Filter by listing type e.g. "research", "design", "lab"
        if type:
            if post.get("type", "").lower() != type.lower():
                continue

        # Filter by department
        if department:
            post_department = post.get("department", "").lower()
            if department not in post_department:
                continue

        results.append({"kind": "listing", **post})

    # ---- SEARCH PROFILES ----
    for profile in profiles:
        text = (
            profile.get("name", "") + " " +
            profile.get("bio", "") + " " +
            " ".join(profile.get("research_interests", []))
        ).lower()

        words = text.split()

        match = True

        # Prefix keyword matching
        if query:
            match = False
            for word in words:
                if word.startswith(query.lower()):
                    match = True
                    break

        if not match:
            continue

        # Filter by department
        if department:
            profile_department = profile.get("department", "").lower()
            if department not in profile_department:
                continue

        results.append({"kind": "profile", **dict(profile)})

    return results


# Replaces FastAPI — this is the entry point AWS Lambda calls
def lambda_handler(event, context):
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    }

    try:
        # GET /search?q=robotics&type=research&department=ece&entity=all
        # Query params come from queryStringParameters in Lambda
        params = event.get('queryStringParameters') or {}

        q          = params.get('q')
        type_      = params.get('type')
        department = params.get('department')
        entity     = params.get('entity', 'all')  # "all", "profiles", or "listings"

        results = search(
            query=q,
            type=type_,
            department=department,
            entity=entity
        )

        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'results': results,
                'total': len(results)
            }, cls=DecimalEncoder)
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)})
        }