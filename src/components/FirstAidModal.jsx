export default function FirstAidModal({ onClose }) {
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
                    border: '2px solid #ef4444',
                    borderRadius: '24px',
                    padding: '24px',
                    maxWidth: '460px',
                    width: '100%',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    boxSizing: 'border-box'
                }}
            >
                {/* En-tête d'urgence */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h2 style={{ margin: 0, color: '#ef4444', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        🚨 Premiers Secours : Étouffement
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

                {/* 1. Évaluation rapide */}
                <div style={{ background: 'rgba(239, 68, 68, 0.15)', borderLeft: '4px solid #ef4444', padding: '12px', borderRadius: '12px', marginBottom: '14px' }}>
                    <h3 style={{ margin: '0 0 6px 0', fontSize: '15px', color: '#fca5a5' }}>
                        1. Évaluer la situation
                    </h3>
                    <p style={{ margin: '0 0 6px 0', fontSize: '13px', color: '#cbd5e1' }}>
                        🔴 <strong>Étouffement sévère (Incapacité de tousser/pleurer) :</strong> Le bébé ne fait aucun bruit, ne peut pas respirer ou devient bleu. ➔ <strong>Agir immédiatement.</strong>
                    </p>
                    <p style={{ margin: 0, fontSize: '13px', color: '#cbd5e1' }}>
                        🟢 <strong>Toux efficace (Réflexe nauséeux) :</strong> Le bébé tousse fort, fait du bruit ou rougit. ➔ <strong>Ne pas intervenir</strong>, le laisser tousser sous surveillance.
                    </p>
                </div>

                {/* 2. Appel des secours */}
                <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '12px', borderRadius: '12px', marginBottom: '14px' }}>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#38bdf8' }}>
                        2. Appeler les secours
                    </h3>
                    <p style={{ margin: 0, fontSize: '13px', color: '#cbd5e1' }}>
                        Faites appeler immédiatement le <strong>15 (SAMU)</strong> ou le <strong>112</strong> par un tiers, ou mettez le haut-parleur si vous êtes seul.
                    </p>
                </div>

                {/* 3. Gestes de désobstruction (Bébé < 1 an) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* Étape A : Claques dans le dos */}
                    <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '14px', borderRadius: '12px' }}>
                        <h4 style={{ margin: '0 0 6px 0', color: '#f59e0b', fontSize: '14px' }}>
                            🖐️ Étape A : 5 Claques dans le dos (Mofenson)
                        </h4>
                        <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <li>Placez le bébé à califourchon sur votre avant-bras, <strong>tête penchée vers le bas</strong>.</li>
                            <li>Maintenez sa mâchoire avec vos doigts (sans appuyer sur la gorge).</li>
                            <li>Donnez jusqu'à <strong>5 claques fermes</strong> entre les omoplates avec le talon de votre main libre.</li>
                        </ul>
                    </div>

                    {/* Étape B : Compressions thoraciques */}
                    <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '14px', borderRadius: '12px' }}>
                        <h4 style={{ margin: '0 0 6px 0', color: '#f59e0b', fontSize: '14px' }}>
                            ✌️ Étape B : 5 Compressions thoraciques (si échec)
                        </h4>
                        <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <li>Retournez le bébé sur le dos le long de votre autre avant-bras, toujours tête plus basse que le buste.</li>
                            <li>Placez <strong>2 doigts au milieu de la poitrine</strong> (juste en dessous de la ligne des tétéons).</li>
                            <li>Effectuez <strong>5 compressions profondes et lentes</strong>.</li>
                        </ul>
                    </div>
                </div>

                {/* Rappel important */}
                <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '12px', color: '#94a3b8' }}>
                    🔄 Alterner 5 claques dans le dos et 5 compressions thoraciques jusqu'à l'expulsion du corps étranger ou l'arrivée des secours.
                </div>

                {/* Section Vidéo de démonstration */}
                <div style={{ marginTop: '20px', background: 'rgba(255, 255, 255, 0.05)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <h4 style={{ margin: '0 0 8px 0', color: '#38bdf8', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        🎬 Vidéos démonstratives
                    </h4>
                    <a
                        href="https://www.youtube.com/results?search_query=premiers+secours+nourrisson+etouffement"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            background: '#ef4444',
                            color: '#ffffff',
                            textDecoration: 'none',
                            padding: '10px 14px',
                            borderRadius: '10px',
                            fontSize: '13px',
                            fontWeight: 'bold',
                            boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)'
                        }}
                    >
                        ▶ Voir les vidéos de désobstruction sur YouTube
                    </a>
                </div>
            </div>
        </div>
    );
}