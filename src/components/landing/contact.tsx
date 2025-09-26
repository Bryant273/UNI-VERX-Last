'use client';
import { Phone, Mail, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const contactInfo = [
  {
    icon: <Phone className="text-white" />,
    iconBg: 'bg-primary',
    title: 'Téléphone',
    line1: '+33 1 23 45 67 89',
    line2: 'Lun-Ven 9h-18h',
  },
  {
    icon: <Mail className="text-white" />,
    iconBg: 'bg-secondary',
    title: 'Email',
    line1: 'contact@uni-verx.com',
    line2: 'Réponse sous 24h',
  },
  {
    icon: <MapPin className="text-white" />,
    iconBg: 'bg-accent',
    title: 'Adresse',
    line1: '123 Avenue de l\'Innovation',
    line2: '75001 Paris, France',
  },
];

export default function Contact() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Message envoyé !",
      description: "Votre message a été envoyé avec succès. Nous vous recontacterons bientôt.",
    });
    const form = e.target as HTMLFormElement;
    form.reset();
  };

  return (
    <section id="contact" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Contactez-nous</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Notre équipe est là pour vous accompagner dans votre transformation digitale
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div>
            <h3 className="text-2xl font-semibold mb-6">Parlons de votre projet</h3>
            <div className="space-y-6">
              {contactInfo.map(info => (
                <div key={info.title} className="flex items-start">
                  <div className={`w-12 h-12 ${info.iconBg} rounded-lg flex items-center justify-center mr-4 flex-shrink-0`}>
                    {info.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{info.title}</h4>
                    <p className="text-gray-600 dark:text-gray-300">{info.line1}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{info.line2}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input id="firstName" placeholder="Jean" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input id="lastName" placeholder="Dupont" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="jean.dupont@email.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="establishment">Établissement</Label>
                <Input id="establishment" placeholder="Université de Paris" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Votre message..." />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-secondary text-white py-3 px-6 rounded-lg font-semibold transition-colors">
                Envoyer le message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
