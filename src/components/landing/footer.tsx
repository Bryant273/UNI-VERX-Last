import Link from 'next/link';
import { GraduationCap, Facebook, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <GraduationCap className="text-white h-6 w-6" />
              </div>
              <span className="text-2xl font-bold">UNI-VERX</span>
            </div>
            <p className="text-gray-400 mb-4">
              La solution de gestion universitaire intelligente qui révolutionne l'enseignement supérieur.
            </p>
            <p className="text-sm text-gray-500">Un produit de INNOV'KORP</p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Linkedin className="h-5 w-5" /></a>
            </div>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-6">Produit</h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Fonctionnalités</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Intégrations</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Sécurité</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-6">Support</h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Centre d'aide</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Formation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Communauté</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-6">Entreprise</h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">À propos</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Carrières</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Presse</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Partenaires</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>© 2024 UNI-VERX par INNOV'KORP. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
