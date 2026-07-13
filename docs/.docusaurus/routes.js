import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/docs',
    component: ComponentCreator('/docs', '452'),
    routes: [
      {
        path: '/docs',
        component: ComponentCreator('/docs', 'd75'),
        routes: [
          {
            path: '/docs',
            component: ComponentCreator('/docs', '6b0'),
            routes: [
              {
                path: '/docs/api-servicos',
                component: ComponentCreator('/docs/api-servicos', '5b7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/arquitetura',
                component: ComponentCreator('/docs/arquitetura', '6bb'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/boas-praticas',
                component: ComponentCreator('/docs/boas-praticas', 'cf1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/changelog',
                component: ComponentCreator('/docs/changelog', 'a62'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/componentes-layout',
                component: ComponentCreator('/docs/componentes-layout', '574'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/componentes-recursos',
                component: ComponentCreator('/docs/componentes-recursos', '447'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/componentes/',
                component: ComponentCreator('/docs/componentes/', '4ec'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/componentes/alert/',
                component: ComponentCreator('/docs/componentes/alert/', 'e37'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/componentes/button/',
                component: ComponentCreator('/docs/componentes/button/', '23a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/componentes/card/',
                component: ComponentCreator('/docs/componentes/card/', '281'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/componentes/form/',
                component: ComponentCreator('/docs/componentes/form/', 'f4f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/componentes/guia-rapido',
                component: ComponentCreator('/docs/componentes/guia-rapido', 'd23'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/componentes/input/',
                component: ComponentCreator('/docs/componentes/input/', '2e1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/componentes/mapa-visual',
                component: ComponentCreator('/docs/componentes/mapa-visual', 'beb'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/componentes/melhores-praticas',
                component: ComponentCreator('/docs/componentes/melhores-praticas', '9c0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/componentes/modal/',
                component: ComponentCreator('/docs/componentes/modal/', 'dd2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/componentes/table/',
                component: ComponentCreator('/docs/componentes/table/', '059'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/contribuicoes',
                component: ComponentCreator('/docs/contribuicoes', '11e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/design-system/',
                component: ComponentCreator('/docs/design-system/', '6e7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/design-system/acessibilidade',
                component: ComponentCreator('/docs/design-system/acessibilidade', '580'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/design-system/componentes-avancados',
                component: ComponentCreator('/docs/design-system/componentes-avancados', 'f8c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/design-system/componentes-basicos',
                component: ComponentCreator('/docs/design-system/componentes-basicos', 'a74'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/design-system/fundamentos',
                component: ComponentCreator('/docs/design-system/fundamentos', '5d2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/design-system/grid-layout',
                component: ComponentCreator('/docs/design-system/grid-layout', '18f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/design-system/padroes-uso',
                component: ComponentCreator('/docs/design-system/padroes-uso', '4da'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/governanca',
                component: ComponentCreator('/docs/governanca', '52f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/guia-contribuicao',
                component: ComponentCreator('/docs/guia-contribuicao', '480'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/intro',
                component: ComponentCreator('/docs/intro', '61d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/LEIA_PRIMEIRO',
                component: ComponentCreator('/docs/LEIA_PRIMEIRO', '492'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/primeiro-uso',
                component: ComponentCreator('/docs/primeiro-uso', '7b6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/REFERENCIA_CODIGO',
                component: ComponentCreator('/docs/REFERENCIA_CODIGO', 'b83'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/SOLUCAO_RAPIDA',
                component: ComponentCreator('/docs/SOLUCAO_RAPIDA', '02a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/SUMARIO_EXECUTIVO',
                component: ComponentCreator('/docs/SUMARIO_EXECUTIVO', '5b1'),
                exact: true
              },
              {
                path: '/docs/versionamento',
                component: ComponentCreator('/docs/versionamento', '5ba'),
                exact: true,
                sidebar: "tutorialSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/', 'e5f'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
