import prisma from '../../config/database.js';

export async function getBookTemplates(filters = {}) {
  const where = { isActive: true };
  
  if (filters.language) {
    where.language = filters.language;
  }
  
  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { author: { contains: filters.search, mode: 'insensitive' } }
    ];
  }
  
  return await prisma.bookTemplate.findMany({
    where,
    orderBy: { createdAt: 'desc' }
  });
}

export async function importBookTemplate(templateId, groupId) {
  const template = await prisma.bookTemplate.findUnique({ 
    where: { id: templateId } 
  });
  
  if (!template) {
    throw new Error('Template non trouvé');
  }
  
  // Si googleBookId, chercher livre existant
  if (template.googleBookId) {
    const existing = await prisma.book.findFirst({ 
      where: { googleBookId: template.googleBookId } 
    });
    if (existing) {
      return existing;
    }
  }
  
  // Créer nouveau livre (global si googleBookId)
  return await prisma.book.create({
    data: {
      title: template.title,
      author: template.author,
      totalPages: template.totalPages,
      isbn: template.isbn,
      coverImageUrl: template.coverImageUrl,
      language: template.language,
      genres: template.genres,
      googleBookId: template.googleBookId,
      groupId: template.googleBookId ? null : groupId
    }
  });
}
