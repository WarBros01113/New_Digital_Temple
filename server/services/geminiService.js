import dotenv from 'dotenv';
dotenv.config();

// Enhanced Gemini service with better prompting
export const getGeminiResponse = async (issue, religion, verses) => {
  // In production, this would call the actual Gemini API
  // For now, we'll create more sophisticated contextual responses
  
  const religionNames = {
    hinduism: 'Hindu',
    christianity: 'Christian', 
    islam: 'Islamic',
    buddhism: 'Buddhist'
  };
  
  const religionContext = {
    hinduism: {
      greeting: "According to the sacred teachings of Hinduism",
      concepts: ["dharma", "karma", "moksha", "atman", "brahman"],
      approach: "focus on duty, detachment, and spiritual realization"
    },
    christianity: {
      greeting: "In the light of Christian teachings",
      concepts: ["love", "forgiveness", "faith", "grace", "salvation"],
      approach: "emphasize God's love, prayer, and trust in divine plan"
    },
    islam: {
      greeting: "As guided by Islamic wisdom",
      concepts: ["taqwa", "sabr", "tawakkul", "rahma", "jihad al-nafs"],
      approach: "trust in Allah, patience, and righteous action"
    },
    buddhism: {
      greeting: "Following the Buddha's teachings",
      concepts: ["mindfulness", "compassion", "impermanence", "suffering", "enlightenment"],
      approach: "cultivate awareness, acceptance, and loving-kindness"
    }
  };

  const responses = {
    anxiety: {
      hinduism: "The Bhagavad Gita teaches us that anxiety arises from attachment to outcomes. Krishna advises Arjuna to perform his duty without being attached to the results. When we focus on our dharma (righteous duty) and surrender the fruits of our actions to the Divine, we find peace. Remember, you are not the doer - you are an instrument of the cosmic will.",
      christianity: "Jesus reminds us in Matthew 6:26 to 'Look at the birds of the air; they do not sow or reap or store away in barns, and yet your heavenly Father feeds them. Are you not much more valuable than they?' Your anxiety shows you care, but God cares for you even more. Cast your worries upon Him through prayer, for He knows your needs before you ask.",
      islam: "Allah says in the Quran: 'And whoever relies upon Allah - then He is sufficient for him. Indeed, Allah will accomplish His purpose.' (65:3). Your anxiety is a test of your trust in Allah. Practice tawakkul (reliance on Allah) and remember that Allah never burdens a soul beyond what it can bear. Make du'a and trust in His perfect timing.",
      buddhism: "Buddha taught that suffering comes from attachment and craving. Your anxiety about the future stems from clinging to outcomes beyond your control. Practice mindfulness to stay present, and remember that all things are impermanent. What you fear may never come to pass, and even if it does, it too shall pass. Cultivate equanimity through meditation."
    },
    fear: {
      hinduism: "The Gita declares: 'For the soul there is neither birth nor death. It is not slain when the body is slain.' (2.20). When you realize your true nature as the eternal atman, fear dissolves. What can truly harm the immortal soul? Face your fears with the knowledge that you are divine consciousness experiencing a human journey.",
      christianity: "1 John 4:18 tells us 'Perfect love drives out fear.' God has not given you a spirit of fear, but of power, love, and sound mind. When fear grips you, remember that you are loved unconditionally by the Creator of the universe. Pray for courage and trust that God's love is stronger than any fear.",
      islam: "Allah is with those who fear Him and do good. The Quran says: 'And whoever fears Allah - He will make for him a way out.' (65:2). True courage comes from fearing Allah alone and trusting in His protection. Seek refuge in Allah from your fears and remember that He is Ar-Rahman (The Most Merciful).",
      buddhism: "Fear arises from ignorance and attachment to the ego-self. Buddha taught that when we understand the true nature of reality - that all phenomena are empty of inherent existence - fear naturally subsides. Practice loving-kindness meditation to transform fear into compassion, both for yourself and others."
    },
    grief: {
      hinduism: "Krishna teaches that grief comes from identifying with the temporary rather than the eternal. 'As a person puts on new garments, giving up old ones, the soul similarly accepts new material bodies, giving up the old and useless ones.' (2.22). Honor your feelings while remembering the soul's immortal journey.",
      christianity: "Jesus wept at Lazarus's tomb, showing us that grief is natural and holy. In Revelation 21:4, we're promised that God 'will wipe every tear from their eyes. There will be no more death or mourning or crying or pain.' Your grief is held in God's loving hands, and healing will come in His time.",
      islam: "The Prophet (peace be upon him) said: 'No fatigue, nor disease, nor sorrow, nor sadness, nor hurt, nor distress befalls a Muslim, not even if it were the prick he receives from a thorn, but that Allah expiates some of his sins for that.' Your grief purifies your soul and draws you closer to Allah's mercy.",
      buddhism: "Grief is the price we pay for love, and love is what makes us human. Buddha taught that attachment causes suffering, but this doesn't mean we shouldn't love - rather, we should love without clinging. Honor your grief as a testament to your capacity for love, while practicing acceptance of impermanence."
    },
    default: {
      hinduism: "The Bhagavad Gita offers timeless wisdom for all of life's challenges. Remember the three paths: karma yoga (selfless action), bhakti yoga (devotion), and jnana yoga (knowledge). Whatever your struggle, approach it with dharma (righteousness), surrender the results to the Divine, and trust in the cosmic order.",
      christianity: "Romans 8:28 reminds us that 'God works for the good of those who love him, who have been called according to his purpose.' Even in difficult times, God is weaving your story into something beautiful. Trust His plan, seek His guidance through prayer and Scripture, and remember you are never alone.",
      islam: "Allah tests those He loves to purify their hearts and elevate their ranks. The Quran says: 'And give good tidings to the patient, Who, when disaster strikes them, say, Indeed we belong to Allah, and indeed to Him we will return.' (2:155-156). Face your challenges with sabr (patience) and trust in Allah's wisdom.",
      buddhism: "Life is characterized by dukkha (suffering), but Buddha showed us the path to liberation. The Four Noble Truths teach us that suffering has a cause and can be overcome. Practice the Eightfold Path: right understanding, intention, speech, action, livelihood, effort, mindfulness, and concentration."
    }
  };
  
  // Analyze the issue to determine response type
  let responseType = 'default';
  const issueLower = issue.toLowerCase();
  
  if (issueLower.includes('anxious') || issueLower.includes('worry') || issueLower.includes('stress') || issueLower.includes('nervous')) {
    responseType = 'anxiety';
  } else if (issueLower.includes('fear') || issueLower.includes('afraid') || issueLower.includes('scared') || issueLower.includes('terrified')) {
    responseType = 'fear';
  } else if (issueLower.includes('grief') || issueLower.includes('loss') || issueLower.includes('death') || issueLower.includes('died') || issueLower.includes('mourning')) {
    responseType = 'grief';
  }
  
  const context = religionContext[religion];
  const baseResponse = responses[responseType][religion];
  
  // Build comprehensive guidance
  let guidance = `${context.greeting}, I understand you're facing: "${issue}"\n\n${baseResponse}`;
  
  // Add verse context if available
  if (verses && verses.length > 0) {
    guidance += `\n\n📖 **Sacred Wisdom:**\n`;
    verses.slice(0, 2).forEach(verse => {
      guidance += `\n"${verse.verse}"\n— ${verse.reference}\n`;
    });
  }
  
  // Add practical guidance
  guidance += `\n\n🙏 **Practical Steps:**\n`;
  guidance += `• Spend time in prayer/meditation daily\n`;
  guidance += `• Reflect on the sacred teachings that resonate with your situation\n`;
  guidance += `• Practice ${context.approach}\n`;
  guidance += `• Seek community support from fellow believers\n`;
  guidance += `• Remember that this challenge is part of your spiritual growth\n`;
  
  guidance += `\n\nMay you find peace, strength, and wisdom on your spiritual journey. 🕊️`;
  
  return guidance;
};