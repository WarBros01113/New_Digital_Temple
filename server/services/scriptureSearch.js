// Simplified scripture search using keyword matching and similarity
// In production, this would use FAISS or similar vector database

const scriptures = {
  hinduism: [
    {
      verse: "You have the right to perform your actions, but you are not entitled to the fruits of action. Never consider yourself the cause of the results of your activities, and never be attached to not doing your duty.",
      reference: "Bhagavad Gita 2.47",
      keywords: ["duty", "action", "attachment", "worry", "control", "responsibility", "anxiety"]
    },
    {
      verse: "For the soul there is neither birth nor death. It is not slain when the body is slain.",
      reference: "Bhagavad Gita 2.20",
      keywords: ["death", "fear", "eternal", "soul", "grief", "loss", "mortality"]
    },
    {
      verse: "A person is said to be established in self-realization and is called a yogi [or mystic] when he is fully satisfied by virtue of acquired knowledge and realization.",
      reference: "Bhagavad Gita 6.8",
      keywords: ["peace", "satisfaction", "knowledge", "wisdom", "contentment", "fulfillment"]
    },
    {
      verse: "One who is not disturbed in spite of the threefold miseries, who is not elated when there is happiness, and who is free from attachment, fear and anger, is called a sage of steady mind.",
      reference: "Bhagavad Gita 2.56",
      keywords: ["calm", "steady", "anger", "fear", "attachment", "misery", "happiness", "balance"]
    }
  ],
  christianity: [
    {
      verse: "Therefore do not worry about tomorrow, for tomorrow will worry about itself. Each day has enough trouble of its own.",
      reference: "Matthew 6:34",
      keywords: ["worry", "anxiety", "future", "tomorrow", "concern", "stress", "fear"]
    },
    {
      verse: "Come to me, all you who are weary and burdened, and I will give you rest.",
      reference: "Matthew 11:28",
      keywords: ["rest", "tired", "burden", "weary", "peace", "comfort", "relief"]
    },
    {
      verse: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
      reference: "Romans 8:28",
      keywords: ["purpose", "good", "plan", "meaning", "hope", "trust", "faith"]
    },
    {
      verse: "I can do all this through him who gives me strength.",
      reference: "Philippians 4:13",
      keywords: ["strength", "power", "ability", "confidence", "overcome", "challenge"]
    }
  ],
  islam: [
    {
      verse: "And whoever relies upon Allah - then He is sufficient for him. Indeed, Allah will accomplish His purpose.",
      reference: "Quran 65:3",
      keywords: ["trust", "reliance", "allah", "purpose", "sufficient", "faith", "dependence"]
    },
    {
      verse: "And it is He who created the heavens and earth in truth. And the day He says, 'Be,' and it is, His word is the truth.",
      reference: "Quran 6:73",
      keywords: ["creation", "truth", "power", "control", "allah", "reality"]
    },
    {
      verse: "So remember Me; I will remember you. And be grateful to Me and do not deny Me.",
      reference: "Quran 2:152",
      keywords: ["remember", "gratitude", "thankful", "blessing", "appreciation", "mindfulness"]
    },
    {
      verse: "And whoever fears Allah - He will make for him a way out.",
      reference: "Quran 65:2",
      keywords: ["fear", "way", "solution", "difficulty", "hardship", "escape", "relief"]
    }
  ],
  buddhism: [
    {
      verse: "All conditioned things are impermanent. Work out your salvation with diligence.",
      reference: "Dhammapada",
      keywords: ["impermanence", "change", "diligence", "work", "salvation", "effort", "temporary"]
    },
    {
      verse: "Hatred does not cease by hatred, but only by love; this is the eternal rule.",
      reference: "Dhammapada 1.5",
      keywords: ["hatred", "love", "anger", "forgiveness", "compassion", "kindness", "peace"]
    },
    {
      verse: "Your work is to discover your world and then with all your heart give yourself to it.",
      reference: "Buddha",
      keywords: ["purpose", "dedication", "heart", "work", "discovery", "commitment", "passion"]
    },
    {
      verse: "Peace comes from within. Do not seek it without.",
      reference: "Buddha",
      keywords: ["peace", "inner", "within", "external", "seeking", "calm", "tranquility"]
    }
  ]
};

export const searchScriptures = async (issue, religion) => {
  const religionScriptures = scriptures[religion] || [];
  const issueWords = issue.toLowerCase().split(/\s+/);
  
  // Score each verse based on keyword matches
  const scoredVerses = religionScriptures.map(scripture => {
    let score = 0;
    issueWords.forEach(word => {
      scripture.keywords.forEach(keyword => {
        if (keyword.includes(word) || word.includes(keyword)) {
          score += 1;
        }
      });
    });
    return { ...scripture, score };
  });
  
  // Sort by relevance and return top matches
  return scoredVerses
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ verse, reference }) => ({ verse, reference }));
};