import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing-features',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="fonctions" class="py-20 bg-white dark:bg-gray-800">
      <div class="container mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold mb-4">Fonctionnalités Avancées</h2>
          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            UNI-VERX intègre l'IA pour automatiser et optimiser tous les aspects de la gestion universitaire
          </p>
        </div>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div *ngFor="let feature of features" class="{{feature.bgClass}} p-8 rounded-2xl hover:shadow-xl transition-all hover:-translate-y-2">
            <div class="w-16 h-16 {{feature.iconBgClass}} rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <i class="pi {{feature.icon}} text-white text-2xl"></i>
            </div>
            <h3 class="text-2xl font-semibold mb-4">{{feature.title}}</h3>
            <p class="text-gray-600 dark:text-gray-300 mb-6">
              {{feature.description}}
            </p>
            <ul class="text-sm text-gray-500 dark:text-gray-400 space-y-3">
              <li *ngFor="let point of feature.points" class="flex items-center">
                <i class="pi pi-check-circle text-blue-500 mr-2"></i>
                {{point}}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  `
})
export class LandingFeaturesComponent {
  features = [
    {
      icon: 'pi-user',
      title: 'Gestion des Étudiants',
      description: "Inscription automatisée, suivi des notes, gestion des absences et génération de relevés personnalisés avec l'IA.",
      points: ["Inscription en ligne intelligente", "Suivi automatique des performances", "Alertes prédictives d'échec"],
      bgClass: "bg-blue-50/50 dark:bg-gray-700/30",
      iconBgClass: "bg-blue-600",
    },
    {
      icon: 'pi-book',
      title: 'Gestion Académique',
      description: "Planification des cours, attribution des salles, gestion des examens et évaluation automatisée.",
      points: ["Planification automatique des cours", "Attribution optimale des ressources", "Correction automatique d'examens"],
      bgClass: "bg-purple-50/50 dark:bg-gray-700/30",
      iconBgClass: "bg-purple-600",
    },
    {
      icon: 'pi-chart-line',
      title: 'Analytics IA',
      description: "Tableaux de bord intelligents, prédictions de performance et recommandations personnalisées.",
      points: ["Analyses prédictives avancées", "Recommandations personnalisées", "Rapports automatisés"],
      bgClass: "bg-green-50/50 dark:bg-gray-700/30",
      iconBgClass: "bg-green-600",
    },
    {
      icon: 'pi-money-bill',
      title: 'Gestion Financière',
      description: "Facturation automatique, suivi des paiements, bourses et aide financière intelligente.",
      points: ["Facturation automatisée", "Gestion des bourses IA", "Prévisions budgétaires"],
      bgClass: "bg-orange-50/50 dark:bg-gray-700/30",
      iconBgClass: "bg-orange-500",
    },
    {
      icon: 'pi-comments',
      title: 'Communication',
      description: "Messagerie intégrée, notifications intelligentes et communication parent-université.",
      points: ["Notifications intelligentes", "Chat multicanal intégré", "Portail parents connecté"],
      bgClass: "bg-pink-50/50 dark:bg-gray-700/30",
      iconBgClass: "bg-pink-500",
    },
    {
      icon: 'pi-cloud',
      title: 'Cloud & Sécurité',
      description: "Stockage cloud sécurisé, sauvegardes automatiques et conformité RGPD complète.",
      points: ["Chiffrement bout en bout", "Sauvegardes automatiques", "Conformité RGPD garantie"],
      bgClass: "bg-indigo-50/50 dark:bg-gray-700/30",
      iconBgClass: "bg-indigo-500",
    },
  ];
}
