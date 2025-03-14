import fs from 'fs';
import path from 'path';

/**
 * Creates a directory if it doesn't exist
 */
const ensureDir = (dirPath: string): void => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

/**
 * Writes a declaration file if it doesn't exist
 */
const writeTypeDeclaration = (moduleName: string, content: string): void => {
  const typesDir = path.resolve(__dirname, '../types');
  ensureDir(typesDir);
  
  const filePath = path.join(typesDir, `${moduleName}.d.ts`);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
    console.log(`Created type declaration for ${moduleName}`);
  } else {
    console.log(`Type declaration for ${moduleName} already exists`);
  }
};

// Create express type declaration
writeTypeDeclaration('express', `declare module 'express';`);

// Create cors type declaration
writeTypeDeclaration('cors', `declare module 'cors';`);

// Create morgan type declaration
writeTypeDeclaration('morgan', `declare module 'morgan';`);

// Create winston type declaration
writeTypeDeclaration('winston', `declare module 'winston';`);

// Create helmet type declaration
writeTypeDeclaration('helmet', `declare module 'helmet';`);

// Create express-rate-limit type declaration
writeTypeDeclaration('express-rate-limit', `declare module 'express-rate-limit';`);

// Create index.d.ts to include all types
const indexContent = `
/// <reference path="./express.d.ts" />
/// <reference path="./cors.d.ts" />
/// <reference path="./morgan.d.ts" />
/// <reference path="./winston.d.ts" />
/// <reference path="./helmet.d.ts" />
/// <reference path="./express-rate-limit.d.ts" />
`;

writeTypeDeclaration('index', indexContent);

console.log('Type declarations generated successfully!'); 