export default function Tracker({ foods, tracker, industrialHistoryKey = 'industrialHistory' }) {
  // Récupération des pots industriels stockés dans le localStorage
  const savedIndustrial = (() => {
    try {
      const saved = localStorage.getItem(industrialHistoryKey) ?? localStorage.getItem('industrialHistory');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  })();

  // Calcul du nombre d'aliments classiques testés + les pots industriels
  const trackerTestedCount = Object.values(tracker).filter((f) => f.tested).length;
  const testedCount = trackerTestedCount + savedIndustrial.length;

  const totalCount = foods.length;

  // Calcul du pourcentage (bloqué à 100% maximum pour éviter de dépasser)
  const percentage = totalCount > 0 ? Math.min(Math.round((testedCount / totalCount) * 100), 100) : 0;
  return (
    <div style={{
      background: 'rgba(30, 41, 59, 0.7)',
      borderRadius: '20px',
      padding: '16px',
      marginBottom: '20px',
      border: '1px solid rgba(255,255,255,0.1)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '16px' }}>Progression de Bébé</h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>
            {testedCount} sur {totalCount} aliments découverts
          </p>
        </div>
        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#38bdf8' }}>{percentage}%</div>
      </div>

      <div style={{
        width: '100%',
        height: '8px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '4px',
        marginTop: '12px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${percentage}%`,
          height: '100%',
          background: '#38bdf8',
          transition: 'width 0.3s ease'
        }} />
      </div>
    </div>
  );
}
