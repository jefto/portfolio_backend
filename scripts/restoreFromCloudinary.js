require('dotenv').config();
const { sequelize } = require('../src/config/db');
const Project = require('../src/models/Project');
const Experience = require('../src/models/Experience');
const Volunteering = require('../src/models/Volunteering');
const Statistic = require('../src/models/Statistic');

const RECOVERED_PROJECTS = [
  // ================= PROJETS DÉVELOPPEMENT (projet-dev) =================
  {
    title: 'OCTO-GARDE — Prévention de Vols de Motos par IA',
    description:
      "Conception d'une solution complète permettant d'éviter et de prévenir les vols de motos au sein de l'Université de Lomé (Crunch Time 2026). Développement d'une application mobile pour les agents et usagers, d'un dashboard d'administration web et intégration d'un modèle d'IA pour la lecture automatique des plaques d'immatriculation par image.",
    technologies: ['React.js', 'React Native', 'Node.js', 'Python', 'IA / OCR', 'PostgreSQL'],
    client: 'Crunch Time 2026 — Université de Lomé',
    date: '2026-03-21',
    category: 'projet-dev',
    type: 'fullstack',
    link: '',
    coverImage: 'https://res.cloudinary.com/dtgoupfrk/image/upload/v1774052277/portfolio/g0ubizokuavqgt9zdjzl.png',
    screenshots: [
      'https://res.cloudinary.com/dtgoupfrk/image/upload/v1774052277/portfolio/qdbfiq8twmwjjzpno9ue.png',
      'https://res.cloudinary.com/dtgoupfrk/image/upload/v1774052278/portfolio/fybk1f9b6d85uppee5fo.png',
      'https://res.cloudinary.com/dtgoupfrk/image/upload/v1774052278/portfolio/lalgwmuwnef3cycs7xtv.png',
      'https://res.cloudinary.com/dtgoupfrk/image/upload/v1774052278/portfolio/qfcpclkm8ichbhmupjz2.png',
      'https://res.cloudinary.com/dtgoupfrk/image/upload/v1774052278/portfolio/a1mnqjxmxwvxivmuu09b.jpg',
      'https://res.cloudinary.com/dtgoupfrk/image/upload/v1774052278/portfolio/clakdh2b2ywaljmsftqe.jpg',
      'https://res.cloudinary.com/dtgoupfrk/image/upload/v1774052278/portfolio/slq3vbqdunmjrctj5qdl.jpg',
      'https://res.cloudinary.com/dtgoupfrk/image/upload/v1774052278/portfolio/wltay51yubmfi81asrho.jpg',
      'https://res.cloudinary.com/dtgoupfrk/image/upload/v1774052278/portfolio/wz4blz6tx9w7wdqfrrhk.jpg',
    ],
  },
  {
    title: 'Éditeur No-Code — Constructeur de Sites Web',
    description:
      "Développement d'une application web permettant aux personnes non-développeurs de concevoir des sites web complets sans écrire une seule ligne de code. Intègre une palette de composants glisser-déposer, un inspecteur de propriétés (position, rotation, typographie) et un moteur d'aperçu et de publication.",
    technologies: ['React.js', 'TypeScript', 'Tailwind CSS', 'Node.js'],
    client: 'Africa Ascent & SPARK Corporation',
    date: '2026-03-18',
    category: 'projet-dev',
    type: 'fullstack',
    link: '',
    coverImage: 'https://res.cloudinary.com/dtgoupfrk/image/upload/v1773794553/portfolio/t9wubzzaslrzczlrbvcd.png',
    screenshots: [],
  },
  {
    title: 'Institut ITM La Vision — Plateforme de Gestion Scolaire',
    description:
      "Développement d'une application web complète de gestion d'une école secondaire, couvrant tout le cycle depuis la demande d'inscription en ligne jusqu'à la délibération des résultats. Conception des interfaces clients (élèves, parents, administration) et intégration serveur.",
    technologies: ['React.js', 'Tailwind CSS', 'Node.js', 'PostgreSQL', 'REST API'],
    client: 'Institut Technique et Moderne La Vision (Lomé)',
    date: '2026-02-15',
    category: 'projet-dev',
    type: 'fullstack',
    link: '',
    coverImage: 'https://res.cloudinary.com/dtgoupfrk/image/upload/v1773791905/portfolio/g3spbjobz2hpat9nedaa.jpg',
    screenshots: [],
  },
  {
    title: 'IJEAF — Marketplace Panafricaine',
    description:
      "Développement du site web vitrine et de l'interface marketplace pour la startup IJEAF, plateforme panafricaine connectant les producteurs et vendeurs d'Afrique (Textiles & Wax, Artisanat, Agroalimentaire) à la demande mondiale.",
    technologies: ['React.js', 'Tailwind CSS', 'JavaScript', 'UI/UX Design'],
    client: 'Startup IJEAF',
    date: '2025-08-20',
    category: 'projet-dev',
    type: 'frontend',
    link: '',
    coverImage: 'https://res.cloudinary.com/dtgoupfrk/image/upload/v1773791427/portfolio/ss9cgdqhudmlvscarurv.jpg',
    screenshots: [],
  },
  {
    title: 'FITPlus+ — Gestion de Salle de Sport & Abonnements',
    description:
      "Application de bureau complète (Espace Client et Administration) dédiée à la gestion d'une salle de sport : souscription aux formules d'abonnement (Simple, Pro, Leader), paiement sécurisé, suivi des séances et notifications.",
    technologies: ['Java', 'Java Swing', 'MySQL', 'JDBC'],
    client: 'Projet Académique — EPL',
    date: '2026-03-21',
    category: 'projet-dev',
    type: 'desktop',
    link: '',
    coverImage: 'https://res.cloudinary.com/dtgoupfrk/image/upload/v1774056654/portfolio/bez3cicpzx6imhylibts.png',
    screenshots: [
      'https://res.cloudinary.com/dtgoupfrk/image/upload/v1774056654/portfolio/egsbt7txutb29acvfj8g.jpg',
      'https://res.cloudinary.com/dtgoupfrk/image/upload/v1774056654/portfolio/icevvhqzhc2z00d3cfwd.png',
      'https://res.cloudinary.com/dtgoupfrk/image/upload/v1774056654/portfolio/kkxylwy9cxs1wqcspmxv.png',
      'https://res.cloudinary.com/dtgoupfrk/image/upload/v1774056654/portfolio/ywwog40rq489tyixrwoc.png',
      'https://res.cloudinary.com/dtgoupfrk/image/upload/v1774056655/portfolio/aij7cgdy0qohlwwvugjr.png',
      'https://res.cloudinary.com/dtgoupfrk/image/upload/v1774056655/portfolio/gegmlxwiwcyp8lfr8ou2.png',
      'https://res.cloudinary.com/dtgoupfrk/image/upload/v1774056655/portfolio/j7nstzwiow9om9isqogo.png',
      'https://res.cloudinary.com/dtgoupfrk/image/upload/v1774056655/portfolio/m2ujizctgjzhfenuoh17.png',
      'https://res.cloudinary.com/dtgoupfrk/image/upload/v1774056655/portfolio/sxwocwgelxodszu7yn5r.png',
    ],
  },
  {
    title: 'Application Météo & Convertisseur de Devises',
    description:
      "Application desktop interactive affichant les prévisions météorologiques en temps réel avec courbe d'historique de température sur 6 heures, couplée à un convertisseur de devises international avec suivi graphique sur 7 jours.",
    technologies: ['Java', 'Java Swing', 'API REST', 'Graphiques 2D'],
    client: 'Projet Académique — EPL',
    date: '2026-03-18',
    category: 'projet-dev',
    type: 'desktop',
    link: '',
    coverImage: 'https://res.cloudinary.com/dtgoupfrk/image/upload/v1773792962/portfolio/xuyofjqduyreose73h4v.jpg',
    screenshots: [
      'https://res.cloudinary.com/dtgoupfrk/image/upload/v1773792963/portfolio/ka3jkyyvz1qisdijowra.jpg',
      'https://res.cloudinary.com/dtgoupfrk/image/upload/v1773792963/portfolio/qyd9tzzrqkbcwjloogrs.jpg',
      'https://res.cloudinary.com/dtgoupfrk/image/upload/v1773792963/portfolio/yo33tgyzvpmymcfoihlj.jpg',
      'https://res.cloudinary.com/dtgoupfrk/image/upload/v1773792964/portfolio/l07tzqmcspxzdqrtxerp.jpg',
    ],
  },
  {
    title: 'WEMEET — Plateforme Événementielle & Billetterie',
    description:
      "Application web dédiée à la promotion d'événements et à la réservation de tickets en ligne, intégrant une recherche dynamique, un espace organisateur et un système d'alertes.",
    technologies: ['React.js', 'Node.js', 'Tailwind CSS', 'PostgreSQL'],
    client: 'WeMeet',
    date: '2026-03-18',
    category: 'projet-dev',
    type: 'fullstack',
    link: '',
    coverImage: 'https://res.cloudinary.com/dtgoupfrk/image/upload/v1773793479/portfolio/igeprhmjydxhifhpynf1.jpg',
    screenshots: [],
  },
  {
    title: 'Portail du Club Génie Informatique (Club GI EPL)',
    description:
      "Conception et développement du site web officiel du Club Génie Informatique de l'École Polytechnique de Lomé pour présenter les sections techniques, les projets étudiants, les formations et faciliter l'adhésion des nouveaux membres.",
    technologies: ['React.js', 'Tailwind CSS', 'JavaScript'],
    client: 'École Polytechnique de Lomé (Université de Lomé)',
    date: '2026-03-18',
    category: 'projet-dev',
    type: 'frontend',
    link: '',
    coverImage: 'https://res.cloudinary.com/dtgoupfrk/image/upload/v1773793940/portfolio/bez6jsnjbtnybw8futs3.jpg',
    screenshots: [],
  },
  {
    title: 'Portfolio Personnel v1 — Tchamie Jephté',
    description:
      "Première édition de mon portfolio personnel mettant en avant mon profil hybride d'Ingénieur Génie Logiciel et UI/UX Designer, mes réalisations et le téléchargement de mon CV.",
    technologies: ['React.js', 'Tailwind CSS', 'JavaScript', 'Figma'],
    client: 'Projet Personnel',
    date: '2026-03-17',
    category: 'projet-dev',
    type: 'frontend',
    link: 'https://mon-portfolio-gamma-liart.vercel.app/',
    coverImage: 'https://res.cloudinary.com/dtgoupfrk/image/upload/v1773791016/portfolio/kfs5xezwhn66ikxv3ktf.jpg',
    screenshots: [],
  },
  {
    title: 'Générateur de Cartes de Vœux — Joyeux Noël',
    description:
      "Application web événementielle permettant aux visiteurs de créer et télécharger une carte de vœux personnalisée avec leur nom et leur photo.",
    technologies: ['HTML5', 'CSS3', 'JavaScript'],
    client: 'JEFTO 2.0',
    date: '2024-12-24',
    category: 'projet-dev',
    type: 'frontend',
    link: '',
    coverImage: 'https://res.cloudinary.com/dtgoupfrk/image/upload/v1773794318/portfolio/yfrd2ibquhzwvyb91mnv.jpg',
    screenshots: [],
  },

  // ================= PROJETS DESIGN (projet-design) =================
  {
    title: 'DevFest Lomé 2025 & Build With AI — Direction Artistique',
    description:
      "Conception sur Figma de l'ensemble des supports visuels pour le DevFest Lomé 2025 et Build With AI 2026 (Google Developer Groups Lomé) : bannières grand format, kakémonos (roll-ups), backdrops, visuels speakers et campagnes réseaux sociaux.",
    technologies: ['Figma', 'Brand Design', 'Print & Roll-up', 'Social Media'],
    client: 'GDG Lomé (Google Developer Groups)',
    date: '2025-11-15',
    category: 'projet-design',
    type: 'affiche',
    link: '',
    coverImage: 'https://res.cloudinary.com/dtgoupfrk/image/upload/v1774027198/portfolio/oyrvkspt82cfhuay70vt.png',
    screenshots: [
      'https://res.cloudinary.com/dtgoupfrk/image/upload/v1774025729/portfolio/zelexypnjnhysvzhqtxp.jpg',
      'https://res.cloudinary.com/dtgoupfrk/image/upload/v1774027198/portfolio/w3fe2gzrwogm3cehepb7.jpg',
    ],
  },
  {
    title: 'Campagne Giveaway DevFest 2025 × Fata School',
    description:
      "Création des affiches promotionnelles et visuels social media pour le jeu concours officiel DevFest Lomé 2025 en partenariat avec l'application éducative Fata School.",
    technologies: ['Figma', 'Adobe Express', 'Social Media Design'],
    client: 'GDG Lomé × Fata School',
    date: '2025-10-31',
    category: 'projet-design',
    type: 'affiche',
    link: '',
    coverImage: 'https://res.cloudinary.com/dtgoupfrk/image/upload/v1774025729/portfolio/zelexypnjnhysvzhqtxp.jpg',
    screenshots: [
      'https://res.cloudinary.com/dtgoupfrk/image/upload/v1774027198/portfolio/w3fe2gzrwogm3cehepb7.jpg',
    ],
  },
  {
    title: 'S.E.M.E. EPL-UL Édition 2025 — Semaine Mathématiques-Entreprises',
    description:
      "Conception de l'affiche officielle de la 2e édition de la Semaine d'Étude Mathématiques-Entreprises (S.E.M.E. EPL-UL 2025) organisée à l'UniPod Togo (Université de Lomé) en partenariat avec l'UTT, l'UTBM et l'IMT Mines Albi.",
    technologies: ['Canva', 'Figma', 'Communication Scientifique', 'Print'],
    client: 'École Polytechnique de Lomé / PEA Afrique-France',
    date: '2025-11-10',
    category: 'projet-design',
    type: 'affiche',
    link: '',
    coverImage: 'https://res.cloudinary.com/dtgoupfrk/image/upload/v1774025025/portfolio/vtzvctvyvuxyapjmqb7u.png',
    screenshots: [
      'https://res.cloudinary.com/dtgoupfrk/image/upload/v1774025024/portfolio/q8z4dcq7ots401avtsfp.png',
    ],
  },
  {
    title: 'Maquette UI/UX — Plateforme Scolaire ITM La Vision',
    description:
      "Conception complète sous Figma du système de design et des écrans de la plateforme de gestion scolaire : Landing Page, Portail Parents, Dashboard Administrateur, suivi des demandes d'inscription et gestion des notes.",
    technologies: ['Figma', 'UI/UX Design', 'Design System', 'Prototypage'],
    client: 'Institut ITM La Vision',
    date: '2025-12-15',
    category: 'projet-design',
    type: 'maquette',
    link: '',
    coverImage: 'https://res.cloudinary.com/dtgoupfrk/image/upload/v1774026663/portfolio/a3fwnahhaudyuvvnacd4.png',
    screenshots: [],
  },
  {
    title: 'FocusLife — Maquette Mobile de Productivité & Bien-être',
    description:
      "Maquettage haute-fidélité et prototypage interactif sous Figma d'une application mobile (iOS / Android) dédiée à la concentration, à la gestion du temps d'écran et au suivi des objectifs quotidiens.",
    technologies: ['Figma', 'Mobile UI/UX', 'Prototypage Interactif'],
    client: 'FocusLife',
    date: '2026-01-20',
    category: 'projet-design',
    type: 'maquette',
    link: '',
    coverImage: 'https://res.cloudinary.com/dtgoupfrk/image/upload/v1774027028/portfolio/plvv0aoajaa07c1ihar5.png',
    screenshots: [],
  },
  {
    title: 'MiabeHackathon — Maquette UI/UX Santé & Télémédecine',
    description:
      "Conception des interfaces utilisateurs sur tablette et mobile pour une plateforme digitale de santé et de prise en charge médicale réalisée lors du MiabeHackathon.",
    technologies: ['Figma', 'UI/UX Design', 'HealthTech UI'],
    client: 'MiabeHackathon',
    date: '2026-02-10',
    category: 'projet-design',
    type: 'maquette',
    link: '',
    coverImage: 'https://res.cloudinary.com/dtgoupfrk/image/upload/v1774026891/portfolio/x9vmijxxeqaasa4b5cob.png',
    screenshots: [],
  },
  {
    title: 'LETRIKI — Interface d’Authentification & Identité Visuelle',
    description:
      "Création du logotype et maquettage de l'interface de connexion sécurisée en glassmorphism pour la solution numérique Letriki.",
    technologies: ['Figma', 'UI Design', 'Identité Visuelle'],
    client: 'Letriki',
    date: '2026-03-10',
    category: 'projet-design',
    type: 'maquette',
    link: '',
    coverImage: 'https://res.cloudinary.com/dtgoupfrk/image/upload/v1774026094/portfolio/dnsndqbrc9piqyqvppwe.jpg',
    screenshots: [],
  },
];

const INITIAL_EXPERIENCES = [
  {
    title: 'Assistant du Product Manager',
    company: 'Edolé Africa',
    roleType: 'HYBRID',
    startDate: 'Avr. 2026',
    endDate: 'Présent',
    isCurrent: true,
    description:
      "Stage au sein de l'équipe produit avec prise en charge de la refonte complète du back-office d'administration.",
    achievements: [
      'Refonte fonctionnelle et technique complète du back-office Admin',
      'Coordination entre les besoins produit et l’implémentation UI/UX',
    ],
    metrics: {
      devWeight: 55,
      designWeight: 45,
      impactScore: 88,
      impactLabel: 'Temps plein · Présentiel (Lomé)',
      employmentType: 'FULL_TIME',
      workMode: 'ONSITE',
    },
    techStack: ['React.js', 'Figma', 'Notion', 'REST API'],
    designWorks: [],
    orderIndex: 1,
  },
  {
    title: 'Développeur Backend',
    company: 'Orga Africa',
    roleType: 'DEV',
    startDate: 'Juin 2026',
    endDate: 'Présent',
    isCurrent: true,
    description:
      "Stage dédié à la conception, au développement et à la documentation des API pour accompagner l'évolution du système de l'entreprise.",
    achievements: [
      'Conception et sécurisation des endpoints API REST',
      'Documentation technique complète avec Swagger et Postman',
    ],
    metrics: {
      devWeight: 85,
      designWeight: 15,
      impactScore: 85,
      impactLabel: 'Temps partiel · En ligne',
      employmentType: 'PART_TIME',
      workMode: 'REMOTE',
    },
    techStack: ['Node.js', 'PostgreSQL', 'Swagger', 'Postman'],
    designWorks: [],
    orderIndex: 2,
  },
  {
    title: 'Développeur Full-Stack (Crunch Time 2026)',
    company: 'Université de Lomé — Projet OCTO-GARDE',
    roleType: 'HYBRID',
    startDate: 'Mars 2026',
    endDate: 'Mars 2026',
    isCurrent: false,
    description:
      "Conception d'une solution permettant d'éviter et de prévenir les vols de motos au sein de l'Université de Lomé : application mobile, dashboard web et modèle d'IA pour la saisie automatique des plaques d'immatriculation.",
    achievements: [
      'Développement de l’application mobile et du tableau de bord web OCTO-GARDE',
      'Intégration du modèle IA de reconnaissance de plaques par image',
    ],
    metrics: {
      devWeight: 70,
      designWeight: 30,
      impactScore: 95,
      impactLabel: 'Temps plein · Présentiel (Lomé)',
      employmentType: 'FULL_TIME',
      workMode: 'ONSITE',
    },
    techStack: ['React.js', 'React Native', 'Python', 'IA / OCR', 'Node.js'],
    designWorks: [
      {
        title: 'Dashboard Web OCTO-GARDE',
        type: 'UI/UX & Web',
        imageUrl: 'https://res.cloudinary.com/dtgoupfrk/image/upload/v1774052277/portfolio/g0ubizokuavqgt9zdjzl.png',
        link: '/dev',
      },
      {
        title: 'Application Mobile OCTO-GARDE',
        type: 'Mobile UI',
        imageUrl: 'https://res.cloudinary.com/dtgoupfrk/image/upload/v1774052278/portfolio/a1mnqjxmxwvxivmuu09b.jpg',
        link: '/dev',
      },
    ],
    orderIndex: 3,
  },
  {
    title: 'Développeur Web Full-Stack',
    company: 'Institut ITM La Vision',
    roleType: 'HYBRID',
    startDate: 'Déc. 2025',
    endDate: 'Fév. 2026',
    isCurrent: false,
    description:
      "Développement d'une application de gestion d'une école secondaire, de la demande d'inscription jusqu'à la délibération. Maquettage Figma, développement des interfaces clients et intégration serveur.",
    achievements: [
      'Développement du portail parents, élèves et back-office de délibération',
      'Maquettage complet du système de design sur Figma',
    ],
    metrics: {
      devWeight: 65,
      designWeight: 35,
      impactScore: 92,
      impactLabel: 'Temps plein · Présentiel (Lomé)',
      employmentType: 'FULL_TIME',
      workMode: 'ONSITE',
    },
    techStack: ['React.js', 'Node.js', 'Tailwind CSS', 'Figma', 'PostgreSQL'],
    designWorks: [
      {
        title: 'Portail Web Institut La Vision',
        type: 'Web App',
        imageUrl: 'https://res.cloudinary.com/dtgoupfrk/image/upload/v1773791905/portfolio/g3spbjobz2hpat9nedaa.jpg',
        link: '/dev',
      },
      {
        title: 'Système UI/UX Figma — ITM La Vision',
        type: 'Maquette Figma',
        imageUrl: 'https://res.cloudinary.com/dtgoupfrk/image/upload/v1774026663/portfolio/a3fwnahhaudyuvvnacd4.png',
        link: '/design',
      },
    ],
    orderIndex: 4,
  },
  {
    title: 'Stage — Développeur Web',
    company: 'Africa Ascent & SPARK Corporation',
    roleType: 'HYBRID',
    startDate: 'Fév. 2025',
    endDate: 'Déc. 2025',
    isCurrent: false,
    description:
      "Développement d'une application permettant aux personnes non-développeurs de concevoir des sites web sans écrire une ligne de code. Conception et développement des interfaces clients.",
    achievements: [
      'Architecture de l’éditeur visuel No-Code par glisser-déposer',
      'Conception ergonomique de la palette de composants et de l’inspecteur',
    ],
    metrics: {
      devWeight: 70,
      designWeight: 30,
      impactScore: 96,
      impactLabel: 'Temps plein · En ligne',
      employmentType: 'FULL_TIME',
      workMode: 'REMOTE',
    },
    techStack: ['React.js', 'TypeScript', 'Tailwind CSS', 'Figma'],
    designWorks: [
      {
        title: 'Interface Éditeur No-Code',
        type: 'Product UI',
        imageUrl: 'https://res.cloudinary.com/dtgoupfrk/image/upload/v1773794553/portfolio/t9wubzzaslrzczlrbvcd.png',
        link: '/dev',
      },
    ],
    orderIndex: 5,
  },
  {
    title: 'Développeur Web Frontend',
    company: 'IJEAF',
    roleType: 'HYBRID',
    startDate: 'Juin 2025',
    endDate: 'Août 2025',
    isCurrent: false,
    description:
      'Conception UI/UX et développement du site web vitrine et marketplace pour la startup panafricaine IJEAF.',
    achievements: [
      'Intégration responsive et animations fluides de la vitrine IJEAF',
      'Direction artistique mettant en valeur l’artisanat et les produits africains',
    ],
    metrics: {
      devWeight: 60,
      designWeight: 40,
      impactScore: 86,
      impactLabel: 'Temps partiel · En ligne',
      employmentType: 'PART_TIME',
      workMode: 'REMOTE',
    },
    techStack: ['React.js', 'Tailwind CSS', 'JavaScript', 'Figma'],
    designWorks: [
      {
        title: 'Vitrine Marketplace IJEAF',
        type: 'UI/UX & Frontend',
        imageUrl: 'https://res.cloudinary.com/dtgoupfrk/image/upload/v1773791427/portfolio/ss9cgdqhudmlvscarurv.jpg',
        link: '/dev',
      },
    ],
    orderIndex: 6,
  },
  {
    title: 'Co-Lead Communauté Tech',
    company: 'Microsoft Student Ambassador UL & GDG Lomé',
    roleType: 'COMMUNITY',
    startDate: 'Sept. 2024',
    endDate: 'Juin 2025',
    isCurrent: false,
    description:
      "Organisation et suivi du déroulement des formations techniques, réalisation et suivi des projets étudiants, et direction artistique d'événements majeurs (DevFest Lomé, S.E.M.E. EPL-UL).",
    achievements: [
      'Organisation et encadrement des ateliers de formation et projets',
      'Création des supports visuels pour DevFest Lomé 2025 et S.E.M.E. EPL-UL',
    ],
    metrics: {
      devWeight: 45,
      designWeight: 55,
      impactScore: 90,
      impactLabel: 'Temps partiel · Hybride',
      employmentType: 'PART_TIME',
      workMode: 'HYBRID',
    },
    techStack: ['Leadership', 'Figma', 'Canva', 'Git / GitHub'],
    designWorks: [
      {
        title: 'DevFest Lomé 2025 — Direction Artistique',
        type: 'Branding Événementiel',
        imageUrl: 'https://res.cloudinary.com/dtgoupfrk/image/upload/v1774027198/portfolio/oyrvkspt82cfhuay70vt.png',
        link: '/design',
      },
      {
        title: 'Affiche S.E.M.E. EPL-UL 2025',
        type: 'Affiche Officielle',
        imageUrl: 'https://res.cloudinary.com/dtgoupfrk/image/upload/v1774025025/portfolio/vtzvctvyvuxyapjmqb7u.png',
        link: '/design',
      },
    ],
    orderIndex: 7,
  },
];

const INITIAL_VOLUNTEERING = [
  {
    title: 'Co-Lead & Mentor Technique',
    organization: 'Microsoft Learn Student Ambassadors — Université de Lomé',
    period: 'Sept. 2024 — Juin 2025',
    location: 'Lomé, Togo',
    description:
      "Organisation et suivi des formations gratuites en développement logiciel, accompagnement des étudiants dans la réalisation de leurs premiers projets techniques et animation de la communauté universitaire.",
    imageUrl: 'https://res.cloudinary.com/dtgoupfrk/image/upload/v1773793940/portfolio/bez6jsnjbtnybw8futs3.jpg',
    orderIndex: 1,
  },
  {
    title: 'Designer & Bénévole Événementiel',
    organization: 'Google Developer Groups (GDG) Lomé — DevFest & Build With AI',
    period: '2025 — Présent',
    location: 'Lomé, Togo',
    description:
      "Contribution bénévole à la réussite du DevFest Lomé et de Build With AI à travers la création des supports visuels (bannières, kakémonos, campagnes réseaux sociaux) et l'accueil des participants.",
    imageUrl: 'https://res.cloudinary.com/dtgoupfrk/image/upload/v1774025729/portfolio/zelexypnjnhysvzhqtxp.jpg',
    orderIndex: 2,
  },
  {
    title: 'Membre Actif & Développeur Bénévole',
    organization: 'Club Génie Informatique — École Polytechnique de Lomé (Club GI EPL)',
    period: '2023 — Présent',
    location: 'Campus Universitaire de Lomé',
    description:
      "Conception de la plateforme web du club, partage de connaissances entre pairs, ateliers d'entraide en programmation et promotion de l'excellence technologique auprès des nouveaux étudiants.",
    imageUrl: 'https://res.cloudinary.com/dtgoupfrk/image/upload/v1774025025/portfolio/vtzvctvyvuxyapjmqb7u.png',
    orderIndex: 3,
  },
];

(async () => {
  try {
    console.log('1. Connexion et synchronisation du schéma Supabase...');
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });

    console.log('2. Restauration des 17 projets depuis Cloudinary...');
    await Project.destroy({ where: {} });
    const createdProjects = await Project.bulkCreate(RECOVERED_PROJECTS);
    console.log(`-> ${createdProjects.length} projets restaurés avec succès !`);

    console.log('3. Restauration des 7 expériences professionnelles du CV...');
    await Experience.destroy({ where: {} });
    const createdExps = await Experience.bulkCreate(INITIAL_EXPERIENCES);
    console.log(`-> ${createdExps.length} expériences professionnelles restaurées !`);

    console.log('4. Restauration des activités de bénévolat...');
    await Volunteering.destroy({ where: {} });
    const createdVols = await Volunteering.bulkCreate(INITIAL_VOLUNTEERING);
    console.log(`-> ${createdVols.length} activités de bénévolat restaurées !`);

    console.log('5. Mise à jour des Statistiques et Coordonnées de Contact...');
    let stats = await Statistic.findOne();
    if (!stats) {
      stats = await Statistic.create({});
    }
    await stats.update({
      completedProjects: 10,
      yearsExperience: 3,
      masteredTechnologies: 18,
      mockupsCreated: 5,
      postersDesigned: 4,
      masteredSoftware: 4,
      contactPhone: '+228 91 02 01 71',
      contactEmail: 'jefftchamie@gmail.com',
      contactLocation: 'Lomé, Togo',
    });
    console.log('-> Statistiques et coordonnées mises à jour avec succès !');

    process.exit(0);
  } catch (err) {
    console.error('Erreur lors de la restauration :', err);
    process.exit(1);
  }
})();
