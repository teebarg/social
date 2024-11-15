from app.models import Tweet
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import requests
from requests_oauthlib import OAuth1
from app.core.config import settings
from requests.exceptions import RequestException
from app.api.deps import (
    SessionDep
)
import time

router = APIRouter()

# Define the Twitter API endpoint for creating tweets
TWITTER_API_URL = "https://api.twitter.com/2/tweets"
# Constants
MAX_RETRIES = 3
BACKOFF_FACTOR = 2  # Exponential backoff factor

# Pydantic model for the tweet content
class TweetRequest(BaseModel):
    content: str

@router.post("/")
async def post_tweet(db: SessionDep, tweet: TweetRequest):
    """
    Endpoint to post a tweet to Twitter with validation, retries, and database logging.

    Args:
        tweet (Tweet): The content of the tweet.
        db (Session): SQLAlchemy database session.

    Returns:
        dict: Response from the Twitter API or error details.
    """
    # Validate content length
    if len(tweet.content) > 280:
        return {"success": False, "error": "Content exceeds the maximum length of 280 characters"}

    # Set up OAuth1 authentication for Twitter
    auth = OAuth1(
        client_key=settings.TWITTER_CONSUMER_KEY,
        client_secret=settings.TWITTER_CONSUMER_SECRET,
        resource_owner_key=settings.TWITTER_ACCESS_TOKEN,
        resource_owner_secret=settings.TWITTER_ACCESS_TOKEN_SECRET,
    )

    # # Create the payload for the tweet
    payload = {
        "text": tweet.content
    }

    retries = 0
    while retries < MAX_RETRIES:
        try:
            # Make the API request
            response = requests.post(TWITTER_API_URL, json=payload, auth=auth)

            if response.status_code == 201:
                # Success: Save to database
                twitter_response = response.json()
                new_tweet = Tweet(
                    content=tweet.content,
                    twitter_id=twitter_response.get('data', {}).get("id")
                )
                db.add(new_tweet)
                db.commit()
                return {"message": "Tweet posted successfully", "tweet": twitter_response}

            elif response.status_code == 429:
                # Rate limit hit: Exponential backoff
                wait_time = BACKOFF_FACTOR ** retries
                time.sleep(wait_time)
                retries += 1
                continue

            else:
                # Other errors
                raise HTTPException(status_code=response.status_code, detail=response.json())

        except RequestException as e:
            retries += 1
            time.sleep(BACKOFF_FACTOR ** retries)
            if retries == MAX_RETRIES:
                raise HTTPException(status_code=500, detail=str(e)) from e

# @router.get("/link-preview")
# def get_link_preview(url: str):
#     try:
#         response = requests.get(url, timeout=5)
#         if response.status_code != 200:
#             raise HTTPException(status_code=400, detail="Failed to fetch URL")

#         soup = BeautifulSoup(response.content, "html.parser")
#         preview = {
#             "title": soup.find("meta", property="og:title")["content"] if soup.find("meta", property="og:title") else "No title",
#             "description": soup.find("meta", property="og:description")["content"] if soup.find("meta", property="og:description") else "No description",
#             "image": soup.find("meta", property="og:image")["content"] if soup.find("meta", property="og:image") else None,
#         }
#         return preview
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))