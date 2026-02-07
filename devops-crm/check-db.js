const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function check() {
  const investors = await p.investor.findMany()
  console.log('Investors:', investors.length)
  investors.forEach(i => console.log(`  - ${i.firstName} ${i.lastName} (${i.status})`))
  
  const projects = await p.project.findMany()
  console.log('Projects:', projects.length)
  
  const users = await p.user.findMany()
  console.log('Users:', users.length)
  users.forEach(u => console.log(`  - ${u.email} (${u.role})`))
  
  await p.$disconnect()
}

check()
