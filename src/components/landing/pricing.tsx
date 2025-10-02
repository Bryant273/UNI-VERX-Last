import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const pricingPlans = [
  {
    name: 'Starter',
    description: 'Pour les petites écoles',
    price: '75 000 FCFA',
    period: 'par mois / jusqu\'à 500 étudiants',
    features: ['Gestion des étudiants', 'Planification de base', 'Support email', 'Stockage 10GB'],
    isPopular: false,
    buttonText: 'Commencer',
    buttonVariant: 'ghost' as const,
    badgeText: ''
  },
  {
    name: 'PREMIUM',
    description: 'Pour les universités moyennes',
    price: '250 000 FCFA',
    period: 'par mois / jusqu\'à 5000 étudiants',
    features: ['Toutes les fonctions Starter', 'Analytics IA avancées', 'Gestion financière complète', 'Support prioritaire 24/7', 'Stockage 100GB'],
    isPopular: true,
    buttonText: 'Commencer',
    buttonVariant: 'default' as const,
    badgeText: 'RECOMMANDÉ'
  },
  {
    name: 'Enterprise',
    description: 'Pour les grandes universités',
    price: 'Sur mesure',
    period: 'étudiants illimités',
    features: ['Toutes les fonctions Professional', 'Personnalisation complète', 'Intégrations sur mesure', 'Gestionnaire de compte dédié', 'Stockage illimité'],
    isPopular: false,
    buttonText: 'Nous contacter',
    buttonVariant: 'ghost' as const,
    badgeText: ''
  }
];

export default function Pricing() {
  return (
    <section id="prix" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Plans Tarifaires</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Choisissez le plan qui correspond à la taille de votre établissement
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map(plan => (
            <div key={plan.name} className={`bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all flex flex-col ${plan.isPopular ? 'border-2 border-primary relative' : ''}`}>
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
                  {plan.badgeText}
                </div>
              )}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-semibold mb-2">{plan.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{plan.description}</p>
                <div className="text-4xl font-bold text-primary mb-2">{plan.price}</div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{plan.period}</p>
              </div>
              <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map(feature => (
                  <li key={feature} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full mt-auto" variant={plan.buttonVariant === 'default' ? 'default' : 'secondary'}>{plan.buttonText}</Button>
            </div>
          ))}
        </div>
        <div className="text-center mt-12 text-sm text-gray-500 dark:text-gray-400">
          <p>Les prix sont affichés en francs CFA (FCFA).</p>
          <p>Conversion approximative : 75 000 FCFA ≈ 115 EUR / 125 USD. | 250 000 FCFA ≈ 380 EUR / 415 USD.</p>
        </div>
      </div>
    </section>
  );
}
