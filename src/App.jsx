import React, { useState, useEffect } from 'react';
import { Search, Clock, Apple, Utensils, BookOpen, Sparkles, AlertCircle, ChevronLeft, ChevronRight, Share2, Heart, MapPin, Calendar, Award, Lightbulb, X, Plus, ArrowRight, Loader } from 'lucide-react';

// Custom ChefHat component
const ChefHat = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.5 11c.276 0 .5-.224.5-.5s-.224-.5-.5-.5-.5.224-.5.5.224.5.5.5zm-11 0c.276 0 .5-.224.5-.5s-.224-.5-.5-.5-.5.224-.5.5.224.5.5.5zm13.5-6c0-1.654-1.346-3-3-3-.771 0-1.468.301-2 .78-.532-.479-1.229-.78-2-.78s-1.468.301-2 .78c-.532-.479-1.229-.78-2-.78s-1.468.301-2 .78c-.532-.479-1.229-.78-2-.78-1.654 0-3 1.346-3 3v1c0 1.654 1.346 3 3 3h.184l1.316 7h11l1.316-7h.184c1.654 0 3-1.346 3-3v-1zm-2 1c0 .551-.449 1-1 1h-12c-.551 0-1-.449-1-1v-1c0-.551.449-1 1-1s1 .449 1 1h2c0-.551.449-1 1-1s1 .449 1 1h2c0-.551.449-1 1-1s1 .449 1 1h2c0-.551.449-1 1-1s1 .449 1 1h2c0-.551.449-1 1-1s1 .449 1 1v1z"/>
  </svg>
);

// Cultural Story Cards Component
const CulturalStoryCards = ({ recipe, culturalInfo, onClose }) => {
  const [currentCard, setCurrentCard] = useState(0);
  const [isSharing, setIsSharing] = useState(false);
  const [liked, setLiked] = useState(false);

  const generateStoryCards = () => {
    if (!culturalInfo) return [];

    const cards = [];

    cards.push({
      type: 'intro',
      title: recipe.name,
      subtitle: 'Cultural Journey',
      content: `Discover the rich cultural heritage behind this beloved dish from ${culturalInfo.origin || 'various traditions'}.`,
      background: 'bg-gradient-to-br from-purple-500 to-pink-500',
      icon: <ChefHat className="h-8 w-8 text-white" />,
      badge: getCulturalBadge(recipe.name)
    });

    if (culturalInfo.origin) {
      cards.push({
        type: 'origin',
        title: 'Origins',
        subtitle: culturalInfo.origin,
        content: culturalInfo.history || 'A dish with deep cultural roots passed down through generations.',
        background: 'bg-gradient-to-br from-blue-500 to-indigo-600',
        icon: <MapPin className="h-6 w-6 text-white" />,
        didYouKnow: getDidYouKnowFact(recipe.name)
      });
    }

    if (culturalInfo.significance) {
      cards.push({
        type: 'significance',
        title: 'Cultural Significance',
        subtitle: 'Traditional Meaning',
        content: culturalInfo.significance,
        background: 'bg-gradient-to-br from-emerald-500 to-teal-600',
        icon: <Award className="h-6 w-6 text-white" />
      });
    }

    if (culturalInfo.serving) {
      cards.push({
        type: 'serving',
        title: 'Traditional Serving',
        subtitle: 'How It\'s Enjoyed',
        content: culturalInfo.serving,
        background: 'bg-gradient-to-br from-orange-500 to-red-500',
        icon: <Utensils className="h-6 w-6 text-white" />
      });
    }

    if (culturalInfo.tips) {
      cards.push({
        type: 'tips',
        title: 'Ancient Wisdom',
        subtitle: 'Traditional Techniques',
        content: culturalInfo.tips,
        background: 'bg-gradient-to-br from-violet-500 to-purple-600',
        icon: <Lightbulb className="h-6 w-6 text-white" />
      });
    }

    return cards;
  };

  const storyCards = generateStoryCards();

  const nextCard = () => {
    setCurrentCard((prev) => (prev + 1) % storyCards.length);
  };

  const prevCard = () => {
    setCurrentCard((prev) => (prev - 1 + storyCards.length) % storyCards.length);
  };

  const handleShare = async () => {
    setIsSharing(true);
    const currentCardData = storyCards[currentCard];
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${recipe.name} - ${currentCardData.title}`,
          text: `${currentCardData.content} Discover more cultural recipes on FlavorAI!`,
          url: window.location.href
        });
      } else {
        const shareText = `🍳 ${recipe.name} - ${currentCardData.title}\n\n${currentCardData.content}\n\nDiscover more cultural recipes on FlavorAI! ${window.location.href}`;
        await navigator.clipboard.writeText(shareText);
        alert('Content copied to clipboard!');
      }
    } catch (error) {
      console.log('Share failed:', error);
    }
    setIsSharing(false);
  };

  if (storyCards.length === 0) return null;

  const currentCardData = storyCards[currentCard];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="relative w-full max-w-md">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
        >
          <X className="h-8 w-8" />
        </button>

        <div className={`relative w-full h-96 rounded-2xl shadow-2xl overflow-hidden ${currentCardData.background}`}>
          <div className="absolute top-0 left-0 right-0 p-6 bg-black bg-opacity-20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {currentCardData.icon}
                <div>
                  <h3 className="text-white font-bold text-lg">{currentCardData.title}</h3>
                  <p className="text-white text-opacity-90 text-sm">{currentCardData.subtitle}</p>
                </div>
              </div>
              
              {currentCardData.badge && (
                <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                  <span className="text-white text-xs font-semibold">{currentCardData.badge}</span>
                </div>
              )}
            </div>
          </div>

          <div className="absolute inset-0 flex flex-col justify-center px-6 pt-20 pb-20">
            <div className="text-center text-white">
              <p className="text-lg leading-relaxed mb-4">{currentCardData.content}</p>
              
              {currentCardData.didYouKnow && (
                <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Lightbulb className="h-5 w-5" />
                    <span className="font-semibold">Did You Know?</span>
                  </div>
                  <p className="text-sm">{currentCardData.didYouKnow}</p>
                </div>
              )}
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 bg-black bg-opacity-20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setLiked(!liked)}
                  className={`transition-colors ${liked ? 'text-red-400' : 'text-white'}`}
                >
                  <Heart className={`h-6 w-6 ${liked ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  disabled={isSharing}
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  <Share2 className="h-6 w-6" />
                </button>
              </div>
              
              <div className="flex space-x-2">
                {storyCards.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentCard ? 'bg-white' : 'bg-white bg-opacity-40'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {storyCards.length > 1 && (
            <>
              <button
                onClick={prevCard}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
              <button
                onClick={nextCard}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            </>
          )}
        </div>

        <div className="text-center mt-4 text-white">
          <span className="text-sm">{currentCard + 1} of {storyCards.length}</span>
        </div>
      </div>
    </div>
  );
};

// Helper functions for cultural badges and facts
const getCulturalBadge = (recipeName) => {
  const badges = {
    'paneer': 'Mughal Heritage',
    'biryani': 'Royal Cuisine',
    'chickpea': 'Ancient Grain',
    'tofu': 'Buddhist Tradition',
    'pizza': 'Italian Classic',
    'teriyaki': 'Japanese Art',
    'quinoa': 'Inca Superfood',
    'curry': 'Spice Route'
  };
  
  for (const [key, badge] of Object.entries(badges)) {
    if (recipeName.toLowerCase().includes(key)) {
      return badge;
    }
  }
  return 'Cultural Heritage';
};

const getDidYouKnowFact = (recipeName) => {
  const facts = {
    'paneer': 'Paneer was first mentioned in ancient Indian texts over 2,000 years ago and was considered food fit for gods.',
    'biryani': 'The word "biryani" comes from the Persian word "birian" meaning "fried before cooking."',
    'chickpea': 'Chickpeas are one of humanity\'s oldest cultivated crops, dating back 10,000 years.',
    'tofu': 'Tofu was accidentally discovered by a Chinese cook who curdled soy milk with sea salt.',
    'pizza': 'The first pizzeria in America opened in 1905 in New York City.',
    'teriyaki': 'Teriyaki was originally used to preserve fish in Japan before refrigeration.',
    'quinoa': 'Quinoa was so sacred to the Incas that the emperor would plant the first seeds each year.',
    'curry': 'The word "curry" comes from the Tamil word "kari" meaning sauce or relish.'
  };
  
  for (const [key, fact] of Object.entries(facts)) {
    if (recipeName.toLowerCase().includes(key)) {
      return fact;
    }
  }
  return 'This dish has traveled through countless generations, carrying stories and traditions in every bite.';
};

const App = () => {
  // Main state
  const [searchQuery, setSearchQuery] = useState('');
  const [queryPattern, setQueryPattern] = useState(null); // 'direct', 'discovery', 'ingredients', 'context'
  const [searchResults, setSearchResults] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [aiRecommendations, setAiRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [apiKeyError, setApiKeyError] = useState(false);
  const [showCulturalCards, setShowCulturalCards] = useState(false);

  // Smart Query Pattern Recognition
  const detectQueryPattern = (query) => {
    const lowerQuery = query.toLowerCase().trim();
    
    // Pattern 1: Direct Recipe Request
    const directPatterns = [
      /^(i want to eat|make me|i want|give me|cook|prepare)\s+(.+)/,
      /^(.+)\s+(recipe|dish)$/,
      /^how to (make|cook|prepare)\s+(.+)/
    ];
    
    // Pattern 2: Discovery & Selection  
    const discoveryPatterns = [
      /^(what's the best|what goes with|what pairs with|recommend.*for)\s+(.+)/,
      /^(suggestions for|ideas for|what to make with)\s+(.+)/,
      /^(best dishes? for|good with)\s+(.+)/
    ];
    
    // Pattern 3: Ingredient-Based
    const ingredientPatterns = [
      /^(i have|using|with)\s+(.+)/,
      /^(.+)\s+(ingredients?|available)$/,
      /^(recipe with|dish with|make with)\s+(.+)/
    ];
    
    // Pattern 4: Context-Based
    const contextPatterns = [
      /^(quick|fast|easy|healthy|party|breakfast|lunch|dinner|snack)\s+(.+)/,
      /^(.+)\s+(for (office|work|party|kids|diet))/,
      /^(vegetarian|vegan|gluten.free|keto|low.carb)\s+(.+)/
    ];
    
    for (const pattern of directPatterns) {
      if (pattern.test(lowerQuery)) {
        return { type: 'direct', query: lowerQuery };
      }
    }
    
    for (const pattern of discoveryPatterns) {
      if (pattern.test(lowerQuery)) {
        return { type: 'discovery', query: lowerQuery };
      }
    }
    
    for (const pattern of ingredientPatterns) {
      if (pattern.test(lowerQuery)) {
        return { type: 'ingredients', query: lowerQuery };
      }
    }
    
    for (const pattern of contextPatterns) {
      if (pattern.test(lowerQuery)) {
        return { type: 'context', query: lowerQuery };
      }
    }
    
    // Default to direct if no clear pattern
    return { type: 'direct', query: lowerQuery };
  };

  // AI-Native Recipe Generation
  const generateAIResponse = async (pattern, query) => {
    const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!GEMINI_API_KEY || GEMINI_API_KEY.length < 20) {
      setApiKeyError(true);
      return null;
    }

    try {
      let prompt = '';
      
      switch (pattern.type) {
        case 'direct':
          prompt = `Generate a complete recipe for: "${query}"

Please provide a detailed response in this EXACT format:

RECIPE_NAME: [Name of the dish]
DESCRIPTION: [Brief appetizing description in 1-2 sentences]
PREP_TIME: [number between 15-120]
SERVINGS: [number between 1-8]

INGREDIENTS:
- [ingredient 1 with quantity]
- [ingredient 2 with quantity]
- [continue for all ingredients]

INSTRUCTIONS:
1. [Detailed step 1 with technique and timing]
2. [Detailed step 2 with technique and timing]
3. [Continue with all cooking steps]

NUTRITION:
Calories: [number]
Protein: [number]g
Carbs: [number]g
Fat: [number]g

CULTURAL_INFO:
Origin: [Country/region with historical context]
History: [2-3 sentences about dish history and cultural development]
Significance: [Cultural importance and traditions]
Traditional_Serving: [How it's traditionally served and eaten]
Cooking_Tips: [Authentic techniques and cultural wisdom]

ALTERNATIVES:
Alt1: [substitute for main ingredient] (1:1 ratio)
Alt2: [substitute for second ingredient] (1:1 ratio)
Alt3: [substitute for third ingredient] (1:1 ratio)`;
          break;
          
        case 'discovery':
          prompt = `Suggest 4 dishes based on: "${query}"

For each dish, provide:

DISH_1:
Name: [Dish name]
Description: [Brief description why it's good for this query]
Appeal: [What makes it special]

DISH_2:
Name: [Dish name]  
Description: [Brief description why it's good for this query]
Appeal: [What makes it special]

DISH_3:
Name: [Dish name]
Description: [Brief description why it's good for this query] 
Appeal: [What makes it special]

DISH_4:
Name: [Dish name]
Description: [Brief description why it's good for this query]
Appeal: [What makes it special]

Provide variety in cuisines and cooking methods.`;
          break;
          
        case 'ingredients':
          prompt = `Suggest 4 recipes using: "${query}"

For each recipe, optimize for the available ingredients:

RECIPE_1:
Name: [Recipe name]
Description: [How it uses the available ingredients]
Additional_Needed: [2-3 common ingredients to complete the dish]

RECIPE_2:
Name: [Recipe name]
Description: [How it uses the available ingredients]
Additional_Needed: [2-3 common ingredients to complete the dish]

RECIPE_3:
Name: [Recipe name]
Description: [How it uses the available ingredients]
Additional_Needed: [2-3 common ingredients to complete the dish]

RECIPE_4:
Name: [Recipe name]
Description: [How it uses the available ingredients]
Additional_Needed: [2-3 common ingredients to complete the dish]

Focus on recipes that make the best use of available ingredients.`;
          break;
          
        case 'context':
          prompt = `Suggest 4 recipes for: "${query}"

For each recipe, provide context-specific information:

RECIPE_1:
Name: [Recipe name]
Description: [Why it's perfect for this context]
Context_Benefits: [Specific advantages for this situation]
Time_Required: [Preparation and cooking time]

RECIPE_2:
Name: [Recipe name]
Description: [Why it's perfect for this context]
Context_Benefits: [Specific advantages for this situation]
Time_Required: [Preparation and cooking time]

RECIPE_3:
Name: [Recipe name]
Description: [Why it's perfect for this context]
Context_Benefits: [Specific advantages for this situation]
Time_Required: [Preparation and cooking time]

RECIPE_4:
Name: [Recipe name]
Description: [Why it's perfect for this context]
Context_Benefits: [Specific advantages for this situation]
Time_Required: [Preparation and cooking time]

Optimize for the specific context requirements.`;
          break;
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 3000,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API failed: ${response.status}`);
      }

      const result = await response.json();
      const aiText = result.candidates?.[0]?.content?.parts?.[0]?.text;

      if (aiText) {
        console.log('🤖 AI Response:', aiText);
        return parseAIResponse(aiText, pattern.type);
      }

      throw new Error('No response from AI');
    } catch (error) {
      console.error('AI generation error:', error);
      setApiKeyError(true);
      return null;
    }
  };

  // Parse AI Response based on pattern type
  const parseAIResponse = (aiText, patternType) => {
    try {
      if (patternType === 'direct') {
        // Parse complete recipe
        const recipe = parseCompleteRecipe(aiText);
        return { type: 'recipe', data: recipe };
      } else {
        // Parse recipe suggestions
        const suggestions = parseRecipeSuggestions(aiText, patternType);
        return { type: 'suggestions', data: suggestions };
      }
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return null;
    }
  };

  // AI Image Generation Function
  const generateRecipeImage = async (recipeName, description) => {
    const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
    const HF_API_KEY = import.meta.env.VITE_HF_API_KEY;
    
    try {
      // Try DALL-E first (best quality)
      if (OPENAI_API_KEY && OPENAI_API_KEY.length > 20) {
        console.log('🎨 Generating DALL-E image...');
        
        const dalleResponse = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: "dall-e-3",
            prompt: `A beautiful, appetizing photo of ${recipeName}, ${description}. Professional food photography, vibrant colors, restaurant quality presentation, high resolution, natural lighting, closeup view.`,
            size: "1024x1024",
            quality: "standard",
            n: 1
          })
        });

        if (dalleResponse.ok) {
          const dalleResult = await dalleResponse.json();
          if (dalleResult.data && dalleResult.data[0]) {
            console.log('✅ DALL-E image generated successfully!');
            return dalleResult.data[0].url;
          }
        } else {
          console.log('❌ DALL-E failed:', dalleResponse.status);
        }
      }

      // Fallback to Hugging Face Stable Diffusion
      if (HF_API_KEY && HF_API_KEY.startsWith('hf_')) {
        console.log('🎨 Trying Stable Diffusion image generation...');
        
        const stableDiffusionModels = [
          'stabilityai/stable-diffusion-2-1',
          'runwayml/stable-diffusion-v1-5'
        ];

        for (const model of stableDiffusionModels) {
          try {
            const sdResponse = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${HF_API_KEY}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                inputs: `professional food photography of ${recipeName}, delicious, appetizing, high quality, restaurant presentation, vibrant colors, natural lighting, detailed, masterpiece`,
                parameters: {
                  guidance_scale: 7.5,
                  num_inference_steps: 50
                },
                options: {
                  wait_for_model: true
                }
              })
            });

            if (sdResponse.ok) {
              const imageBlob = await sdResponse.blob();
              const imageUrl = URL.createObjectURL(imageBlob);
              console.log(`✅ ${model.split('/')[1]} image generated!`);
              return imageUrl;
            } else {
              console.log(`❌ ${model.split('/')[1]} failed:`, sdResponse.status);
              continue;
            }
          } catch (error) {
            console.log(`❌ ${model.split('/')[1]} error:`, error.message);
            continue;
          }
        }
      }

      return null;
    } catch (error) {
      console.error('AI image generation error:', error);
      return null;
    }
  };

  // Parse complete recipe from AI
  const parseCompleteRecipe = async (aiText) => {
    const nameMatch = aiText.match(/RECIPE_NAME:\s*([^\n\r]+)/i);
    const descMatch = aiText.match(/DESCRIPTION:\s*([^\n\r]+(?:\n[^\n\r]+)*?)(?=\n[A-Z_]+:|$)/i);
    const prepTimeMatch = aiText.match(/PREP_TIME:\s*(\d+)/i);
    const servingsMatch = aiText.match(/SERVINGS:\s*(\d+)/i);
    
    // Parse ingredients
    const ingredientsSection = aiText.match(/INGREDIENTS:\s*([\s\S]*?)(?=\n[A-Z_]+:|$)/i);
    let ingredients = [];
    if (ingredientsSection) {
      ingredients = ingredientsSection[1]
        .split('\n')
        .filter(line => line.trim().startsWith('-'))
        .map(line => line.replace(/^-\s*/, '').trim())
        .filter(ingredient => ingredient.length > 0);
    }
    
    // Parse instructions
    const instructionsSection = aiText.match(/INSTRUCTIONS:\s*([\s\S]*?)(?=\n[A-Z_]+:|$)/i);
    let instructions = [];
    if (instructionsSection) {
      instructions = instructionsSection[1]
        .split('\n')
        .filter(line => /^\d+\./.test(line.trim()))
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .filter(instruction => instruction.length > 0);
    }
    
    // Parse nutrition
    const caloriesMatch = aiText.match(/Calories:\s*(\d+)/i);
    const proteinMatch = aiText.match(/Protein:\s*(\d+)/i);
    const carbsMatch = aiText.match(/Carbs:\s*(\d+)/i);
    const fatMatch = aiText.match(/Fat:\s*(\d+)/i);
    
    // Parse cultural info
    const originMatch = aiText.match(/Origin:\s*([^\n\r]+)/i);
    const historyMatch = aiText.match(/History:\s*([^\n\r]+(?:\n[^\n\r]+)*?)(?=\n[A-Z_]+:|$)/i);
    const significanceMatch = aiText.match(/Significance:\s*([^\n\r]+(?:\n[^\n\r]+)*?)(?=\n[A-Z_]+:|$)/i);
    const servingMatch = aiText.match(/Traditional_Serving:\s*([^\n\r]+(?:\n[^\n\r]+)*?)(?=\n[A-Z_]+:|$)/i);
    const tipsMatch = aiText.match(/Cooking_Tips:\s*([^\n\r]+(?:\n[^\n\r]+)*?)(?=\n[A-Z_]+:|$)/i);
    
    // Parse alternatives
    const alt1Match = aiText.match(/Alt1:\s*([^\n\r]+)/i);
    const alt2Match = aiText.match(/Alt2:\s*([^\n\r]+)/i);
    const alt3Match = aiText.match(/Alt3:\s*([^\n\r]+)/i);
    
    const recipeName = nameMatch ? nameMatch[1].trim() : 'Delicious Recipe';
    const description = descMatch ? descMatch[1].trim() : 'A wonderful dish to try!';
    
    // Generate AI image for the recipe
    console.log('🎨 Generating AI image for recipe...');
    const aiImage = await generateRecipeImage(recipeName, description);
    
    return {
      name: recipeName,
      description: description,
      prepTime: prepTimeMatch ? parseInt(prepTimeMatch[1]) : 45,
      servings: servingsMatch ? parseInt(servingsMatch[1]) : 4,
      ingredients: ingredients.length > 0 ? ingredients : ['Various ingredients as needed'],
      instructions: instructions.length > 0 ? instructions : ['Follow traditional cooking methods'],
      nutrition: {
        calories: caloriesMatch ? parseInt(caloriesMatch[1]) : 300,
        protein: proteinMatch ? parseInt(proteinMatch[1]) : 15,
        carbs: carbsMatch ? parseInt(carbsMatch[1]) : 40,
        fat: fatMatch ? parseInt(fatMatch[1]) : 12
      },
      culturalInfo: (originMatch || historyMatch || significanceMatch || servingMatch || tipsMatch) ? {
        origin: originMatch ? originMatch[1].trim() : null,
        history: historyMatch ? historyMatch[1].trim() : null,
        significance: significanceMatch ? significanceMatch[1].trim() : null,
        serving: servingMatch ? servingMatch[1].trim() : null,
        tips: tipsMatch ? tipsMatch[1].trim() : null
      } : null,
      alternatives: [
        {
          original: ingredients[0] || 'main ingredient',
          substitute: alt1Match ? alt1Match[1].split('(')[0].trim() : 'similar ingredient',
          ratio: '1:1'
        },
        {
          original: ingredients[1] || 'second ingredient',
          substitute: alt2Match ? alt2Match[1].split('(')[0].trim() : 'similar ingredient',
          ratio: '1:1'
        },
        {
          original: ingredients[2] || 'third ingredient',
          substitute: alt3Match ? alt3Match[1].split('(')[0].trim() : 'similar ingredient',
          ratio: '1:1'
        }
      ],
      aiImage: aiImage, // Include the generated AI image
      aiGenerated: true
    };
  };

  // Parse recipe suggestions from AI
  const parseRecipeSuggestions = (aiText, patternType) => {
    const suggestions = [];
    
    for (let i = 1; i <= 4; i++) {
      let nameMatch, descMatch, extraMatch;
      
      if (patternType === 'discovery') {
        nameMatch = aiText.match(new RegExp(`DISH_${i}:[\\s\\S]*?Name:\\s*([^\\n\\r]+)`, 'i'));
        descMatch = aiText.match(new RegExp(`DISH_${i}:[\\s\\S]*?Description:\\s*([^\\n\\r]+)`, 'i'));
        extraMatch = aiText.match(new RegExp(`DISH_${i}:[\\s\\S]*?Appeal:\\s*([^\\n\\r]+)`, 'i'));
      } else if (patternType === 'ingredients') {
        nameMatch = aiText.match(new RegExp(`RECIPE_${i}:[\\s\\S]*?Name:\\s*([^\\n\\r]+)`, 'i'));
        descMatch = aiText.match(new RegExp(`RECIPE_${i}:[\\s\\S]*?Description:\\s*([^\\n\\r]+)`, 'i'));
        extraMatch = aiText.match(new RegExp(`RECIPE_${i}:[\\s\\S]*?Additional_Needed:\\s*([^\\n\\r]+)`, 'i'));
      } else if (patternType === 'context') {
        nameMatch = aiText.match(new RegExp(`RECIPE_${i}:[\\s\\S]*?Name:\\s*([^\\n\\r]+)`, 'i'));
        descMatch = aiText.match(new RegExp(`RECIPE_${i}:[\\s\\S]*?Description:\\s*([^\\n\\r]+)`, 'i'));
        extraMatch = aiText.match(new RegExp(`RECIPE_${i}:[\\s\\S]*?Context_Benefits:\\s*([^\\n\\r]+)`, 'i'));
      }
      
      if (nameMatch && descMatch) {
        suggestions.push({
          id: i,
          name: nameMatch[1].trim(),
          description: descMatch[1].trim(),
          extra: extraMatch ? extraMatch[1].trim() : '',
          patternType
        });
      }
    }
    
    return suggestions;
  };

  // Handle search with pattern recognition
  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      setQueryPattern(null);
      return;
    }

    setLoading(true);
    setShowResults(true);
    setApiKeyError(false);

    const pattern = detectQueryPattern(query);
    setQueryPattern(pattern);
    
    console.log('🔍 Detected pattern:', pattern);

    const aiResponse = await generateAIResponse(pattern, query);
    
    if (aiResponse) {
      if (aiResponse.type === 'recipe') {
        // Direct recipe - show immediately
        setSelectedRecipe(aiResponse.data);
        setAiRecommendations({
          prepTime: aiResponse.data.prepTime,
          nutrition: aiResponse.data.nutrition,
          alternateIngredients: aiResponse.data.alternatives,
          culturalInfo: aiResponse.data.culturalInfo,
          aiInstructions: aiResponse.data.instructions,
          aiGenerated: true
        });
        setShowResults(false);
      } else {
        // Suggestions - show for selection
        setSearchResults(aiResponse.data);
      }
    } else {
      setSearchResults([]);
    }
    
    setLoading(false);
  };

  // Handle recipe suggestion selection
  const handleSuggestionSelect = async (suggestion) => {
    setLoading(true);
    setShowResults(false);
    
    // Generate full recipe for selected suggestion
    const fullRecipeQuery = `Generate complete recipe for: ${suggestion.name}`;
    const pattern = { type: 'direct', query: fullRecipeQuery };
    
    const aiResponse = await generateAIResponse(pattern, fullRecipeQuery);
    
    if (aiResponse && aiResponse.type === 'recipe') {
      // Add context-specific enhancements based on original pattern
      const enhancedRecipe = {
        ...aiResponse.data,
        contextualNotes: getContextualNotes(suggestion, queryPattern.type)
      };
      
      setSelectedRecipe(enhancedRecipe);
      setAiRecommendations({
        prepTime: enhancedRecipe.prepTime,
        nutrition: enhancedRecipe.nutrition,
        alternateIngredients: enhancedRecipe.alternatives,
        culturalInfo: enhancedRecipe.culturalInfo,
        aiInstructions: enhancedRecipe.instructions,
        aiImage: enhancedRecipe.aiImage, // Include AI image from enhanced recipe
        aiGenerated: true,
        contextualNotes: enhancedRecipe.contextualNotes
      });
    }
    
    setLoading(false);
  };

  // Get contextual notes based on query pattern
  const getContextualNotes = (suggestion, patternType) => {
    switch (patternType) {
      case 'discovery':
        return {
          title: "Perfect Pairing",
          content: `This ${suggestion.name} ${suggestion.extra || 'complements your request beautifully'}.`,
          icon: "🤝"
        };
      case 'ingredients':
        return {
          title: "Ingredient Optimization",
          content: `Using your available ingredients optimally. ${suggestion.extra ? `You'll also need: ${suggestion.extra}` : ''}`,
          icon: "🥘"
        };
      case 'context':
        return {
          title: "Context Benefits",
          content: `${suggestion.extra || 'Perfect for your specific needs'}.`,
          icon: "⭐"
        };
      default:
        return null;
    }
  };

  const resetToHome = () => {
    setSelectedRecipe(null);
    setAiRecommendations(null);
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
    setApiKeyError(false);
    setLoading(false);
    setShowCulturalCards(false);
    setQueryPattern(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center space-x-2 cursor-pointer"
              onClick={resetToHome}
            >
              <ChefHat className="h-8 w-8 text-indigo-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                FlavorAI
              </span>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Sparkles className="h-4 w-4" />
                <span>AI-Native Recipe Discovery</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Cultural Story Cards Modal */}
        {showCulturalCards && selectedRecipe && aiRecommendations?.culturalInfo && (
          <CulturalStoryCards
            recipe={selectedRecipe}
            culturalInfo={aiRecommendations.culturalInfo}
            onClose={() => setShowCulturalCards(false)}
          />
        )}

        {/* API Key Setup Notice */}
        {apiKeyError && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-6 w-6 text-amber-600 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-amber-800 mb-2">🤖 AI Recipe Generation Requires Setup</h3>
                <div className="text-amber-700 space-y-3">
                  <div className="bg-white/50 rounded-lg p-4">
                    <h4 className="font-semibold text-amber-800 mb-2">🚀 Google Gemini (Required for AI Recipes)</h4>
                    <ol className="list-decimal list-inside space-y-1 ml-2 text-sm">
                      <li>Go to <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Google AI Studio</a></li>
                      <li>Click "Create API Key" (free with generous limits)</li>
                      <li>Add <code className="bg-amber-100 px-2 py-1 rounded">VITE_GEMINI_API_KEY=your_key_here</code> to your .env file</li>
                      <li>Restart the development server</li>
                    </ol>
                  </div>
                  
                  <p className="text-sm font-semibold">🎯 <strong>Features enabled with API:</strong></p>
                  <ul className="text-xs space-y-1 ml-4">
                    <li>• Complete recipe generation from any query</li>
                    <li>• Smart pattern recognition (direct, discovery, ingredients, context)</li>
                    <li>• Cultural heritage information</li>
                    <li>• Ingredient alternatives and nutritional data</li>
                    <li>• Context-specific cooking tips</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {!selectedRecipe ? (
          <div className="center-container">
            <div className="text-center mb-12 w-full">
              <h1 className="text-6xl font-bold text-gray-800 mb-4">
                What's Cooking?
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                AI-powered recipe discovery! Tell me what you want and I'll create the perfect recipe with cultural insights.
              </p>
              
              {/* Smart Query Examples */}
              <div className="mb-8 grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                <div className="bg-white/60 rounded-xl p-4 text-left">
                  <h3 className="font-semibold text-indigo-700 mb-2">🍽️ Direct Recipe</h3>
                  <p className="text-sm text-gray-600 mb-2">Get instant complete recipes:</p>
                  <div className="text-xs space-y-1">
                    <div className="bg-gray-100 px-2 py-1 rounded">"I want to eat chicken tikka masala"</div>
                    <div className="bg-gray-100 px-2 py-1 rounded">"Make me authentic pad thai"</div>
                  </div>
                </div>
                
                <div className="bg-white/60 rounded-xl p-4 text-left">
                  <h3 className="font-semibold text-green-700 mb-2">🔍 Discovery</h3>
                  <p className="text-sm text-gray-600 mb-2">Get suggestions to choose from:</p>
                  <div className="text-xs space-y-1">
                    <div className="bg-gray-100 px-2 py-1 rounded">"What's the best dish for naan bread?"</div>
                    <div className="bg-gray-100 px-2 py-1 rounded">"What goes well with jasmine rice?"</div>
                  </div>
                </div>
                
                <div className="bg-white/60 rounded-xl p-4 text-left">
                  <h3 className="font-semibold text-orange-700 mb-2">🥘 Ingredients</h3>
                  <p className="text-sm text-gray-600 mb-2">Use what you have:</p>
                  <div className="text-xs space-y-1">
                    <div className="bg-gray-100 px-2 py-1 rounded">"I have chicken, onions, and rice"</div>
                    <div className="bg-gray-100 px-2 py-1 rounded">"Recipe with tomatoes and basil"</div>
                  </div>
                </div>
                
                <div className="bg-white/60 rounded-xl p-4 text-left">
                  <h3 className="font-semibold text-purple-700 mb-2">⚡ Context</h3>
                  <p className="text-sm text-gray-600 mb-2">Perfect for your situation:</p>
                  <div className="text-xs space-y-1">
                    <div className="bg-gray-100 px-2 py-1 rounded">"Quick lunch for office"</div>
                    <div className="bg-gray-100 px-2 py-1 rounded">"Healthy dinner for weight loss"</div>
                  </div>
                </div>
              </div>
              
              {/* Search Box */}
              <div className="relative max-w-2xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                    placeholder="Tell me what you want to cook..."
                    className="w-full pl-12 pr-16 py-4 text-lg border-2 border-transparent rounded-full shadow-lg focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all"
                    disabled={loading}
                  />
                  <button
                    onClick={() => handleSearch(searchQuery)}
                    disabled={loading || !searchQuery.trim()}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 disabled:bg-gray-400 transition-colors"
                  >
                    {loading ? <Loader className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
                  </button>
                </div>
                
                {/* Query Pattern Indicator */}
                {queryPattern && (
                  <div className="mt-2 text-center">
                    <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
                      🤖 Pattern: {queryPattern.type.charAt(0).toUpperCase() + queryPattern.type.slice(1)}
                    </span>
                  </div>
                )}
                
                {/* Loading State */}
                {loading && (
                  <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center justify-center space-x-2">
                      <Sparkles className="h-5 w-5 text-blue-600 animate-spin" />
                      <span className="text-blue-800">AI is creating your recipe...</span>
                    </div>
                  </div>
                )}
                
                {/* Search Results/Suggestions */}
                {showResults && searchResults.length > 0 && !loading && (
                  <div className="mt-4 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100">
                      <h3 className="font-semibold text-gray-800">
                        {queryPattern?.type === 'discovery' && '🔍 Recommended Dishes'}
                        {queryPattern?.type === 'ingredients' && '🥘 Recipes Using Your Ingredients'}
                        {queryPattern?.type === 'context' && '⭐ Perfect for Your Needs'}
                        {(!queryPattern || queryPattern?.type === 'direct') && '🍽️ Recipe Suggestions'}
                      </h3>
                      <p className="text-sm text-gray-600">Choose one to get the complete recipe with cultural insights</p>
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto">
                      {searchResults.map((suggestion, index) => (
                        <div
                          key={suggestion.id || index}
                          onClick={() => handleSuggestionSelect(suggestion)}
                          className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-800 mb-1">{suggestion.name}</h4>
                              <p className="text-sm text-gray-600 mb-2">{suggestion.description}</p>
                              {suggestion.extra && (
                                <div className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full inline-block">
                                  {queryPattern?.type === 'discovery' && `✨ ${suggestion.extra}`}
                                  {queryPattern?.type === 'ingredients' && `+ ${suggestion.extra}`}
                                  {queryPattern?.type === 'context' && `⚡ ${suggestion.extra}`}
                                </div>
                              )}
                            </div>
                            <div className="ml-4 flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg">
                              <ChefHat className="h-6 w-6 text-indigo-600" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {showResults && searchResults.length === 0 && !loading && searchQuery.trim() && (
                  <div className="mt-4 bg-white rounded-2xl shadow-xl border border-gray-100 p-6 text-center">
                    <div className="text-gray-600">
                      <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p>Unable to generate recipes. Please check your AI configuration.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Recipe Details & AI Recommendations */
          <div className="space-y-8">
            {/* Back Button */}
            <button
              onClick={resetToHome}
              className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <span>← Back to search</span>
            </button>

            {/* Recipe Header */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-gray-800 mb-2">{selectedRecipe.name}</h1>
                  <p className="text-lg text-gray-600 mb-4">{selectedRecipe.description}</p>
                  
                  {/* Recipe Meta Info */}
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{selectedRecipe.prepTime} min</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Utensils className="h-4 w-4" />
                      <span>{selectedRecipe.servings} servings</span>
                    </div>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                      🤖 AI Generated
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Contextual Notes */}
              {aiRecommendations?.contextualNotes && (
                <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">{aiRecommendations.contextualNotes.icon}</span>
                    <h3 className="font-semibold text-blue-800">{aiRecommendations.contextualNotes.title}</h3>
                  </div>
                  <p className="text-blue-700 text-sm">{aiRecommendations.contextualNotes.content}</p>
                </div>
              )}
              
              {/* Recipe Image - AI Generated or Placeholder */}
              {selectedRecipe.aiImage || aiRecommendations?.aiImage ? (
                <div className="relative">
                  <img 
                    src={selectedRecipe.aiImage || aiRecommendations.aiImage} 
                    alt={`AI-generated ${selectedRecipe.name}`}
                    className="w-full h-64 object-cover rounded-xl mb-6"
                    onError={(e) => { 
                      console.log('❌ AI image failed to load');
                      e.target.style.display = 'none'; 
                    }}
                  />
                  <div className="absolute top-2 right-2 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    🎨 AI Generated Image
                  </div>
                </div>
              ) : (
                <div className="w-full h-64 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl mb-6 flex items-center justify-center">
                  <div className="text-center">
                    <ChefHat className="h-20 w-20 text-indigo-600 mx-auto mb-4" />
                    <p className="text-indigo-800 font-semibold">{selectedRecipe.name}</p>
                    <p className="text-xs text-indigo-600 mt-2">🤖 AI-Generated Recipe</p>
                    {loading && <p className="text-xs text-indigo-600 mt-2">🎨 Generating AI image...</p>}
                  </div>
                </div>
              )}
              
              {/* Ingredients List */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Utensils className="h-5 w-5 text-indigo-600 mr-2" />
                  Ingredients ({selectedRecipe.ingredients.length} items)
                </h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="grid md:grid-cols-2 gap-2">
                    {selectedRecipe.ingredients.map((ingredient, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-2 py-2 border-b border-gray-200 last:border-b-0"
                      >
                        <span className="text-indigo-600 font-semibold text-sm min-w-[24px]">
                          {index + 1}.
                        </span>
                        <span className="text-gray-700 text-sm flex-1">
                          {ingredient}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI-Generated Instructions */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Clock className="h-5 w-5 text-green-600 mr-2" />
                  Instructions
                  <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">🤖 AI Generated</span>
                </h3>
                
                <div className="bg-green-50 rounded-xl p-4">
                  <div className="space-y-3">
                    {selectedRecipe.instructions.map((step, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold min-w-[24px]">
                          {index + 1}
                        </span>
                        <p className="text-gray-700 text-sm flex-1 leading-relaxed">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Recommendations */}
            {aiRecommendations && (
              <div className="grid md:grid-cols-2 gap-6">
                {/* Preparation Time & Nutrition */}
                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <Clock className="h-5 w-5 text-indigo-600" />
                    <h3 className="text-xl font-semibold">Preparation Time</h3>
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">AI Calculated</span>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-indigo-600">{aiRecommendations.prepTime} min</p>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <Apple className="h-5 w-5 text-green-600" />
                    <h3 className="text-xl font-semibold">Nutritional Value</h3>
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">AI Calculated</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm max-w-xs mx-auto">
                    <div className="text-center">Calories: <span className="font-semibold block">{aiRecommendations.nutrition.calories}</span></div>
                    <div className="text-center">Protein: <span className="font-semibold block">{aiRecommendations.nutrition.protein}g</span></div>
                    <div className="text-center">Carbs: <span className="font-semibold block">{aiRecommendations.nutrition.carbs}g</span></div>
                    <div className="text-center">Fat: <span className="font-semibold block">{aiRecommendations.nutrition.fat}g</span></div>
                  </div>
                </div>

                {/* Alternate Ingredients */}
                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg md:col-span-2">
                  <div className="flex items-center space-x-2 mb-4">
                    <Utensils className="h-5 w-5 text-orange-600" />
                    <h3 className="text-xl font-semibold">Alternate Ingredients</h3>
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">AI Generated</span>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    {aiRecommendations.alternateIngredients.map((alt, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-600">Instead of <strong>{alt.original}</strong></p>
                        <p className="font-semibold text-gray-800">{alt.substitute}</p>
                        <p className="text-xs text-gray-500">Ratio: {alt.ratio}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cultural & Historical Information */}
                {aiRecommendations.culturalInfo && (
                  <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg md:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-5 w-5 text-purple-600" />
                        <h3 className="text-xl font-semibold">Cultural Heritage & History</h3>
                        <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">🤖 AI Generated</span>
                      </div>
                      
                      <button
                        onClick={() => setShowCulturalCards(true)}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                      >
                        📖 Story Cards
                      </button>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        {aiRecommendations.culturalInfo.origin && (
                          <div className="bg-purple-50 rounded-lg p-4">
                            <h4 className="font-semibold text-purple-800 mb-2 flex items-center">
                              🌍 Origin
                            </h4>
                            <p className="text-purple-700 text-sm">{aiRecommendations.culturalInfo.origin}</p>
                          </div>
                        )}
                        
                        {aiRecommendations.culturalInfo.history && (
                          <div className="bg-blue-50 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                              📜 History
                            </h4>
                            <p className="text-blue-700 text-sm">{aiRecommendations.culturalInfo.history}</p>
                          </div>
                        )}
                        
                        {aiRecommendations.culturalInfo.significance && (
                          <div className="bg-amber-50 rounded-lg p-4">
                            <h4 className="font-semibold text-amber-800 mb-2 flex items-center">
                              🎭 Cultural Significance
                            </h4>
                            <p className="text-amber-700 text-sm">{aiRecommendations.culturalInfo.significance}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-4">
                        {aiRecommendations.culturalInfo.serving && (
                          <div className="bg-rose-50 rounded-lg p-4">
                            <h4 className="font-semibold text-rose-800 mb-2 flex items-center">
                              🍽️ Traditional Serving
                            </h4>
                            <p className="text-rose-700 text-sm">{aiRecommendations.culturalInfo.serving}</p>
                          </div>
                        )}
                        
                        {aiRecommendations.culturalInfo.tips && (
                          <div className="bg-indigo-50 rounded-lg p-4">
                            <h4 className="font-semibold text-indigo-800 mb-2 flex items-center">
                              💡 Cultural Cooking Tips
                            </h4>
                            <p className="text-indigo-700 text-sm">{aiRecommendations.culturalInfo.tips}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white/60 backdrop-blur-md border-t border-white/20 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p>Built with ❤️ by HumanXAI for AI-native cooking</p>
            <p className="mt-2">🤖 100% AI-generated recipes with cultural heritage</p>
            <p className="mt-2">✨ Smart pattern recognition: Direct • Discovery • Ingredients • Context</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;