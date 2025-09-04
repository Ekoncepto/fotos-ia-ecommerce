# **Documento de Requisitos do Produto (PRD): Fotos IA para E-commerce**

Versão: 1.0
Data: 03 de Setembro de 2025
Autor: John (PM)

## **1\. Metas e Contexto**

### **Metas**

* Reduzir o tempo médio para obter um conjunto de fotos de qualidade de horas/dias para menos de 10 minutos.
* Aumentar a taxa de cliques e a conversão dos anúncios dos vendedores.
* Converter 15% dos usuários do teste grátis em clientes pagantes nos primeiros 3 meses.
* Alcançar 1.000 usuários ativos mensais até o final do primeiro semestre.

### **Contexto**

Vendedores do Mercado Livre no Brasil, especialmente os de pequeno e médio porte, necessitam de fotos de produtos com qualidade profissional para serem competitivos, mas enfrentam barreiras de custo e complexidade técnica. As soluções atuais, como fotografia profissional, são caras, e as alternativas caseiras muitas vezes produzem resultados de baixa qualidade que prejudicam as vendas. Esta aplicação visa resolver esse problema, fornecendo uma ferramenta de IA acessível e rápida para gerar um conjunto completo de imagens otimizadas para e-commerce.

### **Registo de Alterações**

| Data | Versão | Descrição | Autor |
| :---- | :---- | :---- | :---- |
| 03 de Setembro, 2025 | 1.0 | Versão inicial completa do documento | John (PM) |

## **2\. Requisitos (Versão 2 \- Revisada com Análise de Risco)**

### **Funcionais**

1. **FR1:** O sistema deve permitir que novos usuários se cadastrem e façam login na plataforma.
2. **FR2:** O sistema deve implementar um mecanismo de créditos, onde a geração de imagens consome um número definido de créditos da conta do usuário.
3. **FR3:** Novos usuários devem receber um saldo inicial de créditos gratuitos ao se cadastrarem.
4. **FR4:** Os usuários devem poder fornecer as informações de um produto fazendo o upload de fotos de referência e inserindo informações básicas manualmente (este é o método alternativo caso a importação falhe ou não seja desejada).
5. **FR5:** Antes de iniciar a geração, o sistema deve exibir uma lista de dicas para uma boa foto de referência.
6. **FR6:** A interface deve apresentar uma ação principal clara (ex: botão "Gerar Fotos") para iniciar o processo.
7. **FR7:** Antes da geração final, a IA deve executar uma etapa de "planejamento", analisando a categoria e as informações do produto para definir o conjunto ideal de tipos de imagem a serem criados.
8. **FR8:** O sistema deve gerar o "pacote" de imagens planejado.
9. **FR9:** Após a geração, o usuário pode solicitar um número limitado de refinamentos ou variações por pacote gerado (ex: até 3 refinamentos gratuitos). Refinamentos adicionais consumirão mais créditos.
10. **FR10:** O usuário deve poder visualizar seu saldo de créditos a qualquer momento.

### **Não Funcionais**

1. **NFR1:** A aplicação web deve ser responsiva.
2. **NFR2:** A interface do usuário deve ser altamente intuitiva.
3. **NFR3:** A arquitetura do sistema deve ser otimizada para um baixo custo operacional.
4. **NFR4:** O sistema deve ser escalável.
5. **NFR5:** As imagens geradas devem ser compatíveis com as políticas de imagem do Mercado Livre.
6. **NFR6:** O tempo médio de geração para um pacote de imagens não deve exceder 5 minutos.
7. **NFR7:** O sistema deve incluir um mecanismo para o usuário avaliar e reportar imagens de baixa qualidade, e esse feedback deve ser usado para melhorar o sistema.

## **3\. Objetivos de Design da Interface do Usuário (Versão 2\)**

### **Visão Geral da UX**

A experiência do usuário será extremamente simples e focada. O objetivo é que um vendedor possa gerar um conjunto de fotos de alta qualidade com o mínimo de cliques. A interface deve ser limpa, moderna e inspirar confiança.

### **Principais Paradigmas de Interação**

* **Fluxo Linear Guiado:** O usuário será guiado passo a passo (Passo 1: Enviar Produto, Passo 2: Gerar, Passo 3: Refinar).
* **Feedback Visual Constante:** O sistema deve sempre informar ao usuário o que está acontecendo de forma clara.

### **Telas/Visualizações Principais**

* **Tela de Envio de Produto:** Uma tela única para o usuário fazer o upload de suas fotos e preencher um formulário simples.
* **Tela de Geração e Resultados:** Uma área onde o progresso da geração é exibido e os resultados aparecem em uma galeria.
* **Tela de Refinamento:** Uma visualização interativa onde o usuário poderá digitar pedidos de alteração em um **campo de texto** (ex: "mude o fundo para uma mesa de madeira"). O sistema também oferecerá **sugestões predefinidas** (como botões de "Mudar fundo", "Mais ângulos").

### **Acessibilidade**

* **Padrão:** WCAG AA.

### **Branding**

* **Estilo:** O design será inspirado na estética do site ekoncepto.com, projetando uma imagem profissional, moderna e tecnológica.
* **Tema:** Utilizaremos um **tema escuro (dark mode)** como padrão.
* **Cores:** A paleta de cores será minimalista, focada em um fundo escuro, texto branco e uma **cor de destaque vibrante** (como um verde-ciano).
* **Elementos:** A interface usará tipografia limpa, espaçamento generoso e elementos com cantos retos ou levemente arredondados.

### **Dispositivos e Plataformas Alvo**

* **Plataforma:** Web Responsiva.

## **5\. Lista de Épicos**

1. **Épico 1: Fundação, Contas de Usuário e Geração Básica de Imagens**
2. **Épico 2: Geração Inteligente, Validação e Refinamento Interativo**

## **8\. Resultados da Checklist**

*(Esta seção será preenchida pelo Product Owner na fase de validação final.)*

## **9\. Próximos Passos**

**Para a Especialista em UX:** Este PRD está completo e validado. Por favor, use este documento como base para criar a **Especificação de UI/UX (front-end-spec.md)**. Foque em traduzir os requisitos e objetivos de design em fluxos de usuário detalhados, arquitetura da informação e diretrizes visuais, conforme o nosso fluxo de trabalho.
