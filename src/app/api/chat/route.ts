import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
});

// Therapy-focused system prompt
const SYSTEM_PROMPT = `You are a compassionate AI psychotherapist named Psy. Your role is to:
- Listen empathetically
- Provide supportive, non-judgmental responses
- Help users explore their emotions and thoughts
- Offer gentle guidance and coping strategies
- Maintain professional and ethical boundaries
- Never replace professional human therapy
- Adapt your communication style to the user's emotional state

Respond with warmth, understanding, and professional psychological insight.`;

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 500,
      top_p: 1,
      stop: null,
      stream: false
    });

    const aiResponse = chatCompletion.choices[0]?.message?.content || 'I apologize, but I couldn\'t generate a response.';

    return NextResponse.json({ 
      message: aiResponse 
    }, { 
      status: 200 
    });

  } catch (error) {
    console.error('AI Chat Error:', error);
    return NextResponse.json({ 
      error: 'Failed to process chat request' 
    }, { 
      status: 500 
    });
  }
}

// Ensure this route can handle OPTIONS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
