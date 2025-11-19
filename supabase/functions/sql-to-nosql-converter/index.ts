// SQL to NOSQL Converter Edge Function
// Converts SQL queries to MongoDB equivalents with multiple approaches

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface ConversionRequest {
  sql_query: string;
  query_type?: string;
}

interface MongoDBApproach {
  title: string;
  code: string;
  pros: string[];
  cons: string[];
  use_case: string;
}

interface ConversionResponse {
  primary_mongodb: string;
  approaches: MongoDBApproach[];
  explanation: string;
  notes: string[];
  schema_suggestions?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sql_query, query_type }: ConversionRequest = await req.json();

    if (!sql_query) {
      return new Response(
        JSON.stringify({ error: 'SQL query is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create comprehensive prompt for GPT-4
    const prompt = `You are an expert database architect specializing in SQL to MongoDB conversions.

Convert the following SQL query to MongoDB equivalents. Provide MULTIPLE approaches when applicable (especially for JOINs).

SQL Query:
${sql_query}

${query_type ? `Query Type: ${query_type}` : ''}

Provide a JSON response with the following structure:
{
  "primary_mongodb": "The most straightforward MongoDB equivalent code",
  "approaches": [
    {
      "title": "Approach name (e.g., 'Embedded Documents', 'Referenced Collections with $lookup', 'Denormalization')",
      "code": "MongoDB code for this approach",
      "pros": ["Advantage 1", "Advantage 2"],
      "cons": ["Disadvantage 1", "Disadvantage 2"],
      "use_case": "When to use this approach"
    }
  ],
  "explanation": "Detailed explanation of the conversion, key differences between SQL and MongoDB approaches",
  "notes": ["Important consideration 1", "Important consideration 2"],
  "schema_suggestions": "Suggestions for schema design in MongoDB (optional, for complex queries)"
}

IMPORTANT:
1. For JOINs, provide at least 2-3 different approaches (embedded documents, $lookup, denormalization)
2. Explain trade-offs between approaches (performance, data consistency, complexity)
3. For aggregations, show the full aggregation pipeline
4. Include proper MongoDB operators ($gt, $lt, $in, $match, $group, $lookup, etc.)
5. Suggest when to denormalize vs normalize data
6. Consider read/write patterns in recommendations
7. Use proper MongoDB syntax (db.collection.method())
8. For complex queries, suggest schema design improvements

Return ONLY valid JSON, no markdown formatting.`;

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert database architect specializing in SQL to MongoDB conversions. Always respond with valid JSON only, no markdown formatting.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.text();
      console.error('OpenAI API error:', errorData);
      return new Response(
        JSON.stringify({ error: 'AI conversion failed', details: errorData }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiResult = await openaiResponse.json();
    const aiContent = aiResult.choices[0].message.content.trim();
    
    // Parse AI response
    let conversionData: ConversionResponse;
    try {
      // Remove markdown code blocks if present
      const cleanedContent = aiContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      conversionData = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiContent);
      return new Response(
        JSON.stringify({ error: 'Failed to parse AI response', raw: aiContent }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Return conversion result
    return new Response(
      JSON.stringify({ data: conversionData }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Conversion error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Conversion failed',
        details: error.toString()
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
