import { Button } from "@/components/ui/button";
import { Download, Play, Users, Shield, University } from "lucide-react";

export default function Hero() {
  return (
    <section className="pt-20 pb-16 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-6 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Gestion Universitaire Intelligente
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
            Plus intelligente, plus rapide, plus facile. UNI-VERX révolutionne la gestion des établissements d'enseignement supérieur avec l'IA.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button className="bg-primary hover:bg-secondary text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg h-auto">
              <Download className="mr-2 h-5 w-5" />
              Essai Gratuit
            </Button>
            <Button variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all h-auto">
              <Play className="mr-2 h-5 w-5" />
              Voir la Démo
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4 text-primary" />
              +50,000 Étudiants
            </div>
            <div className="flex items-center">
              <University className="mr-2 h-4 w-4 text-primary" />
              +200 Universités
            </div>
            <div className="flex items-center">
              <Shield className="mr-2 h-4 w-4 text-primary" />
              100% Sécurisé
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
