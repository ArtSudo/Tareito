// create-module.js
const fs = require('fs');
const path = require('path');

// ⚙️ Leer nombre del módulo desde argumentos
const moduleName = process.argv[2];

if (!moduleName) {
  console.error('❌ Debes proporcionar un nombre de módulo. Ejemplo: node create-module.js inbox');
  process.exit(1);
}

const capitalized = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
const modulePath = path.join('src', 'api', moduleName);

// 🏗 Crear carpeta si no existe
if (!fs.existsSync(modulePath)) {
  fs.mkdirSync(modulePath, { recursive: true });
  console.log(`📁 Carpeta creada: ${modulePath}`);
} else {
  console.warn(`⚠️ La carpeta ${modulePath} ya existe. Se agregarán los archivos faltantes.`);
}

// 📄 Archivos a crear
const files = [
  {
    name: `${moduleName}Router.ts`,
    content:
`import { Router } from 'express';
import { ${capitalized}Controller } from './${moduleName}Controller';

export const ${moduleName}Router = Router();

// Define tus rutas aquí
`
  },
  {
    name: `${moduleName}Controller.ts`,
    content:
`import { Request, Response } from 'express';
import { ${capitalized}Service } from './${moduleName}Service';

export const ${capitalized}Controller = {
  // Métodos HTTP aquí
};
`
  },
  {
    name: `${moduleName}Service.ts`,
    content:
`import { ${capitalized}Repository } from './${moduleName}Repository';

export const ${capitalized}Service = {
  // Lógica de negocio aquí
};
`
  },
  {
    name: `${moduleName}Repository.ts`,
    content:
`import { prisma } from '../../common/utils/prisma';

export const ${capitalized}Repository = {
  // Operaciones de base de datos aquí
};
`
  },
  {
    name: `${moduleName}Model.ts`,
    content:
`export interface ${capitalized} {
  // Define los tipos del modelo aquí
}
`
  }
];

// 🧾 Crear archivos
files.forEach(file => {
  const filePath = path.join(modulePath, file.name);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, file.content);
    console.log(`✅ Archivo creado: ${file.name}`);
  } else {
    console.warn(`⚠️ El archivo ${file.name} ya existe, se omitió.`);
  }
});
