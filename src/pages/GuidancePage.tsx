import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Send, ArrowLeft, MessageCircle, BookOpen, Sparkles } from 'lucide-react';
import axios from 'axios';

interface GuidanceResponse {
  issue: string;
  religion: string;
  guidance: string;
  verses: Array<{
    verse: string;
    reference: string;
  }>;
  timestamp: string;
}

const GuidancePage = () => {
  const { user } = useAuth();
  const [issue, setIssue] = useState('');
  const [loading, setLoading] = useState(false);
  const [guidance, setGuidance] = useState<GuidanceResponse | null>(null);
  const [error, setError] = useState('');

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.religion) {
    return <Navigate to="/religion" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issue.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/guidance/seek', {
        issue: issue.trim(),
        religion: user.religion
      });
      
      setGuidance(response.data);
      setIssue('');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to get guidance');
    } finally {
      setLoading(false);
    }
  };

  const religionInfo = {
    hinduism: { name: 'Hindu', color: 'from-orange-500 to-red-600' },
    christianity: { name: 'Christian', color: 'from-blue-500 to-indigo-600' },
    islam: { name: 'Islamic', color: 'from-green-500 to-teal-600' },
    buddhism: { name: 'Buddhist', color: 'from-purple-500 to-pink-600' }
  };

  const currentReligion = religionInfo[user.religion as keyof typeof religionInfo];

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/dashboard"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Spiritual Guidance</h1>
            <p className="text-gray-600">Share your struggles and receive {currentReligion.name} wisdom</p>
          </div>
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="issue" className="block text-lg font-semibold text-gray-900 mb-3">
                What's troubling you today?
              </label>
              <textarea
                id="issue"
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                placeholder="Express your feelings, concerns, or questions here. Be as detailed as you feel comfortable..."
                className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200 resize-none"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !issue.trim()}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Seeking guidance...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Seek guidance
                </>
              )}
            </button>
          </form>
        </div>

        {/* Guidance Response */}
        {guidance && (
          <div className="space-y-6">
            {/* Your Question */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <MessageCircle className="w-6 h-6 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">Your Question</h3>
              </div>
              <p className="text-gray-700 italic">"{guidance.issue}"</p>
            </div>

            {/* Sacred Verses */}
            {guidance.verses.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center gap-3 mb-6">
                  <BookOpen className="w-6 h-6 text-indigo-600" />
                  <h3 className="text-xl font-bold text-gray-900">Sacred Verses</h3>
                </div>
                <div className="space-y-4">
                  {guidance.verses.map((verse, index) => (
                    <div key={index} className="border-l-4 border-indigo-500 pl-6 py-2">
                      <p className="text-gray-700 text-lg leading-relaxed mb-2">"{verse.verse}"</p>
                      <cite className="text-indigo-600 font-semibold">— {verse.reference}</cite>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Spiritual Guidance */}
            <div className={`bg-gradient-to-br ${currentReligion.color} rounded-2xl shadow-lg p-8 text-white`}>
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-6 h-6" />
                <h3 className="text-xl font-bold">Spiritual Guidance</h3>
              </div>
              <div className="prose prose-lg prose-invert">
                {guidance.guidance.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 leading-relaxed text-white/90">
                    {paragraph}
                  </p>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-white/20">
                <p className="text-sm text-white/75">
                  Guidance received on {new Date(guidance.timestamp).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!guidance && !loading && (
          <div className="text-center py-12">
            <div className="bg-gradient-to-br from-purple-100 to-blue-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-12 h-12 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Listen</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Share what's on your heart, and receive personalized spiritual guidance based on {currentReligion.name} teachings.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuidancePage;