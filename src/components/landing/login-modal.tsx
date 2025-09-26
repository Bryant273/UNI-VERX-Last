'use client';

import { useRouter } from 'next/navigation';
import { User, KeyRound } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useLoginModal } from '@/hooks/use-login-modal';
import { useToast } from '@/hooks/use-toast';

export default function LoginModal() {
  const { isOpen, onClose } = useLoginModal();
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Connexion réussie !",
      description: "Redirection vers votre tableau de bord...",
    });
    setTimeout(() => {
      onClose();
      router.push('/student/dashboard');
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl">
        <DialogHeader className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="text-white h-8 w-8" />
          </div>
          <DialogTitle className="text-2xl font-bold mb-2">Connexion</DialogTitle>
          <DialogDescription>
            Accédez à votre espace UNI-VERX
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email-login">Email</Label>
            <Input id="email-login" type="email" placeholder="votre@email.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password-login">Mot de passe</Label>
            <Input id="password-login" type="password" placeholder="••••••••" />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember-me" />
              <Label htmlFor="remember-me" className="text-sm font-normal text-gray-600 dark:text-gray-300">Se souvenir de moi</Label>
            </div>
            <a href="#" className="text-sm text-primary hover:underline">Mot de passe oublié ?</a>
          </div>
          <Button type="submit" className="w-full bg-primary hover:bg-secondary text-white py-3 rounded-lg font-semibold transition-colors">
            Se connecter
          </Button>
          <div className="text-center text-sm text-gray-600 dark:text-gray-300">
            Pas encore de compte ? 
            <a href="#" className="text-primary hover:underline ml-1">Créer un compte</a>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
