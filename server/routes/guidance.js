import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getRagGuidance, searchScriptures } from '../services/ragService.js';
import GuidanceSession from '../models/GuidanceSession.js';

const router = express.Router();

// Get spiritual guidance using RAG system
router.post('/seek', authenticateToken, async (req, res) => {
  try {
    const { issue, religion } = req.body;
    
    if (!issue || !religion) {
      return res.status(400).json({ message: 'Issue and religion are required' });
    }

    const validReligions = ['hinduism', 'christianity', 'islam', 'buddhism'];
    if (!validReligions.includes(religion)) {
      return res.status(400).json({ message: 'Invalid religion' });
    }

    // Get guidance from RAG system
    const guidance = await getRagGuidance(issue, religion);
    
    // Save to MongoDB
    const guidanceSession = new GuidanceSession({
      userId: req.user.userId,
      question: issue,
      religion: religion,
      response: guidance.response,
      verses: guidance.verses || [],
      source: guidance.source
    });

    await guidanceSession.save();
    
    res.json({
      issue,
      religion,
      guidance: guidance.response,
      verses: guidance.verses || [],
      timestamp: new Date().toISOString(),
      source: guidance.source
    });
    
  } catch (error) {
    console.error('Guidance error:', error);
    res.status(500).json({ message: 'Error generating spiritual guidance' });
  }
});

// Search scriptures endpoint
router.post('/search', authenticateToken, async (req, res) => {
  try {
    const { query, religion } = req.body;
    
    if (!query || !religion) {
      return res.status(400).json({ message: 'Query and religion are required' });
    }

    const validReligions = ['hinduism', 'christianity', 'islam', 'buddhism'];
    if (!validReligions.includes(religion)) {
      return res.status(400).json({ message: 'Invalid religion' });
    }

    const results = await searchScriptures(query, religion);
    
    res.json({
      query,
      religion,
      results,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Scripture search error:', error);
    res.status(500).json({ message: 'Error searching scriptures' });
  }
});

// Get user's guidance history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const sessions = await GuidanceSession.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({ sessions });
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({ message: 'Error fetching guidance history' });
  }
});

export default router;