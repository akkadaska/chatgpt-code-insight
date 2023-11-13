import { ChatCompletionMessageParam } from 'openai/resources';
import {
  CodeInsightRequestDirectoryStructure,
  CodeInsightRequestFile,
  CodeInsightRequestDirectory,
} from '../../../types';

const formatDirectoryStructure = (
  dir: CodeInsightRequestDirectory,
  parentPath: string = '',
): string[] => {
  const outputLines: string[] = [];

  const currentPath = parentPath + '/' + dir.name;

  const files = dir.children.filter(
    (child) => child.type === 'file',
  ) as CodeInsightRequestFile[];
  const directories = dir.children.filter(
    (child) => child.type === 'directory',
  ) as CodeInsightRequestDirectory[];

  if (files.length > 0) {
    outputLines.push(`${currentPath}:`);
    files.forEach((file) => {
      outputLines.push(`- ${file.name}`);
    });
  }

  directories.forEach((subDir) => {
    outputLines.push(...formatDirectoryStructure(subDir, currentPath));
  });

  return outputLines;
};

const getDirectoryStructureString = (
  structure: CodeInsightRequestDirectoryStructure,
): string => {
  return formatDirectoryStructure(structure).join('\n');
};

export const createDirectoryStructureMessage = (
  structure: CodeInsightRequestDirectoryStructure,
): ChatCompletionMessageParam => {
  const structureString = getDirectoryStructureString(structure);
  return {
    role: 'system',
    content: `User's directory structure:\n${structureString}`,
  };
};
