import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { modelenceMutation, modelenceQuery } from '@modelence/react-query';
import { toast } from 'react-hot-toast';
import { Wand2, Copy, RefreshCw, Save, Trash2 } from 'lucide-react';
import Button from './Button';
import Card from './Card';

interface GeneratedPost {
  content: string;
  hashtags: string[];
  postId?: string;
}

export default function PostGenerator() {
  const [prompt, setPrompt] = useState('');
  const [platform, setPlatform] = useState<'twitter' | 'linkedin' | 'facebook' | 'instagram'>('twitter');
  const [tone, setTone] = useState<'professional' | 'casual' | 'funny' | 'inspirational' | 'promotional'>('professional');
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [generatedPost, setGeneratedPost] = useState<GeneratedPost | null>(null);
  const [editableContent, setEditableContent] = useState('');

  const { data: templates } = useQuery(modelenceQuery('posts.getTemplates', { platform }));

  const { mutateAsync: generatePost, isPending: isGenerating } = useMutation(
    modelenceMutation('posts.generatePost')
  );

  const { mutateAsync: improvePost, isPending: isImproving } = useMutation(
    modelenceMutation('posts.improvePost')
  );

  const { mutateAsync: savePost, isPending: isSaving } = useMutation(
    modelenceMutation('posts.savePost')
  );

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    try {
      const result = await generatePost({
        prompt,
        platform,
        tone,
        includeHashtags,
      });
      
      setGeneratedPost(result);
      setEditableContent(result.content);
      toast.success('Post generated successfully!');
    } catch (error) {
      toast.error('Failed to generate post');
    }
  };

  const handleImprove = async (improvementType: string) => {
    if (!generatedPost?.postId) return;

    try {
      const result = await improvePost({
        postId: generatedPost.postId,
        improvementType,
      });
      
      setGeneratedPost(prev => prev ? { ...prev, ...result } : null);
      setEditableContent(result.content);
      toast.success('Post improved!');
    } catch (error) {
      toast.error('Failed to improve post');
    }
  };

  const handleSave = async () => {
    if (!generatedPost?.postId) return;

    try {
      await savePost({
        postId: generatedPost.postId,
        content: editableContent,
        hashtags: generatedPost.hashtags,
      });
      toast.success('Post saved!');
    } catch (error) {
      toast.error('Failed to save post');
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(editableContent);
      toast.success('Copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  const useTemplate = (template: any) => {
    setPrompt(template.prompt);
    setPlatform(template.platform === 'all' ? platform : template.platform);
    setTone(template.tone);
  };

  return (
    <div className="space-y-6">
      {/* Templates */}
      {templates && templates.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {templates.slice(0, 6).map((template: any) => (
              <button
                key={template._id}
                onClick={() => useTemplate(template)}
                className="p-3 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <div className="font-medium text-sm text-gray-900">{template.name}</div>
                <div className="text-xs text-gray-500 mt-1 line-clamp-2">{template.prompt}</div>
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Generator Form */}
      <Card>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Generate Social Media Post</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What do you want to post about?
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Share tips about productivity, announce a new product launch, celebrate a milestone..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="twitter">Twitter</option>
                <option value="linkedin">LinkedIn</option>
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="funny">Funny</option>
                <option value="inspirational">Inspirational</option>
                <option value="promotional">Promotional</option>
              </select>
            </div>

            <div className="flex items-center">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={includeHashtags}
                  onChange={(e) => setIncludeHashtags(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Include hashtags</span>
              </label>
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Generate Post
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Generated Post */}
      {generatedPost && (
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Generated Post</h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={copyToClipboard}>
                <Copy className="w-4 h-4 mr-1" />
                Copy
              </Button>
              {generatedPost.postId && (
                <Button variant="outline" size="sm" onClick={handleSave} disabled={isSaving}>
                  <Save className="w-4 h-4 mr-1" />
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <textarea
              value={editableContent}
              onChange={(e) => setEditableContent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={6}
            />

            {generatedPost.hashtags.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hashtags</label>
                <div className="flex flex-wrap gap-2">
                  {generatedPost.hashtags.map((hashtag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      #{hashtag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {generatedPost.postId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Improve Post</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'engagement', label: 'More Engaging' },
                    { key: 'professional', label: 'More Professional' },
                    { key: 'casual', label: 'More Casual' },
                    { key: 'shorter', label: 'Shorter' },
                    { key: 'longer', label: 'Add Detail' },
                    { key: 'hashtags', label: 'Better Hashtags' },
                  ].map((improvement) => (
                    <Button
                      key={improvement.key}
                      variant="outline"
                      size="sm"
                      onClick={() => handleImprove(improvement.key)}
                      disabled={isImproving}
                    >
                      {improvement.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}