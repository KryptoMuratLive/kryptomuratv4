import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { StreamSchema } from '@/types';
import { isValidWalletAddress, generateUUID } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, nft_required } = body;
    
    // Get creator wallet from query parameter
    const url = new URL(request.url);
    const creatorWallet = url.searchParams.get('creator_wallet');

    // Validate input
    if (!name || !creatorWallet) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!isValidWalletAddress(creatorWallet)) {
      return NextResponse.json(
        { success: false, error: 'Invalid creator wallet address' },
        { status: 400 }
      );
    }

    // Generate stream IDs
    const streamId = generateUUID();
    const streamKey = `stream_${streamId}`;
    const playbackId = `playback_${streamId}`;

    // For production, you would integrate with Livepeer API here
    // const livepeerResponse = await createLivepeerStream(name, description);

    // Create stream record
    const stream = StreamSchema.parse({
      id: streamId,
      name,
      description: description || '',
      creator_wallet: creatorWallet,
      stream_key: streamKey,
      playback_id: playbackId,
      nft_required: nft_required || false,
      status: 'active',
      created_at: new Date(),
      viewer_count: 0
    });

    // Save to database
    const db = await getDatabase();
    await db.collection('streams').insertOne(stream);

    return NextResponse.json({
      success: true,
      message: 'Stream created successfully',
      data: {
        id: streamId,
        stream_key: streamKey,
        playback_id: playbackId,
        name,
        description
      }
    });

  } catch (error) {
    console.error('Stream creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create stream' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    
    // Get all active streams
    const streams = await db.collection('streams')
      .find({ status: 'active' })
      .sort({ created_at: -1 })
      .toArray();

    // Format streams for frontend
    const formattedStreams = streams.map(stream => ({
      id: stream.id,
      name: stream.name,
      description: stream.description,
      creator_wallet: stream.creator_wallet,
      nft_required: stream.nft_required,
      status: stream.status,
      created_at: stream.created_at,
      viewer_count: stream.viewer_count
    }));

    return NextResponse.json({
      success: true,
      data: formattedStreams
    });

  } catch (error) {
    console.error('Streams fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch streams' },
      { status: 500 }
    );
  }
}