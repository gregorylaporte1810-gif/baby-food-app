import { useState } from 'react';
import foodsData from './data/foods.json';
import SearchBar from './components/SearchBar';
import FoodList from './components/FoodList';
import FoodDetailModal from './components/FoodDetailModal';
import FirstAidModal from './components/FirstAidModal';
import Tracker from './components/Tracker';
import SecurityGuide from './components/SecurityGuide';
import Recipes from './components/Recipes';
import PortionsModal from './components/PortionsModal';
import { useLocalStorage } from './hooks/useLocalStorage';
import DailyMealsModal from './components/DailyMealsModal';
import HealthTrackerModal from './components/HealthTrackerModal';
import SummaryModal from './components/SummaryModal';


function App() {
  const [activeTab, setActiveTab] = useState('foods');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filterMode, setFilterMode] = useState('all');
  const [selectedFood, setSelectedFood] = useState(null);
  const [showFirstAid, setShowFirstAid] = useState(false);
  const [showPortions, setShowPortions] = useState(false);
  const [showDailyMeals, setShowDailyMeals] = useState(false);
  const [showHealthTracker, setShowHealthTracker] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  // État pour transmettre le filtre vers l'onglet recettes
  const [selectedRecipeIngredient, setSelectedRecipeIngredient] = useState('');

  // Gestion Multi-profils & Sauvegarde
  const [profiles, setProfiles] = useLocalStorage('baby_profiles', ['Bébé 1']);
  const [activeProfile, setActiveProfile] = useState('Bébé 1');
  const [trackers, setTrackers] = useLocalStorage('baby_trackers_multi', {});

  const currentTracker = trackers[activeProfile] || {};

  const handleToggleTrack = (foodId, key, value) => {
    setTrackers((prev) => {
      const childData = prev[activeProfile] || {};
      const currentFood = childData[foodId] || { tested: false, rating: null };

      let updatedFood = { ...currentFood };
      if (key === 'tested') updatedFood.tested = !currentFood.tested;
      if (key === 'rating') updatedFood.rating = value;

      return {
        ...prev,
        [activeProfile]: { ...childData, [foodId]: updatedFood }
      };
    });
  };

  const handleGoToRecipes = (ingredientName) => {
    setSelectedRecipeIngredient(ingredientName);
    setActiveTab('recipes');
  };

  const handleAddProfile = () => {
    const name = prompt("Prénom de l'enfant :");
    if (name && !profiles.includes(name)) {
      setProfiles([...profiles, name]);
      setActiveProfile(name);
    }
  };

  const handleDeleteProfile = () => {
    if (profiles.length <= 1) {
      alert("Vous devez conserver au moins un profil.");
      return;
    }

    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le profil "${activeProfile}" et toutes ses données ?`)) {
      const newProfiles = profiles.filter(p => p !== activeProfile);
      setProfiles(newProfiles);
      setActiveProfile(newProfiles[0]);

      setTrackers((prev) => {
        const updatedTrackers = { ...prev };
        delete updatedTrackers[activeProfile];
        return updatedTrackers;
      });
    }
  };

  const filteredFoods = foodsData.filter((food) => {
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = !selectedCategory || (
      selectedCategory === 'Allergènes'
        ? food.isAllergen
        : food.category === selectedCategory
    );

    const isTested = currentTracker[food.id]?.tested;
    const matchesFilter =
      filterMode === 'tested' ? isTested :
        filterMode === 'untested' ? !isTested : true;

    return matchesSearch && matchesCategory && matchesFilter;
  });

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        background: 'linear-gradient(180deg, #bae6fd 0%, #e0f2fe 35%, #d1fae5 70%, #fef3c7 100%)',
        backgroundAttachment: 'fixed',
        color: '#0f172a',
        padding: '16px 12px 80px 12px',
        fontFamily: 'sans-serif',
        boxSizing: 'border-box',
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      {/* Conteneur App Mobile */}
      <div style={{ maxWidth: '480px', width: '100%', position: 'relative', boxSizing: 'border-box' }}>

        {/* Émojis ancrés à la carte de l'application */}
        <div style={{ position: 'absolute', top: '-10px', left: '-25px', fontSize: '26px', opacity: 0.7, pointerEvents: 'none' }}>☁️</div>
        <div style={{ position: 'absolute', top: '15px', right: '-25px', fontSize: '22px', opacity: 0.7, pointerEvents: 'none' }}>⭐</div>
        <div style={{ position: 'absolute', top: '180px', right: '-30px', fontSize: '24px', opacity: 0.7, pointerEvents: 'none' }}>🎨</div>
        <div style={{ position: 'absolute', top: '320px', left: '-30px', fontSize: '22px', opacity: 0.7, pointerEvents: 'none' }}>🚀</div>
        <div style={{ position: 'absolute', top: '500px', right: '-25px', fontSize: '24px', opacity: 0.7, pointerEvents: 'none' }}>🦁</div>

        {/* Sélecteur de Profil & Export */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <select
              value={activeProfile}
              onChange={(e) => setActiveProfile(e.target.value)}
              style={{
                background: '#ffffff',
                color: '#0f172a',
                border: '1px solid #cbd5e1',
                padding: '6px 10px',
                borderRadius: '10px',
                fontWeight: '600',
                fontSize: '13px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}
            >
              {profiles.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>

            <button
              onClick={handleDeleteProfile}
              title="Supprimer ce profil"
              style={{
                background: '#fee2e2',
                color: '#ef4444',
                border: '1px solid #fca5a5',
                borderRadius: '8px',
                padding: '6px 8px',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}
            >
              🗑️
            </button>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={handleAddProfile}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#0f172a',
                borderRadius: '8px',
                padding: '6px 10px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}
            >
              + Enfant
            </button>

            <button
              onClick={() => setShowSummary(true)}
              style={{
                background: '#0284c7',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '6px 10px',
                fontSize: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(2, 132, 199, 0.3)'
              }}
            >
              📊 Voir le bilan
            </button>
          </div>
        </div>

        {/* Boutons Guides Quantités, Santé & Repas */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <button
            onClick={() => setShowPortions(true)}
            style={{
              flex: 1,
              background: '#ffffff',
              border: '1.5px solid #0284c7',
              color: '#0369a1',
              borderRadius: '12px',
              padding: '8px 10px',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
            }}
          >
            📊 Quantités
          </button>

          <button
            onClick={() => setShowHealthTracker(true)}
            style={{
              flex: 1,
              background: '#ffffff',
              border: '1.5px solid #9333ea',
              color: '#7e22ce',
              borderRadius: '12px',
              padding: '8px 10px',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
            }}
          >
            🩺 Santé & Transit
          </button>

          <button
            onClick={() => setShowDailyMeals(true)}
            style={{
              flex: 1,
              background: '#ffffff',
              border: '1.5px solid #10b981',
              color: '#047857',
              borderRadius: '12px',
              padding: '8px 10px',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
            }}
          >
            🕒 Repas/jour
          </button>
        </div>

        {/* Navigation Onglets */}
        <div
          style={{
            display: 'flex',
            gap: '6px',
            marginBottom: '12px',
            background: 'rgba(255, 255, 255, 0.7)',
            padding: '4px',
            borderRadius: '12px',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.8)'
          }}
        >
          {[
            { id: 'foods', label: '🍎 Aliments' },
            { id: 'recipes', label: '🍳 Recettes' },
            { id: 'security', label: '🛡️ Sécurité' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '8px 4px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === tab.id ? '#0284c7' : 'transparent',
                color: activeTab === tab.id ? '#ffffff' : '#334155',
                fontSize: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Onglet Aliments */}
        {activeTab === 'foods' && (
          <>
            <Tracker foods={foodsData} tracker={currentTracker} />

            <div style={{ margin: '12px 0' }}>
              <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />
            </div>

            <button
              onClick={() => {
                if (filterMode === 'all') setFilterMode('tested');
                else if (filterMode === 'tested') setFilterMode('untested');
                else setFilterMode('all');
              }}
              style={{
                marginBottom: '12px',
                padding: '8px',
                borderRadius: '10px',
                border: filterMode !== 'all' ? '1.5px solid #0284c7' : '1px solid #cbd5e1',
                background: filterMode !== 'all' ? '#e0f2fe' : '#ffffff',
                color: filterMode !== 'all' ? '#0369a1' : '#475569',
                fontSize: '12px',
                fontWeight: '600',
                width: '100%',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
              }}
            >
              {filterMode === 'tested' && '✓ Affichage : Goûtés uniquement'}
              {filterMode === 'untested' && '⏳ Affichage : Non goûtés uniquement'}
              {filterMode === 'all' && '🔍 Filtrer : Tous les aliments (Cliquer pour changer)'}
            </button>

            <FoodList
              foods={filteredFoods}
              selectedCategory={selectedCategory}
              onFoodClick={setSelectedFood}
            />
          </>
        )}

        {/* Onglet Recettes & Sécurité */}
        {activeTab === 'recipes' && (
          <Recipes tracker={currentTracker} recipeSearchTerm={selectedRecipeIngredient} />
        )}
        {activeTab === 'security' && <SecurityGuide />}

        {/* Modales (Nettoyées des doublons) */}
        <FoodDetailModal
          food={selectedFood}
          onClose={() => setSelectedFood(null)}
          tracker={currentTracker}
          onToggleTrack={handleToggleTrack}
          onGoToRecipes={handleGoToRecipes}
        />
        {showPortions && <PortionsModal onClose={() => setShowPortions(false)} />}
        {showFirstAid && <FirstAidModal onClose={() => setShowFirstAid(false)} />}
        {showDailyMeals && <DailyMealsModal onClose={() => setShowDailyMeals(false)} />}
        {showHealthTracker && <HealthTrackerModal onClose={() => setShowHealthTracker(false)} />}
        {showSummary && (
          <SummaryModal
            foods={foodsData}
            tracker={currentTracker}
            onClose={() => setShowSummary(false)}
          />
        )}

        {/* Bouton Fixe d'Urgence */}
        <button
          onClick={() => setShowFirstAid(true)}
          style={{
            position: 'fixed',
            bottom: '16px',
            right: '16px',
            background: '#ef4444',
            color: '#fff',
            border: 'none',
            borderRadius: '30px',
            padding: '10px 16px',
            fontWeight: 'bold',
            fontSize: '13px',
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
            cursor: 'pointer',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          🚨 Urgence
        </button>

      </div>
    </div>
  );
}

export default App;