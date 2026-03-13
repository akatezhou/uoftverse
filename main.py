from fastapi import FastAPI
from search import search

app = FastAPI()

@app.get("/")
def root():
    return {"message": "UofTVerse API running"}

@app.get("/search")
def search_endpoint(
    q: str = None,
    type: str = None,
    department: str = None,
    entity: str = "all"
):
    results = search(
        query=q,
        type=type,
        department=department,
        entity=entity
    )

    return results
