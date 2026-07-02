import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const maxDuration = 60;

export async function POST(request) {
  const { brands, period } = await request.json();

  if (!brands || brands.length < 2) {
    return NextResponse.json({ error: 'Min 2 brands required' }, { status: 400 });
  }

  try {
    const brandPromises = brands.map(brand => analyzeBrand(brand, period));
    const results = await Promise.allSettled(brandPromises);

    const reportData = {
      period,
      brands: brands.reduce((acc, brand, idx) => {
        const result = results[idx];
        if (result.status === 'fulfilled') {
          acc[brand] = result.value;
        } else {
          acc[brand] = { error: result.reason?.message || 'Analisi non disponibile' };
        }
        return acc;
      }, {})
    };

    return NextResponse.json(reportData);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function analyzeBrand(brand, period) {
  const userPrompt = `Fornisci un'analisi completa di ${brand} nel mercato italiano durante ${period}.

Ricerca online e fornisci:
1. Tutti gli eventi organizzati o sponsorizzati
2. Partecipazioni a eventi di settore
3. Awards e riconoscimenti ricevuti
4. Copertura mediatica italiana
5. Positioning e narrative ufficiale

Rispondi ESCLUSIVAMENTE con un oggetto JSON valido, senza testo prima o dopo, senza markdown, senza backtick. Solo JSON puro:
{
  "events": [
    {"date": "DD/MM/YYYY", "title": "nome evento", "city": "città", "type": "tipo", "link": "url se disponibile"}
  ],
  "awards": ["award1", "award2"],
  "mentions": 0,
  "top_outlets": ["testata1", "testata2"],
  "positioning": "descrizione positioning basata su ricerca",
  "key_topics": ["tema1", "tema2"]
}`;

  const response = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 3000,
    tools: [
      {
        name: 'brand_analysis',
        description: 'Restituisce l\'analisi strutturata del brand',
        input_schema: {
          type: 'object',
          properties: {
            events: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  date: { type: 'string' },
                  title: { type: 'string' },
                  city: { type: 'string' },
                  type: { type: 'string' },
                  link: { type: 'string' }
                },
                required: ['date', 'title', 'city', 'type']
              }
            },
            awards: { type: 'array', items: { type: 'string' } },
            mentions: { type: 'number' },
            top_outlets: { type: 'array', items: { type: 'string' } },
            positioning: { type: 'string' },
            key_topics: { type: 'array', items: { type: 'string' } }
          },
          required: ['events', 'awards', 'mentions', 'top_outlets', 'positioning', 'key_topics']
        }
      }
    ],
    tool_choice: { type: 'tool', name: 'brand_analysis' },
    messages: [{ role: 'user', content: userPrompt }]
  });

  const toolUseBlock = response.content.find(block => block.type === 'tool_use');

  if (!toolUseBlock || !toolUseBlock.input) {
    for (const block of response.content) {
      if (block.type === 'text') {
        const mdMatch = block.text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
        const rawMatch = block.text.match(/\{[\s\S]*\}/);
        const jsonStr = mdMatch ? mdMatch[1] : rawMatch ? rawMatch[0] : null;
        if (jsonStr) {
          try {
            return JSON.parse(jsonStr);
          } catch (e) {
            // continua
          }
        }
      }
    }
    throw new Error('No valid JSON in response');
  }

  return toolUseBlock.input;
}
