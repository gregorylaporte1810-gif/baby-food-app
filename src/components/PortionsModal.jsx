export default function PortionsModal({ onClose }) {
    const ageGuides = [
        {
            age: "4 à 6 mois (Début de la diversification)",
            milk: "500 ml à 800 ml par jour (Lait maternel ou 1er/2ème âge). Le lait reste l'aliment principal.",
            solids: "Découverte : 1 à 3 cuillères à café (quelques grammes) jusqu'à un demi-petit pot (60-80 g) par jour.",
            proteins: "Pas obligatoire au tout début. Dès 6 mois : 10 g/jour (2 c.à.c de viande/poisson ou 1/4 d'œuf dur).",
            fats: "1 cuillère à café d'huile végétale (colza, olive) ou une pointe de beurre frais par repas."
        },
        {
            age: "6 à 8 mois",
            milk: "500 ml minimum par jour (3 à 4 biberons/tétées).",
            solids: "Purée/Morceaux très fondants : 130 g à 200 g de légumes/féculents + compote (100 g) au goûter.",
            proteins: "10 g par jour (équivaut à 2 c.à.c de viande/poisson haché ou 1/4 d'œuf dur).",
            fats: "1 cuillère à café d'huile végétale par repas cuisiné."
        },
        {
            age: "9 à 12 mois",
            milk: "500 ml par jour (Lait 2ème âge ou allaitement).",
            solids: "Repas complets : 200 g à 250 g de plat principal (légumes + féculents) + 1 fruit/compote.",
            proteins: "15 g par jour (3 c.à.c de viande/poisson haché ou 1/3 d'œuf dur).",
            fats: "1 à 2 cuillères à café d'huile végétale par jour."
        },
        {
            age: "12 à 36 mois",
            milk: "500 ml par jour (Lait de croissance ou produits laitiers adaptés).",
            solids: "Assiette familiale adaptée : 250 g à 300 g par repas selon l'appétit de l'enfant.",
            proteins: "20 g par jour (4 c.à.c de viande/poisson ou 1/2 œuf dur).",
            fats: "Maintenir l'ajout régulier de matières grasses crues de bonne qualité."
        }
    ];

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.85)',
                backdropFilter: 'blur(6px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px',
                zIndex: 2000
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: '#1e293b',
                    border: '1px solid #38bdf8',
                    borderRadius: '24px',
                    padding: '24px',
                    maxWidth: '480px',
                    width: '100%',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    boxSizing: 'border-box'
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h2 style={{ margin: 0, color: '#38bdf8', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        📊 Quantités Recommandées
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'rgba(255,255,255,0.1)',
                            border: 'none',
                            color: '#fff',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            cursor: 'pointer'
                        }}
                    >
                        ✕
                    </button>
                </div>

                <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '12px', borderRadius: '12px', marginBottom: '16px', fontSize: '12px', color: '#cbd5e1' }}>
                    💡 <strong>Règle d'or :</strong> Ces chiffres sont des repères indicatifs. Bébé régule lui-même son appétit : ne le forcez jamais à finir son assiette ou son biberon.
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {ageGuides.map((item, idx) => (
                        <div key={idx} style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '14px', padding: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                            <h3 style={{ margin: '0 0 8px 0', fontSize: '15px', color: '#f59e0b' }}>{item.age}</h3>
                            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <li><strong>🍼 Lait / Biberons :</strong> {item.milk}</li>
                                <li><strong>🥣 Solides (Purées/DME) :</strong> {item.solids}</li>
                                <li><strong>🥩 Protéines :</strong> {item.proteins}</li>
                                <li><strong>🥑 Matières grasses :</strong> {item.fats}</li>
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}