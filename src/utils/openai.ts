import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function transformHeadlineToPoetry(headline: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a poetic summarizer. I will give you a news headline. Your task is to turn this into a short, poetic, emotionally ambiguous phrase (max 7 words) that could work as the first and last line of a Skinny poem.

Rules:
- Do NOT summarize literally.
- Focus on metaphor, emotional tone, or symbolic abstraction.
- Avoid names, locations, or time markers.
- Be open-ended enough to spark multiple meanings.

Example:
Headline: "UN warns of irreversible climate tipping points"
Poetic phrase: "The edge won't wait for us"`
        },
        {
          role: "user",
          content: headline
        }
      ],
      max_tokens: 20,
      temperature: 0.8
    });

    return response.choices[0]?.message?.content?.trim() || headline;
  } catch (error) {
    console.error('Error transforming headline:', error);
    // Fallback to original headline if API fails
    return headline;
  }
}

export async function generatePoem(whisper: string, anchor: string, feeling: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a poet creating "Skinny poems" - minimalist, emotionally resonant verses. Create a poem using these elements:

- Whisper (opening theme): "${whisper}"
- Anchor word: "${anchor}"
- Personal feeling: "${feeling}"

Style guidelines:
- 3-4 lines maximum
- Use simple, powerful language
- Focus on emotion and imagery
- Include the anchor word naturally
- End with quiet resolution or acceptance
- Avoid rhyming or forced meter`
        },
        {
          role: "user",
          content: `Create a Skinny poem with whisper: "${whisper}", anchor: "${anchor}", feeling: "${feeling}"`
        }
      ],
      max_tokens: 100,
      temperature: 0.7
    });

    return response.choices[0]?.message?.content?.trim() || `In the quiet space where ${whisper.toLowerCase()} meets the dawn,
I ${anchor} into the knowing that ${feeling.toLowerCase()}.
Each breath carries the weight of what we cannot name,
yet in this moment, we are enough.`;
  } catch (error) {
    console.error('Error generating poem:', error);
    // Fallback poem if API fails
    return `In the quiet space where ${whisper.toLowerCase()} meets the dawn,
I ${anchor} into the knowing that ${feeling.toLowerCase()}.
Each breath carries the weight of what we cannot name,
yet in this moment, we are enough.`;
  }
}