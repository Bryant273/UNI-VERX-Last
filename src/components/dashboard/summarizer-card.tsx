'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { BrainCircuit } from 'lucide-react';

import { getSummary } from '@/app/actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Summarizing...' : 'Summarize'}
    </Button>
  );
}

export default function SummarizerCard() {
  const initialState = {
    summary: '',
    error: '',
  };
  const [state, formAction] = useFormState(getSummary, initialState);

  return (
    <Card>
      <form action={formAction}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
                <CardTitle>AI Material Summarizer</CardTitle>
                <CardDescription>
                    Paste course material below for a quick summary.
                </CardDescription>
            </div>
            <BrainCircuit className="h-6 w-6 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            name="courseMaterial"
            placeholder="Enter course material here..."
            className="min-h-[150px] resize-y"
            required
          />
          {state?.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}
          {state?.summary && (
            <Alert>
              <AlertTitle>Summary</AlertTitle>
              <AlertDescription className="prose prose-sm dark:prose-invert">
                {state.summary}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
}
