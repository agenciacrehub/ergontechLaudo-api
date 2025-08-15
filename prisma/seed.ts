import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar setores
  const setor1 = await prisma.setor.create({
    data: {
      name: 'Tecnologia',
      active: true,
    },
  });

  const setor2 = await prisma.setor.create({
    data: {
      name: 'Recursos Humanos',
      active: true,
    },
  });

  // Criar departamentos
  const departamento1 = await prisma.departament.create({
    data: {
      name: 'Desenvolvimento',
      setor_id: setor1.id,
      active: true,
    },
  });

  const departamento2 = await prisma.departament.create({
    data: {
      name: 'Gestão de Pessoas',
      setor_id: setor2.id,
      active: true,
    },
  });

  // Criar funções
  const funcao1 = await prisma.job_function.create({
    data: {
      name: 'Desenvolvedor Full Stack',
      departament_id: departamento1.id,
      active: true,
    },
  });

  const funcao2 = await prisma.job_function.create({
    data: {
      name: 'Analista de RH',
      departament_id: departamento2.id,
      active: true,
    },
  });

  // Criar empresa
  const empresa = await prisma.company.create({
    data: {
      name: 'ErgonTech Solutions',
      legal_name: 'ErgonTech Solutions Ltda',
      street: 'Rua das Inovações',
      number: '123',
      cnpj: '12345678901234',
      zip_code: '01234-567',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      active: true,
    },
  });

  // Criar usuário admin
  const hashedPassword = await bcrypt.hash('123456', 10);

  const masterUser = await prisma.user.create({
    data: {
      name: 'Master',
      email: 'master@ergontech.com',
      password: hashedPassword,
      role: 'MASTER',
      is_active: true,
    },
  });

  // Criar perfil para o usuário master
  await prisma.profile.create({
    data: {
      user_id: masterUser.id,
      company_id: empresa.id,
      function_id: funcao1.id,
      gender: 'NOT_INFORMED',
    },
  });

  
  const adminUser = await prisma.user.create({
    data: {
      name: 'Neide',
      email: 'neide@ergontech.com',
      password: hashedPassword,
      role: 'ADMIN',
      is_active: true,
    },
  });

  // Criar perfil para o usuário admin
  await prisma.profile.create({
    data: {
      user_id: adminUser.id,
      company_id: empresa.id,
      function_id: funcao1.id,
      gender: 'NOT_INFORMED',
    },
  });

  // Criar usuário comum
  const commonUser = await prisma.user.create({
    data: {
      name: 'Sávio',
      email: 'savio@ergontech.com',
      password: hashedPassword,
      role: 'USER',
      is_active: true,
    },
  });

  // Criar perfil para o usuário comum
  await prisma.profile.create({
    data: {
      user_id: commonUser.id,
      company_id: empresa.id,
      function_id: funcao2.id,
      gender: 'MALE',
      birth_date: new Date('1990-01-15'),
    },
  });

  console.log('✅ Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });