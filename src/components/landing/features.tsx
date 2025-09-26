import { GraduationCap, BookOpen, BarChart2, Euro, Users, Cloud } from "lucide-react";

const featureData = [
  {
    icon: <GraduationCap className="text-white h-8 w-8" />,
    title: 'Gestion des Étudiants',
    description: "Inscription automatisée, suivi des notes, gestion des absences et génération de relevés personnalisés avec l'IA.",
    points: ["Inscription en ligne intelligente", "Suivi automatique des performances", "Alertes prédictives d'échec"],
    bgClass: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-600",
    iconBgClass: "bg-primary",
  },
  {
    icon: <BookOpen className="text-white h-8 w-8" />,
    title: 'Gestion Académique',
    description: "Planification des cours, attribution des salles, gestion des examens et évaluation automatisée.",
    points: ["Planification automatique des cours", "Attribution optimale des ressources", "Correction automatique d'examens"],
    bgClass: "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-700 dark:to-gray-600",
    iconBgClass: "bg-secondary",
  },
  {
    icon: <BarChart2 className="text-white h-8 w-8" />,
    title: 'Analytics IA',
    description: "Tableaux de bord intelligents, prédictions de performance et recommandations personnalisées.",
    points: ["Analyses prédictives avancées", "Recommandations personnalisées", "Rapports automatisés"],
    bgClass: "bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-700 dark:to-gray-600",
    iconBgClass: "bg-accent",
  },
  {
    icon: <Euro className="text-white h-8 w-8" />,
    title: 'Gestion Financière',
    description: "Facturation automatique, suivi des paiements, bourses et aide financière intelligente.",
    points: ["Facturation automatisée", "Gestion des bourses IA", "Prévisions budgétaires"],
    bgClass: "bg-gradient-to-br from-orange-50 to-orange-100 dark:from-gray-700 dark:to-gray-600",
    iconBgClass: "bg-orange-500",
  },
  {
    icon: <Users className="text-white h-8 w-8" />,
    title: 'Communication',
    description: "Messagerie intégrée, notifications intelligentes et communication parent-université.",
    points: ["Notifications intelligentes", "Chat multicanal intégré", "Portail parents connecté"],
    bgClass: "bg-gradient-to-br from-pink-50 to-pink-100 dark:from-gray-700 dark:to-gray-600",
    iconBgClass: "bg-pink-500",
  },
  {
    icon: <Cloud className="text-white h-8 w-8" />,
    title: 'Cloud & Sécurité',
    description: "Stockage cloud sécurisé, sauvegardes automatiques et conformité RGPD complète.",
    points: ["Chiffrement bout en bout", "Sauvegardes automatiques", "Conformité RGPD garantie"],
    bgClass: "bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-gray-700 dark:to-gray-600",
    iconBgClass: "bg-indigo-500",
  },
];

const FeatureCard = ({ icon, title, description, points, bgClass, iconBgClass }: typeof featureData[0]) => (
  <div className={`${bgClass} p-8 rounded-2xl hover:shadow-xl transition-all hover:-translate-y-2`}>
    <div className={`w-16 h-16 ${iconBgClass} rounded-2xl flex items-center justify-center mb-6`}>
      {icon}
    </div>
    <h3 className="text-2xl font-semibold mb-4">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300 mb-4">
      {description}
    </p>
    <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
      {points.map(point => <li key={point}>• {point}</li>)}
    </ul>
  </div>
);

export default function Features() {
  return (
    <section id="fonctions" className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Fonctionnalités Avancées</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            UNI-VERX intègre l'IA pour automatiser et optimiser tous les aspects de la gestion universitaire
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureData.map(feature => <FeatureCard key={feature.title} {...feature} />)}
        </div>
      </div>
    </section>
  );
}
