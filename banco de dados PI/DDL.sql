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
