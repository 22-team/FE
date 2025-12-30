import { ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { RecipeCard } from '../features/RecipeCard.jsx';
import { SpeciesModal } from '../features/SpeciesModal.jsx';
import { BottomNav } from '../widgets/BottomNav.jsx';
import { getRandomCreatures } from '../entities/creatures.js';
import { getRecipes } from '../shared/api/api-local.js';

export function HomePage({ onNavigate }) {
  const [selectedSpecies, setSelectedSpecies] = useState(null);
  const [featuredSpecies, setFeaturedSpecies] = useState([]);
  const [topRecipes, setTopRecipes] = useState([]);
  const [refreshKey, setRefreshKey] = useState(Date.now());

  // Load random 3 creatures for featured section
  useEffect(() => {
    const randomCreatures = getRandomCreatures(3);
    setFeaturedSpecies(randomCreatures);
  }, []);

  // Load top recipes from database and refresh key on mount
  useEffect(() => {
    setRefreshKey(Date.now());

    const loadTopRecipes = async () => {
      try {
        const data = await getRecipes({ limit: 50 });
        // Sort by rating and get top 3
        const sorted = [...(data.recipes || [])].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        setTopRecipes(sorted.slice(0, 3));
      } catch (error) {
        console.error('Failed to load top recipes:', error);
        setTopRecipes([]);
      }
    };
    loadTopRecipes();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFA07A]/20 to-white pb-20">

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img
              src="/logo_2.png"
              alt="wintercamp logo"
              className="h-14 w-auto"
            />
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="w-full rounded-b-[24px] overflow-hidden">
        <img
          src="/banner.png"
          alt="먹어서 없애자 배너"
          className="w-full h-auto object-cover"
        />
      </div>

      {/* Top Recipes */}
      <div className="px-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3>인기 레시피</h3>
          <button
            onClick={() => onNavigate('recipes')}
            className="flex items-center gap-1 text-sm"
            style={{ color: '#EA512E' }}
          >
            전체보기
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        {topRecipes.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {topRecipes.slice(0, 3).map((recipe) => (
              <RecipeCard
                key={`${recipe.id}-${refreshKey}`}
                recipe={recipe}
                onClick={() => onNavigate('detail', recipe.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>아직 등록된 레시피가 없습니다</p>
          </div>
        )}
      </div>

      {/* Featured Species */}
      <div className="px-6 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3>주요 해양 유해 생물</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {featuredSpecies.map((species) => (
            species.image ? (
              <button
                key={species.id}
                onClick={() => setSelectedSpecies(species)}
                className="bg-white rounded-3xl overflow-hidden shadow-md border border-gray-100 active:scale-95 transition-all hover:shadow-lg"
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img
                    src={species.image}
                    alt={species.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <span className="text-sm font-medium text-white drop-shadow-lg block text-left leading-tight">
                      {species.name}
                    </span>
                  </div>
                </div>
              </button>
            ) : (
              <button
                key={species.id}
                onClick={() => setSelectedSpecies(species)}
                className="bg-white rounded-3xl overflow-hidden shadow-md border border-gray-100 active:scale-95 transition-all hover:shadow-lg p-4 flex items-center justify-center"
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">🐟</div>
                  <span className="text-sm block text-left leading-tight text-gray-700">
                    {species.name}
                  </span>
                </div>
              </button>
            )
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav currentPage="home" onNavigate={onNavigate} />

      {/* Species Modal */}
      {selectedSpecies && (
        <SpeciesModal
          species={selectedSpecies}
          onClose={() => setSelectedSpecies(null)}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}
