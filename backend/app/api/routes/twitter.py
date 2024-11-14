from fastapi import FastAPI, APIRouter, HTTPException
from pydantic import BaseModel
import requests
from requests_oauthlib import OAuth1
from app.core.config import settings

router = APIRouter()

# Load Twitter credentials from environment variables
# TWITTER_API_KEY = os.getenv("TWITTER_API_KEY")
# TWITTER_API_SECRET_KEY = os.getenv("TWITTER_API_SECRET_KEY")
# TWITTER_ACCESS_TOKEN = os.getenv("TWITTER_ACCESS_TOKEN")
# TWITTER_ACCESS_TOKEN_SECRET = os.getenv("TWITTER_ACCESS_TOKEN_SECRET")

# Define the Twitter API endpoint for creating tweets
TWITTER_API_URL = "https://api.twitter.com/2/tweets"

# Pydantic model for the tweet content
class TweetRequest(BaseModel):
    content: str

@router.post("/")
async def post_to_twitter(tweet: TweetRequest):
    # Set up OAuth1 authentication for Twitter
    auth = OAuth1(
        settings.TWITTER_API_KEY,
        settings.TWITTER_API_SECRET_KEY,
        settings.TWITTER_ACCESS_TOKEN,
        settings.TWITTER_ACCESS_TOKEN_SECRET,
    )

    # Create the payload for the tweet
    payload = {
        "text": tweet.content
    }

    # Make the POST request to Twitter API
    response = requests.post(TWITTER_API_URL, json=payload, auth=auth)

    # Handle response
    if response.status_code == 201:
        return {"message": "Tweet posted successfully", "tweet": response.json()}
    else:
        raise HTTPException(status_code=response.status_code, detail=response.json())