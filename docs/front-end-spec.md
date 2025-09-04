# **Especificação de UI/UX: Fotos IA para E-commerce**

Versão: 1.0  
Data: 03 de Setembro de 2025  
Autor: Sally (UX Expert)

## **1\. Introdução**

Este documento define os objetivos da experiência do usuário, a arquitetura da informação, os fluxos de usuário e as especificações de design visual para a interface da aplicação "Fotos IA para E-commerce". Ele serve como a fundação para o design visual e o desenvolvimento frontend, garantindo uma experiência coesa e centrada no usuário.

## **2\. Arquitetura da Informação (Versão 2\)**

#### **Mapa do Site / Inventário de Telas**

graph TD  
    A\[Página Inicial / Login\] \--\>|Usuário faz login com Google| B(Tela Principal da Aplicação);  
    B \--\>|Usuário clica em 'Gerar'| C{Gerando Imagens...};  
    C \--\>|Geração concluída| D\[Galeria de Resultados / Refinamento\];  
    D \--\>|Usuário solicita alteração| C;  
    D \--\>|Usuário baixa as imagens| B;

    B \--\>|Usuário clica em 'Comprar Créditos'| E\[Planos / Comprar Créditos\];  
    E \--\>|Compra bem-sucedida| B;

    subgraph "Fluxo Principal do Usuário"  
        B  
        C  
        D  
    end  
      
    subgraph "Fluxo de Monetização"  
        E  
    end

## **3\. Fluxos de Usuário**

#### **3.1. Fluxo Principal: Geração de Imagens**

sequenceDiagram  
    participant Vendedor  
    participant Frontend  
    participant Backend

    Vendedor-\>\>Frontend: Acessa a Tela Principal  
    Vendedor-\>\>Frontend: Preenche informações do produto (upload/texto)  
    Vendedor-\>\>Frontend: Clica em "Gerar Fotos"  
    Frontend-\>\>Backend: Envia dados do produto para geração  
    activate Backend  
    Backend--\>\>Frontend: Confirma início e consome créditos  
    deactivate Backend  
    Frontend-\>\>Vendedor: Exibe indicador de progresso  
      
    loop Geração e Validação  
        Backend-\>\>Backend: IA planeja e gera imagens  
        Backend-\>\>Backend: Valida qualidade da imagem  
    end

    activate Backend  
    Backend--\>\>Frontend: Envia o pacote de imagens geradas  
    deactivate Backend  
    Frontend-\>\>Vendedor: Exibe a galeria com os resultados  
      
    Vendedor-\>\>Frontend: Solicita um refinamento (via texto)  
    Frontend-\>\>Backend: Envia pedido de refinamento  
    activate Backend  
    Backend--\>\>Frontend: Envia nova versão da imagem  
    deactivate Backend  
    Frontend-\>\>Vendedor: Atualiza a imagem na galeria  
    Vendedor-\>\>Frontend: Clica em "Baixar Imagens"

#### **3.2. Fluxo de Monetização: Comprar Créditos**

sequenceDiagram  
    participant Vendedor  
    participant Frontend  
    participant Gateway de Pagamento  
    participant Backend

    Vendedor-\>\>Frontend: Clica em "Comprar Créditos"  
    Frontend-\>\>Vendedor: Exibe a tela de Planos/Assinaturas  
    Vendedor-\>\>Frontend: Seleciona um pacote de créditos  
    Frontend-\>\>Gateway de Pagamento: Inicia o processo de checkout  
    activate Gateway de Pagamento  
    Vendedor-\>\>Gateway de Pagamento: Insere informações de pagamento  
    Gateway de Pagamento--\>\>Backend: Envia notificação de pagamento bem-sucedido  
    deactivate Gateway de Pagamento  
    activate Backend  
    Backend-\>\>Backend: Atualiza o saldo de créditos do usuário  
    Backend--\>\>Frontend: Confirma a atualização do saldo  
    deactivate Backend  
    Frontend-\>\>Vendedor: Exibe mensagem de sucesso e novo saldo

#### **3.3. Fluxo de Autenticação: Login**

sequenceDiagram  
    participant Vendedor  
    participant Frontend  
    participant Google Auth  
    participant Backend

    Vendedor-\>\>Frontend: Acessa a Página Inicial  
    Vendedor-\>\>Frontend: Clica em "Entrar com Google"  
    Frontend-\>\>Google Auth: Redireciona para a tela de autenticação do Google  
    activate Google Auth  
    Vendedor-\>\>Google Auth: Autoriza o acesso  
    Google Auth--\>\>Frontend: Retorna com um token de autenticação  
    deactivate Google Auth  
    Frontend-\>\>Backend: Envia o token do Google para validação  
    activate Backend  
    Backend-\>\>Backend: Valida o token e cria/encontra o usuário  
    Backend--\>\>Frontend: Retorna um token de sessão da nossa aplicação  
    deactivate Backend  
    Frontend-\>\>Vendedor: Redireciona para a Tela Principal (autenticado)

## **4\. Guia de Estilo Visual e Branding (Versão 2 \- Verificada)**

* **Referência Principal:** O design será inspirado na estética limpa, moderna e tecnológica do site ekoncepto.com.  
* **Tema:** A aplicação usará um **tema escuro (dark mode)** como padrão.  
* Paleta de Cores:  
  | Tipo de Cor | Código Hex | Uso |  
  | :--- | :--- | :--- |  
  | Fundo Principal | \#121212 | Fundo principal da aplicação. |  
  | Fundo Secundário | \#1E1E1E | Fundo para painéis, modais, etc. |  
  | Destaque | \#00F0B5 | Botões principais e links. |  
  | Texto Principal | \#FFFFFF | Títulos e texto principal. |  
  | Texto Secundário | \#AAAAAA | Texto de apoio e placeholders. |  
  | Sucesso | \#10B981 | Notificações de sucesso. |  
  | Erro | \#EF4444 | Mensagens de erro. |  
  | Bordas | \#2A2A2A | Divisores e bordas. |  
* **Tipografia:**  
  * **Fonte Principal:** Poppins  
  * **Escala:** H1 (36px), H2 (24px), H3 (20px), Corpo (16px), Pequeno (14px).  
* **Iconografia:** Lucide Icons.  
* **Espaçamento:** Baseado em múltiplos de 4px.

## **5\. Requisitos de Acessibilidade, Responsividade e Performance**

* **Acessibilidade:** Conformidade com **WCAG 2.1 nível AA**.  
* **Responsividade:** Abordagem **Mobile-First** com pontos de interrupção para Mobile (320px+), Tablet (768px+) e Desktop (1024px+).  
* **Performance:** Tempo de carregamento inicial **inferior a 3 segundos** e responsividade de interação **inferior a 100ms**.