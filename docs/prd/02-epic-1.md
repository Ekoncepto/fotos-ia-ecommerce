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

### **História 1.3.1: Sistema de Créditos e Teste Gratuito**

**Como** um novo usuário, **eu quero** receber um saldo inicial de créditos gratuitos ao me cadastrar, **para que** eu possa testar a funcionalidade principal do produto.

* **Critérios de Aceitação:**
  1. Toda nova conta de usuário criada deve receber um saldo inicial de X créditos.
  2. O usuário deve conseguir ver seu saldo de créditos atual na interface.
  3. A geração de um pacote de imagens deve consumir um número predefinido de créditos.
  4. Se o usuário não tiver créditos suficientes, o botão "Gerar Fotos" deve exibir uma mensagem clara informando a situação.

### **História 1.3.2: Interface de Envio de Produto via Upload Manual (Focada)**

**Como** um vendedor, **eu quero** uma interface clara para fazer o upload das minhas fotos de referência e inserir as informações do produto, **para que** eu possa iniciar o processo de geração de fotos.

* **Critérios de Aceitação:**
  1. A tela principal deve guiar o usuário para o processo de upload de uma ou mais fotos de referência.
  2. A interface deve conter campos de texto para o nome e a categoria do produto.
  3. Um botão "Gerar Fotos" deve ficar ativo somente após o preenchimento das informações necessárias.

### **História 1.4: Geração de Pacote de Imagens Essencial (Simplificada)**

**Como** um vendedor, **eu quero**, após clicar em "Gerar Fotos", receber um pacote com as duas imagens mais importantes para o meu anúncio, **para que** eu possa atrair cliques e aumentar a confiança do comprador.

* **Critérios de Aceitação:**
  1. Ao clicar em "Gerar Fotos", o sistema deve consumir os créditos do usuário.
  2. O backend deve receber os dados do produto e iniciar um processo de geração de imagens.
  3. Para o MVP, a IA gera um pacote padrão de **2 imagens**: (a) uma foto principal com fundo branco e (b) uma foto do produto em uso (estilo de vida).
  4. Enquanto as imagens estão sendo geradas, a interface deve exibir um indicador de progresso.
  5. As imagens finalizadas devem ser exibidas em uma galeria na tela de resultados.
