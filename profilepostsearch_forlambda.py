import boto3
import json
from decimal import Decimal

# Connect to DynamoDB
dynamo = boto3.resource("dynamodb", region_name="us-west-2")

profiles_table = dynamo.Table("uoftverse-profiles")
listings_table = dynamo.Table("posts")


# Converts DynamoDB Decimal → JSON-safe int
class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return int(obj)
        return super().default(obj)


# ---------- DATABASE ----------
def get_posts():
    result = listings_table.scan()
    return result["Items"]


def get_profiles():
    result = profiles_table.scan()
    return result["Items"]


# ---------- DEPARTMENT ALIASES ----------
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


# ---------- SEARCH ENGINE ----------
def search(query=None, type=None, department=None, entity="all"):

    results = []
    listings = []
    profiles = []

    entity = (entity or "all").lower()

    # Fetch tables depending on entity filter
    if entity in ["all", "listings"]:
        listings = get_posts()

    if entity in ["all", "profiles"]:
        profiles = get_profiles()

    # Normalize department shorthand
    if department:
        department = DEPARTMENT_ALIASES.get(department.lower(), department.lower())

    # ---------- SEARCH LISTINGS ----------
    for post in listings:

        try:
            post = json.loads(post["id"])
        except (KeyError, json.JSONDecodeError):
            continue

        text = (post.get("title", "") + " " + post.get("description", "")).lower()
        words = text.split()

        match = True

        if query:
            match = False
            for word in words:
                if word.startswith(query.lower()):
                    match = True
                    break

        if not match:
            continue

        if type:
            if post.get("type", "").lower() != type.lower():
                continue

        if department:
            post_department = post.get("department", "").lower()
            if department not in post_department:
                continue

        results.append({"kind": "listing", **post})

    # ---------- SEARCH PROFILES ----------
    for profile in profiles:

        text = (
            profile.get("name", "") + " " +
            profile.get("bio", "") + " " +
            " ".join(profile.get("research_interests", []))
        ).lower()

        words = text.split()

        match = True

        if query:
            match = False
            for word in words:
                if word.startswith(query.lower()):
                    match = True
                    break

        if not match:
            continue

        if department:
            profile_department = profile.get("department", "").lower()
            if department not in profile_department:
                continue

        results.append({"kind": "profile", **dict(profile)})

    # Limit results for UI sanity
    return results[:20]


# ---------- AWS LAMBDA HANDLER ----------
def lambda_handler(event, context):

    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "*",
        "Content-Type": "application/json"
    }

    # Handle CORS preflight
    if event.get("requestContext", {}).get("http", {}).get("method") == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": headers,
            "body": ""
        }

    try:

        params = event.get("queryStringParameters")

        if params is None:
            params = {}

        q = params.get("q")
        type_ = params.get("type")
        department = params.get("department")
        entity = params.get("entity", "all")

        results = search(
            query=q,
            type=type_,
            department=department,
            entity=entity
        )

        return {
            "statusCode": 200,
            "headers": headers,
            "body": json.dumps({
                "results": results,
                "total": len(results)
            }, cls=DecimalEncoder)
        }

    except Exception as e:

        return {
            "statusCode": 500,
            "headers": headers,
            "body": json.dumps({
                "error": str(e)
            })
        }
