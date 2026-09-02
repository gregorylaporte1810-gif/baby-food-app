import { useRef, useState } from 'react';
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
  const importInputRef = useRef(null);

  // État pour transmettre le filtre vers l'onglet recettes
  const [selectedRecipeIngredient, setSelectedRecipeIngredient] = useState('');

  // Gestion Multi-profils & Sauvegarde
  const [profiles, setProfiles] = useLocalStorage('baby_profiles', ['Bébé 1']);
  const [activeProfile, setActiveProfile] = useLocalStorage('baby_active_profile', 'Bébé 1');
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

  const handleExportData = () => {
    const data = {};
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (key && (key.startsWith('baby_') || key.startsWith('industrialHistory'))) {
        data[key] = localStorage.getItem(key);
      }
    }

    const blob = new Blob([JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), data }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sauvegarde-bebe-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    try {
      const backup = JSON.parse(await file.text());
      if (!backup?.data || typeof backup.data !== 'object' || Array.isArray(backup.data)) throw new Error('Format invalide');
      const entries = Object.entries(backup.data).filter(([key, value]) =>
        typeof value === 'string' && (key.startsWith('baby_') || key.startsWith('industrialHistory'))
      );
      if (entries.length === 0) throw new Error('Aucune donnée compatible');
      if (!window.confirm('Restaurer cette sauvegarde ? Les données actuelles portant les mêmes noms seront remplacées.')) return;
      entries.forEach(([key, value]) => localStorage.setItem(key, value));
      window.location.reload();
    } catch {
      alert("Ce fichier n'est pas une sauvegarde valide de l'application.");
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

        <header style={{ textAlign: 'left', margin: '8px 0 16px' }}>
          <p style={{ margin: 0, color: '#0369a1', fontSize: '12px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Diversification alimentaire
          </p>
          <h1 style={{ margin: '2px 0 4px', color: '#0f172a', fontSize: '28px', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
            Les découvertes de bébé
          </h1>
          <p style={{ margin: 0, color: '#475569', fontSize: '13px', lineHeight: 1.45 }}>
            Aliments, recettes, réactions et repères réunis au même endroit.
          </p>
        </header>

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
            <Tracker
              foods={foodsData}
              tracker={currentTracker}
              industrialHistoryKey={`industrialHistory_${activeProfile}`}
            />

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
          <Recipes
            key={`${activeProfile}:${selectedRecipeIngredient || 'all-recipes'}`}
            tracker={currentTracker}
            recipeSearchTerm={selectedRecipeIngredient}
            industrialHistoryKey={`industrialHistory_${activeProfile}`}
          />
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
        {showHealthTracker && (
          <HealthTrackerModal
            storageKey={`baby_health_logs_${activeProfile}`}
            onClose={() => setShowHealthTracker(false)}
          />
        )}
        {showSummary && (
          <SummaryModal
            foods={foodsData}
            tracker={currentTracker}
            healthStorageKey={`baby_health_logs_${activeProfile}`}
            onClose={() => setShowSummary(false)}
          />
        )}

        <aside style={{ marginTop: '18px', padding: '12px 14px', borderRadius: '14px', background: 'rgba(255,255,255,0.72)', border: '1px solid rgba(148,163,184,0.35)', color: '#475569', fontSize: '11px', lineHeight: 1.5, textAlign: 'left' }}>
          <strong style={{ color: '#334155' }}>Information importante :</strong> ces repères sont généraux et ne remplacent pas l’avis du pédiatre. En cas d’urgence, appelez le 15 ou le 112 et suivez les instructions des secours.
        </aside>

        <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
          <button onClick={handleExportData} style={{ flex: 1, border: '1px solid #0ea5e9', background: '#ffffff', color: '#0369a1', borderRadius: '10px', padding: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>💾 Sauvegarder mes données</button>
          <button onClick={() => importInputRef.current?.click()} style={{ flex: 1, border: '1px solid #64748b', background: '#ffffff', color: '#334155', borderRadius: '10px', padding: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>📂 Restaurer une sauvegarde</button>
          <input ref={importInputRef} type="file" accept="application/json,.json" onChange={handleImportData} hidden />
        </div>

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
