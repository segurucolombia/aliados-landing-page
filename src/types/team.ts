/**
 * Tipos de datos para miembros del equipo
 */

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  image: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    pinterest?: string;
    linkedin?: string;
  };
  bio?: string;
  email?: string;
  phone?: string;
}

export interface TeamCategory {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
}
