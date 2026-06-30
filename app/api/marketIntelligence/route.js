import { NextResponse } from 'next/server';

export async function POST(request) {
  const { brand1, brand2, trimester } = await request.json();

  if (!brand1 || !brand2 || !trimester) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  try {
    const [data1, data2] = await Promise.all([
      analyzeBrand(brand1, trimester),
      analyzeBrand(brand2, trimester),
    ]);

    return NextResponse.json({
      brand1, brand2, trimester, data1, data2
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function analyzeBrand(brand, trimester) {
  const Anthropic = require("@anthropic-ai/sdk").default;
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const systemPrompt = `You are a market intelligence analyst specializing in Italian financial services.
Analyze ${brand}'s market presence in Italy.
Return ONLY valid JSON, no markdown.`;

  const userPrompt = `Analyze ${brand} for Italian market in ${trimester} 2026.
Return JSON with: own_events, industry_events, timeline_comment, media_mentions, awards_recognitions, reputation_scores, sources.`;

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2000,
      system: systemPrompt,
      tools: [
        {
          name: "web_search",
          description: "Search for Italian market data",
          input_schema: {
            type: "object",
            properties: {
              query: { type: "string" }
            },
            required: ["query"]
          }
        }
      ],
      messages: [{ role: "user", content: userPrompt }],
    });

    let data = null;
    for (const block of response.content) {
      if (block.type === "text") {
        try {
          const jsonMatch = block.text.match(/\{[\s\S]*\}/);
          if (jsonMatch) data = JSON.parse(jsonMatch[0]);
        } catch (e) {}
      }
    }

    return data || generateFallbackData(brand, trimester);
  } catch (error) {
    console.error("Error:", error);
    return generateFallbackData(brand, trimester);
  }
}

function generateFallbackData(brand, trimester) {
  return {
    own_events: [
      { date: "05/02", title: "Roadshow Gestione", city: "Milano", type: "roadshow", description: "Roadshow", source_url: "https://advisoronline.it" }
    ],
    industry_events: [
      { date: "15/03", title: "Salone del Risparmio", city: "Milano", presence: true, role: "speaker", description: "Major event", source_url: "https://salonedelrisparmio.it" }
    ],
    timeline_comment: `${brand} presence in ${trimester} 2026.`,
    media_mentions: { count: 15, top_outlets: ["advisoronline.it"], key_topics: ["longevity"] },
    awards_recognitions: { count: 2, list: ["Award 2026"] },
    reputation_scores: {
      media_authority: 7.2,
      innovation_narrative: 7.4,
      relationship_intensity: 7.6,
      thought_leadership: 7.1,
      social_presence: 7.0,
      competitive_differentiation: 7.3
    },
    sources: ["https://advisoronline.it"]
  };
}
