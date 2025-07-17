import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { AIContentSchema } from '@/types';
import { generateUUID } from '@/lib/utils';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { prompt, content_type, wallet_address } = body;

    // Validate input
    if (!prompt || !content_type || !wallet_address) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let generatedContent: string;

    try {
      // Generate AI content using OpenAI
      const systemMessage = getSystemMessage(content_type);
      
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: prompt }
        ],
        max_tokens: 500,
        temperature: 0.8,
      });

      generatedContent = completion.choices[0]?.message?.content || 'AI content generation failed';

    } catch (openaiError) {
      console.error('OpenAI API error:', openaiError);
      
      // Fallback to mock content
      generatedContent = getMockContent(content_type, prompt);
    }

    // Save to database
    const aiContent = AIContentSchema.parse({
      id: generateUUID(),
      wallet_address,
      prompt,
      content_type,
      content: generatedContent,
      session_id: generateUUID(),
      created_at: new Date()
    });

    const db = await getDatabase();
    await db.collection('ai_content').insertOne(aiContent);

    return NextResponse.json({
      success: true,
      data: {
        content: generatedContent,
        content_type,
        session_id: aiContent.session_id
      }
    });

  } catch (error) {
    console.error('AI content generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate AI content' },
      { status: 500 }
    );
  }
}

function getSystemMessage(contentType: string): string {
  switch (contentType) {
    case 'meme':
      return 'Du bist ein Meme-Generator. Erstelle lustige, kurze Meme-Texte auf Deutsch mit Bitcoin/Crypto-Bezug.';
    case 'comic':
      return 'Du bist ein Comic-Autor. Erstelle kurze, unterhaltsame Comic-Szenen auf Deutsch mit Krypto-Themen.';
    case 'story':
      return 'Du bist ein Storyteller. Erstelle spannende, kurze Geschichten auf Deutsch über Bitcoin und Kryptowährungen.';
    case 'text':
      return 'Du bist ein Content-Creator. Erstelle informativen, interessanten Text auf Deutsch über Krypto-Themen.';
    default:
      return 'Du bist ein hilfreicher Assistent. Erstelle Content auf Deutsch.';
  }
}

function getMockContent(contentType: string, prompt: string): string {
  const mockContents = {
    meme: `🚀 MEME ALERT! 🚀\n\n"${prompt}"\n\n*Hodler-Modus aktiviert*\n💎🙌 Diamond Hands Forever!\n\n#Bitcoin #KryptoMurat #ToTheMoon`,
    comic: `🎭 COMIC STRIP 🎭\n\nPanel 1: "${prompt}"\nPanel 2: "Aber dann kam der Bitcoin-Crash..."\nPanel 3: "HODL! 💎🙌"\nPanel 4: "Und sie lebten glücklich bis ans Ende ihrer Tage!"`,
    story: `📖 KRYPTO-GESCHICHTE 📖\n\nEs war einmal in der Welt der Kryptowährungen...\n\n"${prompt}"\n\nUnd so begann das größte Abenteuer der digitalen Welt. Bitcoin stieg und fiel, aber unsere Helden hielten durch. Am Ende gewannen sie nicht nur Gold, sondern auch Weisheit.\n\nENDE`,
    text: `📝 KRYPTO-CONTENT 📝\n\nThema: ${prompt}\n\nDie Welt der Kryptowährungen ist voller Möglichkeiten. Bitcoin hat den Weg geebnet für eine neue Art des Geldes. Heute erleben wir eine Revolution im Finanzwesen.\n\nKryptoMurat hilft dir dabei, diese Welt zu verstehen und zu navigieren. Mit Features wie Staking, NFTs und AI-Content sind wir bereit für die Zukunft!`
  };

  return mockContents[contentType as keyof typeof mockContents] || `Mock content für: ${prompt}`;
}