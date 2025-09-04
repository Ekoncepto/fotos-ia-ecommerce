# **Documento de Arquitetura Full-Stack: Fotos IA para E-commerce**

Versão: 1.1  
Data: 03 de Setembro de 2025  
Autor: Winston (Arquiteto), Atualizado por Sarah (PO)

## **1\. Arquitetura de Alto Nível (Versão 2 \- com Netlify)**

### **Resumo Técnico**

A arquitetura do projeto será baseada no padrão **Jamstack**, utilizando uma abordagem **Serverless** para máxima escalabilidade e otimização de custos. O frontend será uma aplicação web moderna, hospedada na **Netlify**, que se comunicará diretamente com um backend-as-a-service (BaaS) fornecido pelo **Supabase**. Essa combinação nos permite desenvolver rapidamente, com custos operacionais baixos, e oferece uma excelente experiência ao desenvolvedor. A gestão do código será feita em um **monorepo**.

### **Escolha da Plataforma e Infraestrutura**

* **Plataforma:** **Netlify \+ Supabase**  
* **Justificativa:** Custo-benefício, velocidade de desenvolvimento e escalabilidade automática.  
* **Serviços Chave:** Netlify (Hospedagem), Supabase Auth, Supabase Database (PostgreSQL), Supabase Storage.

### **Estrutura do Repositório**

* **Estrutura:** **Monorepo**  
* **Ferramenta Sugerida:** **Turborepo**

### **Diagrama da Arquitetura de Alto Nível**

graph TD  
    subgraph "Usuário"  
        A\[Vendedor no Navegador\]  
    end

    subgraph "Plataforma Netlify"  
        B\[Frontend App (Next.js)\]  
    end

    subgraph "Plataforma Supabase (Backend)"  
        C\[Auth: Login com Google\]  
        D\[Database: PostgreSQL\]  
        E\[Storage: Armazenamento de Imagens\]  
    end

    subgraph "Serviço Externo de IA"  
        F\[IA: Gemini 2.5 Flash Image\]  
    end

    A \-- Interage com \--\> B  
    B \-- Autentica usando \--\> C  
    B \-- Salva/Lê dados em \--\> D  
    B \-- Envia/Recebe imagens de \--\> E  
    B \-- Envia pedido de geração para \--\> F  
    F \-- Retorna imagem gerada para \--\> B

## **2\. Stack Tecnológico**

| Categoria | Tecnologia | Versão | Propósito |
| :---- | :---- | :---- | :---- |
| **Linguagem (Frontend)** | TypeScript | 5.x | Linguagem principal do frontend. |
| **Framework (Frontend)** | Next.js | 15.x | Framework principal para a UI. |
| **UI (Estilo)** | Tailwind CSS | 4.x | Framework de CSS para estilização. |
| **UI (Componentes)** | shadcn/ui | latest | Biblioteca de componentes base. |
| **Gestão de Estado** | Zustand | 4.x | Gerenciamento de estado global. |
| **Linguagem (Backend)** | TypeScript | 5.x | Linguagem para funções serverless. |
| **Backend (BaaS)** | Supabase | latest | Plataforma de Backend como Serviço. |
| **Banco de Dados** | PostgreSQL | 16.x | Banco de dados relacional. |
| **Armazenamento** | Supabase Storage | latest | Armazenamento de ficheiros. |
| **Autenticação** | Supabase Auth | latest | Gerenciamento de login. |
| **IA (Geração de Imagem)** | Gemini 2.5 Flash Image | latest | Geração de imagens de produtos. |
| **Testes (Frontend)** | Vitest \+ RTL | latest | Testes unitários de componentes. |
| **Testes (End-to-End)** | Playwright | 1.x | Testes de fluxos do usuário. |
| **CI/CD** | Netlify | latest | Automação de build e deploy. |

## **3\. Modelos de Dados (Versão 2\)**

### **Modelo: User**

* **Interface TypeScript:**  
  interface User {  
    id: string; // UUID  
    email: string;  
    createdAt: string; // ISO 8601  
    credits: number;  
  }

### **Modelo: Product (Atualizado)**

* **Interface TypeScript:**  
  interface Product {  
    id: string; // UUID  
    userId: string; // UUID  
    name: string;  
    information: string;  
    referenceImageUrls: string\[\];  
    createdAt: string; // ISO 8601  
  }

### **Modelo: Generation**

* **Interface TypeScript:**  
  type GenerationStatus \= 'pending' | 'processing' | 'completed' | 'failed';

  interface Generation {  
    id: string; // UUID  
    userId: string; // UUID  
    productId: string; // UUID  
    status: GenerationStatus;  
    generatedImageUrls: string\[\];  
    createdAt: string; // ISO 8601  
  }

## **4\. Especificação da API**

A comunicação será feita via biblioteca supabase-js, com operações como createProduct, listProducts, createGeneration, getUserProfile, etc.

## **5\. Estrutura de Pastas do Projeto**

fotos-ia-ecommerce/  
├── apps/  
│   └── web/            \# Aplicação Frontend (Next.js)  
├── packages/  
│   ├── config/         \# Configurações compartilhadas (ESLint, TS)  
│   └── types/          \# Interfaces TypeScript compartilhadas  
├── docs/               \# Documentos de planejamento  
└── package.json        \# Configuração do Monorepo

## **6\. Estratégia de Testes**

A estratégia focará em Testes Unitários com Vitest/RTL, Testes de Integração com o Supabase e alguns Testes End-to-End críticos com Playwright para validar os fluxos principais.

## **7\. Requisitos de Segurança**

A segurança será garantida pelo Supabase Auth para autenticação, Row Level Security (RLS) para autorização e gerenciamento de segredos via variáveis de ambiente na Netlify.

## **8\. Próximos Passos**

Este documento de arquitetura está completo. O próximo passo em nosso fluxo de trabalho é a validação final de todos os artefatos de planejamento pelo Product Owner (PO).