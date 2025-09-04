# **Briefing do Projeto: Fotos IA para E-commerce**

Data: 03 de Setembro de 2025  
Autor: Mary (Analista de Negócios)

## **1\. Resumo Executivo**

Este projeto visa desenvolver uma aplicação web de baixo custo que utiliza inteligência artificial para gerar um conjunto completo de fotos de produtos otimizadas para e-commerce. A solução é projetada especificamente para vendedores do Mercado Livre no Brasil, permitindo que eles criem imagens de alta qualidade comercial de forma rápida e acessível, a partir de fotos simples ou de anúncios já existentes, com o objetivo de aumentar o interesse dos compradores e as taxas de conversão.

## **2\. Declaração do Problema**

Vendedores do Mercado Livre no Brasil, especialmente os de pequeno e médio porte, enfrentam um desafio significativo: a necessidade de fotos de produtos profissionais para competir e atrair clientes. A fotografia profissional tradicional é cara, demorada e logisticamente complexa. As alternativas (fotos caseiras com o celular) muitas vezes resultam em imagens de baixa qualidade que não destacam o produto, diminuem a confiança do comprador e, consequentemente, prejudicam as vendas e o ranqueamento nos anúncios.

## **3\. Solução Proposta**

Propomos uma aplicação web intuitiva que automatiza a criação de fotos de produtos. O vendedor poderá fornecer as informações do seu produto de duas maneiras: importando os dados de um anúncio já existente no Mercado Livre ou fazendo o upload de fotos básicas tiradas com o celular, juntamente com uma breve descrição. Com um único clique, nossa IA irá gerar um "Pacote de Imagens Inteligente", contendo diversos tipos de fotos (fundo branco, estilo de vida, detalhes, escala) otimizadas para a categoria específica daquele produto. O usuário poderá, então, solicitar variações e correções de forma interativa para refinar o resultado final.

## **4\. Usuários-Alvo**

O público principal são os vendedores de pequeno e médio porte que atuam na plataforma do Mercado Livre no Brasil. Este perfil de usuário geralmente possui recursos limitados (orçamento e tempo), não tem conhecimento técnico em fotografia e precisa de uma solução ágil e "faça-você-mesmo" para melhorar a apresentação de seus produtos e aumentar suas vendas.

## **5\. Objetivos e Métricas de Sucesso**

* **Objetivos de Negócio:**  
  * Converter 15% dos usuários que realizarem o teste grátis em clientes pagantes nos primeiros 3 meses.  
  * Alcançar 1.000 usuários ativos mensais até o final do primeiro semestre.  
* **Métricas de Sucesso do Usuário:**  
  * Reduzir o tempo médio para obter um conjunto de fotos de qualidade de horas/dias para menos de 10 minutos.  
  * Receber feedback positivo de que o uso das fotos geradas ajudou a aumentar a taxa de cliques e conversão dos anúncios.

## **6\. Escopo do MVP (Produto Mínimo Viável)**

### **Funcionalidades Essenciais (Inclusas no MVP):**

* **Sistema de Contas e Créditos:** Cadastro de usuário e um sistema de créditos para a geração de imagens, com um pacote de créditos iniciais gratuitos para teste.  
* **Input de Produto (Duas Vias):**  
  1. Importação de dados via URL de um anúncio existente do Mercado Livre.  
  2. Upload manual de fotos básicas e inserção de informações do produto.  
* **Geração com Um Clique:** Um botão simples "Gerar Fotos" que inicia o processo.  
* **Pacote de Imagens Inteligente:** A IA identifica a categoria do produto e gera um conjunto relevante de imagens (ex: foto de escala para decoração, foto de uso para vestuário).  
* **Refinamento Interativo:** Ferramentas simples para o usuário solicitar variações após a geração (ex: "mudar o fundo", "gerar mais opções").

### **Fora do Escopo do MVP:**

* Geração de vídeos ou modelos 3D do produto.  
* Processamento em lote para um grande volume de produtos simultaneamente.  
* Integração direta para publicar/atualizar o anúncio no Mercado Livre.  
* Ferramentas de edição avançada de imagem (retoques manuais, etc.).

## **7\. Visão Pós-MVP**

Após o lançamento e validação do MVP, a visão de longo prazo inclui a implementação de processamento em lote, a expansão para outras plataformas de e-commerce (como Shopify e Instagram Shopping), o desenvolvimento de uma API para grandes lojistas e a incorporação de funcionalidades de IA mais avançadas, como a geração de vídeos curtos do produto.

## **8\. Considerações Técnicas Iniciais**

* **Frontend:** Uma aplicação web simples e responsiva, focada na facilidade de uso.  
* **Backend:** Uma arquitetura escalável para gerenciar os trabalhos de processamento de IA, possivelmente utilizando serviços de nuvem de baixo custo.  
* **IA:** Necessidade de explorar e treinar modelos de IA (generative AI) capazes de manipular imagens de produtos com base em fotos de referência e texto.  
* **Integração:** Desenvolver um método para extrair dados de páginas de produtos do Mercado Livre.

## **9\. Restrições e Suposições**

* **Restrição:** A solução deve ter um custo operacional baixo para permitir um preço final acessível.  
* **Suposição:** Os vendedores possuem pelo menos uma foto básica e clara de seu produto para usar como base.  
* **Suposição:** A qualidade das fotos geradas será suficiente para atender às políticas e aos padrões de qualidade do Mercado Livre.

## **10\. Riscos e Questões Abertas**

* **Risco de Custo:** O custo de processamento dos modelos de IA pode ser maior do que o previsto, impactando o modelo de negócio de baixo custo.  
* **Risco de Qualidade:** A IA pode ter dificuldade em manter a consistência e fidelidade do produto original, gerando frustração para o vendedor e para o cliente final.  
* **Risco de Dependência:** A funcionalidade de importação de anúncios depende da estrutura do site do Mercado Livre, que pode mudar e quebrar a integração.

## **11\. Próximos Passos**

Este documento deve ser entregue ao **Gerente de Produto (PM)** para dar início à criação do **Documento de Requisitos do Produto (PRD)**, onde cada funcionalidade será detalhada em épicos e histórias de usuário.