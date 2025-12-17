
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

Voici l'arbre complet de l'application, détaillant chaque dossier et fichier pour une compréhension parfaite de l'architecture.

```
/
├── .env
├── README.md
├── apphosting.yaml
├── components.json
├── next.config.ts
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── docs/
│   └── backend.json
├── public/
│   └── icon.svg
└── src/
    ├── app/
    │   ├── academic-advisor/
    │   │   ├── actions/page.tsx
    │   │   ├── alerts/page.tsx
    │   │   ├── announcements/page.tsx
    │   │   ├── courses/page.tsx
    │   │   ├── dashboard/page.tsx
    │   │   ├── enrollments/page.tsx
    │   │   ├── exports/page.tsx
    │   │   ├── layout.tsx
    │   │   ├── messaging/page.tsx
    │   │   ├── planning/page.tsx
    │   │   ├── profile/page.tsx
    │   │   ├── reports/page.tsx
    │   │   ├── results/page.tsx
    │   │   ├── rooms/page.tsx
    │   │   ├── scholarships/page.tsx
    │   │   ├── settings/page.tsx
    │   │   ├── stats/page.tsx
    │   │   ├── students/page.tsx
    │   │   ├── teachers/page.tsx
    │   │   ├── tickets/page.tsx
    │   │   └── validations/page.tsx
    │   ├── admin/
    │   │   ├── actions/page.tsx
    │   │   ├── alerts/page.tsx
    │   │   ├── announcements/page.tsx
    │   │   ├── budgets/page.tsx
    │   │   ├── contracts/page.tsx
    │   │   ├── courses/page.tsx
    │   │   ├── dashboard/page.tsx
    │   │   ├── departments/page.tsx
    │   │   ├── documents/page.tsx
    │   │   ├── enrollments/page.tsx
    │   │   ├── exports/page.tsx
    │   │   ├── hours/page.tsx
    │   │   ├── journal/page.tsx
    │   │   ├── layout.tsx
    │   │   ├── maquettes/page.tsx
    │   │   ├── messages/page.tsx
    │   │   ├── modules/page.tsx
    │   │   ├── page.tsx
    │   │   ├── planning/page.tsx
    │   │   ├── profile/page.tsx
    │   │   ├── reports/page.tsx
    │   │   ├── results/page.tsx
    │   │   ├── rooms/page.tsx
    │   │   ├── scholarships/page.tsx
    │   │   ├── settings/page.tsx
    │   │   ├── signature/page.tsx
    │   │   ├── stats/page.tsx
    │   │   ├── student-files/page.tsx
    │   │   ├── teacher-files/page.tsx
    │   │   ├── templates/page.tsx
    │   │   ├── tickets/page.tsx
    │   │   ├── timetable/page.tsx
    │   │   ├── treasury/page.tsx
    │   │   ├── users/
    │   │   │   ├── archived/page.tsx
    │   │   │   └── page.tsx
    │   │   └── validations/page.tsx
    │   ├── erp-provider/
    │   │   ├── actions/page.tsx
    │   │   ├── dashboard/page.tsx
    │   │   ├── layout.tsx
    │   │   ├── profile/page.tsx
    │   │   └── settings/page.tsx
    │   ├── professor/
    │   │   ├── actions/page.tsx
    │   │   ├── courses/page.tsx
    │   │   ├── dashboard/page.tsx
    │   │   ├── documents/page.tsx
    │   │   ├── evaluations/page.tsx
    │   │   ├── layout.tsx
    │   │   ├── messages/page.tsx
    │   │   ├── page.tsx
    │   │   ├── payments/page.tsx
    │   │   ├── presence/page.tsx
    │   │   ├── profile/page.tsx
    │   │   ├── reports/page.tsx
    │   │   ├── resources/page.tsx
    │   │   ├── results/page.tsx
    │   │   ├── settings/page.tsx
    │   │   ├── students/page.tsx
    │   │   └── tickets/page.tsx
    │   ├── rectorate/
    │   │   ├── actions/page.tsx
    │   │   ├── alerts/page.tsx
    │   │   ├── announcements/page.tsx
    │   │   ├── budgets/page.tsx
    │   │   ├── contracts/page.tsx
    │   │   ├── dashboard/page.tsx
    │   │   ├── departments/page.tsx
    │   │   ├── documents/page.tsx
    │   │   ├── exports/page.tsx
    │   │   ├── hours/page.tsx
    │   │   ├── journal/page.tsx
    │   │   ├── layout.tsx
    │   │   ├── maquettes/page.tsx
    │   │   ├── messages/page.tsx
    │   │   ├── modules/page.tsx
    │   │   ├── page.tsx
    │   │   ├── profile/page.tsx
    │   │   ├── reports/page.tsx
    │   │   ├── results/page.tsx
    │   │   ├── settings/page.tsx
    │   │   ├── signature/page.tsx
    │   │   ├── stats/page.tsx
    │   │   ├── student-files/page.tsx
    │   │   ├── teacher-files/page.tsx
    │   │   └── treasury/page.tsx
    │   ├── secretariat/
    │   │   ├── actions/page.tsx
    │   │   ├── alerts/page.tsx
    │   │   ├── announcements/page.tsx
    │   │   ├── contracts/page.tsx
    │   │   ├── courses/page.tsx
    │   │   ├── dashboard/page.tsx
    │   │   ├── departments/page.tsx
    │   │   ├── enrollments/page.tsx
    │   │   ├── exports/page.tsx
    │   │   ├── hours/page.tsx
    │   │   ├── journal/page.tsx
    │   │   ├── layout.tsx
    │   │   ├── messaging/page.tsx
    │   │   ├── modules/page.tsx
    │   │   ├── planning/page.tsx
    │   │   ├── profile/page.tsx
    │   │   ├── reports/page.tsx
    │   │   ├── results/page.tsx
    │   │   ├── rooms/page.tsx
    │   │   ├── scholarships/page.tsx
    │   │   ├── settings/page.tsx
    │   │   ├── stats/page.tsx
    │   │   ├── student-files/page.tsx
    │   │   ├── teacher-files/page.tsx
    │   │   ├── templates/page.tsx
    │   │   ├── tickets/page.tsx
    │   │   ├── treasury/page.tsx
    │   │   ├── users/
    │   │   │   ├── archived/page.tsx
    │   │   │   └── page.tsx
    │   │   └── validations/page.tsx
    │   ├── student/
    │   │   ├── actions/page.tsx
    │   │   ├── courses/page.tsx
    │   │   ├── dashboard/page.tsx
    │   │   ├── documents/page.tsx
    │   │   ├── enterprise/page.tsx
    │   │   ├── evaluations/page.tsx
    │   │   ├── group-work/page.tsx
    │   │   ├── jobs/page.tsx
    │   │   ├── layout.tsx
    │   │   ├── messages/page.tsx
    │   │   ├── messaging/page.tsx
    │   │   ├── payments/page.tsx
    │   │   ├── profile/page.tsx
    │   │   ├── results/
    │   │   │   ├── layout.tsx
    │   │   │   └── page.tsx
    │   │   ├── settings/page.tsx
    │   │   ├── tickets/page.tsx
    │   │   └── timetable/page.tsx
    │   ├── globals.css
    │   ├── layout.tsx
    │   └── page.tsx
    ├── blue-ai/
    │   ├── dev.ts
    │   ├── genkit.ts
    │   └── flows/
    │       ├── generate-professor-report.ts
    │       ├── generate-stats-report.ts
    │       ├── generate-student-report.ts
    │       ├── summarize-course-materials.ts
    │       └── summarize-document-uploads.ts
    ├── components/
    │   ├── admin/
    │   │   └── role-details-modal.tsx
    │   ├── dashboard/
    │   │   ├── ai-report-card.tsx
    │   │   ├── ai-report-modal.tsx
    │   │   ├── ai-report-pdf.tsx
    │   │   ├── average-card.tsx
    │   │   ├── courses-card.tsx
    │   │   ├── current-event-card.tsx
    │   │   ├── date-time.tsx
    │   │   ├── event-details-modal.tsx
    │   │   ├── global-events-card.tsx
    │   │   ├── messaging-card.tsx
    │   │   ├── quick-actions-card.tsx
    │   │   ├── rectorate-quick-actions.tsx
    │   │   ├── secretariat-quick-actions.tsx
    │   │   └── stats-card.tsx
    │   ├── landing/
    │   │   ├── contact.tsx
    │   │   ├── features.tsx
    │   │   ├── footer.tsx
    │   │   ├── header.tsx
    │   │   ├── hero.tsx
    │   │   ├── login-modal.tsx
    │   │   ├── pricing.tsx
    │   │   └── testimonials.tsx
    │   ├── layout/
    │   │   ├── header.tsx
    │   │   └── sidebar.tsx
    │   ├── secretariat/
    │   │   ├── student-file-modal.tsx
    │   │   ├── teacher-file-modal.tsx
    │   │   └── user-details-modal.tsx
    │   ├── settings/
    │   │   ├── SettingsCard.tsx
    │   │   ├── account-settings.tsx
    │   │   ├── appearance-settings.tsx
    │   │   ├── integrations-settings.tsx
    │   │   ├── notifications-settings.tsx
    │   │   ├── privacy-settings.tsx
    │   │   └── profile-settings.tsx
    │   ├── shared/
    │   │   └── timetable.tsx
    │   ├── students/
    │   │   └── student-profile-modal.tsx
    │   ├── logo.tsx
    │   ├── modal-provider.tsx
    │   └── theme-provider.tsx
    ├── hooks/
    │   ├── use-course-modal.ts
    │   ├── use-login-modal.ts
    │   ├── use-mobile.tsx
    │   └── use-toast.ts
    ├── lib/
    │   ├── actions-data.ts
    │   ├── advisor-data.ts
    │   ├── alerts-data.ts
    │   ├── announcements-data.ts
    │   ├── applications-data.ts
    │   ├── budgets-data.ts
    │   ├── bulletins-data.ts
    │   ├── contracts-data.ts
    │   ├── course-data.ts
    │   ├── data.ts
    │   ├── departments-data.ts
    │   ├── documents-data.ts
    │   ├── enrollments-data.ts
    │   ├── enterprise-data.ts
    │   ├── evaluations-data.ts
    │   ├── exports-data.ts
    │   ├── group-work-data.ts
    │   ├── hours-data.ts
    │   ├── jobs-data.ts
    │   ├── messages-data.ts
    │   ├── payments-data.ts
    │   ├── placeholder-images.json
    │   ├── placeholder-images.ts
    │   ├── planning-data.ts
    │   ├── presence-data.ts
    │   ├── profile-data.ts
    │   ├── reports-data.ts
    │   ├── resources-data.ts
    │   ├── results-data-prof.ts
    │   ├── results-data.ts
    │   ├── rooms-data.ts
    │   ├── scholarships-data.ts
    │   ├── static-data.ts
    │   ├── stats-data.ts
    │   ├── student-payment-data.ts
    │   ├── students-data.ts
    │   ├── supabaseClient.ts
    │   ├── teachers-data.ts
    │   ├── templates-data.ts
    │   ├── tickets-data.ts
    │   ├── treasury-data.ts
    │   ├── users-data.ts
    │   ├── utils.ts
    │   └── validations-data.ts
    └── server/
        └── actions.ts
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
