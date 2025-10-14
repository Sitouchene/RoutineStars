import { z } from 'zod';
import { categoriesService } from './categories.service.js';

const createCategorySchema = z.object({
  title: z.string().min(1).max(50).regex(/^[a-z0-9_-]+$/, 'Le titre doit contenir uniquement des lettres minuscules, chiffres, tirets et underscores'),
  display: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  icon: z.string().max(10).optional(),
  isActive: z.boolean().default(true)
});

// Schéma de mise à jour: tous les champs optionnels
const updateCategorySchema = z.object({
  title: z.string().min(1).max(50).regex(/^[a-z0-9_-]+$/, 'Le titre doit contenir uniquement des lettres minuscules, chiffres, tirets et underscores').optional(),
  display: z.string().min(1).max(100).optional(),
  description: z.string().min(1).max(500).optional(),
  icon: z.string().max(10).optional(),
  isActive: z.boolean().optional(),
});

const toggleCategorySchema = z.object({
  isActive: z.boolean()
});

export async function getCategoriesController(req, res, next) {
  try {
    const categories = await categoriesService.getCategoriesByGroup(req.user.groupId);
    res.json(categories);
  } catch (error) {
    next(error);
  }
}

export async function getCommonCategoriesController(req, res, next) {
  try {
    const categories = await categoriesService.getSystemCategories();
    res.json(categories);
  } catch (error) {
    next(error);
  }
}

export async function getGroupCategoriesController(req, res, next) {
  try {
    const categories = await categoriesService.getGroupCategories(req.user.groupId);
    res.json(categories);
  } catch (error) {
    next(error);
  }
}

export async function createCategoryController(req, res, next) {
  try {
    const validatedData = createCategorySchema.parse(req.body);
    const category = await categoriesService.createCategory(req.user.groupId, validatedData);
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
}

export async function updateCategoryController(req, res, next) {
  try {
    const validatedData = updateCategorySchema.parse(req.body);
    const category = await categoriesService.updateCategory(
      req.params.id,
      req.user.groupId,
      validatedData
    );
    res.json(category);
  } catch (error) {
    next(error);
  }
}

export async function deleteCategoryController(req, res, next) {
  try {
    await categoriesService.deleteCategory(req.params.id, req.user.groupId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function toggleCategoryStatusController(req, res, next) {
  try {
    console.log('Toggle category request:', {
      categoryId: req.params.id,
      groupId: req.user.groupId,
      body: req.body
    });
    
    const { isActive } = toggleCategorySchema.parse(req.body);
    const category = await categoriesService.toggleCategoryStatus(
      req.params.id,
      req.user.groupId,
      isActive
    );
    
    console.log('Toggle category result:', category);
    res.json(category);
  } catch (error) {
    console.error('Toggle category error:', error);
    next(error);
  }
}
