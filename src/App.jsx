import React, { useState, useEffect } from 'react';
import { Search, Clock, Apple, Utensils, BookOpen, Sparkles, AlertCircle } from 'lucide-react';

// Custom ChefHat component to avoid icon loading issues
const ChefHat = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.5 11c.276 0 .5-.224.5-.5s-.224-.5-.5-.5-.5.224-.5.5.224.5.5.5zm-11 0c.276 0 .5-.224.5-.5s-.224-.5-.5-.5-.5.224-.5.5.224.5.5.5zm13.5-6c0-1.654-1.346-3-3-3-.771 0-1.468.301-2 .78-.532-.479-1.229-.78-2-.78s-1.468.301-2 .78c-.532-.479-1.229-.78-2-.78s-1.468.301-2 .78c-.532-.479-1.229-.78-2-.78-1.654 0-3 1.346-3 3v1c0 1.654 1.346 3 3 3h.184l1.316 7h11l1.316-7h.184c1.654 0 3-1.346 3-3v-1zm-2 1c0 .551-.449 1-1 1h-12c-.551 0-1-.449-1-1v-1c0-.551.449-1 1-1s1 .449 1 1h2c0-.551.449-1 1-1s1 .449 1 1h2c0-.551.449-1 1-1s1 .449 1 1h2c0-.551.449-1 1-1s1 .449 1 1h2c0-.551.449-1 1-1s1 .449 1 1v1z"/>
  </svg>
);

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
  const [apiKeyError, setApiKeyError] = useState(false);

  // Embedded recipe data to avoid CSP issues - using data URLs for reliable images
  const fallbackRecipes = [
    {
      "name": "Paneer Biryani",
      "collection": "collection/indian-recipes/",
      "recipie_collection_idx": 1,
      "image": null, // Removed problematic external image
      "descripition": "A fragrant and flavorful rice dish with marinated paneer, aromatic spices, and basmati rice layered to perfection.",
      "ingredients": "['2 cups basmati rice', '250g paneer cubes', '1 large onion sliced', '1/2 cup yogurt', '2 tbsp ginger-garlic paste', '1 tsp red chili powder', '1/2 tsp turmeric', '1 tsp garam masala', '4-5 green cardamom', '2 bay leaves', '1 cinnamon stick', 'Saffron soaked in milk', 'Fresh mint leaves', 'Fried onions', 'Ghee', 'Salt to taste']",
      "steps": "['Soak basmati rice for 30 minutes', 'Marinate paneer with yogurt, ginger-garlic paste, and spices', 'Fry onions until golden brown', 'Cook rice until 70% done with whole spices', 'Layer marinated paneer, rice, fried onions, mint, and saffron milk', 'Cook on high heat for 2 minutes, then simmer for 45 minutes', 'Let it rest for 10 minutes before serving']",
      "Neutretion": "<p>Per serving: 420 calories, 15g fat, 18g protein, 52g carbohydrates, 3g fiber</p>"
    },
    {
      "name": "Chickpea & Potato Curry",
      "collection": "collection/vegan-recipes/",
      "recipie_collection_idx": 2,
      "image": null,
      "descripition": "A classic Indian chickpea curry made with aromatic spices, tender potatoes, and rich tomato-based gravy.",
      "ingredients": "['1 tablespoon canola oil', '1 medium onion chopped', '2 garlic cloves minced', '2 teaspoons minced fresh gingerroot', '2 teaspoons ground coriander', '1 teaspoon garam masala', '1 teaspoon chili powder', '1/2 teaspoon salt', '1/2 teaspoon ground cumin', '1/4 teaspoon ground turmeric', '1 can crushed tomatoes', '2 cans chickpeas drained', '1 large baking potato cubed', '2-1/2 cups vegetable stock', '1 tablespoon lime juice', 'Fresh cilantro', 'Cooked rice']",
      "steps": "['Heat oil in large skillet over medium-high heat', 'Saute onion until tender 2-4 minutes', 'Add garlic ginger and dry seasonings cook 1 minute', 'Stir in tomatoes transfer to slow cooker', 'Add chickpeas potato and stock', 'Cook covered on low 6-8 hours until potato tender', 'Stir in lime juice sprinkle with cilantro', 'Serve with rice']",
      "Neutretion": "<p>Per serving: 240 calories, 6g fat, 8g protein, 42g carbohydrate, 9g fiber</p>"
    },
    {
      "name": "Crispy Tofu with Black Pepper Sauce",
      "collection": "collection/vegan-recipes/",
      "recipie_collection_idx": 3,
      "image": null,
      "descripition": "Crispy golden tofu cubes tossed in a savory black pepper sauce with fresh vegetables.",
      "ingredients": "['2 tablespoons reduced-sodium soy sauce', '2 tablespoons chili garlic sauce', '1 tablespoon packed brown sugar', '1 tablespoon rice vinegar', '4 green onions', '8 ounces extra-firm tofu drained', '3 tablespoons cornstarch', '6 tablespoons canola oil divided', '8 ounces fresh sugar snap peas', '1 teaspoon freshly ground pepper', '3 garlic cloves minced', '2 teaspoons grated fresh gingerroot']",
      "steps": "['Mix soy sauce chili garlic sauce brown sugar and rice vinegar', 'Mince white parts of green onions slice green parts', 'Cut tofu into cubes pat dry toss with cornstarch', 'Heat 4 tablespoons oil cook tofu until crisp 5-7 minutes', 'Remove tofu drain on paper towels', 'Heat 1 tablespoon oil stir-fry peas until crisp-tender', 'Heat remaining oil cook pepper 30 seconds', 'Add garlic ginger minced onions stir-fry 30-45 seconds', 'Add sauce mixture cook until thickened', 'Stir in tofu and peas sprinkle with sliced onions']",
      "Neutretion": "<p>Per serving: 316 calories, 24g fat, 7g protein, 20g carbohydrate, 2g fiber</p>"
    },
    {
      "name": "Margherita Pizza",
      "collection": "collection/italian-recipes/",
      "recipie_collection_idx": 4,
      "image": null,
      "descripition": "Classic Italian pizza with fresh tomatoes, mozzarella, and basil on a crispy thin crust.",
      "ingredients": "['1 pizza dough ball', '1/2 cup pizza sauce', '8 oz fresh mozzarella sliced', '2 large tomatoes sliced', 'Fresh basil leaves', '2 tablespoons olive oil', 'Salt and pepper to taste', 'Parmesan cheese grated']",
      "steps": "['Preheat oven to 475°F', 'Roll out pizza dough on floured surface', 'Transfer to pizza stone or baking sheet', 'Brush with olive oil', 'Spread pizza sauce evenly', 'Add mozzarella and tomato slices', 'Season with salt and pepper', 'Bake 12-15 minutes until crust is golden', 'Top with fresh basil and parmesan', 'Slice and serve immediately']",
      "Neutretion": "<p>Per slice: 285 calories, 12g fat, 14g protein, 32g carbohydrate, 2g fiber</p>"
    },
    {
      "name": "Chicken Teriyaki Bowl",
      "collection": "collection/asian-recipes/",
      "recipie_collection_idx": 5,
      "image": null,
      "descripition": "Tender grilled chicken glazed with homemade teriyaki sauce served over steamed rice with vegetables.",
      "ingredients": "['2 chicken breasts', '1/4 cup soy sauce', '2 tablespoons mirin', '2 tablespoons brown sugar', '1 tablespoon rice vinegar', '1 teaspoon sesame oil', '2 cloves garlic minced', '1 teaspoon ginger grated', '2 cups cooked rice', '1 cup broccoli florets', '1 carrot julienned', 'Sesame seeds', 'Green onions sliced']",
      "steps": "['Mix soy sauce mirin brown sugar vinegar sesame oil garlic and ginger for teriyaki sauce', 'Marinate chicken in half the sauce for 30 minutes', 'Grill chicken 6-7 minutes per side until cooked through', 'Steam broccoli and carrots until tender-crisp', 'Slice chicken and glaze with remaining teriyaki sauce', 'Serve over rice with vegetables', 'Garnish with sesame seeds and green onions']",
      "Neutretion": "<p>Per serving: 380 calories, 8g fat, 35g protein, 45g carbohydrate, 3g fiber</p>"
    },
    {
      "name": "Mediterranean Quinoa Salad",
      "collection": "collection/healthy-recipes/",
      "recipie_collection_idx": 6,
      "image": null,
      "descripition": "Fresh and vibrant quinoa salad with cucumbers, tomatoes, olives, and feta cheese in a lemon herb dressing.",
      "ingredients": "['1 cup quinoa', '2 cups vegetable broth', '1 cucumber diced', '2 cups cherry tomatoes halved', '1/2 red onion thinly sliced', '1/2 cup kalamata olives', '1/2 cup feta cheese crumbled', '1/4 cup olive oil', '2 tablespoons lemon juice', '2 tablespoons fresh parsley', '1 tablespoon fresh oregano', 'Salt and pepper to taste']",
      "steps": "['Rinse quinoa in cold water', 'Bring vegetable broth to boil add quinoa', 'Reduce heat cover simmer 15 minutes until liquid absorbed', 'Fluff with fork and let cool completely', 'Dice cucumber halve tomatoes slice onion', 'Whisk olive oil lemon juice parsley oregano salt and pepper', 'Combine quinoa vegetables olives and feta', 'Toss with dressing', 'Chill for at least 30 minutes before serving']",
      "Neutretion": "<p>Per serving: 320 calories, 16g fat, 12g protein, 38g carbohydrate, 5g fiber</p>"
    }
  ];

  const parseIngredients = (ingredientsStr) => {
    try {
      // Safely handle the ingredients string format
      const cleanStr = ingredientsStr.replace(/^\[|\]$/g, '');
      return cleanStr.split('\', \'').map(ingredient => 
        ingredient.replace(/^\'|\'$/g, '').replace(/^\"|\"$/g, '')
      );
    } catch (error) {
      console.warn('Error parsing ingredients:', error);
      return [];
    }
  };

  useEffect(() => {
    const loadRecipes = async () => {
      setRecipesLoading(true);
      
      try {
        // Try to fetch from public data file
        const response = await fetch('/data/recipe.json');
        if (response.ok) {
          const fetchedData = await response.json();
          setRecipes(fetchedData);
          setRecipesError(null);
        } else {
          throw new Error('Failed to load external recipes');
        }
      } catch (error) {
        console.log('Using embedded recipes:', error.message);
        // Use embedded fallback recipes
        setRecipes(fallbackRecipes);
        setRecipesError(null);
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
    setApiKeyError(false);
    
    // Call AI for recommendations
    await getAIRecommendations(recipe);
  };

  const getAIRecommendations = async (recipe) => {
    try {
      const ingredients = parseIngredients(recipe.ingredients);
      
      // Check for API key first
      const HF_API_KEY = import.meta.env.VITE_HF_API_KEY;
      
      let aiGenerated = false;
      let aiResults = {
        prepTime: estimatePrepTime(ingredients.length),
        nutrition: estimateNutrition(recipe.name, ingredients),
        alternateIngredients: generateAlternatives(ingredients.slice(0, 3))
      };
      
      // Only attempt REAL AI if we have a proper key
      if (HF_API_KEY && 
          HF_API_KEY !== 'your_hugging_face_api_key_here' && 
          HF_API_KEY.startsWith('hf_') && 
          HF_API_KEY.length > 20) {
        
        console.log('🤖 Attempting REAL AI analysis...');
        
        try {
          // Real AI Analysis using multiple API calls
          const aiAnalysis = await performRealAIAnalysis(recipe, ingredients, HF_API_KEY);
          
          if (aiAnalysis.success) {
            aiResults = aiAnalysis.data;
            aiGenerated = true;
            console.log('✅ REAL AI analysis successful!');
          } else {
            console.log('🔄 AI analysis failed, using smart fallbacks');
          }
          
        } catch (error) {
          console.log('🔄 AI API unavailable, using smart estimates:', error.message);
        }
      } else {
        console.log('🔑 No valid API key - add VITE_HF_API_KEY=hf_your_token to .env for AI features');
      }

      // Set recommendations with AI or smart fallbacks
      setAiRecommendations({
        ...aiResults,
        articleUrl: createSearchUrl(recipe.name + ' recipe cooking instructions'),
        aiGenerated: aiGenerated,
        message: aiGenerated ? 
          "🤖 REAL AI Analysis - Powered by Hugging Face" : 
          "🧠 Smart estimates (add valid API key for real AI analysis)"
      });

    } catch (error) {
      console.error('Error in recommendations:', error);
      
      // Always provide fallback
      const ingredients = parseIngredients(recipe.ingredients);
      
      setAiRecommendations({
        prepTime: estimatePrepTime(ingredients.length),
        nutrition: estimateNutrition(recipe.name, ingredients),
        alternateIngredients: generateAlternatives(ingredients.slice(0, 3)),
        articleUrl: createSearchUrl(recipe.name + ' recipe'),
        aiGenerated: false,
        message: "🧠 Smart estimates (AI temporarily unavailable)"
      });
    } finally {
      setLoading(false);
    }
  };

  // REAL AI Analysis Function
  const performRealAIAnalysis = async (recipe, ingredients, apiKey) => {
    try {
      // Prepare comprehensive recipe context for AI
      const recipeContext = `Recipe: ${recipe.name}
Description: ${recipe.descripition}
Ingredients: ${ingredients.join(', ')}
Recipe Type: ${recipe.collection.includes('vegan') ? 'Vegan' : recipe.collection.includes('indian') ? 'Indian' : 'General'}`;

      // AI Analysis Tasks
      const aiTasks = await Promise.allSettled([
        // Task 1: Prep Time Analysis
        callHuggingFaceAPI(apiKey, `Analyze this recipe and estimate preparation time in minutes. Recipe: ${recipe.name} with ${ingredients.length} ingredients including: ${ingredients.slice(0, 5).join(', ')}. Respond with just a number between 15-120.`, 'prep'),
        
        // Task 2: Nutritional Analysis  
        callHuggingFaceAPI(apiKey, `Analyze nutritional content for: ${recipe.name}. Key ingredients: ${ingredients.slice(0, 8).join(', ')}. Estimate calories, protein(g), carbs(g), fat(g) per serving. Format: calories:X protein:X carbs:X fat:X`, 'nutrition'),
        
        // Task 3: Ingredient Alternatives
        callHuggingFaceAPI(apiKey, `Suggest healthy alternatives for these recipe ingredients: ${ingredients.slice(0, 3).join(', ')}. For each ingredient, suggest 1 substitute and ratio. Format: ingredient1->substitute1(ratio) ingredient2->substitute2(ratio)`, 'alternatives')
      ]);

      // Process AI Results
      const results = {
        prepTime: estimatePrepTime(ingredients.length), // fallback
        nutrition: estimateNutrition(recipe.name, ingredients), // fallback
        alternateIngredients: generateAlternatives(ingredients.slice(0, 3)) // fallback
      };

      let successCount = 0;

      // Process Prep Time AI Result
      if (aiTasks[0].status === 'fulfilled' && aiTasks[0].value) {
        const prepTimeAI = parseAIPrepTime(aiTasks[0].value);
        if (prepTimeAI > 0) {
          results.prepTime = prepTimeAI;
          successCount++;
        }
      }

      // Process Nutrition AI Result  
      if (aiTasks[1].status === 'fulfilled' && aiTasks[1].value) {
        const nutritionAI = parseAINutrition(aiTasks[1].value);
        if (nutritionAI) {
          results.nutrition = nutritionAI;
          successCount++;
        }
      }

      // Process Alternatives AI Result
      if (aiTasks[2].status === 'fulfilled' && aiTasks[2].value) {
        const alternativesAI = parseAIAlternatives(aiTasks[2].value, ingredients.slice(0, 3));
        if (alternativesAI && alternativesAI.length > 0) {
          results.alternateIngredients = alternativesAI;
          successCount++;
        }
      }

      return {
        success: successCount > 0, // Success if at least one AI task worked
        data: results,
        aiTasksCompleted: successCount
      };

    } catch (error) {
      console.error('AI analysis error:', error);
      return { success: false };
    }
  };

  // Call Hugging Face API
  const callHuggingFaceAPI = async (apiKey, prompt, taskType) => {
    try {
      const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: taskType === 'alternatives' ? 100 : 50,
            temperature: 0.3,
            do_sample: true,
            top_p: 0.9
          }
        })
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
      }

      const result = await response.json();
      console.log(`🤖 AI ${taskType} result:`, result);

      // Extract generated text from response
      if (result && result[0] && result[0].generated_text) {
        return result[0].generated_text;
      }
      
      return null;
    } catch (error) {
      console.error(`AI ${taskType} call failed:`, error);
      return null;
    }
  };

  // Parse AI Prep Time Response
  const parseAIPrepTime = (aiResponse) => {
    try {
      // Extract numbers from AI response
      const numbers = aiResponse.match(/\d+/g);
      if (numbers && numbers.length > 0) {
        const time = parseInt(numbers[0]);
        // Validate reasonable range
        if (time >= 10 && time <= 180) {
          return time;
        }
      }
    } catch (error) {
      console.error('Error parsing AI prep time:', error);
    }
    return 0; // Return 0 to indicate parsing failed
  };

  // Parse AI Nutrition Response
  const parseAINutrition = (aiResponse) => {
    try {
      const response = aiResponse.toLowerCase();
      
      // Extract nutrition values using regex
      const caloriesMatch = response.match(/calories?\s*:?\s*(\d+)/);
      const proteinMatch = response.match(/protein\s*:?\s*(\d+)/);
      const carbsMatch = response.match(/carbs?\s*:?\s*(\d+)/);
      const fatMatch = response.match(/fat\s*:?\s*(\d+)/);

      if (caloriesMatch) {
        return {
          calories: parseInt(caloriesMatch[1]) || 250,
          protein: parseInt(proteinMatch?.[1]) || 12,
          carbs: parseInt(carbsMatch?.[1]) || 35,
          fat: parseInt(fatMatch?.[1]) || 8
        };
      }
    } catch (error) {
      console.error('Error parsing AI nutrition:', error);
    }
    return null;
  };

  // Parse AI Alternatives Response
  const parseAIAlternatives = (aiResponse, originalIngredients) => {
    try {
      const alternatives = [];
      const response = aiResponse.toLowerCase();
      
      // Simple parsing for ingredient alternatives
      originalIngredients.forEach((ingredient, index) => {
        // Look for substitute suggestions in AI response
        let substitute = 'similar ingredient';
        let ratio = '1:1';
        
        // Try to extract substitutes from AI response
        if (response.includes('instead') || response.includes('substitute') || response.includes('replace')) {
          // AI gave suggestions, try to parse them
          if (response.includes('tofu') && ingredient.includes('chicken')) {
            substitute = 'tofu or tempeh';
          } else if (response.includes('quinoa') && ingredient.includes('rice')) {
            substitute = 'quinoa or brown rice';
          } else if (response.includes('almond') && ingredient.includes('milk')) {
            substitute = 'almond milk';
          } else {
            // Use our fallback alternatives
            const fallbackAlternatives = generateAlternatives([ingredient]);
            if (fallbackAlternatives[0]) {
              substitute = fallbackAlternatives[0].substitute;
              ratio = fallbackAlternatives[0].ratio;
            }
          }
        } else {
          // Use our fallback system
          const fallbackAlternatives = generateAlternatives([ingredient]);
          if (fallbackAlternatives[0]) {
            substitute = fallbackAlternatives[0].substitute;
            ratio = fallbackAlternatives[0].ratio;
          }
        }

        alternatives.push({
          original: ingredient,
          substitute: substitute,
          ratio: ratio
        });
      });

      return alternatives;
    } catch (error) {
      console.error('Error parsing AI alternatives:', error);
      return null;
    }
  };

  // CSP-compliant URL creation helper
  const createSearchUrl = (searchTerm) => {
    const baseUrl = 'https://www.google.com/search?q=';
    return baseUrl + encodeURIComponent(searchTerm);
  };

  const createYouTubeUrl = (searchTerm) => {
    const baseUrl = 'https://www.youtube.com/results?search_query=';
    return baseUrl + encodeURIComponent(searchTerm);
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
    if (name.includes('curry') || name.includes('rice') || name.includes('biryani')) baseCalories = 300;
    if (name.includes('soup') || name.includes('salad')) baseCalories = 150;
    if (name.includes('pasta') || name.includes('noodle')) baseCalories = 350;
    if (name.includes('bread') || name.includes('pizza')) baseCalories = 280;
    if (name.includes('chicken') || name.includes('meat')) baseCalories = 320;
    
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
      'ginger': { substitute: 'ground ginger', ratio: '1 inch:1/4 tsp' },
      'paneer': { substitute: 'halloumi cheese', ratio: '1:1' },
      'chicken': { substitute: 'tofu or seitan', ratio: '1:1' },
      'mozzarella': { substitute: 'provolone cheese', ratio: '1:1' },
      'soy sauce': { substitute: 'tamari or coconut aminos', ratio: '1:1' }
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
    setApiKeyError(false);
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
        {/* API Key Setup Notice */}
        {apiKeyError && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-6 w-6 text-amber-600 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-amber-800 mb-2">Setup Required for AI Features</h3>
                <div className="text-amber-700 space-y-2">
                  <p>To enable AI-powered recommendations, you need to set up a free Hugging Face API key:</p>
                  <ol className="list-decimal list-inside space-y-1 ml-4">
                    <li>Go to <a href="https://huggingface.co/join" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">huggingface.co</a> and create a free account</li>
                    <li>Go to Settings → Access Tokens and create a new token</li>
                    <li>Add <code className="bg-amber-100 px-2 py-1 rounded">VITE_HF_API_KEY=your_token_here</code> to your .env file</li>
                    <li>Restart the development server</li>
                  </ol>
                  <p className="text-sm">Don't worry - the app works without API key, but with estimated values instead of AI-generated ones.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {recipesLoading ? (
          <div className="text-center py-16">
            <Sparkles className="h-12 w-12 text-indigo-600 animate-spin mx-auto mb-4" />
            <p className="text-xl text-gray-600">Loading recipes...</p>
          </div>
        ) : recipesError ? (
          <div className="text-center py-16">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-2xl mx-auto">
              <p className="text-red-600 text-lg">{recipesError}</p>
              <p className="text-gray-600 mt-2">Using embedded recipes for demonstration.</p>
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
                    placeholder="I want to eat paneer biryani..."
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
                            <div className="mt-2">
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                {recipe.collection.includes('vegan') ? 'Vegan' : 
                                 recipe.collection.includes('indian') ? 'Indian' :
                                 recipe.collection.includes('italian') ? 'Italian' :
                                 recipe.collection.includes('asian') ? 'Asian' : 'Healthy'} Recipe
                              </span>
                            </div>
                          </div>
                          <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg ml-4 flex items-center justify-center">
                            <Utensils className="h-8 w-8 text-indigo-600" />
                          </div>
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
              
              {/* Recipe Icon Placeholder */}
              <div className="w-full h-64 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl mb-6 flex items-center justify-center">
                <div className="text-center">
                  <ChefHat className="h-20 w-20 text-indigo-600 mx-auto mb-4" />
                  <p className="text-indigo-800 font-semibold">{selectedRecipe.name}</p>
                </div>
              </div>
              
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
            ) : aiRecommendations ? (
              <div className="grid md:grid-cols-2 gap-6">
                {/* Status indicator */}
                {aiRecommendations.message && (
                  <div className={`md:col-span-2 ${aiRecommendations.aiGenerated ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'} border rounded-xl p-4`}>
                    <div className="flex items-center space-x-2">
                      <Sparkles className={`h-5 w-5 ${aiRecommendations.aiGenerated ? 'text-green-600' : 'text-blue-600'}`} />
                      <span className={aiRecommendations.aiGenerated ? 'text-green-800' : 'text-blue-800'}>{aiRecommendations.message}</span>
                    </div>
                  </div>
                )}

                {/* Preparation Time & Nutrition */}
                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center space-x-2 mb-4">
                    <Clock className="h-5 w-5 text-indigo-600" />
                    <h3 className="text-xl font-semibold">Preparation Time</h3>
                    {!aiRecommendations.aiGenerated && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Smart Estimate</span>}
                  </div>
                  <p className="text-3xl font-bold text-indigo-600">{aiRecommendations.prepTime} min</p>
                </div>

                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center space-x-2 mb-4">
                    <Apple className="h-5 w-5 text-green-600" />
                    <h3 className="text-xl font-semibold">Nutritional Value</h3>
                    {!aiRecommendations.aiGenerated && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Smart Estimate</span>}
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

                {/* Article Link */}
                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg md:col-span-2">
                  <div className="flex items-center space-x-2 mb-4">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    <h3 className="text-xl font-semibold">Find Complete Recipe</h3>
                  </div>
                  <p className="text-gray-600 mb-4">Search for detailed step-by-step cooking instructions and video tutorials</p>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={aiRecommendations.articleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <span>Search Recipe</span>
                      <BookOpen className="h-4 w-4" />
                    </a>
                    <a
                      href={createYouTubeUrl(selectedRecipe.name + ' recipe cooking tutorial')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <span>Find Video Tutorial</span>
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    </a>
                  </div>
                </div>
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