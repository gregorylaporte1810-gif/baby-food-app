export default function SecurityGuide() {
    const forbiddenFoods = [
        { name: 'Miel', reason: 'Risque de botulisme infantile (grave) avant 1 an.' },
        { name: 'Lait cru et fromages au lait cru', reason: 'Risque d’infections bactériennes. Choisir des produits pasteurisés.' },
        { name: 'Fruits à coque entiers, cacahuètes entières, popcorn', reason: 'Risque majeur d’étouffement. Les fruits à coque peuvent être introduits finement moulus ou en purée lisse diluée.' },
        { name: 'Viande, poisson et œuf crus ou peu cuits', reason: 'Toujours les cuire à cœur pour réduire le risque infectieux.' },
        { name: 'Boissons végétales à la place du lait infantile', reason: 'Elles ne couvrent pas les besoins d’un enfant de moins d’un an.' }
    ];

    const limitFoods = [
        'Ne pas ajouter de sel ni de sucre et limiter les produits très salés ou ultra-transformés.',
        'L’eau est la boisson à proposer ; les jus, sodas et boissons sucrées ne sont pas nécessaires.',
        'Varier les poissons et les céréales ; ne pas donner le même poisson ou des produits à base de riz tous les jours.'
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', borderRadius: '16px', padding: '16px' }}>
                <h3 style={{ margin: '0 0 10px 0', color: 'black' }}>🚫 À ne pas donner avant 1 an</h3>
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: 'black' }}>
                    {forbiddenFoods.map((item) => (
                        <li key={item.name} style={{ marginBottom: '6px' }}>
                            <strong>{item.name} :</strong> {item.reason}
                        </li>
                    ))}
                </ul>
            </div>

            <div style={{ background: '#fff7ed', border: '1px solid #fb923c', borderRadius: '16px', padding: '16px', color: '#431407' }}>
                <h3 style={{ margin: '0 0 10px 0' }}>⚠️ À éviter ou limiter</h3>
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {limitFoods.map((item) => <li key={item}>{item}</li>)}
                </ul>
            </div>

            <div style={{ background: 'rgba(30, 41, 59, 0.7)', borderRadius: '16px', padding: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#38bdf8' }}>💡 Règles d'or de la DME & Purées</h3>
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <li><strong>Assise parfaite :</strong> Bébé doit être bien assis à 90° dans sa chaise haute, jamais allongé.</li>
                    <li><strong>Texture fondante :</strong> Les aliments en morceaux doivent pouvoir s'écraser facilement entre deux doigts.</li>
                    <li><strong>Bébé gère :</strong> Ne jamais mettre un morceau directement dans la bouche de bébé. C'est lui qui attrape.</li>
                    <li><strong>Surveillance :</strong> Un adulte attentif reste avec bébé pendant tout le repas, sans écran ni distraction.</li>
                    <li><strong>Allergènes :</strong> Une fois la diversification commencée, les introduire sans tarder, en petite quantité, bien cuits et sous une forme sûre. Les reproposer régulièrement s'ils sont tolérés.</li>
                </ul>
            </div>

            <div style={{ background: '#ffffff', borderRadius: '16px', padding: '16px', border: '1px solid #cbd5e1', color: '#0f172a' }}>
                <h3 style={{ margin: '0 0 8px 0', color: '#b91c1c' }}>🚑 Réaction allergique : quand appeler</h3>
                <p style={{ margin: '0 0 8px', fontSize: '13px' }}>
                    Gonflement du visage ou de la langue, difficulté à respirer, voix ou cri modifié, malaise, pâleur inhabituelle ou réaction rapide touchant plusieurs parties du corps : <strong>appelez immédiatement le 15 ou le 112</strong>.
                </p>
                <p style={{ margin: 0, fontSize: '12px', color: '#475569' }}>
                    Pour une réaction légère isolée, arrêtez l'aliment et demandez rapidement conseil au médecin. Ne réintroduisez pas l'aliment suspect sans avis médical.
                </p>
            </div>

            <p style={{ margin: 0, fontSize: '11px', color: '#475569', lineHeight: 1.5 }}>
                Sources : <a href="https://www.ameli.fr/assure/sante/themes/alimentation/alimentation-0-3-ans/debut-diversification-alimentaire" target="_blank" rel="noopener noreferrer">Assurance Maladie</a> et <a href="https://www.1000-premiers-jours.fr/fr/lalimentation-de-6-mois-1-la-decouverte-des-textures" target="_blank" rel="noopener noreferrer">1000 premiers jours</a>.
            </p>
        </div>
    );
}
