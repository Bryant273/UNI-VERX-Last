
# UNI-VERX - Le Système Universitaire Intelligent

UNI-VERX est une plateforme de gestion universitaire de nouvelle génération, conçue pour unifier et optimiser tous les aspects de la vie académique et administrative. En intégrant l'intelligence artificielle au cœur de ses processus, UNI-VERX offre une expérience fluide, intuitive et personnalisée pour chaque acteur de l'écosystème éducatif.

Notre vision est de transformer la gestion universitaire en un système proactif, data-driven et centré sur l'utilisateur, libérant ainsi le personnel administratif des tâches répétitives et offrant aux étudiants et enseignants des outils puissants pour atteindre l'excellence.

---

## Table des Matières

1.  [Core Features](#core-features)
2.  [Rôles Utilisateurs](#rôles-utilisateurs)
3.  [Stack Technique](#stack-technique)
4.  [Structure du Projet](#structure-du-projet)
5.  [Démarrage Rapide](#démarrage-rapide)

---

## Core Features

-   **Tableaux de Bord Personnalisés**: Chaque rôle dispose d'une vue d'ensemble conçue pour ses besoins, avec des statistiques clés et des actions rapides.
-   **Gestion Académique Centralisée**: Suivi des cours, gestion des maquettes de programme, planification des emplois du temps et saisie des notes.
-   **Outils de Communication Intégrés**: Une messagerie interne et un système d'annonces permettent de fluidifier la communication entre tous les utilisateurs.
-   **Intelligence Artificielle (Blue AI)**: Des agents IA génèrent des rapports de performance, analysent des statistiques et résument des documents pour une prise de décision éclairée.
-   **Gestion Administrative Complète**: Suivi des dossiers étudiants et professeurs, gestion des inscriptions, des contrats, de la trésorerie et de la budgétisation.
-   **Portails dédiés**: Chaque rôle (étudiant, professeur, administration) dispose d'un portail sécurisé et adapté à ses missions.

---

## Rôles Utilisateurs

La plateforme est structurée autour de plusieurs rôles clés, chacun avec des permissions et des fonctionnalités spécifiques :

-   **Étudiant**: Consulte ses notes, son emploi du temps, ses cours et interagit avec les professeurs et l'administration.
-   **Professeur**: Gère ses cours, saisit les notes, communique avec ses classes et suit la progression de ses étudiants.
-   **Responsable Pédagogique**: Supervise les programmes, valide les bulletins, gère les inscriptions et suit la performance globale des étudiants et des enseignants.
-   **Secrétariat**: Point central de la gestion administrative, il traite les dossiers, les tickets et les validations quotidiennes.
-   **Rectorat / Admin Université**: Dispose d'une vue d'ensemble stratégique sur l'ensemble de l'université, avec un accès complet aux statistiques, aux finances et à la gestion des utilisateurs.
-   **Fournisseur ERP**: Gère la maintenance technique de la plateforme, la supervision des serveurs et les licences.

---

## Stack Technique

UNI-VERX est construit sur un socle technologique moderne, performant et évolutif :

-   **Framework Frontend**: [Next.js](https://nextjs.org/) avec React et le App Router.
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) pour le style et [ShadCN UI](https://ui.shadcn.com/) pour les composants d'interface.
-   **Intelligence Artificielle**: [Genkit](https://firebase.google.com/docs/genkit) (un framework open-source de Google) pour l'orchestration des workflows IA.
-   **Base de Données & Authentification**: [Firebase](https://firebase.google.com/) (Firestore & Firebase Auth) pour la gestion des données et des utilisateurs en temps réel.
-   **Langage**: [TypeScript](https://www.typescriptlang.org/) sur l'ensemble du projet pour la robustesse et la maintenabilité.

---

## Structure du Projet

Le projet est organisé pour une séparation claire des préoccupations :

```
/
├── src/
│   ├── app/
│   │   ├── (auth)/         # Pages d'authentification (si nécessaire)
│   │   ├── [role]/         # Pages spécifiques pour chaque rôle (student, professor, admin...)
│   │   ├── layout.tsx      # Layout principal de l'application
│   │   └── page.tsx        # Page d'accueil (landing page)
│   ├── components/
│   │   ├── dashboard/      # Composants spécifiques aux tableaux de bord
│   │   ├── landing/        # Composants pour la page d'accueil
│   │   ├── layout/         # Composants de structure (Header, Sidebar)
│   │   └── ui/             # Composants d'interface ShadCN (Button, Card, etc.)
│   ├── lib/
│   │   ├── data.ts         # Types et interfaces principaux
│   │   └── static-data.ts  # Données statiques de démonstration
│   ├── hooks/
│   │   └── use-login-modal.ts # Gestion de l'état de la modale de connexion
│   ├── blue-ai/
│   │   ├── flows/          # Logique des agents IA (Genkit Flows)
│   │   └── genkit.ts       # Configuration de Genkit
│   └── server/
│       └── actions.ts      # Server Actions pour les appels au backend
├── public/                 # Fichiers statiques (images, etc.)
└── tailwind.config.ts      # Configuration de Tailwind CSS
```

---

## Démarrage Rapide

Pour lancer le projet en environnement de développement, suivez ces étapes :

1.  **Installer les dépendances** :
    ```bash
    npm install
    ```

2.  **Lancer le serveur de développement** :
    ```bash
    npm run dev
    ```

L'application sera alors accessible à l'adresse `http://localhost:9002`.
