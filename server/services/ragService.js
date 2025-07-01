import axios from 'axios';
import { getGeminiResponse } from './geminiService.js';
import { searchScriptures as fallbackSearch } from './scriptureSearch.js';

const RAG_SERVER_URL = process.env.RAG_SERVER_URL || 'http://localhost:5000';

// Main function to get spiritual guidance using RAG
export const getRagGuidance = async (issue, religion) => {
  try {
    // Try RAG server first
    const response = await axios.post(`${RAG_SERVER_URL}/get_guidance`, {
      question: issue,
      religion: religion
    }, {
      timeout: 10000 // 10 second timeout
    });

    if (response.data && response.data.response) {
      return {
        response: response.data.response,
        verses: response.data.verses || [],
        source: 'rag'
      };
    }
  } catch (error) {
    console.log('RAG server unavailable, using fallback:', error.message);
  }

  // Fallback to local services
  try {
    const relevantVerses = await fallbackSearch(issue, religion);
    const guidance = await getGeminiResponse(issue, religion, relevantVerses);
    
    return {
      response: guidance,
      verses: relevantVerses,
      source: 'fallback'
    };
  } catch (fallbackError) {
    console.error('Fallback also failed:', fallbackError);
    throw new Error('Unable to generate guidance at this time');
  }
};

// Search scriptures using RAG
export const searchScriptures = async (query, religion) => {
  try {
    // Try RAG server first
    const response = await axios.post(`${RAG_SERVER_URL}/search_scriptures`, {
      query: query,
      religion: religion
    }, {
      timeout: 8000
    });

    if (response.data && response.data.results) {
      return response.data.results;
    }
  } catch (error) {
    console.log('RAG search unavailable, using fallback:', error.message);
  }

  // Fallback to local search
  return await fallbackSearch(query, religion);
};

// Health check for RAG server
export const checkRagHealth = async () => {
  try {
    const response = await axios.get(`${RAG_SERVER_URL}/health`, {
      timeout: 3000
    });
    return response.data;
  } catch (error) {
    return { status: 'unavailable', error: error.message };
  }
};