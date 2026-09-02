export default function DailyMealsModal({ onClose }) {
    const mealPlans = [
        {
            age: "4 - 6 mois (Début diversification)",
            frequency: "1 repas par jour (midi de préférence)",
            meals: [
                { name: "Matin", detail: "Tétée ou Biberon de lait (210 - 240 ml)" },
                { name: "Midi", detail: "2 à 3 cuillères à soupe de purée lisse + Lait" },
                { name: "Goûter", detail: "Tétée ou Biberon de lait (210 - 240 ml) (+ compote si souhaité)" },
                { name: "Soir", detail: "Tétée ou Biberon de lait (210 - 240 ml)" }
            ]
        },
        {
            age: "6 - 8 mois (Introduction des protéines & goûter)",
            frequency: "2 repas à la cuillère par jour",
            meals: [
                { name: "Matin", detail: "Tétée ou Biberon de lait (210 - 240 ml)" },
                { name: "Midi", detail: "Purée selon l'appétit + jusqu'à 10 g de viande/poisson ou 1/4 d'œuf dur + matière grasse + lait ou fruit" },
                { name: "Goûter", detail: "Compote (60-100g) + Tétée ou Biberon de lait (210 ml)" },
                { name: "Soir", detail: "Tétée ou Biberon de lait (210 - 240 ml) (+ purée de légumes si grand appétit)" }
            ]
        },
        {
            age: "8 - 12 mois (Repas structurés & morceaux doux)",
            frequency: "3 à 4 vrais temps de repas",
            meals: [
                { name: "Matin", detail: "Tétée ou Biberon (240 ml) (+ quelques morceaux de pain/fruit)" },
                { name: "Midi", detail: "Légumes/féculents selon l'appétit + environ 10 g de viande/poisson ou 1/4 d'œuf dur + matière grasse + laitage/fruit" },
                { name: "Goûter", detail: "Compote ou fruit tendre + Laitage (yaourt/petit suisse ou lait)" },
                { name: "Soir", detail: "Purée de légumes/féculents (150-200g) avec un filet d'huile + Lait" }
            ]
        },
        {
            age: "12 mois et + (Vers la table des grands)",
            frequency: "4 repas par jour",
            meals: [
                { name: "Matin", detail: "Lait (240 ml) + Céréales / Pain avec beurre + Fruit" },
                { name: "Midi", detail: "Assiette équilibrée (200g+) + 20g de protéine + Matière grasse + Dessert" },
                { name: "Goûter", detail: "Laitage + Fruit frais + Petit biscuit / Pain" },
                { name: "Soir", detail: "Repas complet léger (Légumes, féculents, laitage) + Fruit" }
            ]
        }
    ];

    const frequencyWarnings = [
        {
            title: "🐟 Poissons (2 fois par semaine)",
            desc: "Alterner poisson gras et poisson maigre, varier les espèces et éviter les poissons fortement contaminés au mercure (espadon, marlin, requin...)."
        },
        {
            title: "🫀 Abats & Foie (1x / 2 semaines max)",
            desc: "Très riches en Vitamine A. Une surconsommation peut être toxique pour le foie de bébé."
        },
        {
            title: "🌾 Riz & Produits à base de riz (À alterner)",
            desc: "Variez avec l'avoine, le blé, la patate douce ou le quinoa pour limiter l'exposition à l'arsenic naturel."
        },
        {
            title: "🚫 Sel, Sucre & Ultra-transformés (À éviter)",
            desc: "Pas de sel ajouté (reins fragiles) ni de produits sucrés/industriels. Légumes et fruits au naturel !"
        },
        {
            title: "🥑 Matières grasses (Chaque jour !)",
            desc: "Ajoutez 1 c.à.c de bonne huile (colza, olive, noix) ou du beurre dans ses purées chaque jour pour son cerveau."
        }
    ];

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(15, 23, 42, 0.65)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '16px'
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: '#ffffff',
                    borderRadius: '20px',
                    padding: '20px',
                    maxWidth: '460px',
                    width: '100%',
                    maxHeight: '85vh',
                    overflowY: 'auto',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
                    color: '#0f172a'
                }}
            >
                {/* En-tête */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h2 style={{ margin: 0, fontSize: '18px', color: '#0369a1' }}>🕒 Repas, Fréquences & Eau</h2>
                    <button
                        onClick={onClose}
                        style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', fontWeight: 'bold', color: '#475569' }}
                    >
                        ✕
                    </button>
                </div>

                {/* 1. Section Répartition par repas (en premier) */}
                <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#0284c7' }}>📅 Planning type par âge</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                    {mealPlans.map((plan, index) => (
                        <div
                            key={index}
                            style={{
                                background: '#f8fafc',
                                borderRadius: '14px',
                                padding: '12px',
                                border: '1px solid #e2e8f0'
                            }}
                        >
                            <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#0284c7' }}>{plan.age}</h4>
                            <p style={{ margin: '0 0 8px 0', fontSize: '11px', color: '#10b981', fontWeight: '600' }}>
                                📌 {plan.frequency}
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                {plan.meals.map((meal, mIdx) => (
                                    <div key={mIdx} style={{ fontSize: '11px', background: '#ffffff', padding: '6px 8px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                                        <strong style={{ color: '#334155' }}>{meal.name} : </strong>
                                        <span style={{ color: '#475569' }}>{meal.detail}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* 2. Section Hydratation & Eau */}
                <div style={{ marginBottom: '16px', background: '#e0f2fe', padding: '12px', borderRadius: '12px', border: '1px solid #bae6fd' }}>
                    <h3 style={{ margin: '0 0 6px 0', fontSize: '14px', color: '#0369a1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        💧 Quand et comment proposer de l'eau ?
                    </h3>
                    <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '11px', color: '#0c4a6e', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <li><strong>Avant 6 mois :</strong> Lait exclusif. Pas besoin d'eau (sauf forte chaleur/fièvre).</li>
                        <li><strong>Dès 6 mois :</strong> Proposer quelques gorgées au cours des repas à la cuillère (tasse à bec ou petit verre).</li>
                        <li><strong>Choix de l'eau :</strong> Eau en bouteille faible en minéraux (mention <em>« convient pour nourrissons »</em>) ou eau du robinet non adoucie.</li>
                    </ul>
                </div>

                {/* 3. Section Avertissements et Fréquences */}
                <div style={{ background: '#fff7ed', padding: '12px', borderRadius: '12px', border: '1px solid #ffedd5' }}>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#c2410c', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        ⚠️ Aliments à limiter ou surveiller
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {frequencyWarnings.map((warn, wIdx) => (
                            <div key={wIdx} style={{ fontSize: '11px', background: '#ffffff', padding: '8px', borderRadius: '8px', border: '1px solid #fed7aa' }}>
                                <strong style={{ color: '#9a3412', display: 'block', marginBottom: '2px' }}>{warn.title}</strong>
                                <span style={{ color: '#431407' }}>{warn.desc}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
