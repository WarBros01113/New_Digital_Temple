import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Heart, Star, Bot as Lotus } from 'lucide-react';

const ReligionSelectionPage = () => {
  const { user, updateReligion } = useAuth();
  const [selectedReligion, setSelectedReligion] = useState(user?.religion || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const religions = [
    {
      id: 'hinduism',
      name: 'Hinduism',
      description: 'Ancient wisdom from the Bhagavad Gita, focusing on dharma, karma, and spiritual liberation',
      icon: Lotus,
      color: 'from-orange-500 to-red-600',
      bgColor: 'from-orange-50 to-red-50'
    },
    {
      id: 'christianity',
      name: 'Christianity',
      description: 'Teachings of Jesus Christ from the Bible, emphasizing love, forgiveness, and salvation',
      icon: Heart,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'from-blue-50 to-indigo-50'
    },
    {
      id: 'islam',
      name: 'Islam',
      description: 'Guidance from the Holy Quran, focusing on submission to Allah and righteous living',
      icon: Star,
      color: 'from-green-500 to-teal-600',
      bgColor: 'from-green-50 to-teal-50'
    },
    {
      id: 'buddhism',
      name: 'Buddhism',
      description: 'Buddha\'s teachings from the Dhammapada on mindfulness, compassion, and enlightenment',
      icon: BookOpen,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'from-purple-50 to-pink-50'
    }
  ];

  const handleSubmit = async () => {
    if (!selectedReligion) {
      setError('Please select a religion');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await updateReligion(selectedReligion);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to update religion');
    } finally {
      setLoading(false);
    }
  };

  if (user.religion && selectedReligion === user.religion) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Spiritual Path
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select the religious tradition that resonates with your heart. Your choice will guide the wisdom and teachings you receive.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6 max-w-md mx-auto">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {religions.map((religion) => {
            const IconComponent = religion.icon;
            const isSelected = selectedReligion === religion.id;
            
            return (
              <div
                key={religion.id}
                onClick={() => setSelectedReligion(religion.id)}
                className={`
                  cursor-pointer rounded-2xl p-8 transition-all duration-300 transform hover:scale-105
                  ${isSelected 
                    ? `bg-gradient-to-br ${religion.bgColor} border-2 border-current shadow-lg` 
                    : 'bg-white hover:shadow-lg border-2 border-transparent'
                  }
                `}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`bg-gradient-to-r ${religion.color} w-14 h-14 rounded-full flex items-center justify-center`}>
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{religion.name}</h3>
                    {isSelected && (
                      <div className="text-sm text-green-600 font-semibold mt-1">
                        ✓ Selected
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {religion.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <button
            onClick={handleSubmit}
            disabled={loading || !selectedReligion}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-purple-700 hover:to-blue-700 focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {loading ? 'Saving...' : 'Continue to Dashboard'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReligionSelectionPage;