---
sidebar_position: 7
title: Grid & Layout
description: Sistema responsivo 12-colunas
---

# Grid & Layout

Sistema responsivo 12-colunas.

## Breakpoints

```
xs  <  640px
sm  640px - 768px
md  768px - 1024px
lg  1024px - 1280px
xl  1280px - 1536px
2xl > 1536px
```

## Grid Sistema

**12 colunas**

```
<div className="grid grid-cols-12 gap-4">
  <div className="col-span-4">1/3</div>
  <div className="col-span-8">2/3</div>
</div>
```

## Responsividade

```
Mobile-first approach

grid-cols-1       (mobile)
md:grid-cols-2    (tablet)
lg:grid-cols-3    (desktop)
```

---

[Voltar: Design System →](./index)
