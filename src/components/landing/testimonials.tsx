import { Star } from "lucide-react";

const testimonials = [
  {
    initials: 'MP',
    name: 'Marie Dupont',
    title: 'Directrice Administrative',
    university: 'Université de Lyon',
    quote: '"UNI-VERX a révolutionné notre gestion administrative. L\'IA nous fait gagner un temps précieux et améliore l\'expérience étudiante."',
  },
  {
    initials: 'JM',
    name: 'Jean Martin',
    title: 'Responsable IT',
    university: 'École Centrale Paris',
    quote: '"L\'interface est intuitive et les fonctionnalités d\'analyse prédictive nous aident à anticiper les besoins de nos étudiants."',
  },
  {
    initials: 'SL',
    name: 'Sarah Lefebvre',
    title: 'Secrétaire Pédagogique',
    university: 'Université de Bordeaux',
    quote: '"Fini les erreurs de planification ! UNI-VERX gère automatiquement notre emploi du temps et optimise l\'utilisation de nos salles."',
  },
];

const StarRating = () => (
  <div className="flex text-yellow-400 mt-3">
    {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
  </div>
);

export default function Testimonials() {
  return (
    <section id="temoignages" className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Ce que disent nos utilisateurs</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Plus de 200 universités nous font confiance dans le monde entier
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map(testimonial => (
            <div key={testimonial.name} className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-semibold mr-4">
                  {testimonial.initials}
                </div>
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{testimonial.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.university}</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic">
                {testimonial.quote}
              </p>
              <StarRating />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
