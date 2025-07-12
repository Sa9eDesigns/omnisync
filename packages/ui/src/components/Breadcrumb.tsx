// Breadcrumb Component using Cross-Platform Styled System
// Works across Web, React Native, and Electron

import React, { forwardRef } from "react";
import { createStyledComponent } from "../system/createStyledComponent";
import { StyledProps } from "../system/styled";

// Platform detection
const isWeb = typeof window !== 'undefined';

// Breadcrumb props interface
export interface BreadcrumbProps extends StyledProps {
  separator?: React.ReactNode;
  children: React.ReactNode;
}

// Base styled breadcrumb container
const BreadcrumbContainer = createStyledComponent(
  isWeb ? 'nav' : 'View',
  {
    name: 'Breadcrumb',
    defaultProps: {
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 2,
    },
  }
);

// Breadcrumb list
const BreadcrumbList = createStyledComponent(
  isWeb ? 'ol' : 'View',
  {
    name: 'BreadcrumbList',
    defaultProps: {
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 2,
      listStyle: 'none',
      margin: 0,
      padding: 0,
    },
  }
);

// Breadcrumb item
export interface BreadcrumbItemProps extends StyledProps {
  children: React.ReactNode;
}

const BreadcrumbItemBase = createStyledComponent(
  isWeb ? 'li' : 'View',
  {
    name: 'BreadcrumbItem',
    defaultProps: {
      display: 'flex',
      alignItems: 'center',
      gap: 2,
    },
  }
);

// Breadcrumb link
export interface BreadcrumbLinkProps extends StyledProps {
  href?: string;
  onPress?: () => void;
  current?: boolean;
  children: React.ReactNode;
}

const BreadcrumbLinkBase = createStyledComponent(
  isWeb ? 'a' : 'TouchableOpacity',
  {
    name: 'BreadcrumbLink',
    defaultProps: {
      fontSize: 'sm',
      color: 'gray600',
      textDecoration: 'none',
      transition: 'all 0.2s',
      cursor: isWeb ? 'pointer' : undefined,
      hoverStyle: {
        color: 'gray900',
        textDecoration: isWeb ? 'underline' : 'none',
      },
      pressStyle: {
        color: 'gray900',
      },
    },
    variants: {
      current: {
        true: {
          color: 'gray900',
          fontWeight: 'medium',
          cursor: isWeb ? 'default' : undefined,
          pointerEvents: 'none',
        },
        false: {},
      },
    },
  }
);

// Breadcrumb separator
export interface BreadcrumbSeparatorProps extends StyledProps {
  children?: React.ReactNode;
}

const BreadcrumbSeparatorBase = createStyledComponent(
  isWeb ? 'span' : 'Text',
  {
    name: 'BreadcrumbSeparator',
    defaultProps: {
      color: 'gray400',
      fontSize: 'sm',
      userSelect: 'none',
    },
  }
);

// Default separator icon
const DefaultSeparator = () => {
  if (isWeb) {
    return (
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="9,18 15,12 9,6" />
      </svg>
    );
  } else {
    const { Text } = require('react-native');
    return <Text style={{ color: 'currentColor', fontSize: 12 }}>›</Text>;
  }
};

// Main Breadcrumb component
export const Breadcrumb = forwardRef<any, BreadcrumbProps>(
  ({ separator, children, ...props }, ref) => {
    const defaultSeparator = separator || <DefaultSeparator />;

    // Process children to add separators
    const childrenArray = React.Children.toArray(children);
    const processedChildren = childrenArray.reduce((acc: React.ReactNode[], child, index) => {
      acc.push(child);
      
      // Add separator between items (but not after the last item)
      if (index < childrenArray.length - 1) {
        acc.push(
          <BreadcrumbSeparator key={`separator-${index}`}>
            {defaultSeparator}
          </BreadcrumbSeparator>
        );
      }
      
      return acc;
    }, []);

    return (
      <BreadcrumbContainer
        ref={ref}
        role={isWeb ? 'navigation' : undefined}
        aria-label={isWeb ? 'Breadcrumb' : undefined}
        {...props}
      >
        <BreadcrumbList>
          {processedChildren}
        </BreadcrumbList>
      </BreadcrumbContainer>
    );
  }
);

// BreadcrumbItem component
export const BreadcrumbItem = forwardRef<any, BreadcrumbItemProps>(
  ({ children, ...props }, ref) => {
    return (
      <BreadcrumbItemBase ref={ref} {...props}>
        {children}
      </BreadcrumbItemBase>
    );
  }
);

// BreadcrumbLink component
export const BreadcrumbLink = forwardRef<any, BreadcrumbLinkProps>(
  ({ href, onPress, current = false, children, ...props }, ref) => {
    const handlePress = () => {
      if (!current && onPress) {
        onPress();
      }
    };

    return (
      <BreadcrumbLinkBase
        ref={ref}
        href={isWeb && !current ? href : undefined}
        current={current}
        onPress={handlePress}
        onClick={handlePress}
        aria-current={isWeb && current ? 'page' : undefined}
        {...props}
      >
        {children}
      </BreadcrumbLinkBase>
    );
  }
);

// BreadcrumbSeparator component
export const BreadcrumbSeparator = forwardRef<any, BreadcrumbSeparatorProps>(
  ({ children, ...props }, ref) => {
    return (
      <BreadcrumbSeparatorBase
        ref={ref}
        aria-hidden={isWeb ? 'true' : undefined}
        {...props}
      >
        {children || <DefaultSeparator />}
      </BreadcrumbSeparatorBase>
    );
  }
);

// BreadcrumbPage component (for current page)
export interface BreadcrumbPageProps extends StyledProps {
  children: React.ReactNode;
}

export const BreadcrumbPage = forwardRef<any, BreadcrumbPageProps>(
  ({ children, ...props }, ref) => {
    return (
      <BreadcrumbLinkBase
        ref={ref}
        current={true}
        {...props}
      >
        {children}
      </BreadcrumbLinkBase>
    );
  }
);

Breadcrumb.displayName = "Breadcrumb";
BreadcrumbItem.displayName = "BreadcrumbItem";
BreadcrumbLink.displayName = "BreadcrumbLink";
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";
BreadcrumbPage.displayName = "BreadcrumbPage";

// Compound component
const BreadcrumbCompound = Object.assign(Breadcrumb, {
  Item: BreadcrumbItem,
  Link: BreadcrumbLink,
  Separator: BreadcrumbSeparator,
  Page: BreadcrumbPage,
});

export { 
  BreadcrumbCompound as BreadcrumbComponent,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
};

export default Breadcrumb;
