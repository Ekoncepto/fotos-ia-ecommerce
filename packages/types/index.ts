// packages/types/index.ts

export interface User {
  id: string; // UUID
  email: string;
  createdAt: string; // ISO 8601
  credits: number;
}

export type GenerationStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Product {
  id: string; // UUID
  userId: string; // UUID
  name: string;
  information: string;
  referenceImageUrls: string[];
  createdAt: string; // ISO 8601
}

export interface Generation {
  id: string; // UUID
  userId: string; // UUID
  productId: string; // UUID
  status: GenerationStatus;
  generatedImageUrls: string[];
  createdAt: string; // ISO 8601
}
