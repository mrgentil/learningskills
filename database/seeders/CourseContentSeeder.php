<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Lesson;
use App\Models\Module;
use App\Models\Tenant;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CourseContentSeeder extends Seeder
{
    /**
     * Curriculum complet pour chaque cours de l'académie MrGentil.
     * Chaque cours reçoit des modules (chapitres) et des leçons (vidéo ou texte).
     */
    public function run(): void
    {
        $tenant = Tenant::where('slug', 'mrgentil-tshitshos-academy')->first();
        if (!$tenant) {
            $this->command->warn('Académie MrGentil non trouvée. Exécutez d\'abord le seeder qui crée l\'académie.');
            return;
        }

        $curricula = $this->getCurricula();
        $courses = Course::where('tenant_id', $tenant->id)->get();

        foreach ($courses as $course) {
            $curriculum = $curricula[$course->slug] ?? null;
            if (!$curriculum) {
                $this->command->info("Pas de curriculum défini pour : {$course->title}");
                continue;
            }

            $this->seedCourseContent($tenant, $course, $curriculum);
            $this->command->info("✓ {$course->title} : " . count($curriculum['modules']) . " modules, " . $this->countLessons($curriculum) . " leçons");
        }
    }

    private function seedCourseContent(Tenant $tenant, Course $course, array $curriculum): void
    {
        $sortOrder = 0;
        foreach ($curriculum['modules'] as $modData) {
            $module = Module::updateOrCreate(
                [
                    'tenant_id' => $tenant->id,
                    'course_id' => $course->id,
                    'title' => $modData['title'],
                ],
                ['sort_order' => ++$sortOrder]
            );

            $lessonOrder = 0;
            foreach ($modData['lessons'] as $lesData) {
                $lesson = Lesson::where('tenant_id', $tenant->id)
                    ->where('module_id', $module->id)
                    ->where('title', $lesData['title'])
                    ->first();

                $slug = $lesson?->slug ?? Str::slug($lesData['title']) . '-' . Str::lower(Str::random(4));

                Lesson::updateOrCreate(
                    [
                        'tenant_id' => $tenant->id,
                        'module_id' => $module->id,
                        'title' => $lesData['title'],
                    ],
                    [
                        'slug' => $slug,
                        'video_url' => $lesData['video_url'] ?? null,
                        'content' => $lesData['content'] ?? null,
                        'duration_minutes' => $lesData['duration_minutes'] ?? 15,
                        'is_preview' => $lesData['is_preview'] ?? false,
                        'sort_order' => ++$lessonOrder,
                    ]
                );
            }
        }
    }

    private function countLessons(array $curriculum): int
    {
        $n = 0;
        foreach ($curriculum['modules'] as $m) {
            $n += count($m['lessons']);
        }
        return $n;
    }

    /**
     * Définition du programme pour chaque cours (par slug).
     * Vidéos YouTube éducatives libres de droits / tutoriels populaires.
     */
    private function getCurricula(): array
    {
        return [
            'masterclass-marketing-digital-2024-931' => [
                'modules' => [
                    [
                        'title' => 'Introduction au Marketing Digital',
                        'lessons' => [
                            ['title' => 'Qu\'est-ce que le marketing digital ?', 'video_url' => 'https://youtu.be/9B4bY_vGqOg', 'duration_minutes' => 12],
                            ['title' => 'Les piliers du marketing 4.0', 'video_url' => 'https://youtu.be/outcGtbnMuQ', 'duration_minutes' => 18],
                            ['title' => 'Définir votre stratégie digitale', 'content' => '<p>Une stratégie digitale cohérente repose sur 4 piliers : <strong>objectifs mesurables</strong>, <strong>cibles bien définies</strong>, <strong>canaux adaptés</strong> et <strong>KPIs clairs</strong>. Définissez votre persona, votre proposition de valeur unique et vos indicateurs de succès avant de lancer toute campagne.</p>', 'duration_minutes' => 10],
                        ],
                    ],
                    [
                        'title' => 'SEO et Référencement',
                        'lessons' => [
                            ['title' => 'Fondamentaux du SEO en 2024', 'video_url' => 'https://youtu.be/DvwS7cV9GmQ', 'duration_minutes' => 25],
                            ['title' => 'Optimisation on-page et balises', 'video_url' => 'https://youtu.be/lJvNAywZxwc', 'duration_minutes' => 20],
                            ['title' => 'Netlinking et autorité de domaine', 'content' => '<p>Le netlinking consiste à obtenir des liens externes (backlinks) vers votre site. La qualité prime sur la quantité : un lien depuis un site d\'autorité vaut mieux que 100 liens depuis des annuaires. Utilisez des outils comme Ahrefs ou Moz pour analyser votre profil de liens.</p>', 'duration_minutes' => 15],
                        ],
                    ],
                    [
                        'title' => 'Réseaux Sociaux et Content Marketing',
                        'lessons' => [
                            ['title' => 'Créer une stratégie de contenu efficace', 'video_url' => 'https://youtu.be/8vfw3TceW_k', 'duration_minutes' => 22],
                            ['title' => 'Facebook & Instagram Ads : les bases', 'video_url' => 'https://youtu.be/BWeom11HxSU', 'duration_minutes' => 28],
                            ['title' => 'LinkedIn pour le B2B', 'content' => '<p>LinkedIn est incontournable pour le marketing B2B. Publiez du contenu de valeur (articles, posts, vidéos), participez aux discussions de groupes, et utilisez les InMails avec parcimonie. L\'objectif : établir votre crédibilité et générer des leads qualifiés.</p>', 'duration_minutes' => 12],
                        ],
                    ],
                ],
            ],
            'developpement-web-avec-laravel-react-472' => [
                'modules' => [
                    [
                        'title' => 'Environnement et Fondamentaux',
                        'lessons' => [
                            ['title' => 'Installation de Laravel et React', 'video_url' => 'https://youtu.be/BXiHvGJYWdY', 'duration_minutes' => 35],
                            ['title' => 'Architecture MVC et API REST', 'video_url' => 'https://youtu.be/7ZFyBXKiWD8', 'duration_minutes' => 20],
                            ['title' => 'Connexion Laravel + React avec Inertia', 'content' => '<p>Inertia.js permet de créer des applications monopages (SPA) avec Laravel et React sans construire une API séparée. Vous utilisez les contrôleurs Laravel classiques et renvoyez des pages Inertia qui se rendent en React. Installation : <code>composer require inertiajs/inertia-laravel</code></p>', 'duration_minutes' => 15],
                        ],
                    ],
                    [
                        'title' => 'Backend Laravel',
                        'lessons' => [
                            ['title' => 'Eloquent ORM et migrations', 'video_url' => 'https://youtu.be/t4MSQ5rmjpQ', 'duration_minutes' => 30],
                            ['title' => 'Authentification et autorisation', 'video_url' => 'https://youtu.be/0jk0SeuHVpo', 'duration_minutes' => 25],
                            ['title' => 'API Resources et validation', 'content' => '<p>Les API Resources transforment vos modèles Eloquent en JSON. Utilisez <code>php artisan make:resource</code> pour créer des ressources. La validation se fait via FormRequest : <code>php artisan make:request StorePostRequest</code>. Retournez des erreurs 422 avec les messages de validation.</p>', 'duration_minutes' => 18],
                        ],
                    ],
                    [
                        'title' => 'Frontend React',
                        'lessons' => [
                            ['title' => 'Composants et hooks React', 'video_url' => 'https://youtu.be/Tn6-PIqc4UM', 'duration_minutes' => 32],
                            ['title' => 'Routing et état global', 'video_url' => 'https://youtu.be/oOhf8KT8cYI', 'duration_minutes' => 28],
                            ['title' => 'Projet final : CRUD complet', 'content' => '<p>Mettez en pratique : créer un module de gestion d\'articles avec création, lecture, mise à jour et suppression. Utilisez des formulaires contrôlés, la gestion des erreurs et le feedback utilisateur. Testez avec des données fictives avant d\'intégrer l\'API Laravel.</p>', 'duration_minutes' => 45],
                        ],
                    ],
                ],
            ],
            'design-uiux-premium-314' => [
                'modules' => [
                    [
                        'title' => 'Principes du Design UI/UX',
                        'lessons' => [
                            ['title' => 'Psychologie de l\'utilisateur et parcours', 'video_url' => 'https://youtu.be/c9Wg6Cb_YlU', 'duration_minutes' => 18],
                            ['title' => 'Hiérarchie visuelle et grilles', 'video_url' => 'https://youtu.be/4HRm_9UgwhI', 'duration_minutes' => 22],
                            ['title' => 'Accessibilité et design inclusif', 'content' => '<p>Le design accessible (WCAG) garantit que tous les utilisateurs, y compris ceux en situation de handicap, peuvent utiliser votre interface. Pensez contraste des couleurs, taille des textes, navigation au clavier, et alternatives textuelles pour les images.</p>', 'duration_minutes' => 15],
                        ],
                    ],
                    [
                        'title' => 'Outils et Prototypage',
                        'lessons' => [
                            ['title' => 'Figma : maîtriser les bases', 'video_url' => 'https://youtu.be/FTFaQWZBqQ8', 'duration_minutes' => 40],
                            ['title' => 'Composants et design systems', 'video_url' => 'https://youtu.be/cEuF7b-E8-s', 'duration_minutes' => 35],
                            ['title' => 'Prototypes interactifs et tests', 'content' => '<p>Créez des prototypes cliquables pour valider vos flux avant développement. Testez avec 5 utilisateurs minimum pour identifier les principaux points de friction. Utilisez Maze ou UserTesting pour des tests à distance.</p>', 'duration_minutes' => 20],
                        ],
                    ],
                    [
                        'title' => 'Mise en Production',
                        'lessons' => [
                            ['title' => 'Handoff développeur avec Figma', 'video_url' => 'https://youtu.be/2qZqLWe7KZU', 'duration_minutes' => 25],
                            ['title' => 'Design responsive et mobile-first', 'video_url' => 'https://youtu.be/vkAepcpvhHI', 'duration_minutes' => 28],
                            ['title' => 'Documentation et maintenance', 'content' => '<p>Documentez votre design system : couleurs, typographies, espacements, composants. Utilisez Storybook côté dev. Gardez un changelog des mises à jour. Une bonne documentation accélère l\'onboarding et assure la cohérence long terme.</p>', 'duration_minutes' => 12],
                        ],
                    ],
                ],
            ],
            'intelligence-artificielle-pour-business-846' => [
                'modules' => [
                    [
                        'title' => 'Introduction à l\'IA',
                        'lessons' => [
                            ['title' => 'Les bases de l\'algorithme', 'video_url' => 'https://youtu.be/v0ziB74-Yjs', 'duration_minutes' => 15],
                            ['title' => 'IA, Machine Learning et Deep Learning', 'video_url' => 'https://youtu.be/JVft4_-qw7M', 'duration_minutes' => 18],
                            ['title' => 'Cas d\'usage business de l\'IA', 'content' => '<p>L\'IA transforme les entreprises : automatisation (chatbots, tri de documents), personnalisation (recommandations), prédiction (maintenance, ventes), et création (contenu, design). Identifiez les processus à fort volume et faible complexité pour démarrer.</p>', 'duration_minutes' => 12],
                        ],
                    ],
                    [
                        'title' => 'ChatGPT et LLM',
                        'lessons' => [
                            ['title' => 'Maîtriser les prompts efficaces', 'video_url' => 'https://youtu.be/jC2oWDsyV-k', 'duration_minutes' => 25],
                            ['title' => 'Intégrer ChatGPT dans vos workflows', 'video_url' => 'https://youtu.be/da1_iM4Z_wo', 'duration_minutes' => 22],
                            ['title' => 'Limites et bonnes pratiques', 'content' => '<p>Les LLM peuvent halluciner. Toujours vérifier les faits critiques. Ne pas envoyer de données sensibles sans chiffrement. Utiliser des prompts structurés (rôle, contexte, tâche, format). Pour la production, préférez les API avec quotas et logs.</p>', 'duration_minutes' => 15],
                        ],
                    ],
                    [
                        'title' => 'Stratégie IA en Entreprise',
                        'lessons' => [
                            ['title' => 'Évaluer la maturité IA de votre organisation', 'video_url' => 'https://youtu.be/lAd3LgetOtM', 'duration_minutes' => 20],
                            ['title' => 'ROI et pilotage de projets IA', 'video_url' => 'https://youtu.be/4C3RwPIPlAo', 'duration_minutes' => 18],
                            ['title' => 'Éthique et gouvernance de l\'IA', 'content' => '<p>Établir des principes d\'usage : transparence, biais, confidentialité, responsabilité. Documenter les décisions automatisées. Former les équipes aux risques. L\'IA doit servir l\'humain et respecter les réglementations (RGPD, EU AI Act).</p>', 'duration_minutes' => 14],
                        ],
                    ],
                ],
            ],
            'gestion-de-projet-agile-974' => [
                'modules' => [
                    [
                        'title' => 'Fondamentaux Agile',
                        'lessons' => [
                            ['title' => 'Manifeste Agile et valeurs', 'video_url' => 'https://youtu.be/Z9QbYZh1YXY', 'duration_minutes' => 15],
                            ['title' => 'Scrum en 15 minutes', 'video_url' => 'https://youtu.be/TRcRatedRY4', 'duration_minutes' => 18],
                            ['title' => 'Comparaison Scrum, Kanban, SAFe', 'content' => '<p><strong>Scrum</strong> : sprints fixes, rôles définis, cérémonies. <strong>Kanban</strong> : flux continu, WIP limités, pas de sprints. <strong>SAFe</strong> : scaling Agile pour grandes organisations. Choisissez selon la taille de l\'équipe et le type de projet.</p>', 'duration_minutes' => 12],
                        ],
                    ],
                    [
                        'title' => 'Pratiques SCRUM',
                        'lessons' => [
                            ['title' => 'User Stories et Backlog', 'video_url' => 'https://youtu.be/APxm4sYxHYg', 'duration_minutes' => 20],
                            ['title' => 'Sprint Planning et Daily Standups', 'video_url' => 'https://youtu.be/gy70BI8eLn0', 'duration_minutes' => 22],
                            ['title' => 'Rétrospectives productives', 'content' => '<p>La rétro permet d\'améliorer en continu. Format classique : Qu\'est-ce qui a bien marché ? Qu\'est-ce qu\'on améliore ? Actions concrètes. Variantes : Sailboat, Start-Stop-Continue, Mad-Sad-Glad. Limiter à 1h max, noter les décisions.</p>', 'duration_minutes' => 15],
                        ],
                    ],
                    [
                        'title' => 'Outils et Certification',
                        'lessons' => [
                            ['title' => 'Jira, Trello, Linear : comparatif', 'video_url' => 'https://youtu.be/7bJp-L3xnIE', 'duration_minutes' => 25],
                            ['title' => 'Certification Scrum Master (P SM)', 'video_url' => 'https://youtu.be/8aEfQ2N1_uM', 'duration_minutes' => 18],
                            ['title' => 'Mesurer la vélocité et la santé d\'équipe', 'content' => '<p>Vélocité = points livrés par sprint (tendance, pas comparaison inter-équipes). Métriques complémentaires : lead time, cycle time, taux de livraison. Les métriques doivent servir l\'amélioration, pas le contrôle. Évitez les tableaux de bord punitifs.</p>', 'duration_minutes' => 12],
                        ],
                    ],
                ],
            ],
            'cryptomonnaies-et-web3-112' => [
                'modules' => [
                    [
                        'title' => 'Blockchain et Crypto',
                        'lessons' => [
                            ['title' => 'Comprendre la blockchain en 10 min', 'video_url' => 'https://youtu.be/SSo_EIwHSd4', 'duration_minutes' => 12],
                            ['title' => 'Bitcoin, Ethereum et les autres', 'video_url' => 'https://youtu.be/kHybf1aC-jE', 'duration_minutes' => 20],
                            ['title' => 'Wallets et sécurité', 'content' => '<p>Cold wallet (Ledger, Trezor) pour les gros montants. Hot wallet pour les petites sommes. Ne jamais partager votre seed phrase. Vérifier les adresses avant envoi. Méfiez-vous des sites de phishing et des promesses de rendements irréalistes.</p>', 'duration_minutes' => 15],
                        ],
                    ],
                    [
                        'title' => 'Web3 et Smart Contracts',
                        'lessons' => [
                            ['title' => 'Introduction à Web3', 'video_url' => 'https://youtu.be/a16F3nEIkQ8', 'duration_minutes' => 22],
                            ['title' => 'Smart contracts et Solidity', 'video_url' => 'https://youtu.be/ipwxYa-F1uY', 'duration_minutes' => 30],
                            ['title' => 'NFTs : au-delà des images', 'content' => '<p>Les NFTs peuvent représenter des actifs numériques ou physiques : tickets, titres de propriété, identité. L\'utilité prime sur la spéculation. Cas d\'usage : loyalty programs, jeux, accès exclusifs, attestations.</p>', 'duration_minutes' => 14],
                        ],
                    ],
                    [
                        'title' => 'Investissement et Régulation',
                        'lessons' => [
                            ['title' => 'DCA et gestion du risque', 'video_url' => 'https://youtu.be/lrTqdO0V404', 'duration_minutes' => 18],
                            ['title' => 'Taxation et conformité', 'video_url' => 'https://youtu.be/gkfTqCE1B48', 'duration_minutes' => 15],
                            ['title' => 'Éviter les arnaques', 'content' => '<p>Signaux d\'alerte : rendements garantis, pression à l\'achat, projets anonymes, audits manquants. Vérifier les contrats sur Etherscan. Ne jamais connecter son wallet à un site non vérifié. En cas de doute : ne pas investir.</p>', 'duration_minutes' => 12],
                        ],
                    ],
                ],
            ],
            'data-science-avec-python-381' => [
                'modules' => [
                    [
                        'title' => 'Python pour la Data',
                        'lessons' => [
                            ['title' => 'NumPy et Pandas : les bases', 'video_url' => 'https://youtu.be/8JfDAm9y_7s', 'duration_minutes' => 35],
                            ['title' => 'Nettoyage et exploration des données', 'video_url' => 'https://youtu.be/hEgO03G0b_M', 'duration_minutes' => 30],
                            ['title' => 'Visualisation avec Matplotlib et Seaborn', 'content' => '<p>Les visualisations révèlent des patterns invisibles dans les tableaux. Matplotlib pour des graphiques personnalisés, Seaborn pour des stats visuelles élégantes. Toujours : titre clair, axes labellisés, légende si plusieurs séries.</p>', 'duration_minutes' => 20],
                        ],
                    ],
                    [
                        'title' => 'Machine Learning',
                        'lessons' => [
                            ['title' => 'Régression et classification avec Scikit-learn', 'video_url' => 'https://youtu.be/0B5eIE_2vpY', 'duration_minutes' => 40],
                            ['title' => 'Clustering et réduction de dimensionnalité', 'video_url' => 'https://youtu.be/EItlUEPCIzM', 'duration_minutes' => 28],
                            ['title' => 'Évaluer un modèle : métriques clés', 'content' => '<p>Accuracy, précision, rappel, F1-score. La matrice de confusion pour la classification. RMSE et MAE pour la régression. Cross-validation pour éviter le surajustement. Toujours comparer à une baseline naïve.</p>', 'duration_minutes' => 18],
                        ],
                    ],
                    [
                        'title' => 'Projets Pratiques',
                        'lessons' => [
                            ['title' => 'Prédiction de ventes', 'video_url' => 'https://youtu.be/JwQnD-ypg0k', 'duration_minutes' => 45],
                            ['title' => 'Analyse de sentiment (NLP)', 'video_url' => 'https://youtu.be/M7SWr5xObkA', 'duration_minutes' => 35],
                            ['title' => 'Pipeline de production', 'content' => '<p>De la Jupyter à la production : créer des pipelines reproductibles (MLflow, DVC). Versionner les données et modèles. Déployer avec FastAPI ou Flask. Monitorer la dérive des données et les performances du modèle.</p>', 'duration_minutes' => 22],
                        ],
                    ],
                ],
            ],
            'vente-et-negociation-b2b-424' => [
                'modules' => [
                    [
                        'title' => 'Fondamentaux du B2B',
                        'lessons' => [
                            ['title' => 'Cycle de vente B2B vs B2C', 'video_url' => 'https://youtu.be/wj1gH-jowfg', 'duration_minutes' => 18],
                            ['title' => 'Identifier les décideurs', 'video_url' => 'https://youtu.be/l0C_2T6JQYo', 'duration_minutes' => 15],
                            ['title' => 'Prospection par le froid', 'content' => '<p>Email et LinkedIn sont les canaux principaux. Personnalisez chaque message. Mentionnez un élément spécifique à leur entreprise. Proposez une valeur claire en 2 phrases. Suivez 3 fois maximum, espacés de 5-7 jours.</p>', 'duration_minutes' => 12],
                        ],
                    ],
                    [
                        'title' => 'Négociation',
                        'lessons' => [
                            ['title' => 'Techniques de négociation gagnant-gagnant', 'video_url' => 'https://youtu.be/2VfBsp1Gr_k', 'duration_minutes' => 25],
                            ['title' => 'Gérer les objections', 'video_url' => 'https://youtu.be/UMbR_CVqm7I', 'duration_minutes' => 22],
                            ['title' => 'Closing et post-vente', 'content' => '<p>Plusieurs techniques de closing : alternative, assumptive, urgence. Après la vente : livrer plus que promis, demander des témoignages, identifier les upsells. Un client satisfait est la meilleure source de références.</p>', 'duration_minutes' => 14],
                        ],
                    ],
                    [
                        'title' => 'CRM et Pipelines',
                        'lessons' => [
                            ['title' => 'HubSpot et Salesforce : vue d\'ensemble', 'video_url' => 'https://youtu.be/oZZvFnXNQOw', 'duration_minutes' => 28],
                            ['title' => 'Construire un pipeline prédictif', 'video_url' => 'https://youtu.be/5VDO2xldruk', 'duration_minutes' => 20],
                            ['title' => 'Métriques commerciales essentielles', 'content' => '<p>CAC, LTV, ratio LTV/CAC. Taux de conversion par étape du funnel. Délai moyen de cycle de vente. Taux de rétention. Ces métriques permettent de piloter la performance et d\'anticiper les résultats.</p>', 'duration_minutes' => 15],
                        ],
                    ],
                ],
            ],
            'photographie-professionnelle-607' => [
                'modules' => [
                    [
                        'title' => 'Technique de Base',
                        'lessons' => [
                            ['title' => 'Triangle d\'exposition : ISO, ouverture, vitesse', 'video_url' => 'https://youtu.be/F8T94sdiNjc', 'duration_minutes' => 22],
                            ['title' => 'Composition et règles des tiers', 'video_url' => 'https://youtu.be/7ZVyNjKSr0M', 'duration_minutes' => 18],
                            ['title' => 'Objectifs et focales', 'content' => '<p>Grand angle ( paysages, architecture), 50mm (polyvalent), téléobjectif (portraits, sport). Ouverture maximale pour le bokeh. Stabilisation optique pour les longues focales. Investissez d\'abord dans l\'objectif, puis le boîtier.</p>', 'duration_minutes' => 15],
                        ],
                    ],
                    [
                        'title' => 'Éclairage',
                        'lessons' => [
                            ['title' => 'Éclairage naturel et golden hour', 'video_url' => 'https://youtu.be/6_B8pVoANyY', 'duration_minutes' => 25],
                            ['title' => 'Flash et lumière artificielle', 'video_url' => 'https://youtu.be/sCRd-Cxcrzc', 'duration_minutes' => 30],
                            ['title' => 'Post-traitement Lightroom', 'content' => '<p>Workflow : importer, sélectionner, développer. Ajustez exposition, contraste, courbes. Utilisez les masques pour des retouches locales. Gardez un style cohérent avec des pré réglages. Exportez en haute résolution pour l\'impression.</p>', 'duration_minutes' => 20],
                        ],
                    ],
                    [
                        'title' => 'Business de la Photo',
                        'lessons' => [
                            ['title' => 'Construire son book et sa marque', 'video_url' => 'https://youtu.be/klnMnMQmX-w', 'duration_minutes' => 22],
                            ['title' => 'Tarification et contrats', 'video_url' => 'https://youtu.be/9TTP_XdZVnI', 'duration_minutes' => 18],
                            ['title' => 'Réseaux sociaux pour photographes', 'content' => '<p>Instagram et Pinterest pour la visibilité. Cohérence visuelle, hashtags pertinents, stories pour l\'envers du décor. Collaborer avec des influenceurs ou des marques. Le bouche-à-oreille reste le canal n°1 pour les mariages et événements.</p>', 'duration_minutes' => 14],
                        ],
                    ],
                ],
            ],
            'developpement-mobile-avec-expo-852' => [
                'modules' => [
                    [
                        'title' => 'React Native et Expo',
                        'lessons' => [
                            ['title' => 'Installation et premier projet', 'video_url' => 'https://youtu.be/obH0Po_RdWk', 'duration_minutes' => 30],
                            ['title' => 'Composants natifs et navigation', 'video_url' => 'https://youtu.be/8XCIDxEJYhQ', 'duration_minutes' => 35],
                            ['title' => 'Expo vs React Native CLI', 'content' => '<p>Expo simplifie le développement (pas de Xcode/Android Studio pour démarrer), offre des APIs prêtes (caméra, notifications), et facilite les builds. Pour des modules natifs custom, utilisez les development builds ou prévoyez un "eject" vers le bare workflow.</p>', 'duration_minutes' => 15],
                        ],
                    ],
                    [
                        'title' => 'UI et UX Mobile',
                        'lessons' => [
                            ['title' => 'Design adaptatif iOS/Android', 'video_url' => 'https://youtu.be/dLPDc-FKJSc', 'duration_minutes' => 28],
                            ['title' => 'Animations avec Reanimated', 'video_url' => 'https://youtu.be/ZE1fVfN6G3U', 'duration_minutes' => 32],
                            ['title' => 'Accessibilité et performances', 'content' => '<p>Utilisez les props accessibilityLabel et accessibilityHint. Testez avec VoiceOver (iOS) et TalkBack (Android). Pour les perfs : éviter les re-renders inutiles, utiliser FlatList pour les listes longues, optimiser les images avec réduction de résolution.</p>', 'duration_minutes' => 18],
                        ],
                    ],
                    [
                        'title' => 'Publication et Distribution',
                        'lessons' => [
                            ['title' => 'Build avec EAS (Expo Application Services)', 'video_url' => 'https://youtu.be/VAGkfZxb-6w', 'duration_minutes' => 25],
                            ['title' => 'Soumettre sur App Store et Play Store', 'video_url' => 'https://youtu.be/ox-8A-X85pY', 'duration_minutes' => 35],
                            ['title' => 'Mises à jour OTA et monitoring', 'content' => '<p>Expo Updates permet de pousser des corrections JS sans nouvelle soumission store. Utilisez Sentry ou Bugsnag pour le monitoring des crashs. Suivez les métriques d\'adoption et de rétention. Planifiez les mises à jour majeures selon le cycle de review des stores.</p>', 'duration_minutes' => 15],
                        ],
                    ],
                ],
            ],
        ];
    }
}
