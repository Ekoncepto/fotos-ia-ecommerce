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

## **4\. Suposições Técnicas**

* **Estrutura do Repositório:** Monorepo.  
* **Arquitetura de Serviços:** Serverless (Sem Servidor).  
* **Requisitos de Teste:** Testes Unitários \+ Testes de Integração.

## **5\. Lista de Épicos**

1. **Épico 1: Fundação, Contas de Usuário e Geração Básica de Imagens**  
2. **Épico 2: Geração Inteligente, Validação e Refinamento Interativo**

## **6\. Épico 1: Fundação, Contas de Usuário e Geração Básica de Imagens (Versão 2 \- Focada no MVP)**

**Objetivo do Épico:** Estabelecer a infraestrutura técnica do projeto, permitir que os usuários se cadastrem com o Google e realizem o fluxo essencial de fazer o upload de um produto e gerar um pacote de duas imagens-chave (capa e uso), validando a proposta de valor central do aplicativo.

### **História 1.1: Configuração Inicial do Projeto e Infraestrutura**

**Como** desenvolvedor, **eu quero** configurar a estrutura do monorepo com os projetos de frontend, backend e a pipeline de CI/CD, **para que** tenhamos uma base sólida, automatizada e pronta para o desenvolvimento e deploy.

* **Critérios de Aceitação:**  
  1. O monorepo deve ser inicializado com a estrutura de pastas para apps (frontend/backend) e packages (código compartilhado).  
  2. O projeto frontend (aplicação web) deve ser criado e configurado.  
  3. O projeto backend (serviços serverless) deve ser criado e configurado.  
  4. Uma pipeline de CI/CD básica deve ser configurada para rodar testes e fazer deploy em um ambiente de desenvolvimento.

### **História 1.2: Autenticação de Usuários com Google (Simplificada)**

**Como** um novo vendedor, **eu quero** poder me cadastrar e fazer login de forma rápida usando minha conta do Google, **para que** eu possa acessar a plataforma com o mínimo de atrito.

* **Critérios de Aceitação:**  
  1. A página de login/cadastro deve apresentar uma opção principal: "Entrar com Google".  
  2. Clicar em "Entrar com Google" deve iniciar o fluxo de autenticação padrão do Google.  
  3. Se um usuário se autenticar pela primeira vez, uma conta deve ser criada para ele automaticamente em nosso sistema.  
  4. Após o login, o usuário deve ser redirecionado para a página principal da aplicação.

### **História 1.3: Sistema de Créditos e Teste Gratuito**

**Como** um novo usuário, **eu quero** receber um saldo inicial de créditos gratuitos ao me cadastrar, **para que** eu possa testar a funcionalidade principal do produto.

* **Critérios de Aceitação:**  
  1. Toda nova conta de usuário criada deve receber um saldo inicial de X créditos.  
  2. O usuário deve conseguir ver seu saldo de créditos atual na interface.  
  3. A geração de um pacote de imagens deve consumir um número predefinido de créditos.  
  4. Se o usuário não tiver créditos suficientes, o botão "Gerar Fotos" deve exibir uma mensagem clara informando a situação.

### **História 1.4: Interface de Envio de Produto via Upload Manual (Focada)**

**Como** um vendedor, **eu quero** uma interface clara para fazer o upload das minhas fotos de referência e inserir as informações do produto, **para que** eu possa iniciar o processo de geração de fotos.

* **Critérios de Aceitação:**  
  1. A tela principal deve guiar o usuário para o processo de upload de uma ou mais fotos de referência.  
  2. A interface deve conter campos de texto para o nome e a categoria do produto.  
  3. Um botão "Gerar Fotos" deve ficar ativo somente após o preenchimento das informações necessárias.

### **História 1.5: Geração de Pacote de Imagens Essencial (Simplificada)**

**Como** um vendedor, **eu quero**, após clicar em "Gerar Fotos", receber um pacote com as duas imagens mais importantes para o meu anúncio, **para que** eu possa atrair cliques e aumentar a confiança do comprador.

* **Critérios de Aceitação:**  
  1. Ao clicar em "Gerar Fotos", o sistema deve consumir os créditos do usuário.  
  2. O backend deve receber os dados do produto e iniciar um processo de geração de imagens.  
  3. Para o MVP, a IA gera um pacote padrão de **2 imagens**: (a) uma foto principal com fundo branco e (b) uma foto do produto em uso (estilo de vida).  
  4. Enquanto as imagens estão sendo geradas, a interface deve exibir um indicador de progresso.  
  5. As imagens finalizadas devem ser exibidas em uma galeria na tela de resultados.

## **7\. Épico 2: Geração Inteligente, Validação e Refinamento Interativo (Versão 2 \- Focada e Revisada)**

**Objetivo do Épico:** Implementar as funcionalidades avançadas de IA para o planejamento inteligente do pacote de fotos e o refinamento interativo, além de introduzir mecanismos de feedback do usuário para garantir a qualidade.

### **História 2.1: Guia de Boas Práticas para Fotos de Referência (Simplificada)**

**Como** um vendedor, **eu quero** ver dicas claras sobre como tirar uma boa foto de referência, **para que** eu possa fornecer a melhor imagem possível para a IA.

* **Critérios de Aceitação:**  
  1. Durante o processo de upload, a interface deve exibir uma lista de dicas (ex: "✅ Use boa iluminação", "✅ Mantenha a foto nítida").

### **História 2.2: Planejamento do Pacote de Imagens por IA de Raciocínio**

**Como** um vendedor, **eu quero** que a IA analise meu produto e proponha um plano de geração de imagens otimizado, **para que** eu receba um conjunto de fotos eficaz para a minha categoria.

* **Critérios de Aceitação:**  
  1. Com base nas informações do produto, um modelo de IA com capacidade de raciocínio deve criar um "plano de geração".  
  2. O plano deve definir os tipos de imagem a serem criados (ex: "Foto principal", "Foto de estilo de vida", "Foto de detalhe").  
  3. A IA de geração de imagem deve executar este plano para criar o pacote de fotos.

### **História 2.3: Refinamento Interativo via Texto com Histórico**

**Como** um vendedor, **eu quero** poder digitar pedidos de alteração em linguagem natural e receber novas versões, **para que** eu possa ajustar o resultado final.

* **Critérios de Aceitação:**  
  1. Na tela de resultados, cada imagem deve ter um campo de texto para "Solicitar Alterações", além de botões de sugestões.  
  2. O sistema de IA deve gerenciar o contexto da conversa para entender pedidos sequenciais.  
  3. O usuário tem um número limitado de refinamentos gratuitos por pacote.

### **História 2.4: Validação e Feedback do Usuário (Aprimorada)**

**Como** um vendedor, **eu quero** uma forma fácil de avaliar e descartar imagens geradas que não ficaram boas, **para que** eu tenha controle sobre a qualidade final.

* **Critérios de Aceitação:**  
  1. Cada imagem gerada terá opções de avaliação (👍 e 👎).  
  2. Se o usuário clicar em 👎, uma lista de motivos predefinidos aparecerá (ex: "O produto está distorcido", "Parece falso").  
  3. Selecionar um motivo remove a imagem e não consome os créditos de refinamento.  
  4. O feedback deve ser armazenado para análise.

## **8\. Resultados da Checklist**

*(Esta seção será preenchida pelo Product Owner na fase de validação final.)*

## **9\. Próximos Passos**

**Para a Especialista em UX:** Este PRD está completo e validado. Por favor, use este documento como base para criar a **Especificação de UI/UX (front-end-spec.md)**. Foque em traduzir os requisitos e objetivos de design em fluxos de usuário detalhados, arquitetura da informação e diretrizes visuais, conforme o nosso fluxo de trabalho.