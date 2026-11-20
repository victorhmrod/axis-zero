export type Kind = 'estatua' | 'capacete' | 'cubo' | 'engrenagem' | 'busto' | 'automato';
export type CategorySlug = 'estatuas' | 'colecionaveis' | 'gadgets' | 'cosplay';

export const categories: { slug: CategorySlug; label: string; desc: string }[] = [
  { slug: 'estatuas', label: 'Estátuas', desc: 'Peças de exposição de 20 a 60 cm.' },
  { slug: 'colecionaveis', label: 'Colecionáveis', desc: 'Edições numeradas, base assinada.' },
  { slug: 'gadgets', label: 'Gadgets', desc: 'Utilidades de mesa com acabamento de ateliê.' },
  { slug: 'cosplay', label: 'Cosplay', desc: 'Capacetes, armaduras e props vestíveis.' },
];

export interface Product {
  slug: string;
  name: string;
  category: CategorySlug;
  kind: Kind;
  summary: string;      // linha curta de specs (cards)
  description: string;  // texto da página de produto
  price: number;
  size: string;
  material: string;
  weight: string;
  finish: string;
  leadTime: string;
  finishes?: string[];  // opções de acabamento
  badge?: { label: string; tone: 'orange' | 'ivory' | 'steel' };
  edition?: { made: number; total: number };
  layers: number;       // nº de camadas (só informativo)
  image?: string;       // foto em /public (ex.: '/products/gta6-tribute.webp'); sem arquivo, usa a arte provisória
  note?: string;        // aviso curto exibido na página do produto
}

export const products: Product[] = [
  {
    slug: 'sentinela-01',
    name: 'Sentinela Nº 01',
    category: 'estatuas',
    kind: 'estatua',
    summary: 'Resina 8K · 32 cm · pintada à mão',
    description:
      'Guardiã de 32 cm esculpida em resina 8K, com lança removível e base numerada. Lixada, primada e pintada à mão. A primeira camada de cada peça vai na cor da casa.',
    price: 1290,
    size: '32 cm de altura',
    material: 'Resina 8K',
    weight: '640 g',
    finish: 'Pintura à mão · verniz fosco',
    leadTime: '7 a 10 dias úteis',
    finishes: ['Marfim e laranja', 'Preto fosco', 'Aço escovado'],
    badge: { label: 'Edição limitada', tone: 'orange' },
    edition: { made: 12, total: 50 },
    layers: 3200,
  },
  {
    slug: 'gta6-tribute',
    name: 'GTA 6 Tribute',
    category: 'estatuas',
    kind: 'busto',
    summary: 'Busto duplo · Resina 8K · 22 cm',
    description:
      'Tributo de fã em busto duplo: ela, com a pistola em punho, e ele, de regata e corrente, lado a lado. Esculpido em detalhe, de ruga a veia, impresso em resina 8K e finalizado à mão. Peça de colecionador para quem espera o próximo capítulo.',
    price: 649,
    size: '22 cm de largura · 24 cm de altura',
    material: 'Resina 8K',
    weight: '780 g',
    finish: 'Lixado e primer · pintura à mão opcional',
    leadTime: '10 a 15 dias úteis',
    finishes: ['Cinza primer', 'Pintado à mão'],
    badge: { label: 'Novo', tone: 'orange' },
    layers: 4400,
    image: '/products/gta6-tribute.webp',
    note: 'Obra de fã, sem vínculo com a Rockstar Games ou a Take-Two.',
  },
  {
    slug: 'resting-doom',
    name: 'Resting Doom',
    category: 'estatuas',
    kind: 'estatua',
    summary: 'Diorama no trono · Resina 8K · 28 cm',
    description:
      'O tirano em repouso: figura encapuzada sentada num trono monumental, com a mão erguida e a armadura cheia de detalhe. Diorama de mesa em resina 8K, com base entalhada e glifos gravados. Entregue lixado e com primer, pronto para a sua pintura, ou pintado à mão.',
    price: 1490,
    size: '28 cm de altura · 26 cm de largura',
    material: 'Resina 8K',
    weight: '1,6 kg',
    finish: 'Lixado e primer · pintura à mão opcional',
    leadTime: '15 a 20 dias úteis',
    finishes: ['Cinza primer', 'Pintado à mão'],
    badge: { label: 'Diorama', tone: 'ivory' },
    layers: 6200,
    image: '/products/resting-doom.webp',
    note: 'Obra de fã, sem vínculo com a Marvel ou a Disney.',
  },
  {
    slug: 'capacete-vanguarda',
    name: 'Capacete Vanguarda',
    category: 'cosplay',
    kind: 'capacete',
    summary: 'Escala 1:1 · lixado e primer · vestível',
    description:
      'Capacete em escala 1:1, impresso em partes, colado e lixado até a superfície ficar lisa. Entregue com primer, pronto para a sua pintura, ou pintado sob encomenda. Forro e ajuste interno incluídos.',
    price: 890,
    size: 'Escala 1:1 · circunferência ajustável',
    material: 'PLA+ reforçado',
    weight: '780 g',
    finish: 'Lixado e primer (cinza)',
    leadTime: '15 a 20 dias úteis',
    finishes: ['Primer cinza', 'Pintado · preto', 'Pintado · marfim'],
    badge: { label: 'Sob encomenda', tone: 'steel' },
    layers: 5400,
  },
  {
    slug: 'icone-cubico',
    name: 'Ícone Cúbico',
    category: 'colecionaveis',
    kind: 'cubo',
    summary: 'Resina 8K · 12 cm · base numerada',
    description:
      'Um cubo fatiado em camadas visíveis, sobre base numerada. A peça que mostra o processo: cada linha é uma camada de 50 µm. Ideal para estante ou mesa de trabalho.',
    price: 249,
    size: '12 cm de altura',
    material: 'Resina 8K',
    weight: '210 g',
    finish: 'Lixado · pintura à mão na base',
    leadTime: '3 a 5 dias úteis',
    finishes: ['Marfim', 'Preto fosco'],
    badge: { label: 'Novo', tone: 'ivory' },
    layers: 2400,
  },
  {
    slug: 'engrenagem-zero',
    name: 'Engrenagem Zero',
    category: 'gadgets',
    kind: 'engrenagem',
    summary: 'PETG · suporte de mesa · 5 cores',
    description:
      'Suporte de mesa para cabos, canetas ou fones. Impresso em PETG, resistente e com acabamento liso. A engrenagem central gira de verdade.',
    price: 129,
    size: '11 × 11 × 14 cm',
    material: 'PETG',
    weight: '180 g',
    finish: 'Lixado · cor sólida',
    leadTime: '2 a 4 dias úteis',
    finishes: ['Preto', 'Marfim', 'Laranja', 'Cinza aço', 'Natural'],
    layers: 1800,
  },
  {
    slug: 'busto-origem',
    name: 'Busto Origem',
    category: 'estatuas',
    kind: 'busto',
    summary: 'Resina 8K · 24 cm · acabamento fosco',
    description:
      'Busto de 24 cm sobre plinto, com acabamento fosco que deixa a luz mostrar as camadas. Cada exemplar sai assinado e numerado na base.',
    price: 690,
    size: '24 cm de altura',
    material: 'Resina 8K',
    weight: '480 g',
    finish: 'Fosco · pintura à mão',
    leadTime: '7 a 10 dias úteis',
    finishes: ['Marfim', 'Cinza aço'],
    edition: { made: 31, total: 100 },
    layers: 2900,
  },
  {
    slug: 'mini-automato',
    name: 'Mini Autômato',
    category: 'colecionaveis',
    kind: 'automato',
    summary: 'Resina · 9 cm · articulado',
    description:
      'Um autômato de 9 cm com braços e cabeça articulados. Pequeno, direto e pintado à mão. Poucas unidades por lote.',
    price: 189,
    size: '9 cm de altura',
    material: 'Resina',
    weight: '95 g',
    finish: 'Pintura à mão',
    leadTime: '3 a 5 dias úteis',
    finishes: ['Marfim', 'Laranja'],
    badge: { label: 'Poucas unidades', tone: 'orange' },
    layers: 1100,
  },
  {
    slug: 'guardiao-cinza',
    name: 'Guardião de Cinza',
    category: 'estatuas',
    kind: 'estatua',
    summary: 'Resina 8K · 45 cm · edição de 30',
    description:
      'A estátua maior da casa: 45 cm de altura, escudo e lança removíveis, pintura à mão em tons de cinza aço com a primeira camada em laranja.',
    price: 1890,
    size: '45 cm de altura',
    material: 'Resina 8K',
    weight: '1,3 kg',
    finish: 'Pintura à mão · verniz fosco',
    leadTime: '12 a 15 dias úteis',
    finishes: ['Cinza aço', 'Preto fosco'],
    badge: { label: 'Edição limitada', tone: 'orange' },
    edition: { made: 8, total: 30 },
    layers: 4800,
  },
  {
    slug: 'capacete-reator',
    name: 'Capacete Reator',
    category: 'cosplay',
    kind: 'capacete',
    summary: 'Escala 1:1 · viseira removível',
    description:
      'Capacete com viseira removível e entradas de ar vazadas. Impresso em partes, lixado e entregue com primer. Pintura sob encomenda.',
    price: 1190,
    size: 'Escala 1:1 · circunferência ajustável',
    material: 'PLA+ reforçado',
    weight: '910 g',
    finish: 'Lixado e primer (cinza)',
    leadTime: '15 a 20 dias úteis',
    finishes: ['Primer cinza', 'Pintado · preto', 'Pintado · laranja'],
    badge: { label: 'Sob encomenda', tone: 'steel' },
    layers: 6100,
  },
  {
    slug: 'cubo-origem-xl',
    name: 'Cubo Origem XL',
    category: 'colecionaveis',
    kind: 'cubo',
    summary: 'Resina 8K · 20 cm · base numerada',
    description:
      'A versão grande do Ícone Cúbico: 20 cm, base de madeira escura e numeração gravada. Uma peça de centro de mesa.',
    price: 389,
    size: '20 cm de altura',
    material: 'Resina 8K',
    weight: '520 g',
    finish: 'Lixado · pintura à mão na base',
    leadTime: '5 a 7 dias úteis',
    finishes: ['Marfim', 'Preto fosco'],
    layers: 4000,
  },
  {
    slug: 'organizador-eixo',
    name: 'Organizador Eixo',
    category: 'gadgets',
    kind: 'engrenagem',
    summary: 'PETG · organizador modular',
    description:
      'Organizador modular para a bancada: encaixa em outros módulos Eixo e se reorganiza do seu jeito. Impresso em PETG.',
    price: 99,
    size: '10 × 10 × 8 cm',
    material: 'PETG',
    weight: '120 g',
    finish: 'Lixado · cor sólida',
    leadTime: '2 a 4 dias úteis',
    finishes: ['Preto', 'Marfim', 'Laranja'],
    layers: 1500,
  },
  {
    slug: 'busto-operario',
    name: 'Busto Operário',
    category: 'estatuas',
    kind: 'busto',
    summary: 'Resina 8K · 28 cm · fosco',
    description:
      'Busto inspirado em fotos de oficina: expressão séria, ombros largos e acabamento fosco que mostra as camadas.',
    price: 740,
    size: '28 cm de altura',
    material: 'Resina 8K',
    weight: '560 g',
    finish: 'Fosco · pintura à mão',
    leadTime: '7 a 10 dias úteis',
    finishes: ['Marfim', 'Cinza aço'],
    layers: 3300,
  },
  {
    slug: 'automato-02',
    name: 'Autômato Série 02',
    category: 'colecionaveis',
    kind: 'automato',
    summary: 'Resina · 12 cm · articulado',
    description:
      'Segundo modelo da série: maior, com antena removível e detalhes em laranja. Pintado à mão, numerado na sola.',
    price: 219,
    size: '12 cm de altura',
    material: 'Resina',
    weight: '140 g',
    finish: 'Pintura à mão',
    leadTime: '3 a 5 dias úteis',
    finishes: ['Marfim', 'Laranja', 'Cinza aço'],
    badge: { label: 'Novo', tone: 'ivory' },
    layers: 1700,
  },
];

import { existsSync } from 'node:fs';
import { join } from 'node:path';

/** Foto do produto, se o arquivo existir em /public. Caso contrário, null (usa a arte provisória). */
export const photoOf = (p: Product): string | null =>
  p.image && existsSync(join(process.cwd(), 'public', p.image)) ? p.image : null;

export const categoryLabel = (slug: CategorySlug) => categories.find((c) => c.slug === slug)!.label;

export const brl = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 });

export const installment = (v: number, n = 6) =>
  `${n}x de ${(v / n).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
