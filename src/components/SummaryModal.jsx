import { useState } from 'react';

export default function SummaryModal({ foods = [], tracker = {}, healthStorageKey = 'baby_health_logs', onClose }) {
    const [onlyTested, setOnlyTested] = useState(false);
    let healthLogs = [];
    try {
        const savedLogs = localStorage.getItem(healthStorageKey) ?? localStorage.getItem('baby_health_logs');
        healthLogs = savedLogs ? JSON.parse(savedLogs) : [];
    } catch {
        healthLogs = [];
    }
    
    const testedFoods = foods.filter((food) => tracker[food.id]?.tested);
    
    // Liste affichée selon l'état du filtre
    const displayedFoods = onlyTested ? testedFoods : foods;

    const ratingLabels = [
        { key: 'loved', label: '😍 A adoré', color: '#10b981' },
        { key: 'medium', label: '😐 Moyen', color: '#f59e0b' },
        { key: 'hated', label: '🤢 A détesté', color: '#ef4444' }
    ];

    const getRatingBadge = (ratingVal) => {
        if (ratingVal === null || ratingVal === undefined) return null;
        if (typeof ratingVal === 'number') return ratingLabels[ratingVal] || null;
        return ratingLabels.find((r) => r.key === ratingVal) || null;
    };

    const totalFoods = foods.length || 63;
    const progressPercent = Math.round((testedFoods.length / totalFoods) * 100);

    // Fonction pour imprimer/exporter en PDF la liste filtrée
    const handlePrintPDF = () => {
        const printWindow = window.open('', '_blank');
        
        printWindow.document.write(`
          <html>
            <head>
              <title>Récapitulatif global - Bébé</title>
              <style>
                body { font-family: sans-serif; color: #111; padding: 20px; max-width: 700px; margin: auto; }
                h2 { color: #0284c7; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; }
                h3 { font-size: 16px; margin-top: 24px; color: #334155; }
                .card { border: 1px solid #cbd5e1; background: #f8fafc; padding: 10px 12px; border-radius: 8px; margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center; }
                .health-card { border: 1px solid #cbd5e1; background: #f8fafc; padding: 12px; border-radius: 8px; margin-bottom: 8px; }
                .badge { font-weight: bold; font-size: 12px; padding: 4px 8px; border-radius: 6px; background: #e2e8f0; }
              </style>
            </head>
            <body>
              <h2>📊 Récapitulatif global ${onlyTested ? '(Goûtés uniquement)' : ''}</h2>
              <p><strong>Progression diversification :</strong> ${testedFoods.length} / ${totalFoods} (${progressPercent}%)</p>
              
              <h3>🥑 Aliments (${displayedFoods.length})</h3>
              ${displayedFoods.length === 0 ? '<p style="color: #64748b; font-style: italic;">Aucun aliment à afficher.</p>' : ''}
              ${displayedFoods.map(food => {
                const isTested = tracker[food.id]?.tested;
                const ratingInfo = getRatingBadge(tracker[food.id]?.rating);
                return `
                  <div class="card">
                    <div>
                      <strong>${food.icon} ${food.name}</strong> <small style="color: #64748b;">(${food.category})</small>
                    </div>
                    <div>
                      ${isTested ? (ratingInfo ? `<span class="badge">${ratingInfo.label}</span>` : '<span style="color: #10b981; font-size: 12px; font-weight: bold;">✓ Goûté</span>') : '<span style="color: #94a3b8; font-size: 12px; font-style: italic;">Non goûté</span>'}
                    </div>
                  </div>
                `;
              }).join('')}

              <h3>🩺 Observations Santé & Selles (${healthLogs.length})</h3>
              ${healthLogs.length === 0 ? '<p style="color: #64748b; font-style: italic;">Aucune observation saisie.</p>' : ''}
              ${healthLogs.map(log => `
                <div class="health-card">
                  <div style="color: #0284c7; font-size: 12px; font-weight: bold; margin-bottom: 4px;">📅 ${log.date}</div>
                  <div><strong>Selles :</strong> ${log.stoolType}</div>
                  ${log.symptoms && log.symptoms.length > 0 ? `<div style="color: #dc2626; margin-top: 2px;"><strong>Symptômes :</strong> ${log.symptoms.join(', ')}</div>` : ''}
                  ${log.note ? `<div style="font-style: italic; color: #475569; margin-top: 2px;">"${log.note}"</div>` : ''}
                </div>
              `).join('')}

              <script>
                window.onload = function() {
                  window.print();
                  window.close();
                };
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
    };

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(15, 23, 42, 0.75)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px',
                zIndex: 1000
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: '#1e293b',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '24px',
                    padding: '24px',
                    maxWidth: '500px',
                    width: '100%',
                    maxHeight: '85vh',
                    overflowY: 'auto',
                    boxSizing: 'border-box',
                    color: '#f8fafc'
                }}
            >
                {/* En-tête avec bouton PDF */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h2 style={{ margin: 0, fontSize: '20px', color: '#38bdf8' }}>📊 Récapitulatif global</h2>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button
                            onClick={handlePrintPDF}
                            style={{
                                background: '#10b981',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '10px',
                                padding: '6px 12px',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}
                        >
                            📄 Exporter PDF
                        </button>

                        <button
                            onClick={onClose}
                            style={{
                                background: 'rgba(255,255,255,0.1)',
                                border: 'none',
                                color: '#fff',
                                borderRadius: '50%',
                                width: '32px',
                                height: '32px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Barre de progression */}
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '16px', marginBottom: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
                        <span>Progression diversification</span>
                        <span style={{ color: '#38bdf8' }}>{testedFoods.length} / {totalFoods} ({progressPercent}%)</span>
                    </div>
                    <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '5px', overflow: 'hidden' }}>
                        <div style={{ width: `${progressPercent}%`, height: '100%', background: '#38bdf8' }} />
                    </div>
                </div>

                {/* Bouton de filtrage dans la modale */}
                <button
                    onClick={() => setOnlyTested(!onlyTested)}
                    style={{
                        marginBottom: '16px',
                        padding: '8px 12px',
                        borderRadius: '10px',
                        border: onlyTested ? '1.5px solid #38bdf8' : '1px solid rgba(255,255,255,0.2)',
                        background: onlyTested ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255,255,255,0.05)',
                        color: onlyTested ? '#38bdf8' : '#cbd5e1',
                        fontSize: '12px',
                        fontWeight: '600',
                        width: '100%',
                        cursor: 'pointer'
                    }}
                >
                    {onlyTested ? '✓ Affichage : Aliments goûtés uniquement' : '🔍 Filtrer : Afficher uniquement les aliments goûtés'}
                </button>

                {/* Liste des aliments */}
                <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#f1f5f9' }}>
                        🥑 Aliments ({displayedFoods.length})
                    </h3>

                    {displayedFoods.length === 0 ? (
                        <p style={{ fontSize: '13px', color: '#94a3b8', fontStyle: 'italic', margin: 0 }}>
                            Aucun aliment à afficher avec ce filtre.
                        </p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {displayedFoods.map((food) => {
                                const isTested = tracker[food.id]?.tested;
                                const ratingInfo = getRatingBadge(tracker[food.id]?.rating);
                                return (
                                    <div
                                        key={food.id}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            padding: '10px 14px',
                                            borderRadius: '12px',
                                            border: '1px solid rgba(255, 255, 255, 0.08)'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <span style={{ fontSize: '20px' }}>{food.icon}</span>
                                            <div>
                                                <strong style={{ fontSize: '14px', display: 'block' }}>{food.name}</strong>
                                                <span style={{ fontSize: '11px', color: '#94a3b8' }}>{food.category}</span>
                                            </div>
                                        </div>

                                        <div>
                                            {isTested ? (
                                                ratingInfo ? (
                                                    <span style={{ fontSize: '12px', background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '8px', color: ratingInfo.color, fontWeight: 'bold' }}>
                                                        {ratingInfo.label}
                                                    </span>
                                                ) : (
                                                    <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 'bold' }}>
                                                        ✓ Goûté
                                                    </span>
                                                )
                                            ) : (
                                                <span style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic' }}>
                                                    Non goûté
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Suivi Santé */}
                <div>
                    <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#f1f5f9' }}>
                        🩺 Observations Santé & Selles ({healthLogs.length})
                    </h3>

                    {healthLogs.length === 0 ? (
                        <p style={{ fontSize: '13px', color: '#94a3b8', fontStyle: 'italic', margin: 0 }}>
                            Aucune observation saisie.
                        </p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {healthLogs.map((log) => (
                                <div
                                    key={log.id}
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.03)',
                                        border: '1px solid rgba(255, 255, 255, 0.08)',
                                        borderRadius: '12px',
                                        padding: '10px 12px',
                                        fontSize: '12px'
                                    }}
                                >
                                    <div style={{ color: '#38bdf8', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}>
                                        📅 {log.date}
                                    </div>
                                    <div><strong>Selles :</strong> {log.stoolType}</div>
                                    {log.symptoms && log.symptoms.length > 0 && (
                                        <div style={{ color: '#f87171', marginTop: '2px' }}>
                                            <strong>Symptômes :</strong> {log.symptoms.join(', ')}
                                        </div>
                                    )}
                                    {log.note && (
                                        <div style={{ color: '#cbd5e1', fontStyle: 'italic', marginTop: '2px' }}>
                                            "{log.note}"
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
