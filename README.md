# Padaria Aurora

Balcão de pedidos da Padaria Aurora. Quem está no caixa monta a venda, aplica um cupom e fecha a conta.

Para abrir localmente, use Node.js 22, rode `npm install` e depois `npm run dev`. O balcão fica em <http://127.0.0.1:5173>.

## Integrantes

- Bruna Saturnino de Carvalho
- Rafael Araujo Magesty
- Gabriell Laurentino

## Sobre o sistema

A Padaria Aurora registra a venda de pães, salgados, doces e bebidas. Dá para buscar um produto, filtrar por categoria, mudar quantidades, aplicar um cupom e receber em dinheiro, pix ou cartão. No dinheiro, o sistema calcula o troco. Há um limite de 20 unidades por item.

Cupons do balcão:

- `AURORA10`: 10% no pedido
- `DOCE5`: R$ 5,00, sem deixar o total negativo
- `CAFE3`: a cada três cafés, um sai de graça

O sistema existe para mostrar como testes protegem essas regras quando o código muda.

## Tecnologias

- TypeScript e Vite para a aplicação web.
- Vitest, com a cobertura nativa do V8, para os testes de unidade. A suíte falha se a cobertura ficar abaixo de 80%.
- Playwright para os cinco fluxos de ponta a ponta, no Chromium.
- GitHub Actions para executar testes e cobertura no Linux, no macOS e no Windows a cada push.
- Codecov para publicar o relatório de cobertura gerado no Linux.
- GitHub Pages para a versão em produção. Nas configurações do repositório, a fonte do Pages precisa ser GitHub Actions.

## Uso de IA

O desenvolvimento foi feito no Cursor, com o modelo Grok. A ferramenta ajudou a organizar o domínio do balcão (dinheiro, catálogo, carrinho, cupons e fechamento), a escrever os testes de unidade e os de ponta a ponta, a configurar o Vitest, o Playwright, o GitHub Actions e o envio da cobertura ao Codecov, e a montar a interface. As regras de negócio e os resultados dos testes foram conferidos no projeto.

## Execução dos testes

É preciso ter o Node.js 22.

```bash
npm install
npm run test:coverage
npx playwright install chromium
npm run test:e2e
```

`npm test` roda só os testes de unidade. `npm run test:coverage` também gera o relatório em `coverage/` e falha abaixo de 80% de linhas, funções, ramos e instruções.

`npm run test:e2e` sobe o balcão e executa os cinco fluxos: abrir o catálogo, incluir um item, aumentar a quantidade, aplicar o cupom `AURORA10` e calcular o troco.

No GitHub Actions, os dois grupos de teste rodam a cada push no Linux, no macOS e no Windows. A cobertura do Linux é enviada ao Codecov com o token OIDC do GitHub Actions, porque a branch `main` exige autenticação. A publicação do site fica em outro workflow, no GitHub Pages.
