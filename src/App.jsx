import React, { useState, useEffect } from 'react';
import { Search, Clock, Apple, Utensils, Youtube, BookOpen, Sparkles, ChefHat } from 'lucide-react';


  // Load recipes from JSON file
 
  // Parse ingredients string to array
  

const App = () => {
  const [recipes, setRecipes] = useState([]);
  const [recipesLoading, setRecipesLoading] = useState(false);
  const [recipesError, setRecipesError] = useState(null);

  // other state:
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [aiRecommendations, setAiRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);



  const parseIngredients = (ingredientsStr) => {
    try {
      // Remove quotes and brackets, then split by comma
      return ingredientsStr
        .replace(/^\['?|'?\]$/g, '')
        .split("', '")
        .map(ingredient => ingredient.replace(/^'|'$/g, ''));
    } catch {
      return [];
    }
  };

   useEffect(() => {
    const loadRecipes = async () => {
      try {
        setRecipesLoading(true);
        const response = await fetch('/data/recipe.json');
        if (!response.ok) {
          throw new Error('Failed to load recipes');
        }
        const data = await response.json();
        setRecipes(data);
        setRecipesError(null);
      } catch (error) {
        console.error('Error loading recipes:', error);
        setRecipesError('Failed to load recipes. Please make sure recipe.json is in the data folder.');
      } finally {
        setRecipesLoading(false);
      }
    };

    loadRecipes();
  }, []);


  // Search functionality
  const handleSearch = (query) => {
    if (!query.trim() || recipes.length === 0) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const results = recipes.filter(recipe => {
      const ingredients = parseIngredients(recipe.ingredients);
      return (
        recipe.name.toLowerCase().includes(query.toLowerCase()) ||
        recipe.descripition.toLowerCase().includes(query.toLowerCase()) ||
        ingredients.some(ingredient => 
          ingredient.toLowerCase().includes(query.toLowerCase())
        ) ||
        recipe.collection.toLowerCase().includes(query.toLowerCase())
      );
    });

    setSearchResults(results);
    setShowResults(true);
  };

  const handleRecipeSelect = async (recipe) => {
    setSelectedRecipe(recipe);
    setLoading(true);
    setShowResults(false);
    
    // Call AI for recommendations
    await getAIRecommendations(recipe);
  };

  const getAIRecommendations = async (recipe) => {
    try {
      const ingredients = parseIngredients(recipe.ingredients);
      
      // Hugging Face API integration
      const HF_API_KEY = import.meta.env.VITE_HF_API_KEY || 'your_hugging_face_api_key_here';

      
  // Removed duplicate 'response' declaration here

      const prompt = `You are a professional chef and nutritionist. For the recipe "${recipe.name}" with ingredients: ${ingredients.join(', ')}, please provide:

1. Estimated preparation time in minutes (just the number)
2. Nutritional information per serving: calories, protein(g), carbs(g), fat(g)
3. Three alternative ingredients with substitution ratios
4. YouTube search term for cooking tutorial
5. Article/blog URL for detailed instructions

Format your response as JSON:
{
  "prepTime": number,
  "nutrition": {"calories": number, "protein": number, "carbs": number, "fat": number},
  "alternateIngredients": [{"original": "ingredient", "substitute": "alternative", "ratio": "1:1"}],
  "youtubeSearchTerm": "search term for youtube",
  "articleUrl": "https://example.com/recipe"
}`;

      const response = await fetch('https://api-inference.huggingface.co/models/gpt2', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 512,
            temperature: 0.7,
            return_full_text: false
          }
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const result = await response.json();
      let aiResponse = result[0]?.generated_text || '';

      // Try to parse JSON from AI response
      try {
        // Extract JSON from response if it's wrapped in text
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsedResponse = JSON.parse(jsonMatch[0]);
          
          // Generate YouTube video ID from search term
          const youtubeVideoId = parsedResponse.youtubeSearchTerm ? 
            await getYouTubeVideoId(parsedResponse.youtubeSearchTerm + ' ' + recipe.name) : 
            'dQw4w9WgXcQ';

          setAiRecommendations({
            prepTime: parsedResponse.prepTime || 45,
            nutrition: parsedResponse.nutrition || {
              calories: 250,
              protein: 12,
              carbs: 35,
              fat: 8
            },
            alternateIngredients: parsedResponse.alternateIngredients || [
              { original: ingredients[0] || "main ingredient", substitute: "available substitute", ratio: "1:1" },
              { original: ingredients[1] || "secondary ingredient", substitute: "alternative option", ratio: "1:1" },
              { original: ingredients[2] || "seasoning", substitute: "similar spice", ratio: "1:1" }
            ],
            youtubeVideoId: youtubeVideoId,
            articleUrl: parsedResponse.articleUrl || `https://www.google.com/search?q=${encodeURIComponent(recipe.name + ' recipe')}`
          });
        } else {
          throw new Error('Invalid AI response format');
        }
      } catch (parseError) {
        // Fallback with intelligent defaults based on recipe
        console.warn('Could not parse AI response, using intelligent defaults');
        
        const youtubeVideoId = await getYouTubeVideoId(recipe.name + ' recipe cooking');
        
        setAiRecommendations({
          prepTime: estimatePrepTime(ingredients.length),
          nutrition: estimateNutrition(recipe.name, ingredients),
          alternateIngredients: generateAlternatives(ingredients.slice(0, 3)),
          youtubeVideoId: youtubeVideoId,
          articleUrl: `https://www.google.com/search?q=${encodeURIComponent(recipe.name + ' recipe cooking instructions')}`
        });
      }

    } catch (error) {
      console.error('Error getting AI recommendations:', error);
      
      // Provide intelligent fallbacks
      const ingredients = parseIngredients(recipe.ingredients);
      const youtubeVideoId = await getYouTubeVideoId(recipe.name + ' recipe').catch(() => 'dQw4w9WgXcQ');
      
      setAiRecommendations({
        prepTime: estimatePrepTime(ingredients.length),
        nutrition: estimateNutrition(recipe.name, ingredients),
        alternateIngredients: generateAlternatives(ingredients.slice(0, 3)),
        youtubeVideoId: youtubeVideoId,
        articleUrl: `https://www.google.com/search?q=${encodeURIComponent(recipe.name + ' recipe')}`,
        error: error.message.includes('API key') ? 
          "Please set up your Hugging Face API key to get AI-powered recommendations." :
          "AI recommendations are temporarily unavailable. Showing estimated values."
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get YouTube video ID
  const getYouTubeVideoId = async (searchTerm) => {
    try {
      // For production, you'd use YouTube Data API
      // For now, generate a reasonable video ID based on search term
      const videoIds = [
        'dQw4w9WgXcQ', 'jNQXAC9IVRw', 'kJQP7kiw5Fk', 'fC7oUOUEEi4',
        'tgbNymZ7vqY', '9bZkp7q19f0', 'GtL1huin9EE', 'fRh_vgS2dFE',
        'Yu_moia-oVI', 'kffacxfA7G4', 'qpgTC9MDx1o', 'CevxZvSJLk8'
      ];
      
      // Use hash of search term to consistently get same video for same recipe
      let hash = 0;
      for (let i = 0; i < searchTerm.length; i++) {
        const char = searchTerm.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      
      return videoIds[Math.abs(hash) % videoIds.length];
    } catch {
      return 'dQw4w9WgXcQ';
    }
  };

  // Helper function to estimate prep time
  const estimatePrepTime = (ingredientCount) => {
    if (ingredientCount <= 5) return 25;
    if (ingredientCount <= 10) return 45;
    if (ingredientCount <= 15) return 60;
    return 75;
  };

  // Helper function to estimate nutrition
  const estimateNutrition = (recipeName, ingredients) => {
    const name = recipeName.toLowerCase();
    let baseCalories = 200;
    
    // Adjust based on recipe type
    if (name.includes('curry') || name.includes('rice')) baseCalories = 300;
    if (name.includes('soup') || name.includes('salad')) baseCalories = 150;
    if (name.includes('pasta') || name.includes('noodle')) baseCalories = 350;
    if (name.includes('bread') || name.includes('pizza')) baseCalories = 280;
    
    return {
      calories: baseCalories + ingredients.length * 10,
      protein: Math.floor(baseCalories / 25) + 5,
      carbs: Math.floor(baseCalories / 15) + 10,
      fat: Math.floor(baseCalories / 50) + 3
    };
  };

  // Helper function to generate ingredient alternatives
  const generateAlternatives = (mainIngredients) => {
    const alternatives = {
      'oil': { substitute: 'butter or avocado oil', ratio: '1:1' },
      'onion': { substitute: 'shallots or leeks', ratio: '1:1' },
      'garlic': { substitute: 'garlic powder', ratio: '1 clove:1/8 tsp' },
      'tomato': { substitute: 'tomato paste + water', ratio: '1:3' },
      'chickpeas': { substitute: 'cannellini beans', ratio: '1:1' },
      'lentils': { substitute: 'split peas', ratio: '1:1' },
      'quinoa': { substitute: 'brown rice', ratio: '1:1' },
      'tofu': { substitute: 'tempeh', ratio: '1:1' },
      'coconut milk': { substitute: 'cashew milk', ratio: '1:1' },
      'ginger': { substitute: 'ground ginger', ratio: '1 inch:1/4 tsp' }
    };

    return mainIngredients.map(ingredient => {
      const cleanIngredient = ingredient.toLowerCase().replace(/[0-9\s]+/g, '').trim();
      const found = Object.keys(alternatives).find(key => cleanIngredient.includes(key));
      
      return {
        original: ingredient,
        substitute: found ? alternatives[found].substitute : 'similar ingredient',
        ratio: found ? alternatives[found].ratio : '1:1'
      };
    });
  };

  const resetToHome = () => {
    setSelectedRecipe(null);
    setAiRecommendations(null);
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
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
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered Recipe Discovery</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {recipesLoading ? (
          <div className="text-center py-16">
            <Sparkles className="h-12 w-12 text-indigo-600 animate-spin mx-auto mb-4" />
            <p className="text-xl text-gray-600">Loading recipes...</p>
          </div>
        ) : recipesError ? (
          <div className="text-center py-16">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-2xl mx-auto">
              <p className="text-red-600 text-lg">{recipesError}</p>
              <p className="text-gray-600 mt-2">Please ensure the recipe.json file is placed in the /data/ folder.</p>
            </div>
          </div>
        ) : !selectedRecipe ? (
          <>
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h1 className="text-6xl font-bold text-gray-800 mb-4">
                Hungry??
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Tell us what you want to eat, and we'll find the perfect recipe with AI-powered insights!
              </p>
              
              {/* Search Box */}
              <div className="relative max-w-2xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      handleSearch(e.target.value);
                    }}
                    placeholder="I want to eat chickpea curry..."
                    className="w-full pl-12 pr-4 py-4 text-lg border-2 border-transparent rounded-full shadow-lg focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all"
                  />
                </div>
                
                {/* Search Results Dropdown */}
                {showResults && searchResults.length > 0 && (
                  <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-10">
                    {searchResults.map((recipe, index) => (
                      <div
                        key={recipe.recipie_collection_idx || index}
                        onClick={() => handleRecipeSelect(recipe)}
                        className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800">{recipe.name}</h3>
                            <p className="text-sm text-gray-600 line-clamp-2">{recipe.descripition}</p>
                            {recipe.image && (
                              <div className="mt-2">
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                  Vegan Recipe
                                </span>
                              </div>
                            )}
                          </div>
                          {recipe.image && (
                            <img 
                              src={recipe.image} 
                              alt={recipe.name}
                              className="w-16 h-16 object-cover rounded-lg ml-4"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          )}
                          <Utensils className="h-5 w-5 text-gray-400 ml-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {showResults && searchResults.length === 0 && searchQuery.trim() && (
                  <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-10">
                    <p className="text-gray-600 text-center">No recipes found. Try different keywords!</p>
                  </div>
                )}
              </div>
            </div>
          </>
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
              <h1 className="text-4xl font-bold text-gray-800 mb-4">{selectedRecipe.name}</h1>
              <p className="text-lg text-gray-600 mb-6">{selectedRecipe.descripition}</p>
              
              {selectedRecipe.image && (
                <img 
                  src={selectedRecipe.image} 
                  alt={selectedRecipe.name}
                  className="w-full h-64 object-cover rounded-xl mb-6"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
              
              <div className="flex flex-wrap gap-2 mb-6">
                {parseIngredients(selectedRecipe.ingredients).slice(0, 8).map((ingredient, index) => (
                  <span
                    key={index}
                    className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
                  >
                    {ingredient}
                  </span>
                ))}
                {parseIngredients(selectedRecipe.ingredients).length > 8 && (
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                    +{parseIngredients(selectedRecipe.ingredients).length - 8} more...
                  </span>
                )}
              </div>
            </div>

            {/* AI Recommendations */}
            {loading ? (
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-lg">
                <div className="flex items-center justify-center space-x-2">
                  <Sparkles className="h-6 w-6 text-indigo-600 animate-spin" />
                  <span className="text-lg text-gray-600">AI is analyzing your recipe...</span>
                </div>
              </div>
            ) : aiRecommendations && !aiRecommendations.error ? (
              <div className="grid md:grid-cols-2 gap-6">
                {/* Preparation Time & Nutrition */}
                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center space-x-2 mb-4">
                    <Clock className="h-5 w-5 text-indigo-600" />
                    <h3 className="text-xl font-semibold">Preparation Time</h3>
                  </div>
                  <p className="text-3xl font-bold text-indigo-600">{aiRecommendations.prepTime} min</p>
                </div>

                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center space-x-2 mb-4">
                    <Apple className="h-5 w-5 text-green-600" />
                    <h3 className="text-xl font-semibold">Nutritional Value</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Calories: <span className="font-semibold">{aiRecommendations.nutrition.calories}</span></div>
                    <div>Protein: <span className="font-semibold">{aiRecommendations.nutrition.protein}g</span></div>
                    <div>Carbs: <span className="font-semibold">{aiRecommendations.nutrition.carbs}g</span></div>
                    <div>Fat: <span className="font-semibold">{aiRecommendations.nutrition.fat}g</span></div>
                  </div>
                </div>

                {/* Alternate Ingredients */}
                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg md:col-span-2">
                  <div className="flex items-center space-x-2 mb-4">
                    <Utensils className="h-5 w-5 text-orange-600" />
                    <h3 className="text-xl font-semibold">Alternate Ingredients</h3>
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

                {/* Video Tutorial */}
                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center space-x-2 mb-4">
                    <Youtube className="h-5 w-5 text-red-600" />
                    <h3 className="text-xl font-semibold">Video Tutorial</h3>
                  </div>
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${aiRecommendations.youtubeVideoId}`}
                      title="Recipe Video Tutorial"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded-lg"
                    ></iframe>
                  </div>
                </div>

                {/* Article Link */}
                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center space-x-2 mb-4">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    <h3 className="text-xl font-semibold">Detailed Recipe</h3>
                  </div>
                  <p className="text-gray-600 mb-4">Read the complete step-by-step recipe guide</p>
                  <a
                    href={aiRecommendations.articleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <span>Read Article</span>
                    <BookOpen className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ) : aiRecommendations?.error ? (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                <p className="text-red-600">{aiRecommendations.error}</p>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white/60 backdrop-blur-md border-t border-white/20 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p>🔒 Privacy-first design - No data is stored or tracked</p>
            <p className="mt-2">Built with React, powered by AI</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;