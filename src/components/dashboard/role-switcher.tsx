'use client';

import { useRouter } from 'next/navigation';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const roles = [
  { value: 'student', label: 'Vue Étudiant' },
  { value: 'professor', label: 'Vue Professeur' },
  { value: 'admin', label: 'Vue Admin' },
];

export default function RoleSwitcher({ currentRole }: { currentRole: string }) {
  const router = useRouter();

  const handleRoleChange = (newRole: string) => {
    router.push(`/${newRole}/dashboard`);
  };

  return (
    <Select value={currentRole} onValueChange={handleRoleChange}>
      <SelectTrigger className="w-[180px] bg-transparent border-0 shadow-none">
        <SelectValue placeholder="Sélectionner un rôle" />
      </SelectTrigger>
      <SelectContent>
        {roles.map((role) => (
          <SelectItem key={role.value} value={role.value}>
            {role.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
