import React, { useState, useEffect } from 'react';
import { Search, Clock, Apple, Utensils, BookOpen, Sparkles, AlertCircle, ChevronLeft, ChevronRight, Share2, Heart, MapPin, Calendar, Award, Lightbulb, X } from 'lucide-react';

// Custom ChefHat component to avoid icon loading issues
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

  // Generate story cards from cultural information
  const generateStoryCards = () => {
    if (!culturalInfo) return [];

    const cards = [];

    // Card 1: Recipe Introduction with cultural badge
    cards.push({
      type: 'intro',
      title: recipe.name,
      subtitle: 'Cultural Journey',
      content: `Discover the rich cultural heritage behind this beloved dish from ${culturalInfo.origin || 'various traditions'}.`,
      background: 'bg-gradient-to-br from-purple-500 to-pink-500',
      icon: <ChefHat className="h-8 w-8 text-white" />,
      badge: getCulturalBadge(recipe.name)
    });

    // Card 2: Origin Story
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

    // Card 3: Cultural Significance
    if (culturalInfo.significance) {
      cards.push({
        type: 'significance',
        title: 'Cultural Significance',
        subtitle: 'Traditional Meaning',
        content: culturalInfo.significance,
        background: 'bg-gradient-to-br from-emerald-500 to-teal-600',
        icon: <Award className="h-6 w-6 text-white" />,
        timeline: getHistoricalTimeline(recipe.name)
      });
    }

    // Card 4: Traditional Serving
    if (culturalInfo.serving) {
      cards.push({
        type: 'serving',
        title: 'Traditional Serving',
        subtitle: 'How It\'s Enjoyed',
        content: culturalInfo.serving,
        background: 'bg-gradient-to-br from-orange-500 to-red-500',
        icon: <Utensils className="h-6 w-6 text-white" />,
        funFact: getServingFact(recipe.name)
      });
    }

    // Card 5: Seasonal Connection
    if (culturalInfo.season) {
      cards.push({
        type: 'season',
        title: 'Seasonal Traditions',
        subtitle: 'When It\'s Celebrated',
        content: culturalInfo.season,
        background: 'bg-gradient-to-br from-amber-500 to-yellow-500',
        icon: <Calendar className="h-6 w-6 text-white" />,
        celebration: getCelebrationInfo(recipe.name)
      });
    }

    // Card 6: Cooking Tips & Wisdom
    if (culturalInfo.tips) {
      cards.push({
        type: 'tips',
        title: 'Ancient Wisdom',
        subtitle: 'Traditional Techniques',
        content: culturalInfo.tips,
        background: 'bg-gradient-to-br from-violet-500 to-purple-600',
        icon: <Lightbulb className="h-6 w-6 text-white" />,
        masterTip: getMasterTip(recipe.name)
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
        // Fallback for browsers without native sharing
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
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
        >
          <X className="h-8 w-8" />
        </button>

        {/* Story Card */}
        <div className={`relative w-full h-96 rounded-2xl shadow-2xl overflow-hidden ${currentCardData.background}`}>
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 p-6 bg-black bg-opacity-20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {currentCardData.icon}
                <div>
                  <h3 className="text-white font-bold text-lg">{currentCardData.title}</h3>
                  <p className="text-white text-opacity-90 text-sm">{currentCardData.subtitle}</p>
                </div>
              </div>
              
              {/* Cultural Badge */}
              {currentCardData.badge && (
                <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                  <span className="text-white text-xs font-semibold">{currentCardData.badge}</span>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-center px-6 pt-20 pb-20">
            <div className="text-center text-white">
              <p className="text-lg leading-relaxed mb-4">{currentCardData.content}</p>
              
              {/* Special content based on card type */}
              {currentCardData.didYouKnow && (
                <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Lightbulb className="h-5 w-5" />
                    <span className="font-semibold">Did You Know?</span>
                  </div>
                  <p className="text-sm">{currentCardData.didYouKnow}</p>
                </div>
              )}

              {currentCardData.timeline && (
                <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="h-5 w-5" />
                    <span className="font-semibold">Historical Timeline</span>
                  </div>
                  <div className="text-sm space-y-1">
                    {currentCardData.timeline.map((event, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="font-medium">{event.year}</span>
                        <span>{event.event}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentCardData.funFact && (
                <div className="bg-white bg-opacity-20 rounded-lg p-3 mb-4">
                  <p className="text-sm font-medium">💡 {currentCardData.funFact}</p>
                </div>
              )}

              {currentCardData.celebration && (
                <div className="bg-white bg-opacity-20 rounded-lg p-3 mb-4">
                  <p className="text-sm">🎉 {currentCardData.celebration}</p>
                </div>
              )}

              {currentCardData.masterTip && (
                <div className="bg-white bg-opacity-20 rounded-lg p-3 mb-4">
                  <p className="text-sm">👨‍🍳 Master's Tip: {currentCardData.masterTip}</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer with actions */}
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
              
              {/* Progress indicators */}
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

          {/* Navigation arrows */}
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

        {/* Card counter */}
        <div className="text-center mt-4 text-white">
          <span className="text-sm">{currentCard + 1} of {storyCards.length}</span>
        </div>
      </div>
    </div>
  );
};

// Helper functions for generating cultural content
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

const getHistoricalTimeline = (recipeName) => {
  const timelines = {
    'biryani': [
      { year: '1398', event: 'Timur brings pilaf to India' },
      { year: '1526', event: 'Mughal Empire establishes' },
      { year: '1650', event: 'Biryani perfected in courts' }
    ],
    'pizza': [
      { year: '1889', event: 'Pizza Margherita created' },
      { year: '1905', event: 'First US pizzeria opens' },
      { year: '1958', event: 'Pizza Hut founded' }
    ],
    'tofu': [
      { year: '206 BC', event: 'Tofu invented in China' },
      { year: '710 AD', event: 'Reaches Japan' },
      { year: '1960s', event: 'Becomes popular in West' }
    ]
  };
  
  for (const [key, timeline] of Object.entries(timelines)) {
    if (recipeName.toLowerCase().includes(key)) {
      return timeline;
    }
  }
  return [
    { year: 'Ancient', event: 'Recipe origins' },
    { year: 'Medieval', event: 'Trade spreads recipe' },
    { year: 'Modern', event: 'Global popularity' }
  ];
};

const getServingFact = (recipeName) => {
  const facts = {
    'biryani': 'Traditionally served on banana leaves with each grain of rice separate and aromatic.',
    'pizza': 'In Naples, pizza is eaten with a fork and knife, never by hand!',
    'tofu': 'Best enjoyed family-style with chopsticks, emphasizing community dining.',
    'curry': 'Served with rice and eaten by hand, mixing flavors with each bite.'
  };
  
  for (const [key, fact] of Object.entries(facts)) {
    if (recipeName.toLowerCase().includes(key)) {
      return fact;
    }
  }
  return 'Best shared with loved ones around a table full of conversation.';
};

const getCelebrationInfo = (recipeName) => {
  const celebrations = {
    'biryani': 'Essential at weddings, festivals, and Eid celebrations across South Asia.',
    'pizza': 'A staple of Italian festivals and family Sunday dinners.',
    'tofu': 'Featured in Buddhist temple festivals and vegetarian celebrations.',
    'curry': 'Central to Diwali feasts and harvest festivals.'
  };
  
  for (const [key, celebration] of Object.entries(celebrations)) {
    if (recipeName.toLowerCase().includes(key)) {
      return celebration;
    }
  }
  return 'Enjoyed during special occasions and family gatherings.';
};

const getMasterTip = (recipeName) => {
  const tips = {
    'biryani': 'Cook with the "dum" method - seal the pot and cook slowly to trap all the aromas.',
    'pizza': 'The secret is a blazing hot oven - Neapolitan ovens reach 900°F!',
    'tofu': 'Press the tofu for 30 minutes to remove moisture for maximum crispiness.',
    'curry': 'Toast whole spices before grinding for deeper, more complex flavors.'
  };
  
  for (const [key, tip] of Object.entries(tips)) {
    if (recipeName.toLowerCase().includes(key)) {
      return tip;
    }
  }
  return 'Patience and love are the most important ingredients in any traditional recipe.';
};

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
  const [showCulturalCards, setShowCulturalCards] = useState(false);

  // Embedded recipe data - Clean recipes without hardcoded cultural information
  const fallbackRecipes = [
    {
      "name": "Paneer Biryani",
      "collection": "collection/indian-recipes/",
      "recipie_collection_idx": 1,
      "image": null, // Will trigger AI image generation
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
        // Try to fetch from new primary data file
        console.log('🔍 Loading recipes from titles_only.json...');
        const response = await fetch('/data/titles_only.json');
        if (response.ok) {
          const fetchedData = await response.json();
          console.log('✅ Successfully loaded', fetchedData.length, 'recipes from titles_only.json');
          setRecipes(fetchedData);
          setRecipesError(null);
        } else {
          throw new Error('Failed to load titles_only.json');
        }
      } catch (error) {
        console.log('⚠️ Failed to load titles_only.json, trying recipe.json fallback:', error.message);
        
        try {
          // Fallback to original recipe.json
          const fallbackResponse = await fetch('/data/recipe.json');
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            console.log('✅ Successfully loaded', fallbackData.length, 'recipes from recipe.json fallback');
            setRecipes(fallbackData);
            setRecipesError(null);
          } else {
            throw new Error('Both titles_only.json and recipe.json failed to load');
          }
        } catch (fallbackError) {
          console.log('⚠️ All external sources failed, using embedded recipes:', fallbackError.message);
          // Use embedded fallback recipes with cultural information
          setRecipes(fallbackRecipes);
          setRecipesError(null);
        }
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
    console.log('🔍 DEBUG - Recipe selected:', recipe.name);
    console.log('🔍 DEBUG - Original recipe steps (WILL BE IGNORED):', recipe.steps);
    
    // COMPLETELY BLOCK ACCESS TO ORIGINAL STEPS
    const cleanRecipe = {
      ...recipe,
      steps: null // REMOVE original steps completely
    };
    
    // Immediately set loading and clear previous state to prevent static content
    setSelectedRecipe(cleanRecipe); // Use cleaned recipe
    setLoading(true);
    setAiRecommendations(null); // Clear previous recommendations immediately
    setShowResults(false);
    setApiKeyError(false);
    
    console.log('🔍 DEBUG - Set loading=true, aiRecommendations=null');
    
    // Call AI for recommendations with CLEANED recipe (no original steps)
    await getAIRecommendations(cleanRecipe);
  };

  const getAIRecommendations = async (recipe) => {
    console.log('🔍 DEBUG - Starting getAIRecommendations for:', recipe.name);
    
    try {
      const ingredients = parseIngredients(recipe.ingredients);
      
      // Check for API keys
      const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
      const HF_API_KEY = import.meta.env.VITE_HF_API_KEY;
      const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
      
      console.log('🔍 DEBUG - API Keys available:', {
        gemini: !!GEMINI_API_KEY,
        hf: !!HF_API_KEY,
        openai: !!OPENAI_API_KEY
      });
      
      let aiGenerated = false;
      let aiResults = {
        prepTime: estimatePrepTime(ingredients.length),
        nutrition: estimateNutrition(recipe.name, ingredients),
        alternateIngredients: generateAlternatives(ingredients.slice(0, 3)),
        aiInstructions: null, // EXPLICITLY set to null - NO STATIC CONTENT EVER
        aiImage: null // For AI-generated images
      };
      
      console.log('🤖 Starting REAL AI analysis...');
      
      // Try Google Gemini first (most reliable)
      if (GEMINI_API_KEY && GEMINI_API_KEY.length > 20) {
        console.log('🚀 Attempting Google Gemini AI...');
        
        try {
          const geminiResults = await performGeminiAnalysis(recipe, ingredients, GEMINI_API_KEY);
          if (geminiResults.success) {
            aiResults = geminiResults.data;
            aiGenerated = true;
            console.log('✅ Google Gemini AI analysis successful!');
            console.log('🔍 DEBUG - Gemini aiInstructions:', geminiResults.data.aiInstructions);
          }
        } catch (error) {
          console.log('🔄 Gemini failed, trying Hugging Face...', error.message);
        }
      }
      
      // Fallback to Hugging Face if Gemini failed
      if (!aiGenerated && HF_API_KEY && HF_API_KEY.startsWith('hf_') && HF_API_KEY.length > 20) {
        console.log('🔄 Trying reliable Hugging Face models...');
        
        try {
          const hfResults = await performHuggingFaceAnalysis(recipe, ingredients, HF_API_KEY);
          if (hfResults.success) {
            aiResults = hfResults.data;
            aiGenerated = true;
            console.log('✅ Hugging Face AI analysis successful!');
            console.log('🔍 DEBUG - HF aiInstructions:', hfResults.data.aiInstructions);
          }
        } catch (error) {
          console.log('🔄 Hugging Face also failed:', error.message);
        }
      }

      // Generate AI image if recipe doesn't have one
      if (!recipe.image && (OPENAI_API_KEY || HF_API_KEY)) {
        console.log('🎨 Generating AI image for recipe...');
        try {
          const aiImage = await generateRecipeImage(recipe, OPENAI_API_KEY, HF_API_KEY);
          if (aiImage) {
            aiResults.aiImage = aiImage;
            console.log('✅ AI image generated successfully!');
          }
        } catch (error) {
          console.log('🔄 AI image generation failed:', error.message);
        }
      }
      
      console.log('🔍 DEBUG - Final aiResults before setting:', aiResults);
      console.log('🔍 DEBUG - aiGenerated:', aiGenerated);
      console.log('🔍 DEBUG - aiInstructions in results:', aiResults.aiInstructions);
      
      // Set recommendations - NEVER include static instructions
      setAiRecommendations({
        ...aiResults,
        aiGenerated: aiGenerated,
        aiInstructions: aiResults.aiInstructions // Only AI instructions, never static
      });

      if (!aiGenerated && !GEMINI_API_KEY && !HF_API_KEY) {
        setApiKeyError(true);
      }

    } catch (error) {
      console.error('Error in AI recommendations:', error);
      
      const ingredients = parseIngredients(recipe.ingredients);
      console.log('🔍 DEBUG - Setting fallback recommendations (no AI)');
      setAiRecommendations({
        prepTime: estimatePrepTime(ingredients.length),
        nutrition: estimateNutrition(recipe.name, ingredients),
        alternateIngredients: generateAlternatives(ingredients.slice(0, 3)),
        culturalInfo: null,
        aiInstructions: null, // NEVER SET STATIC INSTRUCTIONS
        aiGenerated: false
      });
    } finally {
      console.log('🔍 DEBUG - Setting loading=false');
      setLoading(false);
    }
  };

  // AI Image Generation Function
  const generateRecipeImage = async (recipe, openaiKey, hfKey) => {
    try {
      // Try DALL-E first (best quality)
      if (openaiKey && openaiKey.length > 20) {
        console.log('🎨 Trying DALL-E image generation...');
        
        const dalleResponse = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: "dall-e-3",
            prompt: `A beautiful, appetizing photo of ${recipe.name}, ${recipe.descripition}. Professional food photography, vibrant colors, restaurant quality presentation, high resolution, natural lighting.`,
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
      if (hfKey && hfKey.startsWith('hf_')) {
        console.log('🎨 Trying Stable Diffusion image generation...');
        
        const stableDiffusionModels = [
          'stabilityai/stable-diffusion-2-1',
          'runwayml/stable-diffusion-v1-5',
          'CompVis/stable-diffusion-v1-4'
        ];

        for (const model of stableDiffusionModels) {
          try {
            const sdResponse = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${hfKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                inputs: `professional food photography of ${recipe.name}, delicious, appetizing, high quality, restaurant presentation, vibrant colors, natural lighting`,
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

  // Google Gemini AI Analysis (Primary - Most Reliable) - 100% AI Generated
  const performGeminiAnalysis = async (recipe, ingredients, apiKey) => {
    try {
      const prompt = `Analyze this recipe and provide detailed cooking instructions along with cultural information:

Recipe: ${recipe.name}
Description: ${recipe.descripition}
Ingredients: ${ingredients.join(', ')}

Please provide EXACTLY in this format:
PREP_TIME: [number between 15-120]
CALORIES: [number between 150-800]
PROTEIN: [number between 5-50]
CARBS: [number between 10-100]
FAT: [number between 2-40]
ALT1: [alternative for ${ingredients[0] || 'main ingredient'}]
ALT2: [alternative for ${ingredients[1] || 'second ingredient'}]
ALT3: [alternative for ${ingredients[2] || 'third ingredient'}]
ORIGIN: [specific country/region of origin with historical context]
HISTORY: [detailed 2-3 sentence history of this dish including dates and cultural development]
CULTURAL: [cultural significance, traditions, and symbolism in the origin culture]
SEASON: [traditional season, festivals, or occasions when this dish is eaten]
SERVING: [authentic traditional way this dish is served in its culture of origin]
TIPS: [authentic cultural cooking tips and traditional techniques from the culture]

COOKING_INSTRUCTIONS:
Please provide detailed step-by-step cooking instructions. Each step should start with "STEP:" and include specific techniques, temperatures, timing, and traditional methods:

STEP: [First detailed cooking step with prep work, temperatures, and timing]
STEP: [Second step with specific cooking techniques and visual cues]
STEP: [Third step with traditional methods and tips]
STEP: [Continue with all necessary cooking steps]
STEP: [Final step with plating and serving suggestions]

Make sure to include at least 5-8 detailed cooking steps with traditional techniques and authentic preparation methods.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.4, // Slightly higher for more detailed instructions
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 3000, // More tokens for detailed instructions
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API failed: ${response.status}`);
      }

      const result = await response.json();
      const aiText = result.candidates?.[0]?.content?.parts?.[0]?.text;

      if (aiText) {
        console.log('🤖 Gemini full response:', aiText);
        return parseGeminiResponse(aiText, ingredients, recipe);
      }

      throw new Error('No response from Gemini');
    } catch (error) {
      console.error('Gemini analysis error:', error);
      return { success: false };
    }
  };

  // Parse Gemini AI Response - Extract Cultural Information from AI
  const parseGeminiResponse = (aiText, ingredients, recipe) => {
    try {
      const text = aiText.toUpperCase();
      
      // Extract nutritional values using regex
      const prepMatch = text.match(/PREP_TIME:\s*(\d+)/);
      const caloriesMatch = text.match(/CALORIES:\s*(\d+)/);
      const proteinMatch = text.match(/PROTEIN:\s*(\d+)/);
      const carbsMatch = text.match(/CARBS:\s*(\d+)/);
      const fatMatch = text.match(/FAT:\s*(\d+)/);
      const alt1Match = text.match(/ALT1:\s*([^\n\r]+)/);
      const alt2Match = text.match(/ALT2:\s*([^\n\r]+)/);
      const alt3Match = text.match(/ALT3:\s*([^\n\r]+)/);
      
      // Extract cultural information from AI - case insensitive
      const originMatch = aiText.match(/ORIGIN:\s*([^\n\r]+)/i);
      const historyMatch = aiText.match(/HISTORY:\s*([^\n\r]+(?:\n[^\n\r]+)*?)(?=\n[A-Z]+:|$)/i);
      const culturalMatch = aiText.match(/CULTURAL:\s*([^\n\r]+(?:\n[^\n\r]+)*?)(?=\n[A-Z]+:|$)/i);
      const seasonMatch = aiText.match(/SEASON:\s*([^\n\r]+)/i);
      const servingMatch = aiText.match(/SERVING:\s*([^\n\r]+(?:\n[^\n\r]+)*?)(?=\n[A-Z]+:|$)/i);
      const tipsMatch = aiText.match(/TIPS:\s*([^\n\r]+(?:\n[^\n\r]+)*?)(?=\n[A-Z]+:|$)/i);
      
      // Enhanced cooking instructions parsing
      console.log('🔍 Searching for cooking instructions in AI response...');
      let aiInstructions = [];
      
      // Method 1: Look for STEP: format
      const stepMatches = aiText.match(/STEP:\s*([^\n\r]+)/gi);
      if (stepMatches && stepMatches.length > 0) {
        aiInstructions = stepMatches.map(match => {
          const cleanStep = match.replace(/^STEP:\s*/i, '').trim();
          return cleanStep;
        });
        console.log('🔍 Found STEP format instructions:', aiInstructions);
      } else {
        // Method 2: Look for numbered instructions (1., 2., etc.)
        const numberedMatches = aiText.match(/\d+\.\s*([^\n\r]+(?:\n(?!\d+\.)[^\n\r]+)*)/gi);
        if (numberedMatches && numberedMatches.length > 0) {
          aiInstructions = numberedMatches.map(match => {
            const cleanStep = match.replace(/^\d+\.\s*/, '').trim();
            return cleanStep;
          });
          console.log('🔍 Found numbered instructions:', aiInstructions);
        } else {
          // Method 3: Split by sentences and look for cooking action words
          const sentences = aiText.split(/[.!?]+/).filter(sentence => {
            const s = sentence.trim().toLowerCase();
            return s.length > 20 && (
              s.includes('heat') || s.includes('add') || s.includes('cook') || 
              s.includes('stir') || s.includes('mix') || s.includes('bake') || 
              s.includes('fry') || s.includes('simmer') || s.includes('serve') ||
              s.includes('remove') || s.includes('place') || s.includes('cover') ||
              s.includes('reduce') || s.includes('boil') || s.includes('pour')
            );
          });
          
          if (sentences.length > 0) {
            // Take up to 8 cooking sentences and clean them up
            aiInstructions = sentences.slice(0, 8).map(sentence => {
              return sentence.trim().charAt(0).toUpperCase() + sentence.trim().slice(1);
            });
            console.log('🔍 Found sentence-based instructions:', aiInstructions);
          }
        }
      }

      // Final cleanup and validation
      aiInstructions = aiInstructions.filter(step => step && step.length > 10).slice(0, 10);
      console.log('🤖 Final cleaned AI instructions:', aiInstructions);

      const results = {
        prepTime: prepMatch ? Math.max(15, Math.min(120, parseInt(prepMatch[1]))) : estimatePrepTime(ingredients.length),
        nutrition: {
          calories: caloriesMatch ? Math.max(150, Math.min(800, parseInt(caloriesMatch[1]))) : 300,
          protein: proteinMatch ? Math.max(5, Math.min(50, parseInt(proteinMatch[1]))) : 15,
          carbs: carbsMatch ? Math.max(10, Math.min(100, parseInt(carbsMatch[1]))) : 40,
          fat: fatMatch ? Math.max(2, Math.min(40, parseInt(fatMatch[1]))) : 10
        },
        alternateIngredients: [
          {
            original: ingredients[0] || 'main ingredient',
            substitute: alt1Match ? alt1Match[1].trim().toLowerCase() : 'similar ingredient',
            ratio: '1:1'
          },
          {
            original: ingredients[1] || 'second ingredient', 
            substitute: alt2Match ? alt2Match[1].trim().toLowerCase() : 'similar ingredient',
            ratio: '1:1'
          },
          {
            original: ingredients[2] || 'third ingredient',
            substitute: alt3Match ? alt3Match[1].trim().toLowerCase() : 'similar ingredient', 
            ratio: '1:1'
          }
        ],
        // AI-Generated Instructions - Enhanced with better parsing
        aiInstructions: aiInstructions.length > 0 ? aiInstructions : null,
        // 100% AI-Generated Cultural Information
        culturalInfo: originMatch || historyMatch || culturalMatch || seasonMatch || servingMatch || tipsMatch ? {
          origin: originMatch ? originMatch[1].trim() : 'Origin information not available',
          history: historyMatch ? historyMatch[1].trim() : 'Historical information not available',
          significance: culturalMatch ? culturalMatch[1].trim() : 'Cultural significance not available',
          season: seasonMatch ? seasonMatch[1].trim() : 'Seasonal information not available',
          serving: servingMatch ? servingMatch[1].trim() : 'Traditional serving information not available',
          tips: tipsMatch ? tipsMatch[1].trim() : 'Cultural cooking tips not available'
        } : null // No cultural info if AI didn't provide it
      };

      console.log('🤖 Final parsed results with instructions:', results);
      return { success: true, data: results };
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      return { success: false };
    }
  };

  // Fallback cultural information functions
  const getCulturalOrigin = (ingredients, recipe) => {
    // Use embedded cultural context if available
    if (recipe?.culturalContext?.origin) {
      return recipe.culturalContext.origin;
    }
    
    const culturalMarkers = {
      'paneer': 'Northern India (Mughal Empire)',
      'chickpeas': 'Indian Subcontinent & Middle East',
      'tofu': 'China (Han Dynasty)',
      'mozzarella': 'Naples, Italy', 
      'soy sauce': 'China',
      'quinoa': 'Andes Mountains (Peru & Bolivia)',
      'garam masala': 'Indian Subcontinent',
      'teriyaki': 'Japan',
      'olive oil': 'Mediterranean Basin',
      'coconut': 'Southeast Asia & Pacific Islands',
      'basmati rice': 'Indian Subcontinent',
      'feta cheese': 'Greece',
      'oregano': 'Mediterranean'
    };

    for (const ingredient of ingredients) {
      for (const [key, origin] of Object.entries(culturalMarkers)) {
        if (ingredient.toLowerCase().includes(key)) {
          return origin;
        }
      }
    }
    return 'Global fusion cuisine - a beautiful blend of world traditions';
  };

  const getCulturalHistory = (ingredients, recipe) => {
    // Use embedded cultural context if available
    if (recipe?.culturalContext?.history) {
      return recipe.culturalContext.history;
    }
    
    if (ingredients.some(i => i.toLowerCase().includes('paneer') || i.toLowerCase().includes('biryani'))) {
      return 'Biryani was brought to India by Persian merchants and Mughal rulers in the 16th century. This aromatic rice dish represents the fusion of Persian cooking techniques with Indian spices and ingredients, becoming a symbol of royal cuisine.';
    }
    if (ingredients.some(i => i.toLowerCase().includes('chickpeas') || i.toLowerCase().includes('chole'))) {
      return 'Chickpeas have been cultivated for over 7,000 years, originating in the Middle East. They spread to India through ancient trade routes and became central to Punjabi cuisine, providing essential protein in vegetarian diets.';
    }
    if (ingredients.some(i => i.toLowerCase().includes('tofu'))) {
      return 'Tofu was invented in China over 2,000 years ago during the Han Dynasty. Buddhist monks adopted it as a meat substitute, spreading the technique throughout Asia. It represents mindful, plant-based eating in Eastern philosophy.';
    }
    if (ingredients.some(i => i.toLowerCase().includes('mozzarella') || i.toLowerCase().includes('pizza'))) {
      return 'Pizza Margherita was created in 1889 in Naples by pizzaiolo Raffaele Esposito to honor Queen Margherita of Savoy. The red tomatoes, white mozzarella, and green basil represented the Italian flag.';
    }
    if (ingredients.some(i => i.toLowerCase().includes('teriyaki'))) {
      return 'Teriyaki cooking technique originated in 17th century Japan. "Teri" means glaze and "yaki" means grilled. Originally used for fish, it spread to other proteins and became internationally popular in the 1960s.';
    }
    if (ingredients.some(i => i.toLowerCase().includes('quinoa'))) {
      return 'Quinoa has been cultivated in the Andes for over 5,000 years. The Incas called it "chisaya mama" (mother of all grains) and considered it sacred. It only gained global recognition in the 21st century as a superfood.';
    }
    return 'This dish represents the beautiful evolution of global cuisine, where traditional techniques meet modern ingredients and cross-cultural influences create new culinary traditions.';
  };

  const getCulturalSignificance = (ingredients, recipe) => {
    // Use embedded cultural context if available
    if (recipe?.culturalContext?.significance) {
      return recipe.culturalContext.significance;
    }
    
    if (ingredients.some(i => i.toLowerCase().includes('paneer') || i.toLowerCase().includes('biryani'))) {
      return 'In Indian culture, biryani symbolizes abundance, celebration, and hospitality. It represents the vegetarian principle of ahimsa (non-violence) while showcasing the rich Mughal heritage. Often prepared for weddings, festivals, and important family gatherings.';
    }
    if (ingredients.some(i => i.toLowerCase().includes('chickpeas'))) {
      return 'Chickpeas represent sustenance and community in Indian culture. This dish embodies the principle of "sattvic" (pure) food in Hindu philosophy and is often prepared during religious fasting periods and community kitchens (langars).';
    }
    if (ingredients.some(i => i.toLowerCase().includes('tofu'))) {
      return 'In Buddhist tradition, tofu represents compassion and mindfulness - providing nourishment without harm. It symbolizes the philosophy of simple living and respect for all life forms.';
    }
    if (ingredients.some(i => i.toLowerCase().includes('rice'))) {
      return 'Rice is considered sacred in many Asian cultures, symbolizing life, fertility, and prosperity. It forms the foundation of meals and is central to cultural ceremonies and hospitality.';
    }
    if (ingredients.some(i => i.toLowerCase().includes('olive oil'))) {
      return 'In Mediterranean culture, olive oil represents peace, wisdom, and the connection to ancient traditions. The olive tree is sacred, symbolizing endurance and the Mediterranean way of life.';
    }
    return 'This dish carries the stories and traditions of its culture, connecting us to generations of cooks who perfected these flavors and passed down their culinary wisdom.';
  };

  const getTraditionalSeason = (ingredients, recipe) => {
    // Use embedded cultural context if available
    if (recipe?.culturalContext?.season) {
      return recipe.culturalContext.season;
    }
    
    if (ingredients.some(i => i.toLowerCase().includes('biryani') || i.toLowerCase().includes('curry'))) {
      return 'Traditionally enjoyed during cooler months, monsoon season, and festive periods like Diwali, Eid, and wedding celebrations';
    }
    if (ingredients.some(i => i.toLowerCase().includes('salad') || i.toLowerCase().includes('quinoa'))) {
      return 'Perfect for summer when fresh vegetables are abundant, though enjoyed year-round as a healthy meal';
    }
    if (ingredients.some(i => i.toLowerCase().includes('pizza'))) {
      return 'Enjoyed year-round, but traditionally best in summer when tomatoes and basil are at peak freshness';
    }
    if (ingredients.some(i => i.toLowerCase().includes('teriyaki'))) {
      return 'Popular year-round, but especially during summer grilling season and outdoor gatherings';
    }
    return 'Enjoyed throughout the year, with ingredients adapted to seasonal availability and local harvests';
  };

  const getTraditionalServing = (ingredients, recipe) => {
    // Use embedded cultural context if available
    if (recipe?.culturalContext?.serving) {
      return recipe.culturalContext.serving;
    }
    
    if (ingredients.some(i => i.toLowerCase().includes('rice') || i.toLowerCase().includes('biryani'))) {
      return 'Traditionally served on banana leaves or large brass platters (thali), shared family-style with various accompaniments like raita, pickles, and papadums. Everyone gathers around to eat together.';
    }
    if (ingredients.some(i => i.toLowerCase().includes('pizza'))) {
      return 'In Italy, traditionally eaten with fork and knife, never cut into slices. Served immediately from the wood-fired oven while the cheese is still bubbling. Each person gets their own individual pizza.';
    }
    if (ingredients.some(i => i.toLowerCase().includes('tofu') || i.toLowerCase().includes('teriyaki'))) {
      return 'Traditionally served family-style with steamed rice and 2-3 other dishes. Everyone shares from the center using chopsticks, emphasizing community and togetherness.';
    }
    if (ingredients.some(i => i.toLowerCase().includes('quinoa') || i.toLowerCase().includes('salad'))) {
      return 'Served at room temperature or chilled, often as a complete meal or sophisticated side dish at gatherings and celebrations';
    }
    return 'Best enjoyed fresh and warm, shared with family and friends as part of a complete meal, following traditional hospitality customs';
  };

  const getCulturalTips = (ingredients, recipe) => {
    // Use embedded cultural context if available
    if (recipe?.culturalContext?.tips) {
      return recipe.culturalContext.tips;
    }
    
    if (ingredients.some(i => i.toLowerCase().includes('paneer') || i.toLowerCase().includes('biryani'))) {
      return 'Master the "dum" cooking method - slow cooking in a sealed pot. Soak saffron in warm milk for at least 30 minutes. Never stir during cooking. Traditional cooks layer carefully and cook by sound and aroma.';
    }
    if (ingredients.some(i => i.toLowerCase().includes('chickpeas'))) {
      return 'Soak chickpeas overnight and cook them slowly for best texture. Add a tea bag while boiling for deeper color - an old Punjabi trick. The key is building layers of flavor with proper tempering (tadka).';
    }
    if (ingredients.some(i => i.toLowerCase().includes('tofu'))) {
      return 'Press tofu for 30 minutes to remove moisture for maximum crispiness. Heat the wok until smoking before adding ingredients - this creates "wok hei" (breath of the wok), essential for authentic flavor.';
    }
    if (ingredients.some(i => i.toLowerCase().includes('pizza'))) {
      return 'Use San Marzano tomatoes and buffalo mozzarella for authenticity. Stretch dough by hand, never roll, to maintain air bubbles. Wood-fired ovens reach 900°F - home ovens should be as hot as possible.';
    }
    if (ingredients.some(i => i.toLowerCase().includes('rice'))) {
      return 'Traditional cooks test rice doneness by pressing a grain between fingers. Soaking rice for 30 minutes before cooking is an ancient practice. Each grain should be separate, not mushy.';
    }
    if (ingredients.some(i => i.toLowerCase().includes('quinoa'))) {
      return 'Always rinse quinoa to remove the bitter saponin coating. Toast quinoa in a dry pan for 2-3 minutes before cooking for nuttier flavor. Ancient Andean cooks would ceremonially offer the first handful to Pachamama (Mother Earth).';
    }
    return 'Traditional techniques often involve patience and attention to detail. Take time to build flavors layer by layer, respecting the wisdom of generations of cooks who perfected these methods.';
  };

  // Hugging Face Analysis (Backup - Multiple Reliable Models) - AI Generated Cultural Info
  const performHuggingFaceAnalysis = async (recipe, ingredients, apiKey) => {
    const reliableModels = [
      'google/flan-t5-base',           // Google's T5 - very reliable
      'facebook/blenderbot-400M-distill', // Facebook conversational AI
      'microsoft/DialoGPT-small',      // Smaller, more stable
      'huggingface/CodeBERTa-small-v1' // Alternative
    ];

    for (const model of reliableModels) {
      try {
        console.log(`🔄 Trying ${model.split('/')[1]}...`);
        
        // Enhanced prompt for cultural information and cooking instructions
        const culturalPrompt = `Recipe: ${recipe.name}. Ingredients: ${ingredients.slice(0, 5).join(', ')}. 
        
        Provide detailed analysis including:
        - Step-by-step cooking instructions (numbered 1, 2, 3...)
        - Preparation time in minutes
        - Calories per serving  
        - Country/region of origin
        - Brief history and cultural significance
        - Traditional serving method
        - Authentic cooking tips

        Please provide detailed cooking steps with specific techniques and timing.`;
        
        const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: culturalPrompt,
            parameters: {
              max_new_tokens: 300, // More tokens for detailed instructions
              temperature: 0.4,    // Balanced for detailed but accurate info
              do_sample: true
            },
            options: {
              wait_for_model: true
            }
          })
        });

        if (response.ok) {
          const result = await response.json();
          console.log(`✅ ${model.split('/')[1]} responded:`, result);
          
          // Parse HF response and extract cultural information
          const enhancedResults = enhanceWithHFResponse(recipe, ingredients, result);
          return { success: true, data: enhancedResults };
        } else {
          console.log(`❌ ${model.split('/')[1]} failed: ${response.status}`);
          continue;
        }
      } catch (error) {
        console.log(`❌ ${model.split('/')[1]} error:`, error.message);
        continue;
      }
    }

    return { success: false };
  };

  // Enhanced cooking instructions parsing - NO FALLBACK TO ORIGINAL STEPS
  const enhanceWithHFResponse = (recipe, ingredients, hfResult) => {
    try {
      // Use AI response to get cultural information and cooking instructions
      let aiText = '';
      if (Array.isArray(hfResult) && hfResult[0]) {
        aiText = hfResult[0].generated_text || hfResult[0].summary_text || '';
      } else if (hfResult.generated_text) {
        aiText = hfResult.generated_text;
      }

      console.log('🤖 Processing HF cultural response:', aiText);

      // Extract cooking instructions from HF response
      const instructionLines = aiText.split('\n').filter(line => {
        const cleanLine = line.trim();
        return cleanLine.length > 15 && 
               (cleanLine.match(/^\d+\./) || 
                cleanLine.toLowerCase().includes('cook') ||
                cleanLine.toLowerCase().includes('heat') ||
                cleanLine.toLowerCase().includes('add') ||
                cleanLine.toLowerCase().includes('mix') ||
                cleanLine.toLowerCase().includes('stir') ||
                cleanLine.toLowerCase().includes('bake') ||
                cleanLine.toLowerCase().includes('fry'));
      });

      const aiInstructions = instructionLines.length > 0 ? instructionLines.slice(0, 6) : null;
      console.log('🤖 HF extracted instructions:', aiInstructions);

      // Extract any numbers from AI response to enhance estimates
      const numbers = aiText.match(/\d+/g) || [];
      
      const baseResults = {
        prepTime: estimatePrepTime(ingredients.length),
        nutrition: estimateNutrition(recipe.name, ingredients),
        alternateIngredients: generateAlternatives(ingredients.slice(0, 3)),
        aiInstructions: aiInstructions, // Include AI instructions from HF - NO FALLBACK
        culturalInfo: extractCulturalInfoFromAI(aiText, recipe.name)
      };

      // AI-enhance the nutritional estimates
      if (numbers.length > 0) {
        const validTimes = numbers.filter(n => parseInt(n) >= 15 && parseInt(n) <= 120);
        if (validTimes.length > 0) {
          baseResults.prepTime = parseInt(validTimes[0]);
        }

        const validCalories = numbers.filter(n => parseInt(n) >= 150 && parseInt(n) <= 600);
        if (validCalories.length > 0) {
          baseResults.nutrition.calories = parseInt(validCalories[0]);
          baseResults.nutrition.protein = Math.round(baseResults.nutrition.calories / 20);
          baseResults.nutrition.carbs = Math.round(baseResults.nutrition.calories / 12);
          baseResults.nutrition.fat = Math.round(baseResults.nutrition.calories / 50);
        }
      }

      return baseResults;
    } catch (error) {
      console.error('Error enhancing with HF:', error);
      return {
        prepTime: estimatePrepTime(ingredients.length),
        nutrition: estimateNutrition(recipe.name, ingredients),
        alternateIngredients: generateAlternatives(ingredients.slice(0, 3)),
        aiInstructions: null, // NO STATIC FALLBACK EVER
        culturalInfo: null
      };
    }
  };

  // Extract Cultural Information from AI Text Response
  const extractCulturalInfoFromAI = (aiText, recipeName) => {
    if (!aiText || aiText.length < 50) return null;

    try {
      const text = aiText.toLowerCase();
      
      // Try to extract cultural information from AI response
      let origin = 'Origin not determined by AI';
      let history = 'Historical information not available';
      let significance = 'Cultural significance not available';
      let season = 'Seasonal information not available';
      let serving = 'Traditional serving information not available';
      let tips = 'Cultural cooking tips not available';

      // Extract origin information
      const originKeywords = ['origin', 'from', 'originated', 'country', 'region', 'culture'];
      const countryNames = ['india', 'china', 'italy', 'japan', 'greece', 'mexico', 'france', 'thailand', 'peru', 'mediterranean'];
      
      for (const country of countryNames) {
        if (text.includes(country)) {
          origin = `${country.charAt(0).toUpperCase() + country.slice(1)} (identified by AI)`;
          break;
        }
      }

      // Extract historical information
      if (text.includes('history') || text.includes('ancient') || text.includes('traditional') || text.includes('century')) {
        const sentences = aiText.split(/[.!?]+/);
        const historySentence = sentences.find(s => 
          s.toLowerCase().includes('history') || 
          s.toLowerCase().includes('ancient') || 
          s.toLowerCase().includes('traditional') ||
          s.toLowerCase().includes('century')
        );
        if (historySentence) {
          history = historySentence.trim() + ' (AI generated)';
        }
      }

      // Extract cultural significance
      if (text.includes('cultural') || text.includes('tradition') || text.includes('celebration') || text.includes('festival')) {
        const sentences = aiText.split(/[.!?]+/);
        const culturalSentence = sentences.find(s => 
          s.toLowerCase().includes('cultural') || 
          s.toLowerCase().includes('tradition') || 
          s.toLowerCase().includes('celebration')
        );
        if (culturalSentence) {
          significance = culturalSentence.trim() + ' (AI generated)';
        }
      }

      // Extract serving information
      if (text.includes('served') || text.includes('serving') || text.includes('eaten')) {
        const sentences = aiText.split(/[.!?]+/);
        const servingSentence = sentences.find(s => 
          s.toLowerCase().includes('served') || 
          s.toLowerCase().includes('serving') || 
          s.toLowerCase().includes('eaten')
        );
        if (servingSentence) {
          serving = servingSentence.trim() + ' (AI generated)';
        }
      }

      // Extract cooking tips
      if (text.includes('tip') || text.includes('cook') || text.includes('prepare') || text.includes('technique')) {
        const sentences = aiText.split(/[.!?]+/);
        const tipSentence = sentences.find(s => 
          s.toLowerCase().includes('tip') || 
          s.toLowerCase().includes('cook') || 
          s.toLowerCase().includes('technique')
        );
        if (tipSentence) {
          tips = tipSentence.trim() + ' (AI generated)';
        }
      }

      return {
        origin,
        history,
        significance,
        season,
        serving,
        tips
      };
    } catch (error) {
      console.error('Error extracting cultural info from AI:', error);
      return null;
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
    console.log('🔍 DEBUG - Resetting to home');
    setSelectedRecipe(null);
    setAiRecommendations(null);
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
    setApiKeyError(false);
    setLoading(false); // Make sure loading is also reset
    setShowCulturalCards(false); // Reset cultural cards
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
                <span>AI-Powered Recipe Discovery</span>
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
                <h3 className="text-lg font-semibold text-amber-800 mb-2">Real AI Required - Setup Instructions</h3>
                <div className="text-amber-700 space-y-3">
                  <div className="bg-white/50 rounded-lg p-4">
                    <h4 className="font-semibold text-amber-800 mb-2">🚀 Option 1: Google Gemini (Recommended - Most Reliable)</h4>
                    <ol className="list-decimal list-inside space-y-1 ml-2 text-sm">
                      <li>Go to <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Google AI Studio</a></li>
                      <li>Click "Create API Key" (free with generous limits)</li>
                      <li>Add <code className="bg-amber-100 px-2 py-1 rounded">VITE_GEMINI_API_KEY=your_key_here</code> to your .env file</li>
                    </ol>
                  </div>
                  
                  <div className="bg-white/50 rounded-lg p-4">
                    <h4 className="font-semibold text-amber-800 mb-2">🎨 Option 2: OpenAI DALL-E (For AI Images)</h4>
                    <ol className="list-decimal list-inside space-y-1 ml-2 text-sm">
                      <li>Go to <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">OpenAI API Keys</a></li>
                      <li>Create API Key (pay-per-use, ~$0.04 per image)</li>
                      <li>Add <code className="bg-amber-100 px-2 py-1 rounded">VITE_OPENAI_API_KEY=your_openai_key</code> to your .env file</li>
                    </ol>
                  </div>
                  
                  <div className="bg-white/50 rounded-lg p-4">
                    <h4 className="font-semibold text-amber-800 mb-2">🔄 Option 3: Hugging Face (Backup for Analysis + Free Images)</h4>
                    <ol className="list-decimal list-inside space-y-1 ml-2 text-sm">
                      <li>Go to <a href="https://huggingface.co/join" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">huggingface.co</a> and create a free account</li>
                      <li>Go to Settings → Access Tokens and create a new token</li>
                      <li>Add <code className="bg-amber-100 px-2 py-1 rounded">VITE_HF_API_KEY=hf_your_token_here</code> to your .env file</li>
                    </ol>
                  </div>
                  
                  <p className="text-sm font-semibold">⚡ Restart the development server after adding API keys</p>
                  <p className="text-xs">🎯 <strong>Recommended combo:</strong> Gemini (analysis) + OpenAI (images) for best results!</p>
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
          <div className="center-container">
            <div className="text-center mb-12 w-full">
              <h1 className="text-6xl font-bold text-gray-800 mb-4">
                What's Cooking?
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
              <h1 className="text-4xl font-bold text-gray-800 mb-4">{selectedRecipe.name}</h1>
              <p className="text-lg text-gray-600 mb-6">{selectedRecipe.descripition}</p>
              
              {/* Recipe Image - Original or AI-generated */}
              {selectedRecipe.image ? (
                <img 
                  src={selectedRecipe.image} 
                  alt={selectedRecipe.name}
                  className="w-full h-64 object-cover rounded-xl mb-6"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : aiRecommendations?.aiImage ? (
                <div className="relative">
                  <img 
                    src={aiRecommendations.aiImage} 
                    alt={`AI-generated ${selectedRecipe.name}`}
                    className="w-full h-64 object-cover rounded-xl mb-6"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <div className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    🤖 AI Generated
                  </div>
                </div>
              ) : (
                <div className="w-full h-64 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl mb-6 flex items-center justify-center">
                  <div className="text-center">
                    <ChefHat className="h-20 w-20 text-indigo-600 mx-auto mb-4" />
                    <p className="text-indigo-800 font-semibold">{selectedRecipe.name}</p>
                    {loading && <p className="text-xs text-indigo-600 mt-2">🎨 Generating AI image...</p>}
                  </div>
                </div>
              )}
              
              {/* Complete Ingredients List */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Utensils className="h-5 w-5 text-indigo-600 mr-2" />
                  Ingredients ({parseIngredients(selectedRecipe.ingredients).length} items)
                </h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="grid md:grid-cols-2 gap-2">
                    {parseIngredients(selectedRecipe.ingredients).map((ingredient, index) => (
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

              {/* Recipe Steps */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Clock className="h-5 w-5 text-green-600 mr-2" />
                  Instructions
                </h3>
                
                <div className="bg-green-50 rounded-xl p-4">
                  <div className="space-y-3">
                    {(() => {
                      // Use AI-generated instructions if available, otherwise fall back to original
                      if (aiRecommendations?.aiInstructions && aiRecommendations.aiInstructions.length > 0) {
                        console.log('🤖 Displaying AI-generated instructions:', aiRecommendations.aiInstructions);
                        return aiRecommendations.aiInstructions.map((step, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold min-w-[24px]">
                              {index + 1}
                            </span>
                            <p className="text-gray-700 text-sm flex-1 leading-relaxed">
                              {step}
                            </p>
                          </div>
                        ));
                      }
                      
                      try {
                        // Safe parsing of original steps
                        const stepsStr = selectedRecipe.steps.replace(/^\[|\]$/g, '');
                        const steps = stepsStr.split('\', \'').map(step => 
                          step.replace(/^\'|\'$/g, '').replace(/^\"|\"$/g, '')
                        );
                        return steps.map((step, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold min-w-[24px]">
                              {index + 1}
                            </span>
                            <p className="text-gray-700 text-sm flex-1 leading-relaxed">
                              {step}
                            </p>
                          </div>
                        ));
                      } catch (error) {
                        return (
                          <p className="text-gray-600 text-sm">
                            Cooking instructions available - AI will enhance these when configured.
                          </p>
                        );
                      }
                    })()}
                  </div>
                </div>
                
                {/* Loading message under instructions */}
                {loading && (
                  <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="h-5 w-5 text-blue-600 animate-spin" />
                      <span className="text-blue-800">AI is analyzing your recipe...</span>
                    </div>
                  </div>
                )}
                
                {/* Message when no AI instructions are available */}
                {!loading && (!aiRecommendations?.aiInstructions || aiRecommendations?.aiInstructions?.length === 0) && (
                  <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-amber-600" />
                      <span className="text-amber-800">💡 Configure AI to get detailed, traditional cooking instructions with techniques and timing</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* AI Recommendations */}
            {!loading && aiRecommendations ? (
              <div className="grid md:grid-cols-2 gap-6">
                {/* Preparation Time & Nutrition */}
                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <Clock className="h-5 w-5 text-indigo-600" />
                    <h3 className="text-xl font-semibold">Preparation Time</h3>
                    {!aiRecommendations.aiGenerated && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Smart Estimate</span>}
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-indigo-600">{aiRecommendations.prepTime} min</p>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <Apple className="h-5 w-5 text-green-600" />
                    <h3 className="text-xl font-semibold">Nutritional Value</h3>
                    {!aiRecommendations.aiGenerated && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Smart Estimate</span>}
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

                {/* Cultural & Historical Information - Only show if AI provided data */}
                {aiRecommendations.culturalInfo && (
                  <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg md:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-5 w-5 text-purple-600" />
                        <h3 className="text-xl font-semibold">Cultural Heritage & History</h3>
                        <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">🤖 AI Generated</span>
                      </div>
                      
                      {/* Cultural Story Cards Button */}
                      <button
                        onClick={() => setShowCulturalCards(true)}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                      >
                        📖 Story Cards
                      </button>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Origin & History */}
                      <div className="space-y-4">
                        <div className="bg-purple-50 rounded-lg p-4">
                          <h4 className="font-semibold text-purple-800 mb-2 flex items-center">
                            🌍 Origin
                          </h4>
                          <p className="text-purple-700 text-sm">{aiRecommendations.culturalInfo.origin}</p>
                        </div>
                        
                        <div className="bg-blue-50 rounded-lg p-4">
                          <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                            📜 History
                          </h4>
                          <p className="text-blue-700 text-sm">{aiRecommendations.culturalInfo.history}</p>
                        </div>
                        
                        <div className="bg-amber-50 rounded-lg p-4">
                          <h4 className="font-semibold text-amber-800 mb-2 flex items-center">
                            🎭 Cultural Significance
                          </h4>
                          <p className="text-amber-700 text-sm">{aiRecommendations.culturalInfo.significance}</p>
                        </div>
                      </div>
                      
                      {/* Traditional Context */}
                      <div className="space-y-4">
                        <div className="bg-green-50 rounded-lg p-4">
                          <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                            🌸 Traditional Season
                          </h4>
                          <p className="text-green-700 text-sm">{aiRecommendations.culturalInfo.season}</p>
                        </div>
                        
                        <div className="bg-rose-50 rounded-lg p-4">
                          <h4 className="font-semibold text-rose-800 mb-2 flex items-center">
                            🍽️ Traditional Serving
                          </h4>
                          <p className="text-rose-700 text-sm">{aiRecommendations.culturalInfo.serving}</p>
                        </div>
                        
                        <div className="bg-indigo-50 rounded-lg p-4">
                          <h4 className="font-semibold text-indigo-800 mb-2 flex items-center">
                            💡 Cultural Cooking Tips
                          </h4>
                          <p className="text-indigo-700 text-sm">{aiRecommendations.culturalInfo.tips}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Message when no cultural info available */}
                {!aiRecommendations.culturalInfo ? (
                  <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 md:col-span-2">
                    <div className="flex items-center justify-center space-x-2 text-gray-600">
                      <BookOpen className="h-5 w-5" />
                      <p>🤖 Cultural information will be provided by AI when API keys are configured</p>
                    </div>
                  </div>
                ) : null}

              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white/60 backdrop-blur-md border-t border-white/20 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p>Built with ❤️ by HumanXAI for foodies</p>
            <p className="mt-2">🔒 Privacy-first design - No data is stored or tracked</p>
            <p className="mt-2">✨ Featuring Cultural Story Cards - Discover the heritage behind every dish</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;