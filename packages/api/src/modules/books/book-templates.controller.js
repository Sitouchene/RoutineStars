import * as templateService from './book-templates.service.js';

export async function getBookTemplatesHandler(req, res) {
  try {
    const filters = {
      language: req.query.language,
      search: req.query.search
    };
    const templates = await templateService.getBookTemplates(filters);
    res.json(templates);
  } catch (error) {
    console.error('Error fetching book templates:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function importBookTemplateHandler(req, res) {
  try {
    const { templateId } = req.params;
    const { groupId } = req.user;
    const book = await templateService.importBookTemplate(templateId, groupId);
    res.status(201).json(book);
  } catch (error) {
    console.error('Error importing book template:', error);
    res.status(400).json({ error: error.message });
  }
}
