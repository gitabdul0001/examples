import { Module, ObjectId } from 'modelence/server';
import { z } from 'zod';
import { dbPosts, dbTemplates } from './db';
import { generateSocialMediaPost, improveSocialMediaPost } from './ai';

export default new Module('posts', {
  stores: [dbPosts, dbTemplates],
  queries: {
    getMyPosts: {
      async handler(args, { user }) {
        if (!user) throw new Error('Authentication required');
        
        const { page = 1, limit = 10, platform } = z.object({
          page: z.number().optional(),
          limit: z.number().optional(),
          platform: z.string().optional(),
        }).parse(args);

        const filter: any = { userId: new ObjectId(user.id) };
        if (platform && platform !== 'all') {
          filter.platform = platform;
        }

        const posts = await dbPosts.fetch(filter, {
          sort: { createdAt: -1 },
          skip: (page - 1) * limit,
          limit,
        });

        const total = await dbPosts.countDocuments(filter);

        return {
          posts,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        };
      },
    },
    getTemplates: {
      async handler(args, { user }) {
        const { platform = 'all' } = z.object({
          platform: z.string().optional(),
        }).parse(args);

        const filter: any = {
          $or: [
            { isPublic: true },
            ...(user ? [{ userId: new ObjectId(user.id) }] : []),
          ],
        };

        if (platform !== 'all') {
          filter.platform = { $in: [platform, 'all'] };
        }

        return await dbTemplates.fetch(filter, {
          sort: { createdAt: -1 },
        });
      },
    },
  },
  mutations: {
    generatePost: {
      async handler(args, { user }) {
        const { prompt, platform, tone, includeHashtags = true } = z.object({
          prompt: z.string().min(1),
          platform: z.enum(['twitter', 'linkedin', 'facebook', 'instagram']),
          tone: z.enum(['professional', 'casual', 'funny', 'inspirational', 'promotional']),
          includeHashtags: z.boolean().optional(),
        }).parse(args);

        const result = await generateSocialMediaPost({
          prompt,
          platform,
          tone,
          includeHashtags,
        });

        // Save the generated post if user is authenticated
        if (user) {
          const { insertedId } = await dbPosts.insertOne({
            userId: new ObjectId(user.id),
            content: result.content,
            platform,
            tone,
            hashtags: result.hashtags,
            prompt,
            createdAt: new Date(),
            updatedAt: new Date(),
            isPublished: false,
          });

          return {
            ...result,
            postId: insertedId.toString(),
          };
        }

        return result;
      },
    },
    improvePost: {
      async handler(args, { user }) {
        const { postId, improvementType } = z.object({
          postId: z.string(),
          improvementType: z.enum(['engagement', 'professional', 'casual', 'shorter', 'longer', 'hashtags']),
        }).parse(args);

        const post = await dbPosts.requireOne({
          _id: new ObjectId(postId),
          ...(user ? { userId: new ObjectId(user.id) } : {}),
        });

        const improvedContent = await improveSocialMediaPost(post.content, improvementType);

        // Extract hashtags from improved content
        const hashtagRegex = /#\w+/g;
        const hashtags = improvedContent.match(hashtagRegex) || [];
        const cleanHashtags = hashtags.map(tag => tag.substring(1));

        // Update the post
        await dbPosts.updateOne(
          { _id: new ObjectId(postId) },
          {
            $set: {
              content: improvedContent,
              hashtags: cleanHashtags,
              updatedAt: new Date(),
            },
          }
        );

        return {
          content: improvedContent,
          hashtags: cleanHashtags,
        };
      },
    },
    savePost: {
      async handler(args, { user }) {
        if (!user) throw new Error('Authentication required');

        const { postId, content, hashtags } = z.object({
          postId: z.string(),
          content: z.string(),
          hashtags: z.array(z.string()).optional(),
        }).parse(args);

        await dbPosts.updateOne(
          {
            _id: new ObjectId(postId),
            userId: new ObjectId(user.id),
          },
          {
            $set: {
              content,
              hashtags: hashtags || [],
              updatedAt: new Date(),
            },
          }
        );

        return { success: true };
      },
    },
    deletePost: {
      async handler(args, { user }) {
        if (!user) throw new Error('Authentication required');

        const { postId } = z.object({
          postId: z.string(),
        }).parse(args);

        await dbPosts.deleteOne({
          _id: new ObjectId(postId),
          userId: new ObjectId(user.id),
        });

        return { success: true };
      },
    },
    createTemplate: {
      async handler(args, { user }) {
        if (!user) throw new Error('Authentication required');

        const { name, prompt, platform, tone, isPublic = false } = z.object({
          name: z.string().min(1),
          prompt: z.string().min(1),
          platform: z.enum(['twitter', 'linkedin', 'facebook', 'instagram', 'all']),
          tone: z.enum(['professional', 'casual', 'funny', 'inspirational', 'promotional']),
          isPublic: z.boolean().optional(),
        }).parse(args);

        const { insertedId } = await dbTemplates.insertOne({
          userId: new ObjectId(user.id),
          name,
          prompt,
          platform,
          tone,
          isPublic,
          createdAt: new Date(),
        });

        return { templateId: insertedId.toString() };
      },
    },
  },
});