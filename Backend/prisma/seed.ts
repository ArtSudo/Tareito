import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  // Crear usuario principal
  const user = await prisma.user.create({
    data: {
      email: 'demo@tareito.ai',
      password: '12345678', // ⚠️ Reemplaza por hash real en producción
      name: 'Usuario Demo',
    },
  });

  // Crear algunos InboxItems
  await prisma.inboxItem.createMany({
    data: [
      { content: 'Leer correo importante', userId: user.id },
      { content: 'Comprar materiales de oficina', userId: user.id },
      { content: 'Llamar a proveedor', userId: user.id },
    ],
  });

  // Crear un proyecto
  const project = await prisma.project.create({
    data: {
      title: 'Proyecto de prueba',
      description: 'Este es un proyecto de ejemplo.',
      userId: user.id,
    },
  });

  // Crear un contexto
  const context = await prisma.context.create({
    data: {
      name: 'Casa',
      userId: user.id,
    },
  });

  // Crear NextActions asociadas
  await prisma.nextAction.createMany({
    data: [
      {
        content: 'Enviar informe final',
        userId: user.id,
        projectId: project.id,
        contextId: context.id,
        status: 'pending',
      },
      {
        content: 'Organizar escritorio',
        userId: user.id,
        status: 'done',
      },
    ],
  });

  // Crear una referencia
  await prisma.referenceItem.create({
    data: {
      title: 'Manual de usuario',
      content: 'Instrucciones para el sistema.',
      fileUrl: 'https://example.com/manual.pdf',
      userId: user.id,
    },
  });

  console.log('✅ Base de datos poblada con datos iniciales.');
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
