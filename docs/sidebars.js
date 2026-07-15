// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    'intro',

    {
      type: 'category',
      label: '🚀 Comece Aqui',
      items: ['primeiro-uso'],
      collapsed: false,
    },

    {
      type: 'category',
      label: '🏗️ Arquitetura Técnica',
      items: [
        'arquitetura',
        'microfrontends',
        'estado-redux',
        'ssr-ssg',
      ],
      collapsed: false,
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
      collapsed: true,
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
      collapsed: true,
    },

    {
      type: 'category',
      label: '📚 Documentação Técnica',
      items: [
        'api-servicos',
        'boas-praticas',
        'changelog',
      ],
      collapsed: true,
    },
  ],
};

module.exports = sidebars;
