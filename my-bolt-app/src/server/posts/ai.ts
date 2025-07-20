import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

interface GeneratePostOptions {
  prompt: string;
  platform: string;
  tone: string;
  includeHashtags?: boolean;
}

export async function generateSocialMediaPost({
  prompt,
  platform,
  tone,
  includeHashtags = true
}: GeneratePostOptions) {
  const platformLimits = {
    twitter: 280,
    linkedin: 3000,
    facebook: 2000,
    instagram: 2200
  };

  const limit = platformLimits[platform as keyof typeof platformLimits] || 280;

  const systemPrompt = `You are an expert social media content creator. Generate engaging ${platform} posts with the following requirements:

Platform: ${platform}
Tone: ${tone}
Character limit: ${limit}
Include hashtags: ${includeHashtags ? 'Yes' : 'No'}

Guidelines:
- Keep within character limits
- Match the specified tone
- Make it engaging and shareable
- Use appropriate formatting for ${platform}
- ${includeHashtags ? 'Include 3-5 relevant hashtags at the end' : 'Do not include hashtags'}
- For LinkedIn: Use professional language and insights
- For Twitter: Be concise and punchy
- For Instagram: Be visual and lifestyle-focused
- For Facebook: Be conversational and community-focused

Return only the post content, no additional text or explanations.`;

  const { text } = await generateText({
    model: openai('gpt-4o'),
    system: systemPrompt,
    prompt: prompt,
    maxTokens: 500,
  });

  // Extract hashtags if they exist
  const hashtagRegex = /#\w+/g;
  const hashtags = text.match(hashtagRegex) || [];
  const cleanHashtags = hashtags.map(tag => tag.substring(1)); // Remove # symbol

  return {
    content: text,
    hashtags: cleanHashtags,
  };
}

export async function improveSocialMediaPost(originalPost: string, improvementType: string) {
  const systemPrompt = `You are a social media expert. Improve the following post based on the improvement type: ${improvementType}

Improvement types:
- "engagement": Make it more engaging and interactive
- "professional": Make it more professional and polished
- "casual": Make it more casual and relatable
- "shorter": Make it more concise
- "longer": Add more detail and context
- "hashtags": Optimize hashtags for better reach

Return only the improved post content.`;

  const { text } = await generateText({
    model: openai('gpt-4o'),
    system: systemPrompt,
    prompt: originalPost,
    maxTokens: 500,
  });

  return text;
}