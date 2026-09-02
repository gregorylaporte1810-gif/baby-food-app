import { useState } from 'react';

export default function HealthTrackerModal({ onClose, storageKey = 'baby_health_logs' }) {
    const [logs, setLogs] = useState(() => {
        try {
            const savedLogs = localStorage.getItem(storageKey) ?? localStorage.getItem('baby_health_logs');
            return savedLogs ? JSON.parse(savedLogs) : [];
        } catch {
            return [];
        }
    });
    const [stoolType, setStoolType] = useState('Normale');
    const [symptoms, setSymptoms] = useState([]);
    const [note, setNote] = useState('');

    // Sauvegarder dans le localStorage
    const saveLogs = (newLogs) => {
        setLogs(newLogs);
        localStorage.setItem(storageKey, JSON.stringify(newLogs));
    };

    const toggleSymptom = (symptom) => {
        setSymptoms((prev) =>
            prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
        );
    };

    const handleAddLog = (e) => {
        e.preventDefault();
        const newEntry = {
            id: Date.now(),
            date: new Date().toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            }),
            stoolType,
            symptoms,
            note
        };

        const updatedLogs = [newEntry, ...logs];
        saveLogs(updatedLogs);

        // Réinitialisation du formulaire
        setSymptoms([]);
        setNote('');
    };

    const handleDelete = (id) => {
        const updatedLogs = logs.filter((log) => log.id !== id);
        saveLogs(updatedLogs);
    };

    const stoolOptions = [
        { label: '💩 Normale', value: 'Normale' },
        { label: '💧 Molle / Liquide', value: 'Molle / Liquide' },
        { label: '🧱 Dure / Constipation', value: 'Dure / Constipation' },
        { label: '🟢 Glaireuse / Verte', value: 'Glaireuse / Verte' }
    ];

    const symptomOptions = [
        '🔴 Rougeurs / Boutons',
        '🤮 Vomissements / Régurgitations',
        '💨 Gaz / Douleurs',
        '🫁 Toux / Démangeaisons',
        '🪨 Érythème fessier'
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
                    <h2 style={{ margin: 0, fontSize: '18px', color: '#9333ea' }}>🩺 Suivi Transit & Réactions</h2>
                    <button
                        onClick={onClose}
                        style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', fontWeight: 'bold', color: '#475569' }}
                    >
                        ✕
                    </button>
                </div>

                <div style={{ background: '#fef2f2', border: '1px solid #ef4444', borderRadius: '12px', padding: '10px 12px', marginBottom: '14px', color: '#7f1d1d', fontSize: '12px', lineHeight: 1.45 }}>
                    <strong>Urgence :</strong> si bébé respire mal, gonfle du visage ou de la langue, devient très pâle, mou ou fait un malaise, appelez immédiatement le <strong>15 ou le 112</strong>. Ce journal ne remplace pas un avis médical.
                </div>

                {/* Formulaire d'ajout */}
                <form onSubmit={handleAddLog} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px', background: '#faf5ff', padding: '14px', borderRadius: '14px', border: '1px solid #f3e8ff' }}>
                    <div>
                        <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#6b21a8', display: 'block', marginBottom: '6px' }}>
                            💩 Aspect des selles :
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                            {stoolOptions.map((opt) => (
                                <button
                                    type="button"
                                    key={opt.value}
                                    onClick={() => setStoolType(opt.value)}
                                    style={{
                                        padding: '6px 8px',
                                        fontSize: '11px',
                                        borderRadius: '8px',
                                        border: stoolType === opt.value ? '2px solid #9333ea' : '1px solid #e9d5ff',
                                        background: stoolType === opt.value ? '#f3e8ff' : '#ffffff',
                                        color: stoolType === opt.value ? '#6b21a8' : '#475569',
                                        fontWeight: stoolType === opt.value ? 'bold' : 'normal',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#6b21a8', display: 'block', marginBottom: '6px' }}>
                            ⚠️ Réactions / Symptômes observés :
                        </label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {symptomOptions.map((sym) => {
                                const isSelected = symptoms.includes(sym);
                                return (
                                    <button
                                        type="button"
                                        key={sym}
                                        onClick={() => toggleSymptom(sym)}
                                        style={{
                                            padding: '4px 8px',
                                            fontSize: '11px',
                                            borderRadius: '12px',
                                            border: isSelected ? '1px solid #dc2626' : '1px solid #cbd5e1',
                                            background: isSelected ? '#fef2f2' : '#ffffff',
                                            color: isSelected ? '#991b1b' : '#475569',
                                            fontWeight: isSelected ? 'bold' : 'normal',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {sym}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#6b21a8', display: 'block', marginBottom: '4px' }}>
                            📝 Note (ex: "Après test de l'œuf") :
                        </label>
                        <input
                            type="text"
                            placeholder="Aliment testé, quantité..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '8px',
                                fontSize: '12px',
                                borderRadius: '8px',
                                border: '1px solid #cbd5e1',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            background: '#9333ea',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '8px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            marginTop: '4px'
                        }}
                    >
                        ➕ Enregistrer l'observation
                    </button>
                </form>

                {/* Historique des observations */}
                <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#581c87' }}>📋 Historique des observations</h3>
                {logs.length === 0 ? (
                    <p style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic', textAlign: 'center' }}>
                        Aucune observation enregistrée pour le moment.
                    </p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {logs.map((log) => (
                            <div
                                key={log.id}
                                style={{
                                    background: '#f8fafc',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '10px',
                                    padding: '10px',
                                    fontSize: '11px',
                                    position: 'relative'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', marginBottom: '4px' }}>
                                    <strong>📅 {log.date}</strong>
                                    <button
                                        onClick={() => handleDelete(log.id)}
                                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold' }}
                                    >
                                        Supprimer
                                    </button>
                                </div>

                                <div><strong>Selles :</strong> {log.stoolType}</div>

                                {log.symptoms.length > 0 && (
                                    <div style={{ marginTop: '2px', color: '#dc2626' }}>
                                        <strong>Symptômes :</strong> {log.symptoms.join(', ')}
                                    </div>
                                )}

                                {log.note && (
                                    <div style={{ marginTop: '2px', color: '#334155', fontStyle: 'italic' }}>
                                        "{log.note}"
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
