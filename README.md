# Padaria Aurora

Balcão web para registrar pedidos de uma padaria, aplicar cupons e fechar a venda. O projeto demonstra como testes de unidade e testes de ponta a ponta protegem as regras do sistema.

**[Abrir a aplicação em produção](https://project-2n6p9.vercel.app/)** · **[Ver os testes no GitHub Actions](https://github.com/brunasaturnino/padaria-aurora/actions/workflows/testes.yml)** · **[Ver a cobertura no Codecov](https://app.codecov.io/github/brunasaturnino/padaria-aurora)**

A versão em produção usa Vercel Functions e PostgreSQL no Neon para salvar pedidos. A [versão no GitHub Pages](https://brunasaturnino.github.io/padaria-aurora/) continua disponível apenas como demonstração: ela mostra o comprovante, mas não grava a venda.

## Integrantes

- Bruna Saturnino de Carvalho
- Rafael Araujo Magesty
- Gabriell Laurentino

## Sobre o sistema

O caixa pode buscar produtos, filtrar o catálogo por categoria, adicionar itens ao pedido e alterar as quantidades (até 20 unidades por item). No fechamento, pode aplicar um cupom e receber em dinheiro, Pix ou cartão. Para pagamentos em dinheiro, o balcão calcula o troco.

| Cupom | Regra |
| --- | --- |
| `AURORA10` | 10% de desconto no pedido |
| `DOCE5` | R$ 5,00 de desconto, sem deixar o total negativo |
| `CAFE3` | A cada três cafés, um sai de graça |

## Tecnologias

- **TypeScript e Vite:** aplicação web e build de produção.
- **Vitest e cobertura V8:** testes de unidade e relatório de cobertura. O comando de cobertura falha se linhas, funções, ramos ou instruções ficarem abaixo de 80%.
- **Playwright:** cinco testes de ponta a ponta executados no Chromium.
- **GitHub Actions:** testes e cobertura a cada push e pull request no Linux, macOS e Windows; publicação da aplicação no GitHub Pages a cada push na `main`.
- **Codecov:** publicação do relatório de cobertura gerado no Linux.
- **Vercel Functions e PostgreSQL (Neon):** API de pedidos com validação dos valores no servidor e armazenamento das vendas.

## Executar localmente

Requisito: Node.js 22 ou superior.

```bash
npm ci
npm run dev
```

Abra <http://127.0.0.1:5173>. Para verificar o build de produção, execute `npm run build`.

## Execução dos testes

```bash
npm test                  # testes de unidade
npm run test:coverage     # testes de unidade e cobertura
npx playwright install chromium
npm run test:e2e          # testes de ponta a ponta
```

O relatório HTML local fica em `coverage/index.html`. Os cinco fluxos e2e verificam a abertura do catálogo, a inclusão de um item, o aumento da quantidade, a aplicação do cupom `AURORA10` e o cálculo do troco. O Playwright inicia o servidor da aplicação automaticamente.

O workflow [Testes](https://github.com/brunasaturnino/padaria-aurora/actions/workflows/testes.yml) executa as duas suítes nos três sistemas operacionais. No Linux, envia `coverage/lcov.info` ao [Codecov](https://app.codecov.io/github/brunasaturnino/padaria-aurora) usando a autenticação OIDC do GitHub Actions. O workflow [Paginas](https://github.com/brunasaturnino/padaria-aurora/actions/workflows/paginas.yml) gera e publica a versão de demonstração no GitHub Pages.

## Submissão

A entrega deve ser feita pelo Moodle com estes cinco links:

1. **Sistema em produção:** [aplicação publicada na Vercel](https://project-2n6p9.vercel.app/).
2. **Repositório no GitHub:** [código-fonte do projeto](https://github.com/brunasaturnino/padaria-aurora).
3. **Build no GitHub Actions:** [execução dos testes concluída com sucesso](https://github.com/brunasaturnino/padaria-aurora/actions/runs/45866212483). Antes da entrega, confira no [histórico do workflow](https://github.com/brunasaturnino/padaria-aurora/actions/workflows/testes.yml) se há uma execução bem-sucedida mais recente e envie o link direto dela.
4. **Relatório no Codecov:** [página de cobertura de testes do projeto](https://app.codecov.io/github/brunasaturnino/padaria-aurora).
5. **Vídeo no YouTube:** pendente de gravação e publicação; incluir o link do vídeo de apresentação do sistema antes da entrega.

## Uso de IA

O desenvolvimento foi feito no Cursor, com o modelo Grok. A ferramenta ajudou a organizar o domínio do balcão (dinheiro, catálogo, carrinho, cupons e fechamento), a escrever os testes de unidade e de ponta a ponta, a configurar o Vitest, o Playwright, o GitHub Actions e o envio da cobertura ao Codecov, e a montar a interface. As regras de negócio e os resultados dos testes foram conferidos no projeto.
