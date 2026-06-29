const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial DEVKIT data...');

  // 1. Seed Career Classes
  const careerClasses = [
    {
      name: 'Python Developer',
      slug: 'python-developer',
      description: 'Scripting, automation, backends',
      icon: '🐍',
      primaryColor: '#22c55e',
    },
    {
      name: 'Frontend Engineer',
      slug: 'frontend-engineer',
      description: 'UI, web interfaces, design systems',
      icon: '🌐',
      primaryColor: '#06b6d4',
    },
    {
      name: 'Backend Engineer',
      slug: 'backend-engineer',
      description: 'APIs, servers, databases',
      icon: '🔧',
      primaryColor: '#7c3aed',
    },
    {
      name: 'ML Engineer',
      slug: 'ml-engineer',
      description: 'Machine learning, model training',
      icon: '🤖',
      primaryColor: '#f59e0b',
    },
    {
      name: 'DevOps Engineer',
      slug: 'devops-engineer',
      description: 'Docker, CI/CD, cloud infra',
      icon: '🛡️',
      primaryColor: '#ef4444',
    },
    {
      name: 'Data Scientist',
      slug: 'data-scientist',
      description: 'Analysis, visualisation, statistics',
      icon: '📊',
      primaryColor: '#8b5cf6',
    },
  ];

  for (const cc of careerClasses) {
    await prisma.careerClass.upsert({
      where: { slug: cc.slug },
      update: {},
      create: cc,
    });
  }

  // 2. Seed Day 1 Subject (Python)
  const pythonSubject = await prisma.subject.upsert({
    where: { slug: 'python' },
    update: {},
    create: {
      name: 'Python',
      slug: 'python',
      regionName: 'Serpent Valley',
      regionIcon: '🐍',
      description: 'Master Python syntax, data structures, OOP, and automation.',
      isUnlocked: true,
      orderIndex: 1,
    },
  });

  // 3. Seed Python Topics / Dungeons
  const topics = [
    { name: 'Python Basics', dungeonName: 'The Burrow', orderIndex: 1, isLocked: false },
    { name: 'Data Structures', dungeonName: 'The Venom Caves', orderIndex: 2, isLocked: true },
    { name: 'OOP & Classes', dungeonName: 'The Nest', orderIndex: 3, isLocked: true },
    { name: 'File I/O & Errors', dungeonName: 'The Python Pits', orderIndex: 4, isLocked: true },
  ];

  for (const t of topics) {
    const existingTopic = await prisma.topic.findFirst({
      where: {
        subjectId: pythonSubject.id,
        name: t.name,
      },
    });

    if (!existingTopic) {
      await prisma.topic.create({
        data: {
          ...t,
          subjectId: pythonSubject.id,
        },
      });
    }
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
