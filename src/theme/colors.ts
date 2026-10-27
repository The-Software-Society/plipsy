export const colors = {
  cream: '#F5EFE3',
  creamSoft: '#FAF6EC',
  creamDeep: '#EBE3D2',

  ink: '#2A2A2A',
  inkSoft: '#5A554F',
  inkFaint: '#8E867D',

  sage: '#7A9B7A',
  sageDark: '#5C7A5C',
  sageSoft: '#B5C9B5',

  terracotta: '#C68066',
  terracottaDeep: '#A66751',
  terracottaSoft: '#E5BFAF',

  mustard: '#D4A85A',
  mustardSoft: '#E8CB94',

  dustyBlue: '#7A95B0',
  dustyBlueSoft: '#B6C4D4',

  shadow: 'rgba(42, 42, 42, 0.08)',
  shadowDeep: 'rgba(42, 42, 42, 0.16)',

  scrim: 'rgba(245, 239, 227, 0.92)',
} as const;

export type ColorKey = keyof typeof colors;
