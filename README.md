# Les découvertes de bébé

Application React responsive pour accompagner et suivre la diversification alimentaire d’un ou plusieurs enfants.

## Fonctionnalités

- catalogue d’aliments avec recherche et filtres par catégorie ;
- suivi des aliments goûtés et des préférences de bébé ;
- profils séparés pour plusieurs enfants ;
- recettes filtrables selon un aliment ;
- scan d’un pot industriel avec saisie manuelle de secours ;
- suivi du transit et des réactions ;
- guides de portions, de repas et de sécurité ;
- bilan imprimable ou enregistrable en PDF ;
- sauvegarde locale automatique dans le navigateur ;
- export et restauration d'une sauvegarde complète au format JSON ;
- interface adaptée au téléphone et à l’ordinateur.

> Les informations proposées sont générales. Elles ne remplacent pas l’avis d’un pédiatre. En cas d’urgence, appelez le 15 ou le 112 et suivez les consignes des secours.

## Références santé

Les principaux repères de l'application ont été revus le 2 septembre 2026 à partir de sources françaises officielles :

- Assurance Maladie : diversification entre 4 mois révolus et 6 mois, introduction des allergènes, lait, protéines et matières grasses ;
- 1000 premiers jours : évolution des textures, écoute de l'appétit et installation pendant les repas ;
- Croix-Rouge française : conduite à tenir en cas d'étouffement ;
- Service-Public.fr : numéros d'urgence 15, 112 et 114.

Les besoins peuvent différer en cas de prématurité, trouble de croissance, allergie connue, difficulté à avaler ou problème médical : demander alors un conseil personnalisé au pédiatre ou à la PMI.

## Démarrer le projet

Prérequis : Node.js 20 ou plus récent.

```bash
npm install
npm run dev
```

Vite affiche ensuite l’adresse locale à ouvrir dans le navigateur, généralement `http://localhost:5173`.

## Vérifier et compiler

```bash
npm run lint
npm run build
npm run preview
```

Le dossier de production est généré dans `dist/`.

## Version mobile avec Capacitor

Après une compilation web :

```bash
npm run build
npx cap sync
npx cap open android
```

Pour iOS, remplacez `android` par `ios` et exécutez la commande depuis macOS avec Xcode installé.

## Stockage des données

Les profils et suivis sont enregistrés dans le `localStorage` du navigateur. Ils restent sur l’appareil utilisé et peuvent disparaître si les données du navigateur sont effacées. Utilisez régulièrement **Sauvegarder mes données** pour conserver un fichier JSON restaurable. Aucun compte ni serveur distant n’est configuré dans cette version.
