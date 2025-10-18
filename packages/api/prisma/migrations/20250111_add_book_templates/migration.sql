-- CreateTable
CREATE TABLE "book_templates" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "totalPages" INTEGER NOT NULL,
    "isbn" TEXT,
    "coverImageUrl" TEXT,
    "language" TEXT NOT NULL DEFAULT 'fr',
    "genres" TEXT[],
    "googleBookId" TEXT,
    "synopsis" TEXT,
    "ageRange" JSONB,
    "themes" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "book_templates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "book_templates_googleBookId_key" ON "book_templates"("googleBookId");

-- CreateIndex
CREATE UNIQUE INDEX "books_google_unique" ON "books"("googleBookId") WHERE "googleBookId" IS NOT NULL;
