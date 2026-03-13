import numpy as np
from embeddings import embed

def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

def rank_posts(query_embedding, posts):

    scored = []

    for post in posts:

        text = post["title"] + " " + post["description"]

        post_embedding = embed(text)

        score = cosine_similarity(query_embedding, post_embedding)

        scored.append((score, post))

    scored.sort(reverse=True)

    return [p for _, p in scored]