# Levantamento de Requisitos do Banco de Dados

## Loja Virtual de Roupas e Calçados

---

## 1. Objetivo

O objetivo deste levantamento de requisitos é identificar, de forma clara e organizada, quais informações precisam ser armazenadas no banco de dados de uma loja virtual de roupas e calçados.

O sistema tem como finalidade permitir o cadastro de produtos, controle de estoque, cadastro de clientes, registro de pedidos, itens comprados, endereços de entrega e informações de pagamento.

A partir desses requisitos, foram definidas as entidades, atributos e relacionamentos necessários para a construção do banco de dados relacional.

---

## 2. Descrição do Problema

A loja virtual precisa vender roupas e calçados por meio de um site. Para isso, o sistema deve armazenar os dados dos produtos disponíveis, suas categorias, tamanhos, cores e quantidades em estoque.

Além disso, o sistema deve permitir o cadastro de clientes, seus endereços de entrega, os pedidos realizados, os produtos incluídos em cada pedido e as informações de pagamento.

Como os dados possuem forte relacionamento entre si, foi escolhido o uso de um banco de dados relacional.

Exemplo:

- Um cliente pode realizar vários pedidos;
- Um pedido pode conter vários produtos;
- Um produto pode possuir diferentes tamanhos e cores;
- Cada produto pertence a uma categoria;
- Cada pagamento pertence a um pedido.

---

## 3. Requisitos de Informação

O banco de dados deve armazenar informações sobre:

- clientes cadastrados;
- endereços dos clientes;
- categorias de produtos;
- produtos da loja;
- tamanhos disponíveis;
- variações dos produtos;
- estoque por tamanho e cor;
- pedidos realizados;
- itens de cada pedido;
- pagamentos dos pedidos.

Essas informações são necessárias para garantir o funcionamento correto da loja virtual.

---

## 4. Entidades Identificadas

A partir da análise do problema, foram identificadas as seguintes entidades principais:

| Entidade | Descrição |
|---|---|
| Cliente | Representa os usuários cadastrados na loja |
| Endereço | Representa os endereços de entrega dos clientes |
| Categoria | Representa os tipos de produtos vendidos |
| Produto | Representa os itens disponíveis para venda |
| Tamanho | Representa os tamanhos de roupas e calçados |
| Variação_Produto | Representa a combinação de produto, tamanho, cor e estoque |
| Pedido | Representa uma compra realizada por um cliente |
| Item_Pedido | Representa cada produto incluído em um pedido |
| Pagamento | Representa o pagamento relacionado a um pedido |

---

## 5. Atributos das Entidades

### 5.1 Cliente

A entidade `Cliente` deve armazenar os dados dos usuários cadastrados no sistema.

| Atributo | Descrição |
|---|---|
| id_cliente | Identificador único do cliente |
| nome | Nome completo do cliente |
| email | E-mail utilizado para login e contato |
| senha | Senha do cliente |
| cpf | CPF do cliente |
| telefone | Telefone para contato |
| data_nascimento | Data de nascimento do cliente |
| ativo | Indica se o cliente está ativo |
| data_cadastro | Data em que o cliente foi cadastrado |

---

### 5.2 Endereço

A entidade `Endereço` deve armazenar os locais de entrega vinculados aos clientes.

| Atributo | Descrição |
|---|---|
| id_endereco | Identificador único do endereço |
| id_cliente | Cliente ao qual o endereço pertence |
| apelido | Nome de referência do endereço |
| cep | CEP do endereço |
| logradouro | Rua ou avenida |
| numero | Número do endereço |
| complemento | Complemento do endereço |
| bairro | Bairro |
| cidade | Cidade |
| estado | Estado |
| principal | Indica se é o endereço principal |

---

### 5.3 Categoria

A entidade `Categoria` deve organizar os produtos por tipo.

| Atributo | Descrição |
|---|---|
| id_categoria | Identificador único da categoria |
| nome | Nome da categoria |
| descricao | Descrição da categoria |
| ativo | Indica se a categoria está ativa |

Exemplos de categorias:

- Camisetas;
- Camisas;
- Tênis;
- Sapatos;
- Blazers.

---

### 5.4 Produto

A entidade `Produto` deve armazenar as informações principais dos produtos vendidos na loja.

| Atributo | Descrição |
|---|---|
| id_produto | Identificador único do produto |
| id_categoria | Categoria à qual o produto pertence |
| nome | Nome do produto |
| descricao | Descrição do produto |
| marca | Marca do produto |
| preco | Preço de venda |
| imagem_url | Caminho da imagem do produto |
| destaque | Indica se o produto aparece em destaque |
| ativo | Indica se o produto está ativo |
| data_cadastro | Data em que o produto foi cadastrado |

---

### 5.5 Tamanho

A entidade `Tamanho` deve armazenar os tamanhos disponíveis para roupas e calçados.

| Atributo | Descrição |
|---|---|
| id_tamanho | Identificador único do tamanho |
| nome | Nome do tamanho |
| tipo | Tipo do tamanho, como roupa ou calçado |

Exemplos:

- P;
- M;
- G;
- GG;
- 38;
- 39;
- 40;
- 41.

---

### 5.6 Variação_Produto

A entidade `Variação_Produto` deve armazenar as combinações de produto, tamanho, cor e estoque.

| Atributo | Descrição |
|---|---|
| id_variacao | Identificador único da variação |
| id_produto | Produto relacionado |
| id_tamanho | Tamanho relacionado |
| cor | Cor da variação |
| sku | Código único da variação |
| estoque | Quantidade disponível em estoque |

Essa entidade é necessária porque um mesmo produto pode existir em diferentes tamanhos e cores.

Exemplo:

```text
Produto: Knit Polo Shirt
Tamanho: G
Cor: Branca
Estoque: 11
```

---

### 5.7 Pedido

A entidade `Pedido` deve armazenar os dados gerais da compra realizada pelo cliente.

| Atributo | Descrição |
|---|---|
| id_pedido | Identificador único do pedido |
| id_cliente | Cliente que realizou o pedido |
| id_endereco | Endereço de entrega |
| status | Situação do pedido |
| valor_produtos | Valor total dos produtos |
| valor_frete | Valor do frete |
| valor_desconto | Valor de desconto |
| valor_total | Valor final do pedido |
| data_pedido | Data em que o pedido foi realizado |

Exemplos de status:

- Pendente;
- Pago;
- Em preparação;
- Enviado;
- Entregue;
- Cancelado.

---

### 5.8 Item_Pedido

A entidade `Item_Pedido` deve armazenar os produtos que fazem parte de cada pedido.

| Atributo | Descrição |
|---|---|
| id_item_pedido | Identificador único do item |
| id_pedido | Pedido relacionado |
| id_variacao | Variação do produto comprada |
| quantidade | Quantidade comprada |
| preco_unitario | Preço unitário no momento da compra |
| subtotal | Valor total do item |

Essa entidade resolve a relação muitos-para-muitos entre `Pedido` e `Produto`.

---

### 5.9 Pagamento

A entidade `Pagamento` deve armazenar as informações relacionadas ao pagamento do pedido.

| Atributo | Descrição |
|---|---|
| id_pagamento | Identificador único do pagamento |
| id_pedido | Pedido relacionado |
| forma_pagamento | Forma de pagamento utilizada |
| status | Situação do pagamento |
| valor | Valor pago |
| codigo_transacao | Código da transação |
| data_pagamento | Data do pagamento |

Formas de pagamento permitidas:

- Pix;
- Cartão de crédito;
- Cartão de débito;
- Boleto.

Status de pagamento permitidos:

- Pendente;
- Aprovado;
- Recusado;
- Estornado.

---

## 6. Relacionamentos Relevantes

Os relacionamentos identificados no sistema são:

| Relacionamento | Cardinalidade | Descrição |
|---|---|---|
| Cliente — Endereço | 1:N | Um cliente pode possuir vários endereços |
| Cliente — Pedido | 1:N | Um cliente pode realizar vários pedidos |
| Endereço — Pedido | 1:N | Um endereço pode ser usado em vários pedidos |
| Categoria — Produto | 1:N | Uma categoria pode possuir vários produtos |
| Produto — Variação_Produto | 1:N | Um produto pode possuir várias variações |
| Tamanho — Variação_Produto | 1:N | Um tamanho pode aparecer em várias variações |
| Pedido — Item_Pedido | 1:N | Um pedido pode possuir vários itens |
| Variação_Produto — Item_Pedido | 1:N | Uma variação pode aparecer em vários itens de pedido |
| Pedido — Pagamento | 1:N | Um pedido pode possuir um ou mais pagamentos |
| Pedido — Produto | N:N | Relação resolvida pela tabela intermediária Item_Pedido |

---

## 7. Regras de Negócio

As principais regras de negócio identificadas são:

1. Todo produto deve pertencer a uma categoria.
2. Um cliente pode possuir mais de um endereço.
3. Um cliente pode realizar vários pedidos.
4. Cada pedido deve estar vinculado a um cliente.
5. Cada pedido deve possuir um endereço de entrega.
6. Um pedido pode conter vários itens.
7. Cada item do pedido deve estar relacionado a uma variação de produto.
8. Um produto pode possuir várias variações de tamanho, cor e estoque.
9. O estoque não pode ser negativo.
10. O preço de um produto não pode ser negativo.
11. A quantidade de um item do pedido deve ser maior que zero.
12. O e-mail do cliente deve ser único.
13. O SKU da variação do produto deve ser único.
14. O status do pedido deve seguir valores definidos.
15. A forma de pagamento deve seguir as opções permitidas.

---

## 8. Requisitos Funcionais Relacionados ao Banco de Dados

Os requisitos funcionais ligados ao banco de dados são:

| Código | Requisito |
|---|---|
| RF01 | Cadastrar clientes |
| RF02 | Cadastrar endereços dos clientes |
| RF03 | Cadastrar categorias de produtos |
| RF04 | Cadastrar produtos |
| RF05 | Cadastrar tamanhos |
| RF06 | Cadastrar variações dos produtos |
| RF07 | Controlar estoque por tamanho e cor |
| RF08 | Registrar pedidos |
| RF09 | Registrar itens dos pedidos |
| RF10 | Registrar pagamentos |
| RF11 | Consultar produtos disponíveis |
| RF12 | Consultar pedidos e pagamentos |

---

## 9. Requisitos Não Funcionais Relacionados ao Banco de Dados

Os requisitos não funcionais identificados são:

| Código | Requisito |
|---|---|
| RNF01 | O banco deve garantir integridade referencial |
| RNF02 | O banco deve evitar dados duplicados |
| RNF03 | O banco deve utilizar chaves primárias e estrangeiras |
| RNF04 | O banco deve aplicar restrições como `NOT NULL`, `UNIQUE`, `CHECK` e `DEFAULT` |
| RNF05 | O banco deve estar normalizado para reduzir redundâncias |
| RNF06 | O banco deve permitir consultas com `JOIN` entre as tabelas |
| RNF07 | O banco deve permitir expansão futura, como novos produtos, categorias e formas de pagamento |

---

## 10. Justificativa da Escolha Relacional

O banco de dados relacional foi escolhido porque o sistema possui informações fortemente relacionadas.

Por exemplo:

- produtos pertencem a categorias;
- produtos possuem variações;
- clientes possuem endereços;
- clientes realizam pedidos;
- pedidos possuem itens;
- pedidos possuem pagamentos.

Com o modelo relacional, é possível garantir a integridade dos dados por meio de chaves primárias, chaves estrangeiras e restrições.

Além disso, o uso de tabelas separadas evita redundância e facilita a manutenção do sistema.

---

## 11. Conclusão

O levantamento de requisitos permitiu identificar as principais informações necessárias para o desenvolvimento do banco de dados da loja virtual de roupas e calçados.

Foram definidas entidades, atributos, relacionamentos e regras de negócio coerentes com o domínio do problema.

Esses requisitos serviram como base para a modelagem conceitual, modelo lógico, implementação física e criação dos scripts SQL do banco de dados.
