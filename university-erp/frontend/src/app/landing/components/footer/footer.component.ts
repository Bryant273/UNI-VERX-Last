import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="bg-gray-900 text-white py-12 border-t border-gray-800">
      <div class="container mx-auto px-6">
        <div class="grid md:grid-cols-4 gap-12 mb-12">
          <div class="col-span-2">
             <div class="flex items-center gap-2 mb-6">
              <div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <span class="text-white font-bold text-xl">U</span>
              </div>
              <span class="text-2xl font-bold">UNI-VERX</span>
            </div>
            <p class="text-gray-400 max-w-sm">
              La plateforme ERP intelligente dédiée à l'excellence académique en Afrique et au-delà. Propulsé par Blue AI.
            </p>
          </div>
          
          <div>
            <h4 class="text-lg font-bold mb-6">Liens Rapides</h4>
            <ul class="space-y-4 text-gray-400">
              <li><a href="#fonctions" class="hover:text-blue-500 transition-colors">Fonctionnalités</a></li>
              <li><a href="#tarifs" class="hover:text-blue-500 transition-colors">Tarifs</a></li>
              <li><a href="#temoignages" class="hover:text-blue-500 transition-colors">Témoignages</a></li>
            </ul>
          </div>
          
          <div>
            <h4 class="text-lg font-bold mb-6">Légal</h4>
            <ul class="space-y-4 text-gray-400">
              <li><a href="#" class="hover:text-blue-500 transition-colors">Mentions Légales</a></li>
              <li><a href="#" class="hover:text-blue-500 transition-colors">Politique RGPD</a></li>
              <li><a href="#" class="hover:text-blue-500 transition-colors">Conditions Générales</a></li>
            </ul>
          </div>
        </div>
        
        <div class="pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          &copy; 2025 UNI-VERX ERP. Tous droits réservés.
        </div>
      </div>
    </footer>
  `
})
export class LandingFooterComponent {}
