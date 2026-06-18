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
