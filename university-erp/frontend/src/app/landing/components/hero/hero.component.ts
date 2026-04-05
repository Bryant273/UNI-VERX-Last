import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="pt-32 pb-16 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div class="container mx-auto px-6 py-16">
        <div class="text-center max-w-4xl mx-auto">
          <h1 class="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Gestion Universitaire Intelligente
          </h1>
          <p class="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
            Plus intelligente, plus rapide, plus facile. UNI-VERX révolutionne la gestion des établissements d'enseignement supérieur avec l'IA.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center">
              <i class="pi pi-download mr-2"></i>
              Essai Gratuit
            </button>
            <button class="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all flex items-center">
              <i class="pi pi-play mr-2"></i>
              Voir la Démo
            </button>
          </div>
          <div class="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500 dark:text-gray-400">
            <div class="flex items-center">
              <i class="pi pi-users mr-2 text-blue-600"></i>
              +50,000 Étudiants
            </div>
            <div class="flex items-center">
              <i class="pi pi-building mr-2 text-blue-600"></i>
              +200 Universités
            </div>
            <div class="flex items-center">
              <i class="pi pi-shield mr-2 text-blue-600"></i>
              100% Sécurisé
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class LandingHeroComponent {}
