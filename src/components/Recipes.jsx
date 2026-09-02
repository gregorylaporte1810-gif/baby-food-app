import { useCallback, useEffect, useRef, useState } from 'react';

export default function Recipes({ tracker, recipeSearchTerm = '', industrialHistoryKey = 'industrialHistory', onAddIndustrialFood }) {
    const [search, setSearch] = useState(recipeSearchTerm);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('camera'); // 'camera' ou 'manual'
    const [scannedProductName, setScannedProductName] = useState('');
    const [scannedBrand, setScannedBrand] = useState('Blédina');
    const [babyReaction, setBabyReaction] = useState('liked'); // 'liked' ou 'disliked'
    const [scanError, setScanError] = useState('');

    const [industrialHistory, setIndustrialHistory] = useState(() => {
    try {
        const saved = localStorage.getItem(industrialHistoryKey) ?? localStorage.getItem('industrialHistory');
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
});

// Ajoute cet useEffect juste en dessous pour sauvegarder les changements :
useEffect(() => {
    localStorage.setItem(industrialHistoryKey, JSON.stringify(industrialHistory));
}, [industrialHistory, industrialHistoryKey]);

    const videoRef = useRef(null);
    const mediaStreamRef = useRef(null);
    const scanIntervalRef = useRef(null);

    const stopCamera = useCallback(() => {
        if (scanIntervalRef.current) {
            clearInterval(scanIntervalRef.current);
            scanIntervalRef.current = null;
        }
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach((track) => track.stop());
            mediaStreamRef.current = null;
        }
    }, []);

    const fetchProductInfo = useCallback(async (barcode) => {
        setScannedProductName(`Recherche du produit (${barcode})...`);
        setModalMode('manual');
        try {
            const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
            const data = await response.json();
            if (data.status === 1 && data.product) {
                setScannedProductName(data.product.product_name || `Produit ${barcode}`);
                setScannedBrand(data.product.brands ? data.product.brands.split(',')[0].trim() : 'Autre');
            } else {
                setScannedProductName(`Pot inconnu (${barcode})`);
            }
        } catch {
            setScannedProductName(`Pot scanné (${barcode})`);
        }
    }, []);

    const startBarcodeDetection = useCallback(() => {
        if (!('BarcodeDetector' in window)) {
            setScanError("Le scan automatique n'est pas supporté par ce navigateur. Utilise la saisie manuelle.");
            return;
        }

        const barcodeDetector = new window.BarcodeDetector({
            formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128']
        });

        scanIntervalRef.current = window.setInterval(async () => {
            if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
                try {
                    const barcodes = await barcodeDetector.detect(videoRef.current);
                    if (barcodes.length > 0) {
                        const code = barcodes[0].rawValue;
                        stopCamera();
                        await fetchProductInfo(code);
                    }
                } catch {
                    // Une image illisible est normale pendant que la caméra cherche le code.
                }
            }
        }, 500);
    }, [fetchProductInfo, stopCamera]);

    const startCamera = useCallback(async () => {
        setScanError('');
        try {
            if (!navigator.mediaDevices?.getUserMedia) {
                throw new Error('Camera unavailable');
            }
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            mediaStreamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
                startBarcodeDetection();
            }
        } catch {
            setScanError("Impossible d'accéder à la caméra. Utilise la saisie manuelle.");
            setModalMode('manual');
        }
    }, [startBarcodeDetection]);

    // Gestion de la caméra pour le scan
    useEffect(() => {
        let cameraTimer;
        if (isModalOpen && modalMode === 'camera') {
            cameraTimer = window.setTimeout(startCamera, 0);
        } else {
            stopCamera();
        }
        return () => {
            window.clearTimeout(cameraTimer);
            stopCamera();
        };
    }, [isModalOpen, modalMode, startCamera, stopCamera]);

    const recipesList = [
        // --- LÉGUMES & TUBÉROSES ---[cite: 5]
        {
            title: "🥣 Velouté Douceur Carotte & Potimarron",
            ingredients: ["carotte", "potimarron", "pomme-de-terre"],
            type: "Purée (dès 4-6 mois)",
            ingredientsDetails: [
                "150 g de carottes",
                "150 g de potimarron",
                "100 g de pomme de terre",
                "1 c. à c. d'huile de colza"
            ],
            steps: [
                "Éplucher et couper les légumes en dés réguliers.",
                "Faire cuire le tout à la vapeur pendant environ 20 minutes jusqu'à ce qu'ils soient bien fondants.",
                "Mixer finement avec l'huile de colza pour obtenir un velouté bien lisse."
            ]
        },
        {
            title: "🖐️ Frites de Patate Douce au Four",
            ingredients: ["patate-douce"],
            type: "DME (dès 6 mois)",
            ingredientsDetails: [
                "1 belle patate douce",
                "1 c. à c. d'huile d'olive"
            ],
            steps: [
                "Préchauffer le four à 180°C.",
                "Tailler la patate douce en gros bâtonnets de la taille d'un doigt.",
                "Arroser d'un filet d'huile d'olive et enfourner pour 25 minutes jusqu'à ce qu'elles soient ultra-fondantes à cœur."
            ]
        },
        {
            title: "🥦 Bâtonnets de Chou-Fleur & Polenta au Four",
            ingredients: ["chou-fleur", "polenta"],
            type: "DME (dès 6 mois)",
            ingredientsDetails: [
                "100 g de chou-fleur",
                "40 g de polenta",
                "20 cl d'eau ou de bouillon de légumes"
            ],
            steps: [
                "Cuire les fleurettes de chou-fleur à la vapeur et les écraser en purée.",
                "Préparer la polenta dans l'eau bouillante selon les instructions, puis y incorporer la purée de chou-fleur.",
                "Verser la préparation dans un plat sur 2 cm d'épaisseur, laisser refroidir pour figer, puis découper en frites.",
                "Faire dorer 15 minutes au four à 180°C."
            ]
        },
        {
            title: "🫛 Soupe Verte Épinards, Petits Pois & Kiri",
            ingredients: ["epinard", "petit-pois", "pomme-de-terre", "kiri-chevre"],
            type: "Purée / Soupe (dès 6 mois)",
            ingredientsDetails: [
                "80 g d'épinards frais",
                "50 g de petits pois",
                "100 g de pomme de terre",
                "1 portion de fromage frais pasteurisé (type Kiri ou chèvre doux)"
            ],
            steps: [
                "Laver les épinards, écosser les petits pois et éplucher la pomme de terre.",
                "Cuire le tout à la vapeur pendant 15 à 20 minutes.",
                "Mixer le tout avec le fromage frais pour apporter de l'onctuosité et adoucir le goût."
            ]
        },
        {
            title: "🫛 Purée Fine de Haricots Verts & Persil",
            ingredients: ["haricot-vert", "persil-basilic", "huile-colza"],
            type: "Purée (dès 4-6 mois)",
            ingredientsDetails: [
                "150 g de haricots verts frais",
                "1 petite branche de persil frais",
                "1 c. à c. d'huile de colza"
            ],
            steps: [
                "Effiler et équeuter les haricots verts.",
                "Les faire cuire très tendres à la vapeur (environ 20-25 min).",
                "Mixer très finement avec le persil haché et l'huile de colza pour éliminer les fibres."
            ]
        },
        {
            title: "🌽 Bâtonnets Moelleux Polenta, Poivron & Basilic",
            ingredients: ["polenta", "poivron", "persil-basilic"],
            type: "DME (dès 8 mois)",
            ingredientsDetails: [
                "40 g de polenta",
                "1/4 de poivron rouge",
                "Quelques feuilles de basilic frais"
            ],
            steps: [
                "Faire rôtir le poivron au four pour pouvoir le peler facilement, puis le mixer.",
                "Préparer la polenta chaude et y incorporer le coulis de poivron et le basilic ciselé.",
                "Étaler en couche épaisse dans un plat, laisser durcir, puis tailler en bâtonnets faciles à attraper."
            ]
        },
        {
            title: "🍆 Caviar d'Aubergine Doux au Thym",
            ingredients: ["aubergine", "huile-olive", "thym"],
            type: "Purée / DME (dès 6 mois)",
            ingredientsDetails: [
                "1 petite aubergine",
                "1 filet d'huile d'olive",
                "1 pincée de thym"
            ],
            steps: [
                "Couper l'aubergine en deux, quadriller la chair avec un couteau et ajouter un filet d'huile et le thym.",
                "Cuire au four à 190°C pendant 30 minutes jusqu'à ce que la chair soit confite.",
                "Récupérer la chair à la cuillère et l'écraser grossièrement ou la mixer."
            ]
        },
        {
            title: "🎃 Purée Onctueuse Potimarron & Veau",
            ingredients: ["potimarron", "veau", "pomme-de-terre", "huile-colza"],
            type: "Purée (dès 6 mois)",
            ingredientsDetails: [
                "150 g de potimarron (avec la peau si bio)",
                "100 g de pomme de terre",
                "20 g d'escalope de veau",
                "1 c. à c. d'huile de colza"
            ],
            steps: [
                "Couper les légumes en morceaux et cuire à la vapeur.",
                "Faire cuire l'escalope de veau à la poêle sans matière grasse ou à la vapeur (bien à cœur).",
                "Mixer le tout très finement avec l'huile de colza."
            ]
        },
        {
            title: "🍲 Mijoté Fondant de Veau, Navet & Poireau",
            ingredients: ["veau", "navet", "poireau", "pomme-de-terre"],
            type: "Repas complet (dès 8 mois)",
            ingredientsDetails: [
                "30 g de tendron ou sauté de veau",
                "50 g de navet",
                "50 g de blanc de poireau",
                "50 g de pomme de terre"
            ],
            steps: [
                "Couper finement le poireau, le navet et la pomme de terre.",
                "Faire mijoter le veau avec les légumes dans un peu d'eau ou de bouillon à couvert pendant 30 minutes jusqu'à ce que tout soit très tendre.",
                "Écraser grossièrement à la fourchette ou mixer selon les capacités de bébé."
            ]
        },

        // --- FRUITS ---[cite: 5]
        {
            title: "🍎 Compote Douceur Pomme, Poire & Pruneau",
            ingredients: ["pomme", "poire", "pruneau"],
            type: "Dessert / Transit (dès 6 mois)",
            ingredientsDetails: [
                "1 pomme",
                "1 poire",
                "1 pruneau dénoyauté"
            ],
            steps: [
                "Peler et couper la pomme et la poire en morceaux.",
                "Faire réhydrater le pruneau 10 minutes dans de l'eau chaude.",
                "Cuire les fruits et le pruneau 10 minutes à la vapeur, puis mixer jusqu'à obtention d'une texture lisse."
            ]
        },
        {
            title: "🍌 Porridge Chaud Banane & Cannelle",
            ingredients: ["flocon-avoine", "banane", "cannelle"],
            type: "Petit-déjeuner / Goûter (dès 6 mois)",
            ingredientsDetails: [
                "3 c. à s. de flocons d'avoine",
                "1/2 banane bien mûre",
                "10 cl d'eau ou de lait infantile",
                "1 pincée de cannelle"
            ],
            steps: [
                "Faire chauffer les flocons d'avoine avec l'eau ou le lait dans une petite casserole pendant 3 minutes à feu doux.",
                "Écraser la demi-banane à la fourchette.",
                "Mélanger la banane et la cannelle au porridge chaud avant de laisser tiédir."
            ]
        },
        {
            title: "🍑 Compote Fondante Abricot & Vanille",
            ingredients: ["abricot", "pomme", "vanille"],
            type: "Dessert (dès 6 mois)",
            ingredientsDetails: [
                "4 abricots mûrs",
                "1/2 pomme douce",
                "1 pointe de vanille"
            ],
            steps: [
                "Dénoyauter les abricots et couper la pomme en dés.",
                "Faire cuire à la vapeur 8 minutes (la pomme aide à casser l'acidité naturelle de l'abricot).",
                "Ajouter la vanille et mixer le tout."
            ]
        },
        {
            title: "🍐 Compote Poire, Myrtilles & Poudre d'Amande",
            ingredients: ["poire", "myrtille", "poudre-amande"],
            type: "Dessert / Goûter (dès 6 mois)",
            ingredientsDetails: [
                "1 poire mûre",
                "30 g de myrtilles",
                "1 c. à c. de poudre d'amande"
            ],
            steps: [
                "Laver les myrtilles et peler la poire.",
                "Cuire les fruits ensemble à la vapeur pendant 8 minutes.",
                "Mixer très finement puis incorporer la poudre d'amande."
            ]
        },
        {
            title: "🥭 Compote Exotique Mangue & Poire au Curry Doux",
            ingredients: ["mangue", "poire", "curry-doux"],
            type: "Dessert Éveil (dès 6 mois)",
            ingredientsDetails: [
                "100 g de chair de mangue mûre",
                "1 poire",
                "1 micro-pincée de curry doux"
            ],
            steps: [
                "Couper la mangue et la poire en dés.",
                "Faire cuire à la vapeur douce pendant 8 minutes.",
                "Ajouter la pincée de curry doux et mixer pour obtenir un velouté exotique."
            ]
        },
        {
            title: "🍓 Porridge Fraise & Purée de Sésame",
            ingredients: ["flocon-avoine", "fraise", "puree-sesame"],
            type: "Petit-déjeuner (dès 6 mois)",
            ingredientsDetails: [
                "3 c. à s. de flocons d'avoine",
                "4 fraises mûres",
                "1/2 c. à c. de purée de sésame (tahin)"
            ],
            steps: [
                "Cuire les flocons d'avoine dans un peu d'eau frémissante pendant 3 minutes.",
                "Écraser les fraises à la fourchette.",
                "Incorporer les fraises et le tahin dans le porridge chaud pour lier le tout."
            ]
        },
        {
            title: "🍑 Compote Douceur Pêche & Vanille",
            ingredients: ["peche", "vanille"],
            type: "Dessert (dès 6 mois)",
            ingredientsDetails: [
                "2 pêches mûres",
                "1 pointe de vanille en poudre"
            ],
            steps: [
                "Émonder (peler) les pêches après les avoir plongées quelques secondes dans l'eau chaude, puis les dénoyauter.",
                "Couper en morceaux et cuire 8 minutes à la vapeur.",
                "Ajouter la vanille et mixer pour obtenir une compote onctueuse."
            ]
        },

        // --- PROTÉINES & ALLERGÈNES ---[cite: 5]
        {
            title: "🥚 Galette Fondante Œuf & Brocoli",
            ingredients: ["oeuf", "brocoli", "beurre"],
            type: "DME / Allergène (dès 6 mois)",
            ingredientsDetails: [
                "1/4 d'œuf dur écrasé",
                "40 g de fleurettes de brocoli",
                "1 noisette de beurre"
            ],
            steps: [
                "Cuire les fleurettes de brocoli à la vapeur jusqu'à ce qu'elles soient très tendres, puis les écraser.",
                "Écraser très finement l'œuf dur avec le brocoli.",
                "Former une galette souple et la réchauffer à la poêle à feu très doux avec un peu de beurre, puis adapter la texture aux capacités de bébé."
            ]
        },
        {
            title: "🐟 Purée Parmentière Cabillaud & Courgette",
            ingredients: ["cabillaud", "courgette", "pomme-de-terre", "huile-olive"],
            type: "Purée (dès 6 mois)",
            ingredientsDetails: [
                "10 g de filet de cabillaud (sans arêtes)",
                "80 g de courgette (pelée)",
                "80 g de pomme de terre",
                "1 c. à c. d'huile d'olive"
            ],
            steps: [
                "Vérifier minutieusement l'absence d'arêtes dans le poisson.",
                "Cuire la pomme de terre, la courgette et le cabillaud à la vapeur pendant 20 minutes.",
                "Mixer le tout avec l'huile d'olive pour obtenir une texture homogène."
            ]
        },
        {
            title: "🥩 Boulettes Fondantes Bœuf & Courgette",
            ingredients: ["boeuf", "courgette", "oeuf"],
            type: "DME / Repas (dès 8 mois)",
            ingredientsDetails: [
                "10 g de bœuf haché",
                "50 g de courgette râpée",
                "Un peu de pomme de terre écrasée pour lier"
            ],
            steps: [
                "Bien essorer la courgette râpée dans un torchon pour retirer l'eau.",
                "Mélanger la viande hachée, la courgette et la pomme de terre écrasée.",
                "Façonner de petites boulettes et les cuire au four 12 minutes à 180°C jusqu'à cuisson complète à cœur."
            ]
        },
        {
            title: "🍗 Risotto Fondant Poulet & Courgette",
            ingredients: ["poulet", "riz", "courgette", "ricotta"],
            type: "Repas complet (dès 8 mois)",
            ingredientsDetails: [
                "10 g de blanc de poulet",
                "30 g de riz rond",
                "50 g de courgette",
                "1 c. à c. de ricotta"
            ],
            steps: [
                "Faire surcuire le riz rond dans de l'eau bouillante.",
                "Hacher finement le poulet et la courgette, puis les cuire à la poêle ou à la vapeur.",
                "Mélanger le riz cuit, les légumes et le poulet, puis lier le tout avec la ricotta pour un effet crémeux."
            ]
        },
        {
            title: "🦃 Parmentier Dinde, Carotte & Courge",
            ingredients: ["dinde", "carotte", "courge", "pomme-de-terre"],
            type: "Repas complet (dès 6-8 mois)",
            ingredientsDetails: [
                "10 g de filet de dinde",
                "70 g de carottes",
                "70 g de courge (ou potimarron)",
                "50 g de pomme de terre"
            ],
            steps: [
                "Cuire la dinde à cœur et les légumes à la vapeur.",
                "Effilocher ou hacher très finement la dinde au fond d'un petit plat.",
                "Écraser ou mixer les légumes en purée onctueuse et recouvrir la dinde."
            ]
        },
        {
            title: "🐟 Curry Doux de Saumon, Riz & Brocoli",
            ingredients: ["saumon", "riz", "brocoli", "curry-doux"],
            type: "Repas complet (dès 8 mois)",
            ingredientsDetails: [
                "10 g de pavé de saumon (sans arêtes)",
                "30 g de riz",
                "50 g de fleurettes de brocoli",
                "1 pincée de curry doux"
            ],
            steps: [
                "Faire cuire le riz pour qu'il soit bien fondant.",
                "Vérifier l'absence d'arêtes dans le saumon, puis l'effriter avec le brocoli cuit à la poêle avec une touche de curry.",
                "Mélanger le tout grossièrement pour que bébé puisse attraper les morceaux."
            ]
        },
        {
            title: "🥑 Bâtonnets d'Avocat Panés à l'Amande",
            ingredients: ["avocat", "poudre-amande"],
            type: "DME / Allergène (dès 6 mois)",
            ingredientsDetails: [
                "1/2 avocat mûr mais ferme",
                "1 c. à s. de poudre d'amande"
            ],
            steps: [
                "Couper l'avocat en larges quartiers de la taille d'un doigt.",
                "Verser la poudre d'amande dans une assiette creuse.",
                "Rouler chaque morceau d'avocat dans la poudre pour l'enrober (cela évite que l'aliment ne glisse entre les mains de bébé)."
            ]
        },
        {
            title: "🍝 Coquillettes Fondantes au Jambon & Petits Pois",
            ingredients: ["pates", "jambon", "petit-pois", "beurre"],
            type: "Repas complet (dès 8 mois)",
            ingredientsDetails: [
                "30 g de petites pâtes (coquillettes)",
                "10 g de jambon blanc découenné et peu salé",
                "40 g de petits pois",
                "1 noisette de beurre"
            ],
            steps: [
                "Faire surcuire les coquillettes dans de l'eau bouillante.",
                "Cuire les petits pois à la vapeur puis les écraser légèrement.",
                "Mixer ou couper finement le jambon.",
                "Mélanger le tout avec le beurre pour lier le plat."
            ]
        },
        {
            title: "🍅 Purée Douce Tomate, Thon & Riz",
            ingredients: ["tomate", "thon", "riz", "huile-olive"],
            type: "Repas complet (dès 8 mois)",
            ingredientsDetails: [
                "1 belle tomate mûre (pelée et épépinée)",
                "10 g de thon au naturel (bien rincé)",
                "30 g de riz rond",
                "1 filet d'huile d'olive"
            ],
            steps: [
                "Faire cuire le riz rond à l'eau bouillante.",
                "Cuire la tomate concassée à la poêle pour évacuer l'eau de végétation.",
                "Émietter le thon en vérifiant l'absence d'arêtes.",
                "Mélanger le riz, la tomate et le thon avec un filet d'huile d'olive."
            ]
        },
        {
            title: "🥛 Crème Douce Semoule & Jus d'Orange",
            ingredients: ["semoule", "orange", "lait"],
            type: "Goûter / Dessert (dès 8 mois)",
            ingredientsDetails: [
                "20 g de semoule fine de blé",
                "10 cl de lait infantile préparé selon la notice",
                "Le jus d'une 1/2 orange douce"
            ],
            steps: [
                "Faire chauffer le lait avec le jus d'orange dans une casserole.",
                "Verser la semoule en pluie fine et remuer sans s'arrêter à feu doux pendant 3 à 5 minutes jusqu'à épaississement.",
                "Laisser tiédir avant de servir."
            ]
        }
    ];

    const cleanStr = (str) =>
        str
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]/g, "");

    let filteredRecipes = recipesList.filter((recipe) => {
        if (!search.trim()) return true;

        const term = cleanStr(search);
        const matchesTitle = cleanStr(recipe.title).includes(term);
        const matchesIngredient = recipe.ingredients.some((ing) => cleanStr(ing).includes(term));

        return matchesTitle || matchesIngredient;
    });

    if (filteredRecipes.length === 0 && search.trim()) {
        filteredRecipes = [
            {
                title: `✨ Préparation Découverte : ${search.charAt(0).toUpperCase() + search.slice(1)}`,
                ingredients: [cleanStr(search)],
                type: "Purée ou DME (dès 4-6 mois)",
                ingredientsDetails: [
                    `100 g de ${search}`,
                    "1 c. à c. d'huile de colza ou de beurre"
                ],
                steps: [
                    `Préparer et cuire ${search} très tendrement à la vapeur.`,
                    "Servir en purée lisse avec la matière grasse ou en gros morceaux fondants selon l'âge de bébé."
                ]
            }
        ];
    }

    const handleSaveIndustrial = (e) => {
        e.preventDefault();
        if (!scannedProductName.trim()) return;

        const newEntry = {
            name: scannedProductName,
            brand: scannedBrand,
            reaction: babyReaction,
            date: new Date().toISOString().split('T')[0]
        };

        setIndustrialHistory([newEntry, ...industrialHistory]);
        if (onAddIndustrialFood) {
            onAddIndustrialFood(newEntry);
        }

        setScannedProductName('');
        setIsModalOpen(false);
    };

    const handleDeleteIndustrial = (indexToDelete) => {
        setIndustrialHistory(industrialHistory.filter((_, i) => i !== indexToDelete));
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {/* Barre de recherche et Bouton Scanner */}
            <div style={{ display: "flex", gap: "8px" }}>
                <input
                    type="text"
                    placeholder="Rechercher une recette ou un ingrédient..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                        flex: 1,
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        background: '#334155',
                        color: '#fff',
                        boxSizing: 'border-box'
                    }}
                />
                <button
                    onClick={() => { setModalMode('camera'); setIsModalOpen(true); }}
                    style={{
                        background: '#38bdf8',
                        color: '#0f172a',
                        border: 'none',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        whiteSpace: 'nowrap'
                    }}
                >
                    📸 Scanner un pot
                </button>
            </div>

            {search && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: '#94a3b8' }}>
                    <span>Résultats pour : <strong style={{ color: '#38bdf8' }}>{search}</strong></span>
                    <button
                        onClick={() => setSearch('')}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                    >
                        ✕ Effacer le filtre
                    </button>
                </div>
            )}

            {/* Historique rapide des pots industriels déjà scannés / enregistrés */}
            {industrialHistory.length > 0 && !search && (
                <div style={{ background: "rgba(30, 41, 59, 0.4)", borderRadius: "12px", padding: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "#38bdf8", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        🥫 Pots industriels déjà goûtés ({industrialHistory.length}) :
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {industrialHistory.map((item, i) => (
                            <span key={i} style={{
                                fontSize: "12px",
                                background: item.reaction === 'liked' ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)",
                                color: item.reaction === 'liked' ? "#34d399" : "#f87171",
                                border: item.reaction === 'liked' ? "1px solid #10b981" : "1px solid #ef4444",
                                padding: "4px 8px 4px 10px",
                                borderRadius: "8px",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px"
                            }}>
                                {item.reaction === 'liked' ? '👍' : '👎'} {item.brand} - {item.name}
                                <button
                                    type="button"
                                    onClick={() => handleDeleteIndustrial(i)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: item.reaction === 'liked' ? '#34d399' : '#f87171',
                                        cursor: 'pointer',
                                        fontSize: '12px',
                                        fontWeight: 'bold',
                                        padding: '0 2px',
                                        marginLeft: '4px'
                                    }}
                                    title="Supprimer"
                                >
                                    ✕
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <h3 style={{ margin: "0 0 6px 0", fontSize: "18px" }}>
                🍳 Idées de repas & préparations ({filteredRecipes.length})
            </h3>

            {filteredRecipes.map((recipe, index) => {
                const allValidated = recipe.ingredients.every((id) => tracker[id]?.tested);
                const testedCount = recipe.ingredients.filter((id) => tracker[id]?.tested).length;

                return (
                    <div
                        key={index}
                        style={{
                            background: "rgba(30, 41, 59, 0.75)",
                            borderRadius: "16px",
                            padding: "16px",
                            border: allValidated ? "1px solid #10b981" : "1px solid rgba(255,255,255,0.1)",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px", marginBottom: "8px" }}>
                            <h4 style={{ margin: 0, color: "#f59e0b", fontSize: "15px" }}>{recipe.title}</h4>

                            {allValidated ? (
                                <span style={{ fontSize: "10px", background: "#10b981", color: "#fff", padding: "3px 8px", borderRadius: "10px", fontWeight: "bold", whiteSpace: "nowrap" }}>
                                    ✓ 100% Validé
                                </span>
                            ) : (
                                <span style={{ fontSize: "10px", background: "rgba(255,255,255,0.1)", color: "#94a3b8", padding: "3px 8px", borderRadius: "10px", whiteSpace: "nowrap" }}>
                                    {testedCount}/{recipe.ingredients.length} goûtés
                                </span>
                            )}
                        </div>

                        <p style={{ margin: "0 0 12px 0", fontSize: "11px", color: "#38bdf8", fontWeight: "bold" }}>
                            {recipe.type}
                        </p>

                        {/* Ingrédients */}
                        <div style={{ marginBottom: "10px", background: "rgba(15, 23, 42, 0.4)", padding: "10px", borderRadius: "8px" }}>
                            <p style={{ margin: "0 0 6px 0", fontSize: "12px", color: "#38bdf8", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                🥕 Ingrédients :
                            </p>
                            <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "13px", color: "#cbd5e1" }}>
                                {recipe.ingredientsDetails.map((ing, i) => (
                                    <li key={i} style={{ marginBottom: "2px" }}>{ing}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Préparation */}
                        <div>
                            <p style={{ margin: "0 0 6px 0", fontSize: "12px", color: "#f59e0b", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                👩‍🍳 Préparation :
                            </p>
                            <ol style={{ margin: 0, paddingLeft: "16px", fontSize: "13px", color: "#cbd5e1", lineHeight: "1.5" }}>
                                {recipe.steps.map((step, i) => (
                                    <li key={i} style={{ marginBottom: "4px" }}>{step}</li>
                                ))}
                            </ol>
                        </div>
                    </div>
                );
            })}

            {/* MODALE DE SCAN ET SAISIE DE POT INDUSTRIEL */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    background: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(5px)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000,
                    padding: '16px',
                    boxSizing: 'border-box'
                }}>
                    <div style={{
                        background: '#1e293b',
                        borderRadius: '20px',
                        padding: '24px',
                        width: '100%',
                        maxWidth: '400px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, color: '#f59e0b', fontSize: '18px' }}>
                                {modalMode === 'camera' ? '📷 Scanner le code-barres' : '✏️ Enregistrer un pot'}
                            </h3>
                            <button
                                onClick={() => { setIsModalOpen(false); stopCamera(); }}
                                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '18px', cursor: 'pointer' }}
                            >
                                ✕
                            </button>
                        </div>

                        {/* Sélecteur de mode Caméra / Manuel */}
                        <div style={{ display: 'flex', background: '#0f172a', padding: '4px', borderRadius: '10px', gap: '4px' }}>
                            <button
                                type="button"
                                onClick={() => setModalMode('camera')}
                                style={{
                                    flex: 1, padding: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px',
                                    background: modalMode === 'camera' ? '#38bdf8' : 'transparent',
                                    color: modalMode === 'camera' ? '#0f172a' : '#94a3b8'
                                }}
                            >
                                Caméra 📸
                            </button>
                            <button
                                type="button"
                                onClick={() => { stopCamera(); setModalMode('manual'); }}
                                style={{
                                    flex: 1, padding: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px',
                                    background: modalMode === 'manual' ? '#38bdf8' : 'transparent',
                                    color: modalMode === 'manual' ? '#0f172a' : '#94a3b8'
                                }}
                            >
                                Saisie manuelle ⌨️
                            </button>
                        </div>

                        {scanError && (
                            <p style={{ margin: 0, fontSize: '12px', color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '8px', borderRadius: '8px' }}>
                                {scanError}
                            </p>
                        )}

                        {/* Vue Caméra */}
                        {modalMode === 'camera' && (
                            <div style={{ width: '100%', position: 'relative', borderRadius: '12px', overflow: 'hidden', background: '#000', height: '180px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <video ref={videoRef} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted playsInline />
                                <div style={{
                                    position: 'absolute', border: '2px dashed #38bdf8', width: '80%', height: '70px', borderRadius: '8px', pointerEvents: 'none',
                                    display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff', fontSize: '11px', background: 'rgba(0,0,0,0.3)'
                                }}>
                                    Cadrez le code-barres ici
                                </div>
                            </div>
                        )}

                        {/* Formulaire de validation / Saisie manuelle */}
                        {modalMode === 'manual' && (
                            <form onSubmit={handleSaveIndustrial} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px' }}>
                                        Marque :
                                    </label>
                                    <select
                                        value={scannedBrand}
                                        onChange={(e) => setScannedBrand(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            borderRadius: '8px',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            background: '#334155',
                                            color: '#fff',
                                            boxSizing: 'border-box'
                                        }}
                                    >
                                        <option value="Blédina">Blédina</option>
                                        <option value="Hipp Biologique">Hipp Biologique</option>
                                        <option value="Good Gout">Good Gout</option>
                                        <option value="Nestlé Baby">Nestlé Baby</option>
                                        <option value="Naturnes">Naturnes</option>
                                        <option value="Autre">Autre</option>
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px' }}>
                                        Nom du pot / Recette :
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Ex: Petits Pois & Jambon"
                                        value={scannedProductName}
                                        onChange={(e) => setScannedProductName(e.target.value)}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            borderRadius: '8px',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            background: '#334155',
                                            color: '#fff',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px' }}>
                                        Réaction de bébé :
                                    </label>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button
                                            type="button"
                                            onClick={() => setBabyReaction('liked')}
                                            style={{
                                                flex: 1,
                                                padding: '10px',
                                                borderRadius: '8px',
                                                border: babyReaction === 'liked' ? '2px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                                                background: babyReaction === 'liked' ? 'rgba(16, 185, 129, 0.2)' : '#334155',
                                                color: '#fff',
                                                cursor: 'pointer',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            👍 A aimé
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setBabyReaction('disliked')}
                                            style={{
                                                flex: 1,
                                                padding: '10px',
                                                borderRadius: '8px',
                                                border: babyReaction === 'disliked' ? '2px solid #ef4444' : '1px solid rgba(255,255,255,0.1)',
                                                background: babyReaction === 'disliked' ? 'rgba(239, 68, 68, 0.2)' : '#334155',
                                                color: '#fff',
                                                cursor: 'pointer',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            👎 Pas aimé
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    style={{
                                        marginTop: '8px',
                                        background: '#10b981',
                                        color: '#fff',
                                        border: 'none',
                                        padding: '12px',
                                        borderRadius: '10px',
                                        fontWeight: 'bold',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Enregistrer dans le suivi
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
