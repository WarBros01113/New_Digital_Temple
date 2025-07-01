import mongoose from 'mongoose';

const guidanceSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  question: {
    type: String,
    required: true,
    trim: true
  },
  religion: {
    type: String,
    required: true,
    enum: ['hinduism', 'christianity', 'islam', 'buddhism']
  },
  response: {
    type: String,
    required: true
  },
  verses: [{
    verse: String,
    reference: String
  }],
  source: {
    type: String,
    enum: ['rag', 'fallback'],
    default: 'rag'
  }
}, {
  timestamps: true
});

export default mongoose.model('GuidanceSession', guidanceSessionSchema);