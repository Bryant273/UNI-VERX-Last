import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LandingHeaderComponent } from './components/header/header.component';
import { LandingHeroComponent } from './components/hero/hero.component';
import { LandingFeaturesComponent } from './components/features/features.component';
import { LandingPricingComponent } from './components/pricing/pricing.component';
import { LandingTestimonialsComponent } from './components/testimonials/testimonials.component';
import { LandingContactComponent } from './components/contact/contact.component';
import { LandingFooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LandingHeaderComponent,
    LandingHeroComponent,
    LandingFeaturesComponent,
    LandingPricingComponent,
    LandingTestimonialsComponent,
    LandingContactComponent,
    LandingFooterComponent
  ],
  template: `
    <div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors min-h-screen">
      <app-landing-header></app-landing-header>
      <main>
        <app-landing-hero></app-landing-hero>
        <app-landing-features></app-landing-features>
        <app-landing-pricing></app-landing-pricing>
        <app-landing-testimonials></app-landing-testimonials>
        <app-landing-contact></app-landing-contact>
      </main>
      <app-landing-footer></app-landing-footer>
    </div>
  `
})
export class LandingComponent {}
