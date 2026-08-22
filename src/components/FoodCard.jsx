export default function FoodCard({ food, onClick }) {
    const seasonIcons = {
        'Printemps': '🌱',
        'Été': '☀️',
        'Automne': '🍂',
        'Hiver': '❄️'
    };

    const isFruitOrVeg = food.category === 'Légumes' || food.category === 'Fruits';

    return (
        <div
            onClick={() => onClick(food)}
            style={{
                background: 'rgba(30, 34, 47, 0.75)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '20px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
        >
            <div style={{ fontSize: '36px', background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '16px' }}>
                {food.icon}
            </div>

            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <h3 style={{ margin: 0, fontSize: '18px', color: '#fff' }}>{food.name}</h3>
                    {food.isAllergen && (
                        <span style={{ fontSize: '10px', background: '#e74c3c', color: '#fff', padding: '2px 6px', borderRadius: '8px' }}>
                            Allergène
                        </span>
                    )}
                </div>

                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#9ba1a6', display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span>Dès {food.minAgeMonths} mois • {food.category}</span>
                    {isFruitOrVeg && food.seasons && food.seasons.length > 0 && (
                        <span style={{ color: '#38bdf8' }}>
                            • {food.seasons.map((s) => `${seasonIcons[s] || ''} ${s}`).join(', ')}
                        </span>
                    )}
                </p>
            </div>

            <div style={{ color: '#9ba1a6', fontSize: '18px' }}>➔</div>
        </div>
    );
}