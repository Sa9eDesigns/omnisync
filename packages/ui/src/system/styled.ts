// Universal Styled System for Cross-Platform Components
// Inspired by Tamagui's styled API with cross-platform support

import { DesignTokens } from '../tokens';

// Base style properties that work across platforms
export interface BaseStyleProps {
  // Layout
  display?: 'flex' | 'none' | 'block' | 'inline' | 'inline-block';
  position?: 'relative' | 'absolute' | 'fixed' | 'static';
  top?: number | string;
  right?: number | string;
  bottom?: number | string;
  left?: number | string;
  zIndex?: keyof DesignTokens['zIndex'] | number;
  
  // Flexbox
  flex?: number;
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  flexWrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  alignSelf?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  
  // Dimensions
  width?: number | string;
  height?: number | string;
  minWidth?: number | string;
  minHeight?: number | string;
  maxWidth?: number | string;
  maxHeight?: number | string;
  
  // Spacing
  margin?: keyof DesignTokens['spacing'] | number;
  marginTop?: keyof DesignTokens['spacing'] | number;
  marginRight?: keyof DesignTokens['spacing'] | number;
  marginBottom?: keyof DesignTokens['spacing'] | number;
  marginLeft?: keyof DesignTokens['spacing'] | number;
  marginHorizontal?: keyof DesignTokens['spacing'] | number;
  marginVertical?: keyof DesignTokens['spacing'] | number;
  
  padding?: keyof DesignTokens['spacing'] | number;
  paddingTop?: keyof DesignTokens['spacing'] | number;
  paddingRight?: keyof DesignTokens['spacing'] | number;
  paddingBottom?: keyof DesignTokens['spacing'] | number;
  paddingLeft?: keyof DesignTokens['spacing'] | number;
  paddingHorizontal?: keyof DesignTokens['spacing'] | number;
  paddingVertical?: keyof DesignTokens['spacing'] | number;
  
  // Spacing shortcuts (inspired by Tamagui)
  m?: keyof DesignTokens['spacing'] | number;
  mt?: keyof DesignTokens['spacing'] | number;
  mr?: keyof DesignTokens['spacing'] | number;
  mb?: keyof DesignTokens['spacing'] | number;
  ml?: keyof DesignTokens['spacing'] | number;
  mx?: keyof DesignTokens['spacing'] | number;
  my?: keyof DesignTokens['spacing'] | number;
  
  p?: keyof DesignTokens['spacing'] | number;
  pt?: keyof DesignTokens['spacing'] | number;
  pr?: keyof DesignTokens['spacing'] | number;
  pb?: keyof DesignTokens['spacing'] | number;
  pl?: keyof DesignTokens['spacing'] | number;
  px?: keyof DesignTokens['spacing'] | number;
  py?: keyof DesignTokens['spacing'] | number;
  
  // Colors
  backgroundColor?: keyof DesignTokens['colors'] | string;
  color?: keyof DesignTokens['colors'] | string;
  
  // Color shortcuts
  bg?: keyof DesignTokens['colors'] | string;
  
  // Border
  borderWidth?: number;
  borderTopWidth?: number;
  borderRightWidth?: number;
  borderBottomWidth?: number;
  borderLeftWidth?: number;
  borderColor?: keyof DesignTokens['colors'] | string;
  borderRadius?: keyof DesignTokens['borderRadius'] | number;
  borderTopLeftRadius?: keyof DesignTokens['borderRadius'] | number;
  borderTopRightRadius?: keyof DesignTokens['borderRadius'] | number;
  borderBottomLeftRadius?: keyof DesignTokens['borderRadius'] | number;
  borderBottomRightRadius?: keyof DesignTokens['borderRadius'] | number;
  
  // Border shortcuts
  br?: keyof DesignTokens['borderRadius'] | number;
  
  // Typography
  fontSize?: keyof DesignTokens['typography']['fontSize'] | number;
  fontWeight?: keyof DesignTokens['typography']['fontWeight'] | number;
  lineHeight?: keyof DesignTokens['typography']['lineHeight'] | number;
  letterSpacing?: keyof DesignTokens['typography']['letterSpacing'] | number;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  
  // Typography shortcuts
  fs?: keyof DesignTokens['typography']['fontSize'] | number;
  fw?: keyof DesignTokens['typography']['fontWeight'] | number;
  lh?: keyof DesignTokens['typography']['lineHeight'] | number;
  ls?: keyof DesignTokens['typography']['letterSpacing'] | number;
  
  // Shadow
  shadowColor?: string;
  shadowOffset?: { width: number; height: number };
  shadowOpacity?: number;
  shadowRadius?: number;
  elevation?: number; // Android shadow
  
  // Opacity
  opacity?: number;
  
  // Transform
  transform?: Array<{
    translateX?: number;
    translateY?: number;
    scale?: number;
    scaleX?: number;
    scaleY?: number;
    rotate?: string;
    rotateX?: string;
    rotateY?: string;
    rotateZ?: string;
    skewX?: string;
    skewY?: string;
  }>;
}

// Responsive style props
export interface ResponsiveStyleProps {
  // Responsive variants using breakpoint keys
  xs?: Partial<BaseStyleProps>;
  sm?: Partial<BaseStyleProps>;
  md?: Partial<BaseStyleProps>;
  lg?: Partial<BaseStyleProps>;
  xl?: Partial<BaseStyleProps>;
  '2xl'?: Partial<BaseStyleProps>;
}

// Pseudo state props
export interface PseudoStyleProps {
  hoverStyle?: Partial<BaseStyleProps>;
  pressStyle?: Partial<BaseStyleProps>;
  focusStyle?: Partial<BaseStyleProps>;
  activeStyle?: Partial<BaseStyleProps>;
  disabledStyle?: Partial<BaseStyleProps>;
}

// Animation props
export interface AnimationStyleProps {
  animation?: keyof DesignTokens['animations']['easing'] | string;
  animationDuration?: keyof DesignTokens['animations']['duration'] | number;
  enterStyle?: Partial<BaseStyleProps>;
  exitStyle?: Partial<BaseStyleProps>;
}

// Combined style props
export interface StyledProps extends 
  BaseStyleProps, 
  ResponsiveStyleProps, 
  PseudoStyleProps, 
  AnimationStyleProps {}

// Variant system
export interface VariantConfig<T = any> {
  [variantName: string]: {
    [variantValue: string]: Partial<StyledProps> | ((props: T) => Partial<StyledProps>);
  };
}

// Component configuration
export interface ComponentConfig<T = any> {
  name?: string;
  defaultProps?: Partial<T>;
  variants?: VariantConfig<T>;
  compoundVariants?: Array<{
    variants: Record<string, any>;
    style: Partial<StyledProps> | ((props: T) => Partial<StyledProps>);
  }>;
}

// Style resolver utility
export const resolveStyleProps = (
  props: StyledProps,
  tokens: DesignTokens,
  currentBreakpoint?: keyof DesignTokens['breakpoints']
): Record<string, any> => {
  const resolvedStyles: Record<string, any> = {};

  // Helper to resolve token values
  const resolveValue = (value: any, tokenGroup?: any): any => {
    if (typeof value === 'string' && tokenGroup && tokenGroup[value] !== undefined) {
      return tokenGroup[value];
    }
    return value;
  };

  // Base styles
  Object.entries(props).forEach(([key, value]) => {
    if (value === undefined) return;

    switch (key) {
      // Layout
      case 'display':
      case 'position':
      case 'top':
      case 'right':
      case 'bottom':
      case 'left':
        resolvedStyles[key] = value;
        break;
      
      case 'zIndex':
        resolvedStyles[key] = resolveValue(value, tokens.zIndex);
        break;

      // Flexbox
      case 'flex':
      case 'flexDirection':
      case 'flexWrap':
      case 'alignItems':
      case 'alignSelf':
      case 'justifyContent':
        resolvedStyles[key] = value;
        break;

      // Dimensions
      case 'width':
      case 'height':
      case 'minWidth':
      case 'minHeight':
      case 'maxWidth':
      case 'maxHeight':
        resolvedStyles[key] = value;
        break;

      // Spacing
      case 'margin':
      case 'm':
        resolvedStyles.margin = resolveValue(value, tokens.spacing);
        break;
      case 'marginTop':
      case 'mt':
        resolvedStyles.marginTop = resolveValue(value, tokens.spacing);
        break;
      case 'marginRight':
      case 'mr':
        resolvedStyles.marginRight = resolveValue(value, tokens.spacing);
        break;
      case 'marginBottom':
      case 'mb':
        resolvedStyles.marginBottom = resolveValue(value, tokens.spacing);
        break;
      case 'marginLeft':
      case 'ml':
        resolvedStyles.marginLeft = resolveValue(value, tokens.spacing);
        break;
      case 'marginHorizontal':
      case 'mx':
        resolvedStyles.marginHorizontal = resolveValue(value, tokens.spacing);
        break;
      case 'marginVertical':
      case 'my':
        resolvedStyles.marginVertical = resolveValue(value, tokens.spacing);
        break;

      case 'padding':
      case 'p':
        resolvedStyles.padding = resolveValue(value, tokens.spacing);
        break;
      case 'paddingTop':
      case 'pt':
        resolvedStyles.paddingTop = resolveValue(value, tokens.spacing);
        break;
      case 'paddingRight':
      case 'pr':
        resolvedStyles.paddingRight = resolveValue(value, tokens.spacing);
        break;
      case 'paddingBottom':
      case 'pb':
        resolvedStyles.paddingBottom = resolveValue(value, tokens.spacing);
        break;
      case 'paddingLeft':
      case 'pl':
        resolvedStyles.paddingLeft = resolveValue(value, tokens.spacing);
        break;
      case 'paddingHorizontal':
      case 'px':
        resolvedStyles.paddingHorizontal = resolveValue(value, tokens.spacing);
        break;
      case 'paddingVertical':
      case 'py':
        resolvedStyles.paddingVertical = resolveValue(value, tokens.spacing);
        break;

      // Colors
      case 'backgroundColor':
      case 'bg':
        resolvedStyles.backgroundColor = resolveValue(value, tokens.colors);
        break;
      case 'color':
        resolvedStyles.color = resolveValue(value, tokens.colors);
        break;

      // Border
      case 'borderWidth':
      case 'borderTopWidth':
      case 'borderRightWidth':
      case 'borderBottomWidth':
      case 'borderLeftWidth':
        resolvedStyles[key] = value;
        break;
      case 'borderColor':
        resolvedStyles.borderColor = resolveValue(value, tokens.colors);
        break;
      case 'borderRadius':
      case 'br':
        resolvedStyles.borderRadius = resolveValue(value, tokens.borderRadius);
        break;
      case 'borderTopLeftRadius':
      case 'borderTopRightRadius':
      case 'borderBottomLeftRadius':
      case 'borderBottomRightRadius':
        resolvedStyles[key] = resolveValue(value, tokens.borderRadius);
        break;

      // Typography
      case 'fontSize':
      case 'fs':
        resolvedStyles.fontSize = resolveValue(value, tokens.typography.fontSize);
        break;
      case 'fontWeight':
      case 'fw':
        resolvedStyles.fontWeight = resolveValue(value, tokens.typography.fontWeight);
        break;
      case 'lineHeight':
      case 'lh':
        resolvedStyles.lineHeight = resolveValue(value, tokens.typography.lineHeight);
        break;
      case 'letterSpacing':
      case 'ls':
        resolvedStyles.letterSpacing = resolveValue(value, tokens.typography.letterSpacing);
        break;
      case 'textAlign':
      case 'textTransform':
        resolvedStyles[key] = value;
        break;

      // Shadow and other properties
      case 'shadowColor':
      case 'shadowOffset':
      case 'shadowOpacity':
      case 'shadowRadius':
      case 'elevation':
      case 'opacity':
      case 'transform':
        resolvedStyles[key] = value;
        break;

      // Skip responsive, pseudo, and animation props in base resolution
      case 'xs':
      case 'sm':
      case 'md':
      case 'lg':
      case 'xl':
      case '2xl':
      case 'hoverStyle':
      case 'pressStyle':
      case 'focusStyle':
      case 'activeStyle':
      case 'disabledStyle':
      case 'animation':
      case 'animationDuration':
      case 'enterStyle':
      case 'exitStyle':
        break;

      default:
        // Pass through any other properties
        resolvedStyles[key] = value;
        break;
    }
  });

  // Apply responsive styles if current breakpoint is provided
  if (currentBreakpoint && props[currentBreakpoint]) {
    const responsiveStyles = resolveStyleProps(props[currentBreakpoint]!, tokens);
    Object.assign(resolvedStyles, responsiveStyles);
  }

  return resolvedStyles;
};
