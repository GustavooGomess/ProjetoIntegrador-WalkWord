# Documentação Técnica do Banco de Dados

## Loja Virtual de Roupas e Calçados

---

## 1. Introdução

Este documento apresenta a documentação técnica do banco de dados desenvolvido para uma loja virtual de roupas e calçados.

O banco tem como objetivo armazenar e organizar as informações necessárias para o funcionamento do sistema, incluindo:

- categorias;
- produtos;
- tamanhos;
- variações de produtos;
- clientes;
- endereços;
- pedidos;
- itens do pedido;
- pagamentos.

A solução utiliza um **banco de dados relacional**, pois as informações possuem forte relacionamento entre si. Por exemplo, um cliente pode realizar vários pedidos, um pedido pode conter vários produtos, e um produto pode possuir diferentes tamanhos, cores e quantidades em estoque.

O banco foi desenvolvido utilizando **PostgreSQL**, com aplicação de chaves primárias, chaves estrangeiras, restrições, comandos SQL e uma `VIEW` para consulta de produtos disponíveis.

---

## 2. Modelagem Conceitual — DER

A modelagem conceitual representa as entidades principais do sistema, seus atributos e os relacionamentos entre elas.

As principais entidades identificadas foram:

- Cliente;
- Endereço;
- Categoria;
- Produto;
- Tamanho;
- Variação_Produto;
- Pedido;
- Item_Pedido;
- Pagamento.

A entidade `Item_Pedido` foi criada para resolver a relação muitos-para-muitos entre `Pedido` e `Produto`, permitindo registrar os produtos comprados em cada pedido, a quantidade, o preço unitário e o subtotal.

### Diagrama Conceitual

![Modelagem Conceitual - DER](/assets/modelo%20fisico%201.jpeg)

---

## 3. Modelagem Física

A modelagem física representa como as tabelas foram criadas no banco de dados, incluindo os tipos de dados, chaves primárias, chaves estrangeiras e relacionamentos implementados.

Esse modelo mostra a estrutura real utilizada no PostgreSQL.

### Modelo Físico — Visão 1

![Modelo Físico 01](/assets/modelo%20conceitual.jpeg)

### Modelo Físico — Visão 2

![Modelo Físico 02](/assets/modelo%20fisico%202.jpeg)
---

## 4. Modelo Lógico

O modelo lógico apresenta a transformação do DER em tabelas relacionais, com suas chaves primárias e estrangeiras.

### CLIENTES

```text
CLIENTES (
    id_cliente PK,
    nome,
    email,
    senha,
    cpf,
    telefone,
    data_nascimento,
    ativo,
    data_cadastro
)
```

### ENDERECOS

```text
ENDERECOS (
    id_endereco PK,
    id_cliente FK,
    apelido,
    cep,
    logradouro,
    numero,
    complemento,
    bairro,
    cidade,
    estado,
    principal
)
```

### CATEGORIAS

```text
CATEGORIAS (
    id_categoria PK,
    nome,
    descricao,
    ativo
)
```

### PRODUTOS

```text
PRODUTOS (
    id_produto PK,
    id_categoria FK,
    nome,
    descricao,
    marca,
    preco,
    imagem_url,
    destaque,
    ativo,
    data_cadastro
)
```

### TAMANHOS

```text
TAMANHOS (
    id_tamanho PK,
    nome,
    tipo
)
```

### VARIACOES_PRODUTO

```text
VARIACOES_PRODUTO (
    id_variacao PK,
    id_produto FK,
    id_tamanho FK,
    cor,
    sku,
    estoque
)
```

### PEDIDOS

```text
PEDIDOS (
    id_pedido PK,
    id_cliente FK,
    id_endereco FK,
    status,
    valor_produtos,
    valor_frete,
    valor_desconto,
    valor_total,
    data_pedido
)
```

### ITENS_PEDIDO

```text
ITENS_PEDIDO (
    id_item_pedido PK,
    id_pedido FK,
    id_variacao FK,
    quantidade,
    preco_unitario,
    subtotal
)
```

### PAGAMENTOS

```text
PAGAMENTOS (
    id_pagamento PK,
    id_pedido FK,
    forma_pagamento,
    status,
    valor,
    codigo_transacao,
    data_pagamento
)
```

---

## 5. Relacionamentos e Cardinalidades

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
| Pedido — Produto | N:N | Relação resolvida pela tabela intermediária `Item_Pedido` |

A relação muitos-para-muitos entre **Pedido** e **Produto** foi resolvida por meio da tabela `itens_pedido`.

Essa tabela permite registrar quais produtos fazem parte de cada pedido, além de armazenar:

- quantidade;
- preço unitário;
- subtotal.

---

## 6. Normalização

O banco de dados foi organizado buscando reduzir redundâncias e manter a consistência das informações.

Na **Primeira Forma Normal (1FN)**, os dados foram estruturados em tabelas com campos atômicos, evitando listas ou múltiplos valores em uma única coluna.

Na **Segunda Forma Normal (2FN)**, os atributos foram separados de acordo com sua dependência da chave primária. Por exemplo, os dados de categoria não ficam repetidos na tabela `produtos`, pois existe uma tabela específica chamada `categorias`.

Na **Terceira Forma Normal (3FN)**, foram removidas dependências transitivas. Informações como endereço, pagamento, categoria, tamanho e variações foram separadas em tabelas próprias.

Essa organização evita repetições, facilita a manutenção e melhora a integridade dos dados.

---

## 7. Dicionário de Dados

O dicionário de dados descreve as tabelas, campos, tipos e finalidades.

### Tabela: `categorias`

| Campo | Tipo | Descrição |
|---|---|---|
| id_categoria | SERIAL | Identificador único da categoria |
| nome | VARCHAR(100) | Nome da categoria |
| descricao | VARCHAR(255) | Descrição da categoria |
| ativo | BOOLEAN | Indica se a categoria está ativa |

### Tabela: `produtos`

| Campo | Tipo | Descrição |
|---|---|---|
| id_produto | SERIAL | Identificador único do produto |
| id_categoria | INTEGER | Categoria relacionada ao produto |
| nome | VARCHAR(150) | Nome do produto |
| descricao | TEXT | Descrição detalhada do produto |
| marca | VARCHAR(100) | Marca do produto |
| preco | NUMERIC(10,2) | Preço do produto |
| imagem_url | VARCHAR(500) | Caminho da imagem do produto |
| destaque | BOOLEAN | Indica se o produto aparece em destaque |
| ativo | BOOLEAN | Indica se o produto está ativo |
| data_cadastro | TIMESTAMP | Data de cadastro do produto |

### Tabela: `tamanhos`

| Campo | Tipo | Descrição |
|---|---|---|
| id_tamanho | SERIAL | Identificador único do tamanho |
| nome | VARCHAR(20) | Nome do tamanho |
| tipo | VARCHAR(30) | Tipo do tamanho, como roupa ou calçado |

### Tabela: `variacoes_produto`

| Campo | Tipo | Descrição |
|---|---|---|
| id_variacao | SERIAL | Identificador único da variação |
| id_produto | INTEGER | Produto relacionado à variação |
| id_tamanho | INTEGER | Tamanho relacionado à variação |
| cor | VARCHAR(50) | Cor da variação do produto |
| sku | VARCHAR(50) | Código único da variação |
| estoque | INTEGER | Quantidade disponível em estoque |

### Tabela: `clientes`

| Campo | Tipo | Descrição |
|---|---|---|
| id_cliente | SERIAL | Identificador único do cliente |
| nome | VARCHAR(150) | Nome do cliente |
| email | VARCHAR(150) | E-mail do cliente |
| senha | VARCHAR(255) | Senha do cliente |
| cpf | VARCHAR(14) | CPF do cliente |
| telefone | VARCHAR(20) | Telefone do cliente |
| data_nascimento | DATE | Data de nascimento |
| ativo | BOOLEAN | Indica se o cliente está ativo |
| data_cadastro | TIMESTAMP | Data de cadastro do cliente |

### Tabela: `enderecos`

| Campo | Tipo | Descrição |
|---|---|---|
| id_endereco | SERIAL | Identificador único do endereço |
| id_cliente | INTEGER | Cliente dono do endereço |
| apelido | VARCHAR(50) | Nome de referência do endereço |
| cep | VARCHAR(9) | CEP do endereço |
| logradouro | VARCHAR(150) | Rua ou avenida |
| numero | VARCHAR(20) | Número do endereço |
| complemento | VARCHAR(100) | Complemento do endereço |
| bairro | VARCHAR(100) | Bairro |
| cidade | VARCHAR(100) | Cidade |
| estado | CHAR(2) | Estado |
| principal | BOOLEAN | Indica se é o endereço principal |

### Tabela: `pedidos`

| Campo | Tipo | Descrição |
|---|---|---|
| id_pedido | SERIAL | Identificador único do pedido |
| id_cliente | INTEGER | Cliente que realizou o pedido |
| id_endereco | INTEGER | Endereço de entrega |
| status | VARCHAR(30) | Situação do pedido |
| valor_produtos | NUMERIC(10,2) | Valor total dos produtos |
| valor_frete | NUMERIC(10,2) | Valor do frete |
| valor_desconto | NUMERIC(10,2) | Valor de desconto |
| valor_total | NUMERIC(10,2) | Valor final do pedido |
| data_pedido | TIMESTAMP | Data do pedido |

### Tabela: `itens_pedido`

| Campo | Tipo | Descrição |
|---|---|---|
| id_item_pedido | SERIAL | Identificador único do item do pedido |
| id_pedido | INTEGER | Pedido relacionado |
| id_variacao | INTEGER | Variação de produto comprada |
| quantidade | INTEGER | Quantidade comprada |
| preco_unitario | NUMERIC(10,2) | Preço unitário |
| subtotal | NUMERIC(10,2) | Valor total do item |

### Tabela: `pagamentos`

| Campo | Tipo | Descrição |
|---|---|---|
| id_pagamento | SERIAL | Identificador único do pagamento |
| id_pedido | INTEGER | Pedido relacionado ao pagamento |
| forma_pagamento | VARCHAR(30) | Forma de pagamento |
| status | VARCHAR(30) | Situação do pagamento |
| valor | NUMERIC(10,2) | Valor do pagamento |
| codigo_transacao | VARCHAR(150) | Código da transação |
| data_pagamento | TIMESTAMP | Data do pagamento |

---

## 8. Scripts SQL

Esta seção apresenta os scripts utilizados no banco de dados.

---

## 8.1 Script DDL — Criação das Tabelas

O script DDL é responsável por criar a estrutura física do banco de dados.

```sql
CREATE TABLE categorias (
    id_categoria SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao VARCHAR(255),
    ativo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE produtos (
    id_produto SERIAL PRIMARY KEY,
    id_categoria INTEGER NOT NULL,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT,
    marca VARCHAR(100),
    preco NUMERIC(10,2) NOT NULL,
    imagem_url VARCHAR(500),
    destaque BOOLEAN NOT NULL DEFAULT FALSE,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_produto_categoria
        FOREIGN KEY (id_categoria)
        REFERENCES categorias(id_categoria),

    CONSTRAINT chk_produto_preco
        CHECK (preco >= 0)
);

CREATE TABLE tamanhos (
    id_tamanho SERIAL PRIMARY KEY,
    nome VARCHAR(20) NOT NULL UNIQUE,
    tipo VARCHAR(30) NOT NULL
);

CREATE TABLE variacoes_produto (
    id_variacao SERIAL PRIMARY KEY,
    id_produto INTEGER NOT NULL,
    id_tamanho INTEGER NOT NULL,
    cor VARCHAR(50) NOT NULL,
    sku VARCHAR(50) NOT NULL UNIQUE,
    estoque INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT fk_variacao_produto
        FOREIGN KEY (id_produto)
        REFERENCES produtos(id_produto)
        ON DELETE CASCADE,

    CONSTRAINT fk_variacao_tamanho
        FOREIGN KEY (id_tamanho)
        REFERENCES tamanhos(id_tamanho),

    CONSTRAINT chk_variacao_estoque
        CHECK (estoque >= 0),

    CONSTRAINT uq_produto_tamanho_cor
        UNIQUE (id_produto, id_tamanho, cor)
);

CREATE TABLE clientes (
    id_cliente SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) UNIQUE,
    telefone VARCHAR(20),
    data_nascimento DATE,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE enderecos (
    id_endereco SERIAL PRIMARY KEY,
    id_cliente INTEGER NOT NULL,
    apelido VARCHAR(50),
    cep VARCHAR(9) NOT NULL,
    logradouro VARCHAR(150) NOT NULL,
    numero VARCHAR(20) NOT NULL,
    complemento VARCHAR(100),
    bairro VARCHAR(100) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    estado CHAR(2) NOT NULL,
    principal BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT fk_endereco_cliente
        FOREIGN KEY (id_cliente)
        REFERENCES clientes(id_cliente)
        ON DELETE CASCADE
);

CREATE TABLE pedidos (
    id_pedido SERIAL PRIMARY KEY,
    id_cliente INTEGER NOT NULL,
    id_endereco INTEGER NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Pendente',
    valor_produtos NUMERIC(10,2) NOT NULL DEFAULT 0,
    valor_frete NUMERIC(10,2) NOT NULL DEFAULT 0,
    valor_desconto NUMERIC(10,2) NOT NULL DEFAULT 0,
    valor_total NUMERIC(10,2) NOT NULL DEFAULT 0,
    data_pedido TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_pedido_cliente
        FOREIGN KEY (id_cliente)
        REFERENCES clientes(id_cliente),

    CONSTRAINT fk_pedido_endereco
        FOREIGN KEY (id_endereco)
        REFERENCES enderecos(id_endereco),

    CONSTRAINT chk_pedido_status
        CHECK (
            status IN (
                'Pendente',
                'Pago',
                'Em preparação',
                'Enviado',
                'Entregue',
                'Cancelado'
            )
        ),

    CONSTRAINT chk_pedido_valores
        CHECK (
            valor_produtos >= 0
            AND valor_frete >= 0
            AND valor_desconto >= 0
            AND valor_total >= 0
        )
);

CREATE TABLE itens_pedido (
    id_item_pedido SERIAL PRIMARY KEY,
    id_pedido INTEGER NOT NULL,
    id_variacao INTEGER NOT NULL,
    quantidade INTEGER NOT NULL,
    preco_unitario NUMERIC(10,2) NOT NULL,
    subtotal NUMERIC(10,2) NOT NULL,

    CONSTRAINT fk_item_pedido
        FOREIGN KEY (id_pedido)
        REFERENCES pedidos(id_pedido)
        ON DELETE CASCADE,

    CONSTRAINT fk_item_variacao
        FOREIGN KEY (id_variacao)
        REFERENCES variacoes_produto(id_variacao),

    CONSTRAINT chk_item_quantidade
        CHECK (quantidade > 0),

    CONSTRAINT chk_item_valores
        CHECK (
            preco_unitario >= 0
            AND subtotal >= 0
        )
);

CREATE TABLE pagamentos (
    id_pagamento SERIAL PRIMARY KEY,
    id_pedido INTEGER NOT NULL,
    forma_pagamento VARCHAR(30) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Pendente',
    valor NUMERIC(10,2) NOT NULL,
    codigo_transacao VARCHAR(150),
    data_pagamento TIMESTAMP,

    CONSTRAINT fk_pagamento_pedido
        FOREIGN KEY (id_pedido)
        REFERENCES pedidos(id_pedido)
        ON DELETE CASCADE,

    CONSTRAINT chk_forma_pagamento
        CHECK (
            forma_pagamento IN (
                'Pix',
                'Cartão de crédito',
                'Cartão de débito',
                'Boleto'
            )
        ),

    CONSTRAINT chk_status_pagamento
        CHECK (
            status IN (
                'Pendente',
                'Aprovado',
                'Recusado',
                'Estornado'
            )
        ),

    CONSTRAINT chk_pagamento_valor
        CHECK (valor >= 0)
);
```

---

## 8.2 Script DML — Inserção de Dados

O script DML é responsável por inserir dados nas tabelas.

```sql
INSERT INTO categorias (nome, descricao)
VALUES
('Camisas', 'Camisas sociais, casuais e blusas'),
('Blazers', 'Blazers e peças de alfaiataria')
ON CONFLICT (nome) DO NOTHING;
```

> O restante dos produtos e variações foi inserido no arquivo `02_insercao_dados.sql`, contendo os produtos utilizados no front-end da loja.

---

## 8.3 Script DQL — Consultas

O script DQL é responsável por consultar os dados cadastrados.

### Consulta de produtos com categoria

```sql
SELECT
    p.id_produto,
    p.nome AS produto,
    c.nome AS categoria,
    p.marca,
    p.preco
FROM produtos p
INNER JOIN categorias c
    ON p.id_categoria = c.id_categoria
ORDER BY p.id_produto;
```

Essa consulta exibe todos os produtos cadastrados, mostrando o produto, categoria, marca e preço.

### Consulta de estoque por tamanho e cor

```sql
SELECT
    p.nome AS produto,
    p.marca,
    t.nome AS tamanho,
    v.cor,
    v.sku,
    v.estoque
FROM variacoes_produto v
INNER JOIN produtos p
    ON v.id_produto = p.id_produto
INNER JOIN tamanhos t
    ON v.id_tamanho = t.id_tamanho
ORDER BY p.nome;
```

Essa consulta mostra as variações dos produtos, incluindo tamanho, cor, SKU e estoque.

---

## 8.4 Recurso Avançado — View

Como recurso avançado, foi criada uma view chamada `vw_produtos_disponiveis`.

Uma view é uma consulta salva no banco de dados que funciona como uma tabela virtual.

```sql
CREATE VIEW vw_produtos_disponiveis AS
SELECT
    p.id_produto,
    p.nome AS produto,
    c.nome AS categoria,
    p.marca,
    p.preco,
    t.nome AS tamanho,
    v.cor,
    v.sku,
    v.estoque
FROM variacoes_produto v
INNER JOIN produtos p
    ON v.id_produto = p.id_produto
INNER JOIN categorias c
    ON p.id_categoria = c.id_categoria
INNER JOIN tamanhos t
    ON v.id_tamanho = t.id_tamanho
WHERE p.ativo = TRUE
AND v.estoque > 0;

SELECT * FROM vw_produtos_disponiveis;
```

A view apresenta apenas os produtos ativos e com estoque disponível.

---

## 9. Restrições Aplicadas

O banco utiliza restrições para garantir integridade e consistência dos dados.

| Restrição | Função | Exemplo |
|---|---|---|
| PRIMARY KEY | Identifica cada registro de forma única | `id_categoria SERIAL PRIMARY KEY` |
| FOREIGN KEY | Cria relacionamento entre tabelas | `id_categoria REFERENCES categorias` |
| NOT NULL | Impede campos obrigatórios vazios | `nome VARCHAR(150) NOT NULL` |
| UNIQUE | Evita valores duplicados | `email UNIQUE`, `sku UNIQUE` |
| CHECK | Valida regras de negócio | `CHECK (preco >= 0)` |
| DEFAULT | Define valor padrão automático | `ativo DEFAULT TRUE` |

---

## 10. Considerações Finais

A documentação técnica apresenta a estrutura do banco de dados da loja virtual de roupas e calçados, contendo DER, modelo lógico, modelagem física, scripts SQL, dicionário de dados e recurso avançado.

O banco foi desenvolvido de forma relacional, com tabelas bem definidas e relacionamentos coerentes. A utilização de chaves primárias, chaves estrangeiras e restrições garante a integridade das informações.

A tabela `itens_pedido` resolve a relação muitos-para-muitos entre pedidos e produtos. Já a tabela `variacoes_produto` permite controlar tamanho, cor, SKU e estoque de cada produto.

Dessa forma, o banco atende aos requisitos técnicos do projeto e representa corretamente o domínio de uma loja virtual de roupas e calçados.
