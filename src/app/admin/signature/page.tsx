
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, UploadCloud } from 'lucide-react';

export default function SignaturePage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestion de la Signature Électronique</CardTitle>
          <CardDescription>
            Enregistrez ou mettez à jour votre signature numérisée pour l'apposer sur les documents officiels.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Signature Actuelle</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-8 bg-muted/50 rounded-lg">
            <div className="text-center text-muted-foreground">
              <Pencil className="mx-auto h-16 w-16" />
              <p className="mt-4 font-semibold">Aucune signature enregistrée</p>
              <p className="text-sm">Veuillez téléverser une image de votre signature.</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Mettre à jour la Signature</CardTitle>
            <CardDescription>Le fichier doit être au format PNG avec un fond transparent.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="p-10 text-center border-2 border-dashed rounded-lg cursor-pointer hover:border-primary">
                <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-sm text-muted-foreground">Cliquez ou glissez-déposez pour téléverser</p>
                <input id="signature-upload" type="file" className="hidden" accept="image/png" />
             </div>
             <Button className="w-full">Enregistrer la nouvelle signature</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
