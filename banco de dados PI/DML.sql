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


INSERT INTO categorias (nome, descricao)
VALUES
('Camisas', 'Camisas sociais, casuais e blusas'),
('Blazers', 'Blazers e peças de alfaiataria')
ON CONFLICT (nome) DO NOTHING;

INSERT INTO produtos (
    id_categoria,
    nome,
    descricao,
    marca,
    preco,
    imagem_url,
    destaque
)
VALUES
(
    (SELECT id_categoria FROM categorias WHERE nome = 'Sapatos'),
    'Soft Loafer in Nappa',
    'Sapato loafer em couro nappa',
    'THE ROW',
    700.00,
    'imagens/soft-loafer-nappa.jpg',
    TRUE
),
(
    (SELECT id_categoria FROM categorias WHERE nome = 'Tênis'),
    'Classic Canvas Low-top',
    'Tênis casual de lona modelo baixo',
    'JIL SANDER',
    420.00,
    'imagens/classic-canvas-low-top.jpg',
    TRUE
),
(
    (SELECT id_categoria FROM categorias WHERE nome = 'Sapatos'),
    'Pebbled Leather Desert Boot',
    'Bota desert boot em couro texturizado',
    'LEMAIRE',
    850.00,
    'imagens/pebbled-leather-desert-boot.jpg',
    TRUE
),
(
    (SELECT id_categoria FROM categorias WHERE nome = 'Sapatos'),
    'Structured Chelsea Boot',
    'Bota Chelsea estruturada',
    'WALKWORD',
    1200.00,
    'imagens/structured-chelsea-boot.jpg',
    TRUE
),
(
    (SELECT id_categoria FROM categorias WHERE nome = 'Tênis'),
    'XT-6 Advanced Technical',
    'Tênis técnico esportivo',
    'SALOMON S/LAB',
    380.00,
    'imagens/xt-6-advanced-technical.jpg',
    TRUE
),
(
    (SELECT id_categoria FROM categorias WHERE nome = 'Sapatos'),
    'Suede Derby Shoe',
    'Sapato Derby em camurça',
    'LEMAIRE',
    950.00,
    'imagens/suede-derby-shoe.jpg',
    TRUE
),
(
    (SELECT id_categoria FROM categorias WHERE nome = 'Camisetas'),
    'Oversized Organic Tee',
    'Camiseta oversized em algodão orgânico',
    'WALKWORD',
    280.00,
    'imagens/oversized-organic-tee.jpg',
    TRUE
),
(
    (SELECT id_categoria FROM categorias WHERE nome = 'Camisas'),
    'Poplin Social Shirt',
    'Camisa social em popeline',
    'TOTEME',
    460.00,
    'imagens/poplin-social-shirt.jpg',
    TRUE
),
(
    (SELECT id_categoria FROM categorias WHERE nome = 'Camisetas'),
    'Relaxed Fit T-shirt',
    'Camiseta relaxed fit casual',
    'JIL SANDER',
    190.00,
    'imagens/relaxed-fit-tshirt.jpg',
    TRUE
),
(
    (SELECT id_categoria FROM categorias WHERE nome = 'Camisas'),
    'Classic Button-Down Oxford',
    'Camisa social Oxford button-down',
    'THE ROW',
    580.00,
    'imagens/classic-button-down-oxford.jpg',
    TRUE
),
(
    (SELECT id_categoria FROM categorias WHERE nome = 'Camisas'),
    'Silk Crepe Blouse',
    'Blusa em crepe de seda',
    'LEMAIRE',
    680.00,
    'imagens/silk-crepe-blouse.jpg',
    TRUE
),
(
    (SELECT id_categoria FROM categorias WHERE nome = 'Camisetas'),
    'Knit Polo Shirt',
    'Polo em malha fina',
    'TOTEME',
    340.00,
    'imagens/knit-polo-shirt.jpg',
    TRUE
),
(
    (SELECT id_categoria FROM categorias WHERE nome = 'Blazers'),
    'Structured Wool Blazer',
    'Blazer estruturado em lã',
    'WALKWORD',
    1800.00,
    'imagens/structured-wool-blazer.jpg',
    TRUE
),
(
    (SELECT id_categoria FROM categorias WHERE nome = 'Blazers'),
    'Deconstructed Linen Blazer',
    'Blazer de linho desestruturado',
    'LEMAIRE',
    920.00,
    'imagens/deconstructed-linen-blazer.jpg',
    TRUE
);
