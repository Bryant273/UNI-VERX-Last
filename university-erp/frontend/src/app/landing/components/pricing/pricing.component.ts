import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing-pricing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="tarifs" class="py-20 bg-slate-50 dark:bg-gray-900">
      <div class="container mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold mb-4">Plans Flexibles</h2>
          <p class="text-xl text-gray-600 dark:text-gray-300">Des solutions adaptées à la taille de votre institution</p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8">
          <div *ngFor="let plan of pricingPlans" class="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 hover:border-blue-500 transition-all transform hover:-translate-y-2">
            <h3 class="text-2xl font-bold mb-2">{{plan.name}}</h3>
            <div class="mb-6">
              <span class="text-4xl font-bold text-blue-600">{{plan.price}}</span>
              <span class="text-gray-500">/an</span>
            </div>
            <p class="text-gray-600 dark:text-gray-400 mb-8">{{plan.description}}</p>
            <ul class="space-y-4 mb-8">
              <li *ngFor="let feature of plan.features" class="flex items-center text-sm">
                <i class="pi pi-check text-green-500 mr-2"></i>
                {{feature}}
              </li>
            </ul>
            <button class="w-full py-4 rounded-xl font-semibold transition-all shadow-md {{plan.main ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'}}">
              Choisir ce plan
            </button>
          </div>
        </div>
      </div>
    </section>
  `
})
export class LandingPricingComponent {
  pricingPlans = [
    {
      name: 'Standard',
      price: '5M FCFA',
      description: 'Pour les petits établissements ou facultés isolées.',
      features: ['Jusqu\'à 1,000 étudiants', 'Gestion académique de base', 'Support par email', 'Blue AI Lite'],
      main: false
    },
    {
      name: 'Premium',
      price: '15M FCFA',
      description: 'La solution complète pour les universités en croissance.',
      features: ['Étudiants illimités', 'Gestion financière avancée', 'Blue AI Enterprise', 'Support 24/7'],
      main: true
    },
    {
      name: 'Excellence',
      price: 'Sur Devis',
      description: 'Sur mesure pour les grands réseaux universitaires.',
      features: ['Multi-campus', 'Hébergement dédié', 'IA sur mesure', 'Formation sur site'],
      main: false
    }
  ];
}
