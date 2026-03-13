from db import get_posts
from embeddings import embed
from semantic_search import rank_posts
import json

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

def search(query=None, type=None, department=None):

    posts = get_posts()
    results = []

    # normalize department input
    if department:
        department = DEPARTMENT_ALIASES.get(department.lower(), department.lower())

    for post in posts:

        post = json.loads(post["id"])

        text = (post.get("title","") + " " + post.get("description","")).lower()
        words = text.split()

        match = True

        # keyword matching
        if query:
            match = False
            for word in words:
                if word.startswith(query.lower()):
                    match = True
                    break

        if not match:
            continue

        # type filter
        if type:
            if post.get("type","").lower() != type.lower():
                continue

        # department filter (supports aliases)
        if department:
            post_department = post.get("department","").lower()
            if department not in post_department:
                continue

        results.append(post)

   if query:
    query_embedding = embed(query)
    results = rank_posts(query_embedding, results)

return results
