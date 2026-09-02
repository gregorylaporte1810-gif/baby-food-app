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
                            🖐️ Étape A : jusqu'à 5 claques dans le dos
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
                            <li>Placez <strong>2 doigts au milieu de la poitrine</strong> (juste en dessous de la ligne des tétons).</li>
                            <li>Effectuez jusqu'à <strong>5 compressions thoraciques</strong>, en vérifiant après chacune si l'objet est expulsé.</li>
                        </ul>
                    </div>
                </div>

                {/* Rappel important */}
                <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '12px', color: '#94a3b8' }}>
                    🔄 Alterner 5 claques dans le dos et 5 compressions thoraciques jusqu'à l'expulsion du corps étranger ou l'arrivée des secours.
                </div>

                <div style={{ marginTop: '12px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', padding: '12px', borderRadius: '12px', fontSize: '12px', color: '#fecaca' }}>
                    <strong>Si bébé perd connaissance :</strong> posez-le prudemment sur une surface dure, alertez immédiatement le 15 ou le 112 et commencez la réanimation guidée par les secours. Ne cherchez pas l'objet à l'aveugle avec les doigts.
                </div>

                <p style={{ margin: '14px 0 0', fontSize: '11px', color: '#94a3b8', lineHeight: 1.45 }}>
                    Aide-mémoire uniquement : suivez toujours les consignes données par le 15 ou le 112.{' '}
                    <a href="https://www.croix-rouge.fr/mes-infos-bebe/que-faire-si-mon-bebe-setouffe" target="_blank" rel="noopener noreferrer" style={{ color: '#7dd3fc' }}>
                        Consulter la fiche de la Croix-Rouge française
                    </a>
                </p>

            </div>
        </div>
    );
}
