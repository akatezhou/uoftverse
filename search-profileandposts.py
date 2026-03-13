from db import get_posts, get_profiles
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

def search(query=None, type=None, department=None, entity="all"):

    results = []

    listings = []
    profiles = []

    if entity in ["all", "listings"]:
        listings = get_posts()

    if entity in ["all", "profiles"]:
        profiles = get_profiles()

    # normalize department input
    if department:
        department = DEPARTMENT_ALIASES.get(department.lower(), department.lower())

    # ---- SEARCH LISTINGS ----

    for post in listings:

        post = json.loads(post["id"])

        text = (post.get("title","") + " " + post.get("description","")).lower()
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
            if post.get("type","").lower() != type.lower():
                continue

        if department:
            post_department = post.get("department","").lower()
            if department not in post_department:
                continue

        results.append(post)

    # ---- SEARCH PROFILES ----

    for profile in profiles:

        text = (
            profile.get("name","") + " " +
            profile.get("bio","") + " " +
            " ".join(profile.get("research_interests",[]))
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
            profile_department = profile.get("department","").lower()
            if department not in profile_department:
                continue

        results.append(profile)

    return results
