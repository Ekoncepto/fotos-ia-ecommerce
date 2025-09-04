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