/**
 * Accessibility Agent - Melhorias de acessibilidade
 */

import { BaseAgent } from '../base-agent';
import { glob as globSync } from 'glob';

export class AccessibilityAgent extends BaseAgent {
  constructor(maxFiles: number = 10, blacklist: string[] = []) {
    super('accessibility-agent', 'accessibility', maxFiles, blacklist);
  }

  protected async discoverFiles(): Promise<string[]> {
    const patterns = ['src/components/**/*.tsx', 'src/screens/**/*.tsx'];

    const files: string[] = [];
    for (const pattern of patterns) {
      const matches = await globSync(pattern, { ignore: ['node_modules/**', 'dist/**', 'build/**'] });
      files.push(...matches);
    }

    return files;
  }

  protected async processFile(filePath: string): Promise<{ modified: boolean; description: string }> {
    const content = await this.readFile(filePath);
    let modified = false;
    let newContent = content;
    const improvements: string[] = [];

    // Adiciona accessibilityLabel em TouchableOpacity sem label
    if (content.includes('<TouchableOpacity') && !content.includes('accessibilityLabel')) {
      const touchableRegex = /<TouchableOpacity([^>]*)>/g;
      newContent = newContent.replace(touchableRegex, (match, props) => {
        if (!props.includes('accessibilityLabel')) {
          return `<TouchableOpacity${props}\n        accessibilityLabel="Button"\n        accessibilityRole="button">`;
        }
        return match;
      });
      if (newContent !== content) {
        modified = true;
        improvements.push('added accessibilityLabel to TouchableOpacity');
      }
    }

    // Adiciona accessibilityLabel em Pressable sem label
    if (content.includes('<Pressable') && !content.includes('accessibilityLabel')) {
      const pressableRegex = /<Pressable([^>]*)>/g;
      newContent = newContent.replace(pressableRegex, (match, props) => {
        if (!props.includes('accessibilityLabel')) {
          return `<Pressable${props}\n        accessibilityLabel="Button"\n        accessibilityRole="button">`;
        }
        return match;
      });
      if (newContent !== content) {
        modified = true;
        improvements.push('added accessibilityLabel to Pressable');
      }
    }

    // Adiciona accessibilityRole em elementos interativos
    if (content.includes('<View') && content.includes('onPress') && !content.includes('accessibilityRole')) {
      const viewWithPressRegex = /<View([^>]*onPress[^>]*)>/g;
      newContent = newContent.replace(viewWithPressRegex, (match, props) => {
        if (!props.includes('accessibilityRole')) {
          return `<View${props}\n        accessibilityRole="button">`;
        }
        return match;
      });
      if (newContent !== content) {
        modified = true;
        improvements.push('added accessibilityRole to interactive View');
      }
    }

    if (modified) {
      await this.writeFile(filePath, newContent);
      return {
        modified: true,
        description: `accessibility: ${improvements.join(', ')}`,
      };
    }

    return { modified: false, description: '' };
  }
}
