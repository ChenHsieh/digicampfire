import OpenAI from 'openai';
import { createFallbackSkinnyPoem } from './helpers';
import { HEADLINE_TRANSFORM_PROMPT } from '../prompts/headlineTransform';
import { ANCHOR_GENERATION_PROMPT } from '../prompts/anchorGeneration';
import { POEM_GENERATION_PROMPT } from '../prompts/poemGeneration';

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
          content: HEADLINE_TRANSFORM_PROMPT
        },
        {
          role: "user",
          content: headline
        }
      ],
      max_tokens: 50,
      temperature: 0.8
    });

    const result = response.choices[0]?.message?.content?.trim();
    if (!result) {
      throw new Error('No content returned from OpenAI');
    }
    
    return result;
  } catch (error) {
    console.error('Error transforming headline:', error);
    return createPoetricFallback(headline);
  }
}

function createPoetricFallback(headline: string): string {
  const lowerHeadline = headline.toLowerCase();
  
  if (lowerHeadline.includes('climate') || lowerHeadline.includes('environment')) {
    return "the weight of tomorrow's sky";
  } else if (lowerHeadline.includes('war') || lowerHeadline.includes('conflict')) {
    return "echoes of distant thunder";
  } else if (lowerHeadline.includes('economy') || lowerHeadline.includes('market')) {
    return "the pulse of uncertain tides";
  } else if (lowerHeadline.includes('technology') || lowerHeadline.includes('digital')) {
    return "fragments of electric dreams";
  } else if (lowerHeadline.includes('health') || lowerHeadline.includes('medical')) {
    return "light through healing hands";
  } else {
    return "the space between what was and what could be";
  }
}

export async function generateAnchorWords(): Promise<string[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: ANCHOR_GENERATION_PROMPT
        },
        {
          role: "user",
          content: "Generate 6 new anchor words for poetry"
        }
      ],
      max_tokens: 50,
      temperature: 0.8
    });

    const content = response.choices[0]?.message?.content?.trim();
    if (!content) {
      throw new Error('No content returned from OpenAI');
    }

    const words = content.split('\n').filter(word => word.trim()).map(word => word.trim().toLowerCase());
    return words.length >= 6 ? words.slice(0, 6) : [];
  } catch (error) {
    console.error('Error generating anchor words:', error);
    return [];
  }
}

export async function validateSkinnyPoem(poem: string, anchor: string): Promise<{ isValid: boolean; issues: string[] }> {
  const lines = poem.split('\n').filter(line => line.trim() !== '');
  const issues: string[] = [];

  // Check line count
  if (lines.length !== 11) {
    issues.push(`Must have exactly 11 lines (found ${lines.length})`);
  }

  if (lines.length >= 11) {
    // Check that lines 2-10 are single words
    for (let i = 1; i <= 9; i++) {
      if (lines[i] && lines[i].trim().split(/\s+/).length > 1) {
        issues.push(`Line ${i + 1} must be a single word`);
      }
    }

    // Check anchor word appears in positions 2, 6, 10 (indices 1, 5, 9)
    const anchorPositions = [1, 5, 9];
    for (const pos of anchorPositions) {
      if (lines[pos] && lines[pos].trim().toLowerCase() !== anchor.toLowerCase()) {
        issues.push(`Line ${pos + 1} must be the anchor word "${anchor}"`);
      }
    }

    // Check first and last lines are related (contain similar words)
    if (lines[0] && lines[10]) {
      const firstWords = lines[0].toLowerCase().split(/\s+/);
      const lastWords = lines[10].toLowerCase().split(/\s+/);
      const commonWords = firstWords.filter(word => lastWords.includes(word));

      if (commonWords.length === 0) {
        issues.push('First and last lines should share some words or be variations of each other');
      }
    }
  }

  return {
    isValid: issues.length === 0,
    issues
  };
}

export async function generateSkinnyPoem(whisper: string, anchor: string, feeling: string): Promise<string> {
  console.log('Starting poem generation with:', { whisper, anchor, feeling });
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: POEM_GENERATION_PROMPT(whisper, anchor, feeling)
        },
        {
          role: "user",
          content: `Create a Skinny poem using:
Whisper: "${whisper}"
Anchor: "${anchor}"
Feeling: "${feeling}"`
        }
      ],
      max_tokens: 200,
      temperature: 0.7
    });

    const content = response.choices[0]?.message?.content?.trim();
    if (!content) {
      console.error('No content returned from OpenAI');
      return createFallbackSkinnyPoem(whisper, anchor, feeling);
    }

    console.log('Generated poem:', content);

    // Validate the generated poem
    const validation = await validateSkinnyPoem(content, anchor);
    if (!validation.isValid) {
      console.warn('Generated poem failed validation:', validation.issues);
      console.log('Using fallback poem instead');
      return createFallbackSkinnyPoem(whisper, anchor, feeling);
    }

    console.log('Poem validation passed');
    return content;

  } catch (error) {
    console.error('Error generating Skinny poem:', error);
    console.log('Using fallback poem due to error');
    return createFallbackSkinnyPoem(whisper, anchor, feeling);
  }
}