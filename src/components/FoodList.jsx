import { useState } from 'react';
import FoodCard from './FoodCard';

export default function FoodList({ foods, selectedCategory, onFoodClick }) {
    const [openCategories, setOpenCategories] = useState({});

    // Liste complète de toutes les catégories de l'application
    const categories = [
        "Légumes",
        "Fruits",
        "Féculents",
        "Protéines",
        "Produits Laitiers",
        "Allergènes",
        "Épices & Aromates",
        "Divers"
    ];

    const toggleCategory = (cat) => {
        setOpenCategories((prev) => ({
            ...prev,
            [cat]: prev[cat] !== undefined ? !prev[cat] : false
        }));
    };

    const filteredCategories = !selectedCategory
        ? categories
        : categories.filter((cat) => cat.toLowerCase() === selectedCategory.toLowerCase());

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredCategories.map((cat) => {
                // Gestion de la catégorie "Allergènes" vs les catégories standards
                const categoryFoods = foods.filter((item) => {
                    if (cat.toLowerCase() === 'allergènes') {
                        return item.isAllergen;
                    }
                    return item.category?.toLowerCase() === cat.toLowerCase();
                });

                if (categoryFoods.length === 0) return null;

                // Ouvert par défaut (true) sauf si l'utilisateur l'a fermé
                const isOpen = openCategories[cat] ?? true;

                return (
                    <div
                        key={cat}
                        style={{
                            background: 'rgba(30, 41, 59, 0.7)',
                            borderRadius: '16px',
                            border: '1px solid rgba(255,255,255,0.08)',
                            overflow: 'hidden'
                        }}
                    >
                        <button
                            onClick={() => toggleCategory(cat)}
                            style={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '14px 18px',
                                background: 'rgba(255, 255, 255, 0.03)',
                                border: 'none',
                                color: '#f8fafc',
                                fontWeight: 'bold',
                                fontSize: '15px',
                                cursor: 'pointer'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>{cat}</span>
                                <span style={{
                                    fontSize: '11px',
                                    background: 'rgba(56, 189, 248, 0.2)',
                                    color: '#38bdf8',
                                    padding: '2px 8px',
                                    borderRadius: '10px'
                                }}>
                                    {categoryFoods.length}
                                </span>
                            </div>
                            <span style={{ color: '#94a3b8', fontSize: '12px' }}>
                                {isOpen ? '▲ Fermer' : '▼ Déplier'}
                            </span>
                        </button>

                        {isOpen && (
                            <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {categoryFoods.map((food) => (
                                    <FoodCard key={food.id} food={food} onClick={onFoodClick} />
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}