import { useRef, useState } from 'react';

export default function SearchBar({ searchTerm, setSearchTerm, selectedCategory, setSelectedCategory }) {
  const categories = [
    'Légumes',
    'Fruits',
    'Féculents',
    'Protéines',
    'Produits Laitiers',
    'Allergènes',
    'Épices & Aromates',
    'Divers'
  ];

  const scrollRef = useRef(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Défilement à la molette
  const handleWheel = (e) => {
    if (scrollRef.current && e.deltaY !== 0) {
      scrollRef.current.scrollLeft += e.deltaY;
    }
  };

  // Glisser-déposer à la souris (Click & Drag)
  const handleMouseDown = (e) => {
    setIsMouseDown(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseUpOrLeave = () => {
    setIsMouseDown(false);
  };

  const handleMouseMove = (e) => {
    if (!isMouseDown) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', minWidth: 0 }}>
      {/* Champ de recherche */}
      <input
        type="text"
        placeholder="🔍 Rechercher un aliment (ex: carotte, oeuf)..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: '100%',
          padding: '10px 14px',
          borderRadius: '10px',
          border: '1px solid #cbd5e1',
          background: '#ffffff',
          color: '#0f172a',
          fontSize: '14px',
          boxSizing: 'border-box',
          boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
        }}
      />

      {/* Boutons de filtres par catégorie */}
      <div
        ref={scrollRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseUpOrLeave}
        onMouseUp={handleMouseUpOrLeave}
        onMouseMove={handleMouseMove}
        style={{
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          width: '100%',
          paddingBottom: '6px',
          cursor: isMouseDown ? 'grabbing' : 'grab',
          userSelect: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(isActive ? '' : cat)}
              style={{
                flexShrink: 0,
                padding: '6px 12px',
                borderRadius: '20px',
                border: isActive ? 'none' : '1px solid #cbd5e1',
                background: isActive ? '#38bdf8' : '#ffffff',
                color: isActive ? '#ffffff' : '#334155',
                fontSize: '12px',
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                boxShadow: isActive
                  ? '0 2px 8px rgba(56, 189, 248, 0.4)'
                  : '0 2px 4px rgba(0,0,0,0.04)',
                transition: 'all 0.2s ease'
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}