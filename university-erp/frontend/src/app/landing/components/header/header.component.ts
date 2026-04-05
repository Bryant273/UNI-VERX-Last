import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
      <nav class="container mx-auto px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <span class="text-white font-bold text-xl">U</span>
          </div>
          <span class="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            UNI-VERX
          </span>
        </div>
        
        <div class="hidden md:flex items-center gap-8">
          <a href="#fonctions" class="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">Fonctionnalités</a>
          <a href="#tarifs" class="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">Tarifs</a>
          <a href="#temoignages" class="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">Témoignages</a>
          <a routerLink="/login" class="bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary transition-all shadow-md">
            Connexion
          </a>
        </div>
      </nav>
    </header>
  `
})
export class LandingHeaderComponent {}
