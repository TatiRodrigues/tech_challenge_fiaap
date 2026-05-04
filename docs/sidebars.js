/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    'intro',
    
    {
      type: 'category',
      label: '🚀 Comece Aqui',
      items: [
        'primeiro-uso',
        'LEIA_PRIMEIRO',
        'SOLUCAO_RAPIDA',
      ],
      collapsed: true,
    },

    {
      type: 'category',
      label: '🎨 Design System',
      items: [
        'design-system/index',
        'design-system/fundamentos',
        'design-system/componentes-basicos',
        'design-system/componentes-avancados',
        'design-system/padroes-uso',
        'design-system/acessibilidade',
        'design-system/grid-layout',
      ],
      collapsed: false,
    },

    {
      type: 'category',
      label: '📦 Componentes',
      items: [
        'componentes/index',
        'componentes/guia-rapido',
        {
          type: 'category',
          label: '📥 Entrada de Dados',
          items: [
            'componentes/button/index',
            'componentes/input/index',
            'componentes/form/index',
          ],
          collapsed: true,
        },
        {
          type: 'category',
          label: '📢 Feedback',
          items: [
            'componentes/alert/index',
            'componentes/modal/index',
          ],
          collapsed: true,
        },
        {
          type: 'category',
          label: '📄 Conteúdo',
          items: [
            'componentes/card/index',
            'componentes/table/index',
          ],
          collapsed: true,
        },
        'componentes/melhores-praticas',
        'componentes/mapa-visual',
      ],
      collapsed: false,
    },

    {
      type: 'category',
      label: '📚 Documentação Técnica',
      items: [
        'arquitetura',
        'api-servicos',
        'boas-praticas',
        'REFERENCIA_CODIGO',
        'componentes-layout',
        'componentes-recursos',
      ],
      collapsed: true,
    },

    {
      type: 'category',
      label: '🤝 Contribuir',
      items: [
        'contribuicoes',
        'guia-contribuicao',
        'governanca',
        'changelog',
        'versionamento',
      ],
      collapsed: true,
    },
  ],
};

module.exports = sidebars;
