#!/usr/bin/env node

// Universal Component Generator for OmniSync UI
// Generates cross-platform components with the universal system

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Component templates
const componentTemplate = (name, props) => `// Universal ${name} Component using Cross-Platform Styled System
// Works across Web, React Native, and Electron

import React, { forwardRef } from "react";
import { createStyledComponent } from "../system/createStyledComponent";
import { StyledProps } from "../system/styled";

// Platform detection
const isWeb = typeof window !== 'undefined';

// ${name} props interface
export interface Universal${name}Props extends StyledProps {
  variant?: "default" | "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  children?: React.ReactNode;
  onPress?: () => void;
  onClick?: () => void;
  // Add more props as needed
}

// Base styled ${name.toLowerCase()} component
const Styled${name}Base = createStyledComponent(
  isWeb ? '${props.webElement || 'div'}' : '${props.nativeElement || 'View'}',
  {
    name: 'Universal${name}',
    defaultProps: {
      // Add default props here
      p: 4,
      borderRadius: 'md',
      backgroundColor: 'white',
    },
    variants: {
      variant: {
        default: {
          backgroundColor: 'white',
          borderColor: 'gray200',
        },
        primary: {
          backgroundColor: 'primary500',
          color: 'white',
        },
        secondary: {
          backgroundColor: 'gray100',
          color: 'gray900',
        },
      },
      size: {
        sm: { p: 2, fontSize: 'sm' },
        md: { p: 4, fontSize: 'base' },
        lg: { p: 6, fontSize: 'lg' },
      },
    },
  }
);

// Main Universal ${name} component
export const Universal${name} = forwardRef<any, Universal${name}Props>(
  (
    {
      variant = "default",
      size = "md",
      children,
      onPress,
      onClick,
      ...props
    },
    ref
  ) => {
    // Handle press events
    const handlePress = () => {
      onPress?.();
      onClick?.();
    };

    return (
      <Styled${name}Base
        ref={ref}
        variant={variant}
        size={size}
        onPress={handlePress}
        onClick={handlePress}
        {...props}
      >
        {children}
      </Styled${name}Base>
    );
  }
);

Universal${name}.displayName = "Universal${name}";

// Export as default
export default Universal${name};
`;

const indexExportTemplate = (name) => `export { Universal${name} as ${name} } from './components/Universal${name}';`;

const exampleTemplate = (name) => `// ${name} Component Example
import React from 'react';
import { ${name} } from '@omnisync/ui/universal';

export const ${name}Example = () => {
  return (
    <div>
      <h2>${name} Examples</h2>
      
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <${name} variant="default">
          Default ${name}
        </${name}>
        
        <${name} variant="primary">
          Primary ${name}
        </${name}>
        
        <${name} variant="secondary">
          Secondary ${name}
        </${name}>
      </div>
      
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
        <${name} size="sm">
          Small ${name}
        </${name}>
        
        <${name} size="md">
          Medium ${name}
        </${name}>
        
        <${name} size="lg">
          Large ${name}
        </${name}>
      </div>
    </div>
  );
};
`;

const testTemplate = (name) => `// ${name} Component Tests
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '../theme/ThemeProvider';
import { Universal${name} } from './Universal${name}';

const renderWithTheme = (component) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
};

describe('Universal${name}', () => {
  it('renders correctly', () => {
    const { getByText } = renderWithTheme(
      <Universal${name}>Test ${name}</Universal${name}>
    );
    
    expect(getByText('Test ${name}')).toBeInTheDocument();
  });
  
  it('handles press events', () => {
    const mockPress = jest.fn();
    const { getByText } = renderWithTheme(
      <Universal${name} onPress={mockPress}>
        Clickable ${name}
      </Universal${name}>
    );
    
    fireEvent.click(getByText('Clickable ${name}'));
    expect(mockPress).toHaveBeenCalledTimes(1);
  });
  
  it('applies variants correctly', () => {
    const { container } = renderWithTheme(
      <Universal${name} variant="primary">
        Primary ${name}
      </Universal${name}>
    );
    
    // Add specific variant tests here
    expect(container.firstChild).toHaveClass('omnisync-component');
  });
  
  it('applies sizes correctly', () => {
    const { container } = renderWithTheme(
      <Universal${name} size="lg">
        Large ${name}
      </Universal${name}>
    );
    
    // Add specific size tests here
    expect(container.firstChild).toHaveClass('omnisync-component');
  });
});
`;

// Helper functions
const toPascalCase = (str) => {
  return str.replace(/(?:^|[\s-_])(\w)/g, (match, letter) => letter.toUpperCase());
};

const createDirectory = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const writeFile = (filePath, content) => {
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Created: ${filePath}`);
};

// Main generation function
const generateComponent = async () => {
  console.log('🎨 Universal Component Generator for OmniSync UI\n');
  
  // Get component name
  const componentName = await new Promise((resolve) => {
    rl.question('Component name (e.g., "Alert", "Modal"): ', resolve);
  });
  
  if (!componentName) {
    console.log('❌ Component name is required');
    rl.close();
    return;
  }
  
  const pascalName = toPascalCase(componentName);
  
  // Get web element
  const webElement = await new Promise((resolve) => {
    rl.question('Web element (default: div): ', (answer) => {
      resolve(answer || 'div');
    });
  });
  
  // Get native element
  const nativeElement = await new Promise((resolve) => {
    rl.question('React Native element (default: View): ', (answer) => {
      resolve(answer || 'View');
    });
  });
  
  // Get additional options
  const includeTests = await new Promise((resolve) => {
    rl.question('Include tests? (y/N): ', (answer) => {
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
  
  const includeExample = await new Promise((resolve) => {
    rl.question('Include example? (y/N): ', (answer) => {
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
  
  rl.close();
  
  console.log(`\n🚀 Generating Universal${pascalName} component...\n`);
  
  // Create directories
  const componentsDir = path.join(__dirname, '../src/components');
  const examplesDir = path.join(__dirname, '../src/examples');
  const testsDir = path.join(__dirname, '../src/__tests__');
  
  createDirectory(componentsDir);
  if (includeExample) createDirectory(examplesDir);
  if (includeTests) createDirectory(testsDir);
  
  // Generate component file
  const componentContent = componentTemplate(pascalName, {
    webElement,
    nativeElement,
  });
  
  const componentPath = path.join(componentsDir, `${pascalName}.tsx`);
  writeFile(componentPath, componentContent);

  // Generate test file
  if (includeTests) {
    const testContent = testTemplate(pascalName);
    const testPath = path.join(testsDir, `${pascalName}.test.tsx`);
    writeFile(testPath, testContent);
  }
  
  // Generate example file
  if (includeExample) {
    const exampleContent = exampleTemplate(pascalName);
    const examplePath = path.join(examplesDir, `${pascalName}Example.tsx`);
    writeFile(examplePath, exampleContent);
  }
  
  // Update universal index file
  const universalIndexPath = path.join(__dirname, '../src/universal/index.ts');
  if (fs.existsSync(universalIndexPath)) {
    const indexContent = fs.readFileSync(universalIndexPath, 'utf8');
    const exportLine = `export { ${pascalName} } from '../components/${pascalName}';`;
    
    if (!indexContent.includes(exportLine)) {
      const updatedContent = indexContent.replace(
        '// Universal Components',
        `// Universal Components\n${exportLine}`
      );
      writeFile(universalIndexPath, updatedContent);
    }
  }
  
  console.log(`\n✨ ${pascalName} component generated successfully!\n`);
  console.log('📝 Next steps:');
  console.log(`1. Customize the component in: src/components/${pascalName}.tsx`);
  console.log(`2. Add it to your app: import { ${pascalName} } from '@omnisync/ui/universal'`);
  if (includeTests) {
    console.log(`3. Run tests: npm test ${pascalName}`);
  }
  if (includeExample) {
    console.log(`4. View example: src/examples/${pascalName}Example.tsx`);
  }
  console.log('\n🎉 Happy coding!');
};

// CLI interface
const showHelp = () => {
  console.log(`
🎨 Universal Component Generator for OmniSync UI

Usage:
  node scripts/generate-component.js [options]

Options:
  --help, -h     Show this help message
  --interactive  Run in interactive mode (default)

Examples:
  node scripts/generate-component.js
  node scripts/generate-component.js --help

This tool generates cross-platform components that work across:
- Web browsers
- React Native/Expo
- Electron applications

Generated components include:
- TypeScript definitions
- Universal styled system integration
- Platform-specific optimizations
- Responsive design support
- Theme integration
- Optional tests and examples
`);
};

// Handle CLI arguments
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  showHelp();
  process.exit(0);
}

// Run the generator
generateComponent().catch((error) => {
  console.error('❌ Error generating component:', error);
  process.exit(1);
});
