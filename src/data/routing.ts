import type { Categories } from 'types/category';

export const TOP_BAR_MENU_ROUTING = [
  { path: '/products', name: 'Produkty' },
  { path: '/opinions', name: 'Opinie' }
];

export const FOOTER_MENU_ROUTING: ReadonlyArray<{ name: string; type: Categories }> = [
  { name: 'Narzędzia', type: 'tools' },
  { name: 'Chemia budowlana', type: 'constructionChemicals' },
  { name: 'Schody', type: 'stairway' },
  { name: 'Strefa dachu', type: 'roofZone' },
  { name: 'Strefa fundamentu', type: 'foundationZone' }
];
