-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Vendor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyName" TEXT NOT NULL,
    "contactName" TEXT,
    "category" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT NOT NULL DEFAULT 'OR',
    "zip" TEXT,
    "accountNumber" TEXT,
    "creditLimit" REAL,
    "currentBalance" REAL,
    "paymentTerms" TEXT,
    "taxExempt" BOOLEAN NOT NULL DEFAULT false,
    "taxId" TEXT,
    "portalUrl" TEXT,
    "portalUsername" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Vendor" ("accountNumber", "address", "category", "companyName", "contactName", "createdAt", "email", "id", "notes", "paymentTerms", "phone", "status", "updatedAt", "website") SELECT "accountNumber", "address", "category", "companyName", "contactName", "createdAt", "email", "id", "notes", "paymentTerms", "phone", "status", "updatedAt", "website" FROM "Vendor";
DROP TABLE "Vendor";
ALTER TABLE "new_Vendor" RENAME TO "Vendor";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
