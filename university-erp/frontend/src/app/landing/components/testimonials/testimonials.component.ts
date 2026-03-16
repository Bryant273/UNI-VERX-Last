import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing-testimonials',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="temoignages" class="py-20 bg-white dark:bg-gray-800">
      <div class="container mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold mb-4">Ils nous font confiance</h2>
          <p class="text-xl text-gray-600 dark:text-gray-300">Rejoignez les institutions qui transforment l'éducation avec UNI-VERX</p>
        </div>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div *ngFor="let testimonial of testimonials" class="bg-blue-50/50 dark:bg-gray-700/30 p-8 rounded-2xl relative">
            <i class="pi pi-quote-right absolute top-4 right-8 text-4xl text-blue-200 dark:text-gray-600"></i>
            <p class="text-gray-600 dark:text-gray-300 mb-8 italic">
              "{{testimonial.quote}}"
            </p>
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {{testimonial.initials}}
              </div>
              <div>
                <h4 class="font-bold">{{testimonial.author}}</h4>
                <p class="text-sm text-gray-500">{{testimonial.role}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class LandingTestimonialsComponent {
  testimonials = [
    {
      quote: "UNI-VERX a simplifié nos processus d'inscription de plus de 60%. L'IA nous aide vraiment à anticiper les besoins des étudiants.",
      author: "Dr. Amadou Diallo",
      role: "Recteur, Université de Dakar",
      initials: "AD"
    },
    {
      quote: "Une interface intuitive et performante. Les professeurs adorent la facilité de saisie des notes et le suivi des absences.",
      author: "Mme Sophie Ndiaye",
      role: "Chef de Département Informatique",
      initials: "SN"
    },
    {
      quote: "Le support technique est exceptionnel et la plateforme est d'une stabilité remarquable malgré le nombre d'utilisateurs.",
      author: "M. Bakary Coulibaly",
      role: "Responsable IT, USSEIN",
      initials: "BC"
    }
  ];
}
