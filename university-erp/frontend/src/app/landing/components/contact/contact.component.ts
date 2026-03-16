import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing-contact',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="contact" class="py-20 bg-slate-50 dark:bg-gray-900">
      <div class="container mx-auto px-6">
        <div class="flex flex-col lg:flex-row gap-12">
          <div class="lg:w-1/2">
            <h2 class="text-4xl font-bold mb-6 italic">Prêt à moderniser votre université ?</h2>
            <p class="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Contactez-nous pour une démonstration personnalisée ou pour discuter de vos besoins spécifiques.
            </p>
            <div class="space-y-6">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-blue-600/10 rounded-full flex items-center justify-center text-blue-600">
                  <i class="pi pi-envelope text-xl"></i>
                </div>
                <span>contact&#64;uni-verx.com</span>
              </div>
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-blue-600/10 rounded-full flex items-center justify-center text-blue-600">
                  <i class="pi pi-phone text-xl"></i>
                </div>
                <span>+221 33 800 00 00</span>
              </div>
            </div>
          </div>
          
          <div class="lg:w-1/2 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
            <form class="space-y-6">
              <div class="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Prénom" class="p-4 bg-gray-100 dark:bg-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
                <input type="text" placeholder="Nom" class="p-4 bg-gray-100 dark:bg-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              <input type="email" placeholder="Email institutionnel" class="w-full p-4 bg-gray-100 dark:bg-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
              <select class="w-full p-4 bg-gray-100 dark:bg-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Type d'institution</option>
                <option value="public">Université Publique</option>
                <option value="private">Université Privée</option>
                <option value="school">Grande École</option>
              </select>
              <textarea placeholder="Votre message" rows="4" class="w-full p-4 bg-gray-100 dark:bg-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
              <button class="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold transition-all shadow-lg">
                Envoyer ma demande
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  `
})
export class LandingContactComponent {}
