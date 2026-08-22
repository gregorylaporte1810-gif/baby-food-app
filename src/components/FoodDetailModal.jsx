export default function FoodDetailModal({ food, onClose, tracker, onToggleTrack, onGoToRecipes }) {
    if (!food) return null;

    const isTested = tracker[food.id]?.tested || false;
    const rating = tracker[food.id]?.rating ?? null;

    const ratingOptions = [
        { key: 'loved', label: '😍 A adoré' },
        { key: 'medium', label: '😐 Moyen' },
        { key: 'hated', label: '🤢 A détesté' }
    ];

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            zIndex: 1000
        }} onClick={onClose}>
            <div style={{
                background: '#1e293b',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '24px',
                padding: '24px',
                maxWidth: '440px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxSizing: 'border-box'
            }} onClick={(e) => e.stopPropagation()}>

                {/* En-tête */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '48px' }}>{food.icon}</div>
                    <button onClick={onClose} style={{
                        background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff',
                        borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer'
                    }}>✕</button>
                </div>

                <h2 style={{ margin: '12px 0 4px 0', fontSize: '24px' }}>{food.name}</h2>
                <p style={{ margin: 0, color: '#38bdf8', fontSize: '14px', fontWeight: 'bold' }}>
                    Dès {food.minAgeMonths} mois • {food.category}
                </p>
                {/* Encart Saison (uniquement pour les fruits et légumes) */}
                {(food.category === 'Légumes' || food.category === 'Fruits') && food.seasons && (
                    <div style={{
                        background: 'rgba(56, 189, 248, 0.1)',
                        border: '1px solid rgba(56, 189, 248, 0.3)',
                        borderRadius: '10px',
                        padding: '8px 12px',
                        margin: '10px 0',
                        color: '#38bdf8',
                        fontSize: '13px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <span>📅</span>
                        <span><strong>Saison :</strong> {food.seasons.join(', ')}</span>
                    </div>
                )}

                {/* Bouton d'accès aux recettes reliées */}
                {onGoToRecipes && (
                    <button
                        onClick={() => {
                            onGoToRecipes(food.name);
                            onClose();
                        }}
                        style={{
                            width: '100%',
                            padding: '10px',
                            marginTop: '12px',
                            background: 'rgba(56, 189, 248, 0.15)',
                            border: '1px solid #38bdf8',
                            color: '#38bdf8',
                            borderRadius: '12px',
                            fontWeight: 'bold',
                            fontSize: '13px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                        }}
                    >
                        🍳 Voir les recettes avec {food.name}
                    </button>
                )}

                {/* Risque d'étouffement */}
                <div style={{
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                    borderLeft: '4px solid #ef4444',
                    padding: '12px',
                    borderRadius: '8px',
                    margin: '16px 0',
                    fontSize: '13px'
                }}>
                    ⚠️ <strong>Risque :</strong> {food.chokingRisk}
                </div>

                {/* Découpe & Préparation */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px' }}>
                        <h4 style={{ margin: '0 0 6px 0', color: '#f59e0b' }}>🥣 Mode Purée</h4>
                        <p style={{ margin: 0, fontSize: '13px', color: '#cbd5e1' }}>{food.prepPuree}</p>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px' }}>
                        <h4 style={{ margin: '0 0 6px 0', color: '#10b981' }}>🖐️ Mode DME (Morceaux)</h4>
                        <p style={{ margin: 0, fontSize: '13px', color: '#cbd5e1' }}>{food.prepDme}</p>
                    </div>
                </div>

                {/* Actions Journal */}
                <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <button
                        type="button"
                        onClick={() => onToggleTrack(food.id, 'tested')}
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '12px',
                            border: 'none',
                            background: isTested ? '#10b981' : '#3b82f6',
                            color: '#fff',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        {isTested ? '✓ Déjà goûté par bébé' : 'Marquer comme goûté'}
                    </button>

                    {isTested && (
                        <div style={{
                            display: 'flex',
                            gap: '6px',
                            marginTop: '12px',
                            width: '100%'
                        }}>
                            {ratingOptions.map((option, idx) => {
                                const isSelected = rating === idx || rating === option.key;

                                return (
                                    <button
                                        key={option.key}
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onToggleTrack(food.id, 'rating', idx);
                                        }}
                                        style={{
                                            flex: 1,
                                            background: isSelected ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                                            border: isSelected ? '2px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.2)',
                                            color: '#ffffff',
                                            padding: '8px 2px',
                                            borderRadius: '8px',
                                            fontSize: '11px',
                                            fontWeight: isSelected ? 'bold' : 'normal',
                                            cursor: 'pointer',
                                            whiteSpace: 'nowrap',
                                            textAlign: 'center'
                                        }}
                                    >
                                        {option.label}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}