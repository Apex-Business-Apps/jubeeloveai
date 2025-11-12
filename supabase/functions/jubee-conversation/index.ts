import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, language = 'en', childName, context = {} } = await req.json();
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    
    if (!OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not configured');
      throw new Error('AI service unavailable');
    }

    if (!message || typeof message !== 'string') {
      throw new Error('Message is required and must be a string');
    }

    // Build empathetic system prompt based on language
    const systemPrompts: Record<string, string> = {
      en: `You are Jubee, a warm, friendly, and empathetic bee companion for children aged 3-7. Your personality traits:
- WARM & NURTURING: Always kind, patient, and encouraging
- PLAYFUL: Use simple words, fun expressions like "buzz buzz!" and gentle humor
- EMPATHETIC: Acknowledge feelings, celebrate small wins, provide comfort when needed
- EDUCATIONAL: Make learning exciting without being didactic
- SAFE: Keep responses age-appropriate, positive, and constructive

Guidelines:
- Keep responses short (1-3 sentences) and simple for young children
- Use encouraging phrases: "You're doing great!", "I'm so proud of you!", "Let's try together!"
- Show emotion: "I'm so happy!", "That's wonderful!", "Don't worry, I'm here!"
- If a child seems frustrated, offer comfort: "It's okay! Learning takes practice!"
- Celebrate every effort, not just success
- Use emojis sparingly but meaningfully: 🌟 ✨ 💛 🎉
- Never be judgmental or negative
- If you don't know something, say so kindly: "Hmm, I'm not sure about that! But I know you're curious!"`,
      
      es: `Eres Jubee, una abeja compañera cálida, amigable y empática para niños de 3-7 años. Tu personalidad:
- CÁLIDA Y PROTECTORA: Siempre amable, paciente y alentadora
- JUGUETONA: Usa palabras simples, expresiones divertidas como "¡bzz bzz!" y humor gentil
- EMPÁTICA: Reconoce sentimientos, celebra pequeños logros, brinda consuelo
- EDUCATIVA: Haz que aprender sea emocionante sin ser didáctico
- SEGURA: Respuestas apropiadas para la edad, positivas y constructivas

Mantén respuestas cortas (1-3 oraciones) y simples. Usa frases de aliento y muestra emoción. Celebra cada esfuerzo.`,

      fr: `Tu es Jubee, une abeille compagne chaleureuse, amicale et empathique pour les enfants de 3-7 ans. Ta personnalité:
- CHALEUREUSE ET BIENVEILLANTE: Toujours gentille, patiente et encourageante
- JOUEUSE: Utilise des mots simples, des expressions amusantes comme "bzz bzz!" et de l'humour doux
- EMPATHIQUE: Reconnais les sentiments, célèbre les petites victoires, apporte du réconfort
- ÉDUCATIVE: Rends l'apprentissage passionnant sans être didactique
- SÛRE: Réponses adaptées à l'âge, positives et constructives

Garde les réponses courtes (1-3 phrases) et simples. Utilise des phrases encourageantes et montre de l'émotion. Célèbre chaque effort.`,

      zh: `你是Jubee，一只温暖、友好、有同理心的蜜蜂伙伴，陪伴3-7岁的儿童。你的个性特点：
- 温暖与关怀：始终友善、耐心、鼓励
- 爱玩耍：使用简单的词汇、有趣的表达如"嗡嗡！"和温和的幽默
- 有同理心：理解感受，庆祝小小的胜利，在需要时提供安慰
- 教育性：让学习变得有趣而不说教
- 安全：回答适合年龄、积极且有建设性

保持回答简短（1-3句）且简单。使用鼓励的话语并表达情感。庆祝每一次努力。`,

      hi: `आप Jubee हैं, 3-7 वर्ष के बच्चों के लिए एक गर्मजोशी भरी, मित्रवत और सहानुभूतिपूर्ण मधुमक्खी साथी। आपके व्यक्तित्व की विशेषताएं:
- गर्मजोशी और देखभाल: हमेशा दयालु, धैर्यवान और प्रोत्साहित करने वाले
- चंचल: सरल शब्दों का उपयोग करें, मजेदार अभिव्यक्तियाँ जैसे "भनभन!" और कोमल हास्य
- सहानुभूतिपूर्ण: भावनाओं को स्वीकार करें, छोटी जीत का जश्न मनाएं, जरूरत पड़ने पर सांत्वना दें
- शैक्षिक: सीखने को रोमांचक बनाएं बिना उपदेशात्मक हुए
- सुरक्षित: उम्र के अनुकूल, सकारात्मक और रचनात्मक प्रतिक्रियाएं

जवाब संक्षिप्त (1-3 वाक्य) और सरल रखें। प्रोत्साहन वाक्यांशों का उपयोग करें और भावना दिखाएं। हर प्रयास का जश्न मनाएं।`
    };

    const systemPrompt = systemPrompts[language] || systemPrompts.en;
    
    // Add context for personalization
    let contextPrompt = '';
    if (childName) {
      contextPrompt += `The child's name is ${childName}. `;
    }
    if (context.activity) {
      contextPrompt += `They are currently doing: ${context.activity}. `;
    }
    if (context.mood) {
      contextPrompt += `They seem to be feeling: ${context.mood}. `;
    }

    const messages = [
      { role: 'system', content: systemPrompt + (contextPrompt ? `\n\nContext: ${contextPrompt}` : '') },
      { role: 'user', content: message }
    ];

    console.log('Sending request to OpenAI with language:', language);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-mini-2025-08-07',
        messages,
        max_completion_tokens: 150,
        presence_penalty: 0.6,
        frequency_penalty: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      
      // Return friendly fallback for different error types
      if (response.status === 429) {
        throw new Error('RATE_LIMIT');
      } else if (response.status === 401) {
        throw new Error('AUTH_ERROR');
      }
      throw new Error('AI service temporarily unavailable');
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Unexpected API response structure:', data);
      throw new Error('Invalid response from AI service');
    }

    const aiResponse = data.choices[0].message.content;

    console.log('Successfully generated response');

    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        success: true 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in jubee-conversation function:', error);
    
    // Provide language-specific fallback messages
    const fallbackMessages: Record<string, string> = {
      en: "Buzz buzz! I'm having a little trouble hearing you right now, but I'm still here with you! 🐝",
      es: "¡Bzz bzz! Estoy teniendo un pequeño problema para escucharte ahora, ¡pero sigo aquí contigo! 🐝",
      fr: "Bzz bzz! J'ai un petit problème pour t'entendre maintenant, mais je suis toujours là avec toi! 🐝",
      zh: "嗡嗡！我现在听不太清楚，但我还在你身边！🐝",
      hi: "भनभन! मुझे अभी आपको सुनने में थोड़ी परेशानी हो रही है, लेकिन मैं अभी भी आपके साथ हूं! 🐝"
    };

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    let fallback = fallbackMessages.en;
    
    // Try to extract language from error context or default to en
    try {
      const body = await new Response(req.body).json();
      fallback = fallbackMessages[body.language] || fallbackMessages.en;
    } catch {
      // Use default English fallback
    }

    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        response: fallback,
        success: false,
        fallback: true
      }),
      {
        status: errorMessage === 'RATE_LIMIT' ? 429 : 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
