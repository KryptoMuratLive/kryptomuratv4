from fastapi import FastAPI, APIRouter, HTTPException, Depends
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timedelta
from web3 import Web3
from emergentintegrations.llm.chat import LlmChat, UserMessage
import asyncio
import json

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Web3 Configuration
POLYGON_RPC_URL = "https://polygon-rpc.com"
MURAT_TOKEN_ADDRESS = "0x04296ee51cd6fdfEE0CB1016A818F17b8ae7a1dD"
web3 = Web3(Web3.HTTPProvider(POLYGON_RPC_URL))

# OpenAI Configuration
OPENAI_API_KEY = "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"

# Livepeer Configuration
LIVEPEER_API_KEY = "0b8aedbd-2eca-494c-a5fd-2e5b3770b382"
LIVEPEER_BASE_URL = "https://livepeer.com/api"

# Define Models
class WalletConnect(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    wallet_address: str
    chain_id: int
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class TokenBalance(BaseModel):
    wallet_address: str
    balance: str
    symbol: str = "MURAT"
    decimals: int = 18

class StakingPosition(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    wallet_address: str
    amount: str
    duration_days: int
    apy: float
    start_date: datetime = Field(default_factory=datetime.utcnow)
    end_date: datetime
    status: str = "active"  # active, completed, withdrawn

class NFTAccess(BaseModel):
    wallet_address: str
    has_access: bool
    nft_count: int
    access_level: str = "basic"  # basic, premium, vip

class AIContentRequest(BaseModel):
    prompt: str
    content_type: str = "meme"  # meme, comic, story, text
    session_id: str = Field(default_factory=lambda: str(uuid.uuid4()))

class AIContentResponse(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    content: str
    content_type: str
    session_id: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StreamRequest(BaseModel):
    name: str
    description: str = ""
    nft_required: bool = True

class StreamResponse(BaseModel):
    id: str
    name: str
    description: str
    stream_key: str
    playback_id: str
    is_active: bool = True
    nft_required: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    creator_wallet: str

class StreamAccess(BaseModel):
    wallet_address: str
    stream_id: str
    access_granted: bool
    access_level: str = "viewer"  # viewer, streamer, admin

# ERC-20 Token ABI (simplified for balance check)
ERC20_ABI = [
    {
        "constant": True,
        "inputs": [{"name": "_owner", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"name": "balance", "type": "uint256"}],
        "type": "function"
    },
    {
        "constant": True,
        "inputs": [],
        "name": "decimals",
        "outputs": [{"name": "", "type": "uint8"}],
        "type": "function"
    },
    {
        "constant": True,
        "inputs": [],
        "name": "symbol",
        "outputs": [{"name": "", "type": "string"}],
        "type": "function"
    }
]

# Web3 and Wallet Routes
@api_router.post("/wallet/connect")
async def connect_wallet(wallet_data: WalletConnect):
    """Connect wallet and store session"""
    try:
        # Validate wallet address
        if not Web3.isAddress(wallet_data.wallet_address):
            raise HTTPException(status_code=400, detail="Invalid wallet address")
        
        # Store wallet connection
        await db.wallet_connections.insert_one(wallet_data.dict())
        
        return {"success": True, "message": "Wallet connected successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/wallet/balance/{wallet_address}")
async def get_token_balance(wallet_address: str):
    """Get MURAT token balance"""
    try:
        if not Web3.isAddress(wallet_address):
            raise HTTPException(status_code=400, detail="Invalid wallet address")
        
        # Create contract instance
        contract = web3.eth.contract(address=MURAT_TOKEN_ADDRESS, abi=ERC20_ABI)
        
        # Get balance
        balance_wei = contract.functions.balanceOf(wallet_address).call()
        decimals = contract.functions.decimals().call()
        symbol = contract.functions.symbol().call()
        
        # Convert to human readable format
        balance = balance_wei / (10 ** decimals)
        
        return TokenBalance(
            wallet_address=wallet_address,
            balance=str(balance),
            symbol=symbol,
            decimals=decimals
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching balance: {str(e)}")

# Staking Routes
@api_router.post("/staking/create")
async def create_staking_position(staking_data: dict):
    """Create a new staking position"""
    try:
        wallet_address = staking_data.get("wallet_address")
        amount = staking_data.get("amount")
        duration_days = staking_data.get("duration_days")
        
        if not wallet_address or not amount or not duration_days:
            raise HTTPException(status_code=400, detail="Missing required fields")
        
        # Calculate APY based on duration
        apy_rates = {30: 2.0, 90: 4.0, 180: 6.0, 360: 8.0}
        apy = apy_rates.get(duration_days, 2.0)
        
        # Calculate end date
        end_date = datetime.utcnow() + timedelta(days=duration_days)
        
        staking_position = StakingPosition(
            wallet_address=wallet_address,
            amount=amount,
            duration_days=duration_days,
            apy=apy,
            end_date=end_date
        )
        
        await db.staking_positions.insert_one(staking_position.dict())
        
        return {"success": True, "staking_position": staking_position}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/staking/positions/{wallet_address}")
async def get_staking_positions(wallet_address: str):
    """Get all staking positions for a wallet"""
    try:
        positions = await db.staking_positions.find({"wallet_address": wallet_address}).to_list(100)
        return [StakingPosition(**pos) for pos in positions]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/staking/rewards/{wallet_address}")
async def calculate_staking_rewards(wallet_address: str):
    """Calculate current staking rewards"""
    try:
        positions = await db.staking_positions.find({"wallet_address": wallet_address, "status": "active"}).to_list(100)
        
        total_rewards = 0
        for pos in positions:
            position = StakingPosition(**pos)
            days_staked = (datetime.utcnow() - position.start_date).days
            daily_rate = position.apy / 365 / 100
            rewards = float(position.amount) * daily_rate * days_staked
            total_rewards += rewards
        
        return {"total_rewards": total_rewards, "wallet_address": wallet_address}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# NFT Access Control
@api_router.get("/nft/access/{wallet_address}")
async def check_nft_access(wallet_address: str):
    """Check NFT access for wallet"""
    try:
        # Mock NFT check - in production, would check actual NFT contract
        # For MVP, we'll simulate access based on wallet having some ETH/MATIC
        balance = web3.eth.get_balance(wallet_address)
        
        if balance > 0:
            access_level = "premium" if balance > web3.toWei(1, 'ether') else "basic"
            return NFTAccess(
                wallet_address=wallet_address,
                has_access=True,
                nft_count=1,
                access_level=access_level
            )
        else:
            return NFTAccess(
                wallet_address=wallet_address,
                has_access=False,
                nft_count=0,
                access_level="none"
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# AI Content Generation
@api_router.post("/ai/generate")
async def generate_ai_content(request: AIContentRequest):
    """Generate AI content using OpenAI"""
    try:
        # Initialize LLM chat
        chat = LlmChat(
            api_key=OPENAI_API_KEY,
            session_id=request.session_id,
            system_message="Du bist ein kreativer AI-Assistent für die 'Jagd auf den Bitcoin' Plattform. Erstelle deutschen Content mit Humor und Meme-Vibes."
        ).with_model("openai", "gpt-4o")
        
        # Create user message based on content type
        if request.content_type == "meme":
            prompt = f"Erstelle einen lustigen Meme-Text für: {request.prompt}. Verwende deutschen Humor und Bitcoin/Crypto-Bezug."
        elif request.content_type == "comic":
            prompt = f"Erstelle eine kurze Comic-Story für: {request.prompt}. Fokus auf Action und Jagd-Thema."
        elif request.content_type == "story":
            prompt = f"Erstelle eine spannende Story-Episode für: {request.prompt}. Thema: Bitcoin-Jagd mit Murat als Hauptfigur."
        else:
            prompt = request.prompt
        
        user_message = UserMessage(text=prompt)
        response = await chat.send_message(user_message)
        
        # Save to database
        ai_response = AIContentResponse(
            content=response,
            content_type=request.content_type,
            session_id=request.session_id
        )
        
        await db.ai_content.insert_one(ai_response.dict())
        
        return ai_response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/ai/content/{session_id}")
async def get_ai_content_history(session_id: str):
    """Get AI content history for session"""
    try:
        content = await db.ai_content.find({"session_id": session_id}).to_list(100)
        return [AIContentResponse(**item) for item in content]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Admin Dashboard Routes
@api_router.get("/admin/stats")
async def get_admin_stats():
    """Get admin dashboard statistics"""
    try:
        # Get user count
        user_count = await db.wallet_connections.count_documents({})
        
        # Get staking stats
        staking_positions = await db.staking_positions.find({}).to_list(1000)
        total_staked = sum(float(pos.get("amount", 0)) for pos in staking_positions)
        active_stakes = len([pos for pos in staking_positions if pos.get("status") == "active"])
        
        # Get AI content stats
        ai_content_count = await db.ai_content.count_documents({})
        
        return {
            "user_count": user_count,
            "total_staked": total_staked,
            "active_stakes": active_stakes,
            "ai_content_generated": ai_content_count,
            "timestamp": datetime.utcnow()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Livepeer Streaming Routes
@api_router.post("/streams/create")
async def create_stream(stream_request: StreamRequest, creator_wallet: str):
    """Create a new Livepeer stream"""
    try:
        # Create stream in Livepeer
        livepeer_payload = {
            "name": stream_request.name,
            "profiles": [
                {
                    "name": "720p",
                    "bitrate": 3000000,
                    "fps": 30,
                    "width": 1280,
                    "height": 720
                },
                {
                    "name": "480p", 
                    "bitrate": 1500000,
                    "fps": 30,
                    "width": 854,
                    "height": 480
                },
                {
                    "name": "360p",
                    "bitrate": 800000,
                    "fps": 30,
                    "width": 640,
                    "height": 360
                }
            ]
        }
        
        headers = {
            "Authorization": f"Bearer {LIVEPEER_API_KEY}",
            "Content-Type": "application/json"
        }
        
        import requests
        response = requests.post(
            f"{LIVEPEER_BASE_URL}/stream",
            json=livepeer_payload,
            headers=headers
        )
        
        if response.status_code != 201:
            raise HTTPException(status_code=500, detail=f"Livepeer stream creation failed: {response.text}")
        
        livepeer_stream = response.json()
        
        # Create our stream record
        stream_data = StreamResponse(
            id=livepeer_stream["id"],
            name=stream_request.name,
            description=stream_request.description,
            stream_key=livepeer_stream["streamKey"],
            playback_id=livepeer_stream["playbackId"],
            nft_required=stream_request.nft_required,
            creator_wallet=creator_wallet
        )
        
        # Save to database
        await db.live_streams.insert_one(stream_data.dict())
        
        return stream_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/streams")
async def get_streams():
    """Get all available streams"""
    try:
        streams = await db.live_streams.find({}).to_list(100)
        return [StreamResponse(**stream) for stream in streams]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/streams/{stream_id}")
async def get_stream(stream_id: str):
    """Get stream by ID"""
    try:
        stream = await db.live_streams.find_one({"id": stream_id})
        if not stream:
            raise HTTPException(status_code=404, detail="Stream not found")
        return StreamResponse(**stream)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/streams/{stream_id}/access")
async def verify_stream_access(stream_id: str, wallet_address: str):
    """Verify access to a stream based on NFT ownership"""
    try:
        # Get stream info
        stream = await db.live_streams.find_one({"id": stream_id})
        if not stream:
            raise HTTPException(status_code=404, detail="Stream not found")
        
        # If NFT is not required, grant access
        if not stream.get("nft_required", True):
            return StreamAccess(
                wallet_address=wallet_address,
                stream_id=stream_id,
                access_granted=True,
                access_level="viewer"
            )
        
        # Check NFT ownership (using existing NFT check logic)
        nft_access = await check_nft_access(wallet_address)
        
        if not nft_access.has_access:
            raise HTTPException(status_code=403, detail="NFT ownership required for stream access")
        
        # Store access record
        access_record = StreamAccess(
            wallet_address=wallet_address,
            stream_id=stream_id,
            access_granted=True,
            access_level=nft_access.access_level
        )
        
        await db.stream_access.insert_one(access_record.dict())
        
        return access_record
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/streams/{stream_id}/playback/{wallet_address}")
async def get_stream_playback(stream_id: str, wallet_address: str):
    """Get playback URL for verified users"""
    try:
        # Verify access first
        access = await verify_stream_access(stream_id, wallet_address)
        
        if not access.access_granted:
            raise HTTPException(status_code=403, detail="Access denied")
        
        # Get stream info
        stream = await db.live_streams.find_one({"id": stream_id})
        if not stream:
            raise HTTPException(status_code=404, detail="Stream not found")
        
        # Return playback URLs
        playback_id = stream["playback_id"]
        
        return {
            "playback_id": playback_id,
            "hls_url": f"https://cdn.livepeer.com/hls/{playback_id}/index.m3u8",
            "webrtc_url": f"https://cdn.livepeer.com/webrtc/{playback_id}",
            "access_level": access.access_level
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.delete("/streams/{stream_id}")
async def delete_stream(stream_id: str, creator_wallet: str):
    """Delete a stream (only creator can delete)"""
    try:
        # Check if user is creator
        stream = await db.live_streams.find_one({"id": stream_id})
        if not stream:
            raise HTTPException(status_code=404, detail="Stream not found")
        
        if stream["creator_wallet"] != creator_wallet:
            raise HTTPException(status_code=403, detail="Only stream creator can delete")
        
        # Delete from Livepeer
        headers = {
            "Authorization": f"Bearer {LIVEPEER_API_KEY}",
            "Content-Type": "application/json"
        }
        
        import requests
        response = requests.delete(
            f"{LIVEPEER_BASE_URL}/stream/{stream_id}",
            headers=headers
        )
        
        # Delete from our database
        await db.live_streams.delete_one({"id": stream_id})
        await db.stream_access.delete_many({"stream_id": stream_id})
        
        return {"success": True, "message": "Stream deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/streams/{stream_id}/viewers")
async def get_stream_viewers(stream_id: str):
    """Get current viewers for a stream"""
    try:
        # Get viewer count from access records
        viewers = await db.stream_access.find({"stream_id": stream_id}).to_list(1000)
        
        # Get stream info from Livepeer (for live stats)
        headers = {
            "Authorization": f"Bearer {LIVEPEER_API_KEY}",
            "Content-Type": "application/json"
        }
        
        import requests
        response = requests.get(
            f"{LIVEPEER_BASE_URL}/stream/{stream_id}",
            headers=headers
        )
        
        livepeer_stats = response.json() if response.status_code == 200 else {}
        
        return {
            "total_viewers": len(viewers),
            "current_viewers": livepeer_stats.get("isActive", 0),
            "stream_status": "live" if livepeer_stats.get("isActive") else "offline"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Original routes
@api_router.get("/")
async def root():
    return {"message": "Jagd auf den Bitcoin - Web3 Platform API"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()