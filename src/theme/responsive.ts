import { useWindowDimensions } from 'react-native';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export const breakpoints: Record<Breakpoint, number> = {
  xs: 0,
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1366,
};

export const orderedBreakpoints: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl'];

export type Orientation = 'portrait' | 'landscape';

export type ResponsiveValue<T> = Partial<Record<Breakpoint, T>> & { xs: T };

const pickFromMap = <T,>(value: ResponsiveValue<T>, bp: Breakpoint): T => {
  // Walk down breakpoints until we find a defined value
  const idx = orderedBreakpoints.indexOf(bp);
  for (let i = idx; i >= 0; i--) {
    const b = orderedBreakpoints[i]!;
    if (value[b] !== undefined) return value[b]!;
  }
  return value.xs;
};

export const useResponsive = () => {
  const { width, height } = useWindowDimensions();

  let bp: Breakpoint = 'xs';
  for (const b of orderedBreakpoints) {
    if (width >= breakpoints[b]) bp = b;
  }

  const orientation: Orientation = width >= height ? 'landscape' : 'portrait';
  const isPhone = bp === 'xs' || bp === 'sm';
  const isTablet = bp === 'md' || bp === 'lg';
  const isDesktop = bp === 'xl';
  const isCompact = bp === 'xs';

  const pick = <T,>(value: ResponsiveValue<T>): T => pickFromMap(value, bp);

  return {
    width,
    height,
    bp,
    orientation,
    isPhone,
    isTablet,
    isDesktop,
    isCompact,
    isLandscape: orientation === 'landscape',
    isPortrait: orientation === 'portrait',
    pick,
  };
};

export const minTapTarget = 44; // iOS HIG; bumped to 56 for primary kid taps
export const kidTapTarget = 64;
