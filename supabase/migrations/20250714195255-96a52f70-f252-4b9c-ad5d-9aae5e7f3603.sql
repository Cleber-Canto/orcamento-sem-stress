-- Criar contas de teste no sistema
-- Primeiro, vamos inserir alguns perfis de exemplo para facilitar os testes

-- Contas de teste já existentes no sistema (essas já foram criadas via registro normal)
-- Vamos apenas garantir que as tabelas estão funcionando corretamente

-- Verificar se há dados nas tabelas
SELECT 'Perfis cadastrados:' as info;
SELECT name, email, created_at FROM profiles ORDER BY created_at DESC;

SELECT 'Despesas por usuário:' as info;
SELECT u.email, COUNT(e.id) as total_despesas 
FROM profiles u 
LEFT JOIN expenses e ON u.user_id = e.user_id 
GROUP BY u.email, u.user_id;

SELECT 'Receitas por usuário:' as info;
SELECT u.email, COUNT(i.id) as total_receitas 
FROM profiles u 
LEFT JOIN incomes i ON u.user_id = i.user_id 
GROUP BY u.email, u.user_id;

SELECT 'Metas por usuário:' as info;
SELECT u.email, COUNT(g.id) as total_metas 
FROM profiles u 
LEFT JOIN goals g ON u.user_id = g.user_id 
GROUP BY u.email, u.user_id;