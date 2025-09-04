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