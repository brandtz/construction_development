const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')
  
  // Create admin user
  const passwordHash = await bcrypt.hash('admin123', 10)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@lchd.com' },
    update: {},
    create: {
      email: 'admin@lchd.com',
      name: 'Admin User',
      passwordHash,
      role: 'ADMIN',
    },
  })
  console.log('✅ Created admin user:', adminUser.email)
  
  // Create sample investors
  const investors = await Promise.all([
    prisma.investor.upsert({
      where: { email: 'john.smith@example.com' },
      update: {},
      create: {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@example.com',
        phone: '541-555-0101',
        company: 'Smith Family Office',
        accreditedStatus: 'VERIFIED',
        investmentCapacity: '$500K - $1M',
        preferredStructure: 'Equity',
        status: 'COMMITTED',
        source: 'Referral',
        committedAmount: 250000,
        committedDate: new Date('2024-01-15'),
        notes: 'Interested in residential development projects',
      },
    }),
    prisma.investor.upsert({
      where: { email: 'sarah.johnson@example.com' },
      update: {},
      create: {
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@example.com',
        phone: '541-555-0102',
        company: 'Johnson Investments LLC',
        accreditedStatus: 'VERIFIED',
        investmentCapacity: '$250K - $500K',
        preferredStructure: 'Debt',
        status: 'REVIEWING_DOCS',
        source: 'Website',
        notes: 'Prefers short-term debt instruments',
      },
    }),
    prisma.investor.upsert({
      where: { email: 'mike.davis@example.com' },
      update: {},
      create: {
        firstName: 'Mike',
        lastName: 'Davis',
        email: 'mike.davis@example.com',
        phone: '541-555-0103',
        accreditedStatus: 'SELF_REPORTED',
        investmentCapacity: '$100K - $250K',
        status: 'LEAD',
        source: 'Website',
        notes: 'Initial inquiry from contact form',
      },
    }),
  ])
  console.log(`✅ Created ${investors.length} sample investors`)
  
  // Create sample projects
  const projects = await Promise.all([
    prisma.project.create({
      data: {
        name: 'Springfield Meadows',
        address: '123 Meadow Lane',
        city: 'Springfield',
        state: 'OR',
        zip: '97477',
        landCost: 150000,
        buildBudget: 350000,
        targetSalePrice: 650000,
        status: 'CONSTRUCTION',
        startDate: new Date('2024-06-01'),
        targetEndDate: new Date('2024-12-31'),
        notes: '3BR/2BA single family home, 1,800 sq ft',
      },
    }),
    prisma.project.create({
      data: {
        name: 'Eugene Heights',
        address: '456 Hilltop Drive',
        city: 'Eugene',
        state: 'OR',
        zip: '97401',
        landCost: 200000,
        buildBudget: 450000,
        targetSalePrice: 825000,
        status: 'PERMITTING',
        startDate: new Date('2024-09-01'),
        targetEndDate: new Date('2025-06-30'),
        notes: '4BR/3BA single family home, 2,400 sq ft',
      },
    }),
  ])
  console.log(`✅ Created ${projects.length} sample projects`)
  
  // Create sample subcontractors
  const subcontractors = await Promise.all([
    prisma.subcontractor.create({
      data: {
        companyName: 'ABC Framing Co',
        contactName: 'Bob Wilson',
        trade: 'FRAMING',
        email: 'bob@abcframing.com',
        phone: '541-555-0201',
        address: '789 Industrial Way',
        city: 'Eugene',
        state: 'OR',
        licenseNumber: 'CCB-123456',
        licenseExpiry: new Date('2025-03-15'),
        insuranceExpiry: new Date('2025-01-31'),
        hourlyRate: 65,
        dayRate: 520,
        preferredPayment: 'Check',
        status: 'PREFERRED',
        rating: 5,
        reliabilityScore: 95,
        notes: 'Excellent work quality, very reliable',
        tags: 'residential,commercial',
      },
    }),
    prisma.subcontractor.create({
      data: {
        companyName: 'Premier Plumbing',
        contactName: 'Lisa Chen',
        trade: 'PLUMBING',
        email: 'lisa@premierplumbing.com',
        phone: '541-555-0202',
        address: '321 Trade Street',
        city: 'Springfield',
        state: 'OR',
        licenseNumber: 'CCB-234567',
        licenseExpiry: new Date('2025-06-30'),
        insuranceExpiry: new Date('2025-02-28'),
        hourlyRate: 85,
        preferredPayment: 'ACH',
        status: 'ACTIVE',
        rating: 4,
        reliabilityScore: 88,
        notes: 'Good quality work',
        tags: 'residential',
      },
    }),
    prisma.subcontractor.create({
      data: {
        companyName: 'Sparks Electric',
        contactName: 'Tom Martinez',
        trade: 'ELECTRICAL',
        email: 'tom@sparkselectric.com',
        phone: '541-555-0203',
        address: '555 Power Ave',
        city: 'Eugene',
        state: 'OR',
        licenseNumber: 'CCB-345678',
        licenseExpiry: new Date('2024-02-15'), // Expiring soon!
        insuranceExpiry: new Date('2025-04-30'),
        hourlyRate: 90,
        preferredPayment: 'Check',
        status: 'ACTIVE',
        rating: 4,
        reliabilityScore: 82,
        notes: 'License expiring soon - follow up',
        tags: 'residential,commercial',
      },
    }),
    prisma.subcontractor.create({
      data: {
        companyName: 'Quality HVAC Solutions',
        contactName: 'Rachel Green',
        trade: 'HVAC',
        email: 'rachel@qualityhvac.com',
        phone: '541-555-0204',
        address: '888 Climate Court',
        city: 'Eugene',
        state: 'OR',
        licenseNumber: 'CCB-456789',
        licenseExpiry: new Date('2025-09-30'),
        insuranceExpiry: new Date('2025-08-31'),
        hourlyRate: 95,
        preferredPayment: 'ACH',
        status: 'ACTIVE',
        rating: 5,
        reliabilityScore: 92,
        notes: 'Specializes in energy-efficient systems',
        tags: 'residential,commercial,energy-efficient',
      },
    }),
  ])
  console.log(`✅ Created ${subcontractors.length} sample subcontractors`)
  
  // Create sample vendors
  const vendors = await Promise.all([
    prisma.vendor.create({
      data: {
        companyName: 'ProBuild Materials',
        contactName: 'Steve Thompson',
        category: 'LUMBER',
        email: 'steve@probuild.com',
        phone: '541-555-0301',
        website: 'https://probuild.com',
        accountNumber: 'PB-10045',
        paymentTerms: 'Net 30',
        notes: 'Primary lumber supplier',
      },
    }),
    prisma.vendor.create({
      data: {
        companyName: 'ABC Appliances',
        contactName: 'Jennifer Lee',
        category: 'APPLIANCES',
        email: 'jennifer@abcappliances.com',
        phone: '541-555-0302',
        website: 'https://abcappliances.com',
        accountNumber: 'ABC-20089',
        paymentTerms: 'Net 15',
        notes: 'Builder discount program',
      },
    }),
  ])
  console.log(`✅ Created ${vendors.length} sample vendors`)
  
  // Create sample land leads
  const landLeads = await Promise.all([
    prisma.landLead.create({
      data: {
        address: '999 Oak Street',
        city: 'Eugene',
        state: 'OR',
        zip: '97402',
        parcelId: '1234-5678-9012',
        acreage: 0.25,
        zoning: 'R-1',
        askingPrice: 175000,
        estimatedValue: 165000,
        ownerName: 'James Peterson',
        ownerPhone: '541-555-0401',
        source: 'MLS',
        status: 'RESEARCHING',
        notes: 'Corner lot, good potential',
      },
    }),
    prisma.landLead.create({
      data: {
        address: '777 Maple Avenue',
        city: 'Springfield',
        state: 'OR',
        zip: '97478',
        parcelId: '9876-5432-1098',
        acreage: 0.33,
        zoning: 'R-2',
        askingPrice: 195000,
        estimatedValue: 180000,
        ownerName: 'Mary Williams',
        ownerPhone: '541-555-0402',
        source: 'Direct Mail',
        status: 'NEW',
        notes: 'Owner motivated to sell',
      },
    }),
  ])
  console.log(`✅ Created ${landLeads.length} sample land leads`)
  
  // Create sample activities
  await prisma.activity.create({
    data: {
      entityType: 'INVESTOR',
      entityId: investors[0].id,
      investorId: investors[0].id,
      type: 'MEETING',
      subject: 'Initial investment discussion',
      description: 'Met to discuss investment opportunity in Springfield Meadows project',
      createdById: adminUser.id,
    },
  })
  
  await prisma.activity.create({
    data: {
      entityType: 'SUBCONTRACTOR',
      entityId: subcontractors[2].id,
      subcontractorId: subcontractors[2].id,
      type: 'TASK',
      subject: 'Follow up on license renewal',
      description: 'License expiring in February - remind to renew',
      dueDate: new Date('2024-02-01'),
      createdById: adminUser.id,
    },
  })
  
  console.log('✅ Created sample activities')
  
  // Create investor portal access for committed investor
  const investorPassword = await bcrypt.hash('investor123', 10)
  await prisma.investorAuth.upsert({
    where: { investorId: investors[0].id },
    update: {},
    create: {
      investorId: investors[0].id,
      passwordHash: investorPassword,
      emailVerified: true,
      lastLogin: new Date(),
      loginCount: 5
    }
  })
  console.log('✅ Created investor portal access for John Smith')
  
  // Create sample investment for the committed investor
  const investment = await prisma.investment.create({
    data: {
      investorId: investors[0].id,
      projectId: projects[0].id,
      amount: 100000,
      type: 'EQUITY',
      equityPercent: 15.0,
      terms: '15% equity stake in project profits after sale',
      fundedDate: new Date('2024-01-20'),
      status: 'ACTIVE',
      notes: 'First investment from Smith Family Office'
    }
  })
  console.log('✅ Created sample investment')
  
  // Create distributions for the investment
  await prisma.distribution.createMany({
    data: [
      {
        investmentId: investment.id,
        amount: 2500,
        type: 'INTEREST_PAYMENT',
        date: new Date('2024-03-01'),
        notes: 'Q1 preferred return payment'
      },
      {
        investmentId: investment.id,
        amount: 2500,
        type: 'INTEREST_PAYMENT',
        date: new Date('2024-06-01'),
        notes: 'Q2 preferred return payment'
      }
    ]
  })
  console.log('✅ Created sample distributions')
  
  // Create welcome notification for investor
  await prisma.notification.create({
    data: {
      investorId: investors[0].id,
      type: 'WELCOME',
      title: 'Welcome to the Investor Portal',
      message: 'Thank you for registering! You can now view your investments, documents, and distributions.'
    }
  })
  
  await prisma.notification.create({
    data: {
      investorId: investors[0].id,
      type: 'PROJECT_UPDATE',
      title: 'Project Update: Springfield Meadows',
      message: 'Construction is progressing well. Framing is 80% complete.',
      projectId: projects[0].id
    }
  })
  
  await prisma.notification.create({
    data: {
      investorId: investors[0].id,
      type: 'DISTRIBUTION_SENT',
      title: 'Distribution Sent',
      message: 'A distribution of $2,500 has been sent for your investment in Springfield Meadows.',
      investmentId: investment.id,
      read: true,
      readAt: new Date()
    }
  })
  console.log('✅ Created sample notifications')
  
  console.log('')
  console.log('🎉 Database seeded successfully!')
  console.log('')
  console.log('CRM Admin login:')
  console.log('  Email: admin@lchd.com')
  console.log('  Password: admin123')
  console.log('')
  console.log('Investor Portal login:')
  console.log('  Email: john.smith@example.com')
  console.log('  Password: investor123')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
