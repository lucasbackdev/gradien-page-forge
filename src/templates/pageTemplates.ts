import { PresellData, defaultPresellData } from '@/types/presell';
import { PresellSection, SectionElement } from '@/types/sections';

export interface PageTemplate {
  id: string;
  name: string;
  description: string;
  level: 'simples' | 'intermediário' | 'avançado';
  preview: string;
  data: PresellData;
  // Admin-only templates can be created by admin
  isPublic?: boolean;
  createdBy?: string;
}

// Helper to generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Empty templates array - admin will add templates via the UI
export const pageTemplates: PageTemplate[] = [];
