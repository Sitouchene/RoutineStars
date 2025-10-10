import { getWindow, upsertWindow } from './evalWindow.service.js';

export async function getWindowController(req, res, next) {
  try {
    const { childId } = req.query;
    const data = await getWindow(req.user.familyId, childId || null);
    res.json(data);
  } catch (e) { next(e); }
}

export async function upsertWindowController(req, res, next) {
  try {
    const data = await upsertWindow(req.user.familyId, req.body);
    res.json(data);
  } catch (e) { next(e); }
}


