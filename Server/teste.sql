-- Exemplo de Inserts para users (Substitui os valores e as passwords)
INSERT INTO users (username, email, password, tipo, isAdmin, isBanned) VALUES
('admin_user', 'admin@example.com', '[HASHED_PASSWORD_ADMIN]', 'admin', TRUE, FALSE),
('proprietario_user', 'proprietario@example.com', '[HASHED_PASSWORD_PROPRIETARIO]', 'proprietario', FALSE, FALSE),
('organizador_user', 'organizador@example.com', '[HASHED_PASSWORD_ORGANIZADOR]', 'organizador', FALSE, FALSE),
('estudante_user', 'estudante@example.com', '[HASHED_PASSWORD_ESTUDANTE]', 'estudante', FALSE, FALSE);

-- Assume que os IDs dos utilizadores inseridos acima são 1, 2, 3, 4 respetivamente
-- (Podes verificar os IDs gerados depois de inserir os utilizadores)

-- Exemplo de Inserts para alojamentos
INSERT INTO alojamentos (nome, descricao, precoBase, zona, tipo, imagem, proprietario_id) VALUES
('Apartamento Central', 'Ótimo apartamento perto da universidade', 500.00, 'Centro', 'apartamento', 'img_apartamento.jpg', 2), -- Proprietário com ID 2
('Quarto Económico', 'Quarto partilhado com boa localização', 250.00, 'Zona Sul', 'quarto_partilhado', 'img_quarto.jpg', 2); -- Proprietário com ID 2

-- Assume que os IDs dos alojamentos inseridos acima são 1, 2 respetivamente

-- Exemplo de Inserts para eventos
INSERT INTO eventos (nome, descricao, data, local, tipo, imagem, organizador_id) VALUES
('Visita Guiada ao Museu', 'Exploração da história local', '2023-10-27 10:00:00', 'Museu da Cidade', 'cultural', 'img_museu.jpg', 3), -- Organizador com ID 3
('Workshop de Programação', 'Introdução ao Node.js', '2023-11-10 14:00:00', 'Campus Universitário', 'academico', 'img_workshop.jpg', 3); -- Organizador com ID 3

-- Assume que os IDs dos eventos inseridos acima são 1, 2 respetivamente

-- Exemplo de Inserts para reservas (usando user_id)
INSERT INTO reservas (alojamento_id, user_id, data_inicio, data_fim, estado, observacoes) VALUES
(1, 4, '2023-12-01', '2023-12-15', 'pendente', 'Chegada tardia prevista.'), -- Estudante com ID 4 reserva Alojamento com ID 1
(2, 1, '2024-01-10', '2024-01-20', 'confirmada', NULL); -- Admin com ID 1 reserva Alojamento com ID 2 (apenas exemplo, depende do que queres testar)

-- Exemplo de Inserts para avaliações (usando estudante_id como no teu script)
INSERT INTO avaliacoes (alojamento_id, estudante_id, pontuacao, comentario) VALUES
(1, 4, 4, 'Bom alojamento, bem localizado.'), -- Estudante com ID 4 avalia Alojamento com ID 1
(2, 4, 5, 'Muito confortável e barato.'); -- Estudante com ID 4 avalia Alojamento com ID 2

-- Exemplo de Inserts para inscricoes (usando user_id e novos campos)
INSERT INTO inscricoes (evento_id, user_id, status, valor_pago) VALUES
(1, 4, 'confirmada', 10.00), -- Estudante com ID 4 inscrito no Evento com ID 1 (custo 10.00)
(2, 1, 'pendente', 0.00); -- Admin com ID 1 inscrito no Evento com ID 2 (gratuito)
