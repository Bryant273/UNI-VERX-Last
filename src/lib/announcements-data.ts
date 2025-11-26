import { Bell, Mail, MessageSquare, Tv, type LucideIcon } from 'lucide-react';

export type Channel = 'platform' | 'email' | 'sms' | 'portal';
export type Audience = 'all_students' | 'all_teachers' | 'l1_students' | 'l2_students' | 'l3_students' | 'm1_students' | 'm2_students' | 'admin_staff';
export type AnnouncementStatus = 'sent' | 'draft';

export interface Announcement {
    id: string;
    title: string;
    content: string;
    date: string | null;
    status: AnnouncementStatus;
    audience: Audience[];
    channels: Channel[];
    author: string;
}

export const announcementsData: Announcement[] = [
    {
        id: 'ann-1',
        title: "Fermeture exceptionnelle du campus",
        content: "En raison des conditions météorologiques, le campus sera fermé demain. Tous les cours sont annulés.",
        date: "27/05/2025",
        status: "sent",
        audience: ["all_students", "all_teachers", "admin_staff"],
        channels: ["platform", "email", "sms"],
        author: "Direction"
    },
    {
        id: 'ann-2',
        title: "Rappel : Inscriptions pédagogiques S2",
        content: "N'oubliez pas de finaliser vos inscriptions pédagogiques pour le second semestre avant le 30 mai.",
        date: "25/05/2025",
        status: "sent",
        audience: ["all_students"],
        channels: ["platform", "email", "portal"],
        author: "Scolarité"
    },
    {
        id: 'ann-3',
        title: "Conférence sur l'IA",
        content: "Le Prof. TURING donnera une conférence sur l'IA le 5 juin à 18h en amphi A.",
        date: "22/05/2025",
        status: "sent",
        audience: ["l3_students", "m1_students", "m2_students"],
        channels: ["platform", "email"],
        author: "M. Jean Moreau"
    },
    {
        id: 'ann-4',
        title: "Maintenance des serveurs",
        content: "Une maintenance est prévue ce week-end. L'accès à la plateforme sera perturbé.",
        date: "20/05/2025",
        status: "sent",
        audience: ["all_students", "all_teachers"],
        channels: ["platform"],
        author: "Service IT"
    },
    {
        id: 'ann-5',
        title: "Sondage satisfaction cours",
        content: "Merci de répondre au sondage de satisfaction sur les cours du S1.",
        date: null,
        status: "draft",
        audience: ["l1_students", "l2_students", "l3_students"],
        channels: ["platform"],
        author: "M. Jean Moreau"
    }
];

export const channelsConfig: Record<Channel, { label: string; icon: LucideIcon }> = {
    platform: { label: "Plateforme", icon: Bell },
    email: { label: "Email", icon: Mail },
    sms: { label: "SMS", icon: MessageSquare },
    portal: { label: "Portail", icon: Tv },
};

export const audiencesConfig: Record<Audience, { label: string }> = {
    all_students: { label: "Tous les étudiants" },
    all_teachers: { label: "Tous les professeurs" },
    admin_staff: { label: "Personnel admin." },
    l1_students: { label: "Étudiants L1" },
    l2_students: { label: "Étudiants L2" },
    l3_students: { label: "Étudiants L3" },
    m1_students: { label: "Étudiants M1" },
    m2_students: { label: "Étudiants M2" },
};
