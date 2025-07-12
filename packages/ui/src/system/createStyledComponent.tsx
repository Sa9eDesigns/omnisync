// Universal Styled Component Factory
// Creates components that work across Web, React Native, and Electron

import React, { forwardRef } from 'react';
import { StyledProps, ComponentConfig, resolveStyleProps } from './styled';
import { useTokens, useResponsiveValue } from '../theme/ThemeProvider';
import { DesignTokens } from '../tokens';

// Platform detection
const isWeb = typeof window !== 'undefined';
const isReactNative = !isWeb && typeof navigator !== 'undefined' && navigator.product === 'ReactNative';

// Base component types
type WebComponent = keyof JSX.IntrinsicElements;
type NativeComponent = 'View' | 'Text' | 'ScrollView' | 'TouchableOpacity' | 'TextInput' | 'Image';

// Component props
interface StyledComponentProps extends StyledProps {
  children?: React.ReactNode;
  style?: any;
  className?: string;
  [key: string]: any;
}

// Create styled component function
export function createStyledComponent<T extends StyledComponentProps = StyledComponentProps>(
  baseComponent: WebComponent | NativeComponent | React.ComponentType<any>,
  config: ComponentConfig<T> = {}
) {
  const StyledComponent = forwardRef<any, T>((props, ref) => {
    const tokens = useTokens();
    const { variants = {}, defaultProps = {}, compoundVariants = [] } = config;

    // Merge default props
    const mergedProps = { ...defaultProps, ...props } as T & StyledProps;

    // Extract styled props and component props
    const {
      // Layout
      display, position, top, right, bottom, left, zIndex,
      // Flexbox
      flex, flexDirection, flexWrap, alignItems, alignSelf, justifyContent,
      // Dimensions
      width, height, minWidth, minHeight, maxWidth, maxHeight,
      // Spacing
      margin, marginTop, marginRight, marginBottom, marginLeft, marginHorizontal, marginVertical,
      padding, paddingTop, paddingRight, paddingBottom, paddingLeft, paddingHorizontal, paddingVertical,
      m, mt, mr, mb, ml, mx, my, p, pt, pr, pb, pl, px, py,
      // Colors
      backgroundColor, color, bg,
      // Border
      borderWidth, borderTopWidth, borderRightWidth, borderBottomWidth, borderLeftWidth,
      borderColor, borderRadius, borderTopLeftRadius, borderTopRightRadius, 
      borderBottomLeftRadius, borderBottomRightRadius, br,
      // Typography
      fontSize, fontWeight, lineHeight, letterSpacing, textAlign, textTransform,
      fs, fw, lh, ls,
      // Shadow
      shadowColor, shadowOffset, shadowOpacity, shadowRadius, elevation,
      // Other
      opacity, transform,
      // Responsive
      xs, sm, md, lg, xl, '2xl': xl2,
      // Pseudo states
      hoverStyle, pressStyle, focusStyle, activeStyle, disabledStyle,
      // Animation
      animation, animationDuration, enterStyle, exitStyle,
      // Component props
      style: customStyle,
      className,
      children,
      ...componentProps
    } = mergedProps;

    // Build styled props object
    const styledProps: StyledProps = {
      display, position, top, right, bottom, left, zIndex,
      flex, flexDirection, flexWrap, alignItems, alignSelf, justifyContent,
      width, height, minWidth, minHeight, maxWidth, maxHeight,
      margin, marginTop, marginRight, marginBottom, marginLeft, marginHorizontal, marginVertical,
      padding, paddingTop, paddingRight, paddingBottom, paddingLeft, paddingHorizontal, paddingVertical,
      m, mt, mr, mb, ml, mx, my, p, pt, pr, pb, pl, px, py,
      backgroundColor, color, bg,
      borderWidth, borderTopWidth, borderRightWidth, borderBottomWidth, borderLeftWidth,
      borderColor, borderRadius, borderTopLeftRadius, borderTopRightRadius, 
      borderBottomLeftRadius, borderBottomRightRadius, br,
      fontSize, fontWeight, lineHeight, letterSpacing, textAlign, textTransform,
      fs, fw, lh, ls,
      shadowColor, shadowOffset, shadowOpacity, shadowRadius, elevation,
      opacity, transform,
      xs, sm, md, lg, xl, '2xl': xl2,
      hoverStyle, pressStyle, focusStyle, activeStyle, disabledStyle,
      animation, animationDuration, enterStyle, exitStyle,
    };

    // Apply variant styles
    let variantStyles: Partial<StyledProps> = {};
    
    Object.entries(variants).forEach(([variantName, variantOptions]) => {
      const variantValue = (componentProps as any)[variantName];
      if (variantValue && variantOptions[variantValue]) {
        const variantStyle = variantOptions[variantValue];
        const resolvedVariantStyle = typeof variantStyle === 'function' 
          ? variantStyle(mergedProps) 
          : variantStyle;
        variantStyles = { ...variantStyles, ...resolvedVariantStyle };
      }
    });

    // Apply compound variant styles
    compoundVariants.forEach(({ variants: compoundVariantConditions, style: compoundStyle }) => {
      const matches = Object.entries(compoundVariantConditions).every(([key, value]) => 
        (componentProps as any)[key] === value
      );
      
      if (matches) {
        const resolvedCompoundStyle = typeof compoundStyle === 'function' 
          ? compoundStyle(mergedProps) 
          : compoundStyle;
        variantStyles = { ...variantStyles, ...resolvedCompoundStyle };
      }
    });

    // Merge all styles
    const finalStyledProps = { ...styledProps, ...variantStyles };

    // Get current breakpoint for responsive styles
    const currentBreakpoint = useResponsiveValue({
      xs: 'xs' as const,
      sm: 'sm' as const,
      md: 'md' as const,
      lg: 'lg' as const,
      xl: 'xl' as const,
      '2xl': '2xl' as const,
    });

    // Resolve styles based on platform
    const resolvedStyles = resolveStyleProps(finalStyledProps, tokens, currentBreakpoint);

    // Platform-specific rendering
    if (isWeb) {
      return renderWebComponent(
        baseComponent as WebComponent | React.ComponentType<any>,
        {
          ...componentProps,
          ref,
          style: { ...resolvedStyles, ...customStyle },
          className,
          children,
        }
      );
    } else {
      return renderNativeComponent(
        baseComponent as NativeComponent | React.ComponentType<any>,
        {
          ...componentProps,
          ref,
          style: [resolvedStyles, customStyle],
          children,
        }
      );
    }
  });

  StyledComponent.displayName = config.name || `Styled(${getComponentName(baseComponent)})`;

  return StyledComponent;
}

// Web component renderer
function renderWebComponent(
  Component: WebComponent | React.ComponentType<any>,
  props: any
) {
  if (typeof Component === 'string') {
    return React.createElement(Component, props);
  }
  return <Component {...props} />;
}

// Native component renderer
function renderNativeComponent(
  Component: NativeComponent | React.ComponentType<any>,
  props: any
) {
  if (typeof Component === 'string') {
    // Map string components to React Native components
    const ReactNative = require('react-native');
    const NativeComponent = ReactNative[Component];
    
    if (!NativeComponent) {
      console.warn(`Component ${Component} not found in React Native`);
      return null;
    }
    
    return React.createElement(NativeComponent, props);
  }
  
  return React.createElement(Component, props);
}

// Get component name for display
function getComponentName(component: any): string {
  if (typeof component === 'string') {
    return component;
  }
  return component.displayName || component.name || 'Component';
}

// Predefined styled components
export const Box = createStyledComponent(isWeb ? 'div' : 'View', {
  name: 'Box',
});

export const Text = createStyledComponent(isWeb ? 'span' : 'Text', {
  name: 'Text',
  defaultProps: {
    color: 'gray900',
    fontSize: 'base',
    fontWeight: 'normal',
  },
});

export const Heading = createStyledComponent(isWeb ? 'h2' : 'Text', {
  name: 'Heading',
  defaultProps: {
    color: 'gray900',
    fontSize: '2xl',
    fontWeight: 'bold',
    lineHeight: 'tight',
  },
  variants: {
    size: {
      xs: { fontSize: 'sm' },
      sm: { fontSize: 'base' },
      md: { fontSize: 'lg' },
      lg: { fontSize: 'xl' },
      xl: { fontSize: '2xl' },
      '2xl': { fontSize: '3xl' },
      '3xl': { fontSize: '4xl' },
      '4xl': { fontSize: '5xl' },
      '5xl': { fontSize: '6xl' },
    },
    variant: {
      primary: { color: 'primary600' },
      secondary: { color: 'gray600' },
      success: { color: 'success600' },
      warning: { color: 'warning600' },
      error: { color: 'error600' },
    },
  },
});

export const Button = createStyledComponent(
  isWeb ? 'button' : 'TouchableOpacity',
  {
    name: 'Button',
    defaultProps: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'md',
      paddingHorizontal: 4,
      paddingVertical: 2,
      fontSize: 'base',
      fontWeight: 'medium',
      backgroundColor: 'primary500',
      color: 'white',
    },
    variants: {
      variant: {
        primary: {
          backgroundColor: 'primary500',
          color: 'white',
          hoverStyle: { backgroundColor: 'primary600' },
          pressStyle: { backgroundColor: 'primary700' },
        },
        secondary: {
          backgroundColor: 'gray100',
          color: 'gray900',
          hoverStyle: { backgroundColor: 'gray200' },
          pressStyle: { backgroundColor: 'gray300' },
        },
        outline: {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: 'primary500',
          color: 'primary500',
          hoverStyle: { backgroundColor: 'primary50' },
          pressStyle: { backgroundColor: 'primary100' },
        },
        ghost: {
          backgroundColor: 'transparent',
          color: 'primary500',
          hoverStyle: { backgroundColor: 'primary50' },
          pressStyle: { backgroundColor: 'primary100' },
        },
        destructive: {
          backgroundColor: 'error500',
          color: 'white',
          hoverStyle: { backgroundColor: 'error600' },
          pressStyle: { backgroundColor: 'error700' },
        },
      },
      size: {
        sm: { paddingHorizontal: 3, paddingVertical: 1, fontSize: 'sm' },
        md: { paddingHorizontal: 4, paddingVertical: 2, fontSize: 'base' },
        lg: { paddingHorizontal: 6, paddingVertical: 3, fontSize: 'lg' },
      },
    },
  }
);

export const Input = createStyledComponent(isWeb ? 'input' : 'TextInput', {
  name: 'Input',
  defaultProps: {
    borderWidth: 1,
    borderColor: 'gray300',
    borderRadius: 'md',
    paddingHorizontal: 3,
    paddingVertical: 2,
    fontSize: 'base',
    backgroundColor: 'white',
    color: 'gray900',
  },
  variants: {
    variant: {
      outline: {
        borderColor: 'gray300',
        backgroundColor: 'white',
        focusStyle: { borderColor: 'primary500' },
      },
      filled: {
        borderColor: 'transparent',
        backgroundColor: 'gray100',
        focusStyle: { borderColor: 'primary500', backgroundColor: 'white' },
      },
      flushed: {
        borderWidth: 0,
        borderBottomWidth: 1,
        borderRadius: 'none',
        paddingHorizontal: 0,
        backgroundColor: 'transparent',
        focusStyle: { borderBottomColor: 'primary500' },
      },
    },
    size: {
      sm: { paddingHorizontal: 2, paddingVertical: 1, fontSize: 'sm' },
      md: { paddingHorizontal: 3, paddingVertical: 2, fontSize: 'base' },
      lg: { paddingHorizontal: 4, paddingVertical: 3, fontSize: 'lg' },
    },
  },
});
