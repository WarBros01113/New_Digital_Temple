import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MessageCircle, Settings, LogOut, BookOpen } from 'lucide-react';

const DashboardPage = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.religion) {
    return <Navigate to="/religion" replace />;
  }

  const religionInfo = {
    hinduism: {
      name: 'Hinduism',
      color: 'from-orange-500 to-red-600',
      text: 'Hindu',
      book: 'Bhagavad Gita'
    },
    christianity: {
      name: 'Christianity',
      color: 'from-blue-500 to-indigo-600',
      text: 'Christian',
      book: 'Holy Bible'
    },
    islam: {
      name: 'Islam',
      color: 'from-green-500 to-teal-600',
      text: 'Islamic',
      book: 'Holy Quran'
    },
    buddhism: {
      name: 'Buddhism',
      color: 'from-purple-500 to-pink-600',
      text: 'Buddhist',
      book: 'Dhammapada'
    }
  };

  const currentReligion = religionInfo[user.religion as keyof typeof religionInfo];

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome, {user.name}
              </h1>
              <p className="text-gray-600 mt-1">
                Your spiritual companion is ready to guide you
              </p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign out
            </button>
          </div>
        </div>

        {/* Religion Card */}
        <div className={`bg-gradient-to-r ${currentReligion.color} rounded-2xl shadow-lg p-8 mb-8 text-white`}>
          <div className="flex items-center gap-4 mb-4">
            <BookOpen className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">{currentReligion.name}</h2>
              <p className="opacity-90">Drawing wisdom from the {currentReligion.book}</p>
            </div>
          </div>
          <p className="text-lg opacity-90">
            Your spiritual guidance will be based on {currentReligion.text} teachings and sacred texts.
          </p>
        </div>

        {/* Main Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Link
            to="/guidance"
            className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Seek Guidance</h3>
                <p className="text-gray-600">Share your struggles and receive wisdom</p>
              </div>
            </div>
            <p className="text-gray-600">
              Express what's troubling you and receive personalized spiritual guidance based on sacred teachings.
            </p>
          </Link>

          <Link
            to="/religion"
            className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-gradient-to-r from-green-600 to-teal-600 w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Change Religion</h3>
                <p className="text-gray-600">Update your spiritual preference</p>
              </div>
            </div>
            <p className="text-gray-600">
              Explore different religious traditions and their wisdom for your spiritual journey.
            </p>
          </Link>
        </div>

        {/* Inspirational Quote */}
        <div className="bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 rounded-2xl p-8">
          <blockquote className="text-center">
            <p className="text-xl text-gray-700 italic mb-4">
              "The mind is everything. What you think you become."
            </p>
            <footer className="text-gray-600 font-semibold">
              — Buddha
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;