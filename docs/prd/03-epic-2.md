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
