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