# Conceito de Design: Jullya Souza (Editorial Lookbook)

Este documento detalha a estratégia de Design para o catálogo da Jullya Souza, focando em uma experiência de luxo que foge do padrão de e-commerce tradicional.

## 📱 Visão Mobile-First (Design para o Polegar)
Diferente de sites desktop adaptados, este projeto será construído pensando exclusivamente na ergonomia do smartphone:
- **Zonas de Interação**: Todos os botões de ação (adicionar itens, enviar pedido) ficarão na metade inferior da tela.
- **Micro-interações**: Feedback tátil visual ao tocar em um produto (leve escala ou brilho).
- **Sticky Footer Premium**: Uma barra de "Sacola de Pedidos" com efeito de vidro (backdrop-filter) que flutua na base, sempre acessível.

## ✨ Design Disruptivo (Anti-Ecommerce)
O objetivo é que a cliente sinta que está folheando uma revista de moda, não apenas olhando uma lista de preços.

### 1. Seções Imersivas (Storytelling)
Em vez de uma grade:
- **Scroll Snap**: Cada marca (O.U.I, Eudora, Boticário) terá sua própria seção que ocupa a tela inteira.
- **Tipografia Dramática**: Uso de fontes serifadas elegantes contrastando com fontes modernas minimalistas.
- **Depth-of-Field**: Uso de imagens com fundo desfocado para destacar o produto real, dando um ar profissional de fotografia de estúdio.

### 2. Navegação por Curadoria
- A cliente não "procura" por produtos; ela é guiada por uma curadoria ("O Segredo de Eudora", "Essenciais Boticário").
- Uso de componentes **Z-Stack**: Imagens sobrepostas a textos e elementos gráficos (estrelas, brilhos) para criar tridimensionalidade.

---

## 🎨 Especificações Técnicas Sugeridas
- **Bibliotecas**: Tailwind CSS para layout rápido e Framer Motion (ou CSS Transitions) para as animações fluidas.
- **Imagens**: Uso de gradientes sobre as fotos para garantir a legibilidade do texto Rosé Gold.
- **Fonte Principal (Headlines)**: `Cormorant Garamond` ou `Playfair Display`.
- **Fonte Secundária (UI)**: `Inter` ou `Montserrat`.

---
*Este conceito foi desenvolvido para posicionar a marca Jullya Souza como uma consultoria de beleza de alto padrão.*
