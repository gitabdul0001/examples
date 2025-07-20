import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { modelenceQuery, modelenceMutation } from '@modelence/react-query';
import { toast } from 'react-hot-toast';
import { Copy, Trash2, Calendar, Hash } from 'lucide-react';
import Button from './Button';
import Card from './Card';

export default function PostHistory() {
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(
    modelenceQuery('posts.getMyPosts', {
      page: currentPage,
      limit: 10,
      platform: selectedPlatform === 'all' ? undefined : selectedPlatform,
    })
  );

  const { mutateAsync: deletePost } = useMutation(modelenceMutation('posts.deletePost'));

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await deletePost({ postId });
      queryClient.invalidateQueries({ queryKey: ['posts.getMyPosts'] });
      toast.success('Post deleted successfully');
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success('Copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPlatformColor = (platform: string) => {
    const colors = {
      twitter: 'bg-blue-100 text-blue-800',
      linkedin: 'bg-blue-100 text-blue-800',
      facebook: 'bg-blue-100 text-blue-800',
      instagram: 'bg-pink-100 text-pink-800',
    };
    return colors[platform as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getToneColor = (tone: string) => {
    const colors = {
      professional: 'bg-gray-100 text-gray-800',
      casual: 'bg-green-100 text-green-800',
      funny: 'bg-yellow-100 text-yellow-800',
      inspirational: 'bg-purple-100 text-purple-800',
      promotional: 'bg-red-100 text-red-800',
    };
    return colors[tone as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <Card>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading your posts...</p>
        </div>
      </Card>
    );
  }

  const posts = data?.posts || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Your Posts</h2>
          <select
            value={selectedPlatform}
            onChange={(e) => {
              setSelectedPlatform(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Platforms</option>
            <option value="twitter">Twitter</option>
            <option value="linkedin">LinkedIn</option>
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
          </select>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No posts found. Generate your first post!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post: any) => (
              <div
                key={post._id}
                className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPlatformColor(post.platform)}`}>
                      {post.platform}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getToneColor(post.tone)}`}>
                      {post.tone}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(post.content)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(post._id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-gray-900 whitespace-pre-wrap">{post.content}</p>
                </div>

                {post.hashtags && post.hashtags.length > 0 && (
                  <div className="flex items-center space-x-2 mb-3">
                    <Hash className="w-4 h-4 text-gray-400" />
                    <div className="flex flex-wrap gap-1">
                      {post.hashtags.map((hashtag: string, index: number) => (
                        <span
                          key={index}
                          className="text-blue-600 text-sm"
                        >
                          #{hashtag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                  <div className="text-xs">
                    Prompt: {post.prompt.length > 50 ? `${post.prompt.substring(0, 50)}...` : post.prompt}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {pagination && pagination.pages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {pagination.pages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(pagination.pages, prev + 1))}
              disabled={currentPage === pagination.pages}
            >
              Next
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}