export default function SecurityGuide() {
    const forbiddenFoods = [
        { name: 'Miel', reason: 'Risque de botulisme infantile (grave) avant 1 an.' },
        { name: 'Sel ajouté', reason: 'Surcharge les reins encore immatures de bébé.' },
        { name: 'Sucre ajouté', reason: 'Habitue au goût sucré et inutile nutritionnellement.' },
        { name: 'Lait de vache cru', reason: 'Risque d’infections bactériennes (E. coli, Listeria).' },
        { name: 'Fruits à coque entiers', reason: 'Risque majeur d’étouffement. Toujours en poudre ou purée.' }
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', borderRadius: '16px', padding: '16px' }}>
                <h3 style={{ margin: '0 0 10px 0', color: 'black' }}>🚫 Aliments interdits avant 1 an</h3>
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: 'black' }}>
                    {forbiddenFoods.map((item) => (
                        <li key={item.name} style={{ marginBottom: '6px' }}>
                            <strong>{item.name} :</strong> {item.reason}
                        </li>
                    ))}
                </ul>
            </div>

            <div style={{ background: 'rgba(30, 41, 59, 0.7)', borderRadius: '16px', padding: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#38bdf8' }}>💡 Règles d'or de la DME & Purées</h3>
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <li><strong>Assise parfaite :</strong> Bébé doit être bien assis à 90° dans sa chaise haute, jamais allongé.</li>
                    <li><strong>Texture fondante :</strong> Les aliments en morceaux doivent pouvoir s'écraser facilement entre deux doigts.</li>
                    <li><strong>Bébé gère :</strong> Ne jamais mettre un morceau directement dans la bouche de bébé. C'est lui qui attrape.</li>
                </ul>
            </div>
        </div>
    );
}