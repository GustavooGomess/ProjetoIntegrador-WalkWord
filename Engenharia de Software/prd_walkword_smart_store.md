# 📄 Documento de Requisitos do Produto (PRD)

## 🎯 Produto: WalkWord Smart Store
**Status:** Em Desenvolvimento  
**Versão:** 1.0  
**Contexto:** Projeto Integrador (2025/02)  

---

## 📌 1. Visão Geral e Justificativa do Problema
A indústria da moda é um dos setores que mais gera impacto ambiental e desperdício de recursos no planeta. Embora o mercado de roupas de segunda mão (seminovas) e o consumo consciente estejam em plena expansão, os e-commerces convencionais falham em oferecer uma experiência que garanta a confiança do consumidor em relação ao real estado de conservação, tamanho exato e autenticidade das peças de vestuário.

A **WalkWord Smart Store** surge como uma plataforma web de e-commerce inteligente que preenche essa lacuna através da integração de tecnologias de ponta. O produto combina um motor de recomendação personalizado baseado em Inteligência Artificial com uma interface intuitiva, filtros altamente precisos e uma infraestrutura transacional segura, promovendo a economia circular e estendendo o ciclo de vida útil de novos e seminovos.

---

## 👥 2. Público-Target (Personas)
* **Consumidores Ecodigitais:** Utilizadores que priorizam práticas de consumo sustentável, redução da pegada de carbono pessoal e procuram marcas alinhadas com a economia circular.
* **Compradores de Custo-Benefício:** Clientes que procuram vestuário de marcas consolidadas e excelente qualidade, mas com preços mais acessíveis (foco no inventário de itens seminovos).

---

## 👤 3. Histórias de Utilizador (User Stories)

| ID | Como... | Eu quero... | Para que eu possa... |
| :--- | :--- | :--- | :--- |
| **US01** | Cliente | Filtrar as peças do catálogo por estado de conservação (Novo ou Seminovos). | Encontrar rapidamente vestuário alinhado com o meu orçamento e propósito de compra. |
| **US02** | Cliente | Visualizar de forma clara a grade de tamanhos e cores disponíveis de um item. | Adicionar ao carrinho apenas variações físicas reais que estejam atualmente em stock. |
| **US03** | Utilizador | Registar e gerir múltiplos endereços associados ao meu perfil técnico. | Selecionar locais de entrega flexíveis (Ex: Casa, Trabalho) no momento do checkout. |
| **US04** | Utilizador | Visualizar uma secção de recomendações na página inicial. | Descobrir novas peças e marcas associadas ao meu comportamento prévio de navegação. |

---

## ⚙️ 4. Requisitos Funcionais (RF)

* **RF01 - Catálogo Estruturado:** O sistema deve segmentar itens por categorias, gerenciando variações de um mesmo produto base (associação direta de cor, tamanho e inventário físico individual através de SKU).
* **RF02 - Motor de Recomendação Inteligente:** A plataforma deve recolher dados de cliques e visualizações de produtos para alimentar o algoritmo de IA, exibindo produtos recomendados de forma personalizada.
* **RF03 - Checkout Completo:** O sistema deve calcular dinamicamente o valor total do pedido a partir do subtotal dos itens da variação escolhida, somando custos de frete logístico e subtraindo cupons de desconto válidos.
* **RF04 - Histórico de Transações:** O utilizador deve conseguir visualizar o estado atualizado do seu pedido (Pendente, Pago, Enviado) e o método de liquidação utilizado.

---

## 🏗️ 5. Requisitos Não Funcionais (RNF) & Arquitetura de Dados

Os requisitos não funcionais especificam os critérios de qualidade do software, conectando as regras de negócio à robustez técnica do banco de dados relacional.

* **RNF01 - Integridade Transacional (Regras de Normalização):** O banco de dados relacional deve assegurar a consistência estrita dos dados em operações de compra. Para mitigar redundâncias e anomalias de escrita, atualização ou eliminação, a modelagem segue rigorosamente os princípios até à **3ª Forma Normal (3FN)**.
  * *Mapeamento Lógico:* Os dados de precificação no momento exato do checkout devem ser persistidos na tabela pivot `itens_pedido`, de forma que reajustes futuros na tabela `produtos` não corrompam o histórico financeiro dos pedidos já consolidados.
* **RNF02 - Padronização e Performance SQL:** Toda a infraestrutura de tabelas, restrições de chaves primárias (PK) e estrangeiras (FK) deve ser implementada via scripts estruturados de Definição de Dados (**DDL**). As consultas de busca, paginação e filtros dinâmicos de catálogo (Linguagem de Consulta de Dados - **DQL**) devem utilizar índices adequados para garantir respostas abaixo de 2 segundos.
* **RNF03 - Segurança de Acesso:** As credenciais de acesso (senhas de clientes) armazenadas no banco de dados não podem constar em texto limpo; devem passar obrigatoriamente por algoritmos de hashing seguro antes da persistência.
* **RNF04 - Comunicação Protegida:** Todo o tráfego de dados entre o cliente (Frontend) e o servidor (Backend/API) deve trafegar sob o protocolo seguro **HTTPS** com criptografia ativa TLS/SSL.

---

## 📈 6. Métricas de Sucesso (KPIs)
* **Taxa de Conversão de Carrinho:** Relação entre utilizadores que adicionaram variações de produtos ao carrinho e os que concluíram o pagamento com sucesso.
* **Índice de Retenção e Reutilização:** Percentagem de vendas atribuídas especificamente à categoria de peças seminovas.
* **CTR (Click-Through Rate) da IA:** Volume de cliques convertidos a partir da vitrine dinâmica de recomendações gerada pelo algoritmo.

---

## 🚫 7. Fora de Escopo (Restrições de MVP)
Para assegurar a entrega contínua dentro do cronograma do projeto integrador, os seguintes tópicos estão explicitamente **fora do escopo atual**:
1. Construção de aplicações móveis nativas (iOS ou Android).
2. Módulo C2C (Marketplace completo onde clientes externos publicam e vendem as suas próprias peças).
3. Mecanismo de busca visual avançado (pesquisa no catálogo através do upload de imagens de referência pelo utilizador).
