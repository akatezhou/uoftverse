from fastapi import FastAPI
from search import search

app = FastAPI()

@app.get("/")
def root():
    return {"message": "API running"}

@app.get("/search")
def search_posts(
    q: str | None = None,
    type: str | None = None,
    department: str | None = None
):
    return search(q, type, department)