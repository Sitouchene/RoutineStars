import * as service from './messages.service.js';

export async function listMessagesController(req, res, next) {
  try {
    const { childId, date } = req.query;
    const data = await service.listMessages(req.user.groupId, { childId, date });
    res.json(data);
  } catch (e) { next(e); }
}

export async function getMessageForDateController(req, res, next) {
  try {
    const { childId, date } = req.query;
    const data = await service.getMessageForDate(req.user.groupId, childId, date);
    res.json(data);
  } catch (e) { next(e); }
}

export async function createMessageController(req, res, next) {
  try {
    const payload = { ...req.body, groupId: req.user.groupId };
    const data = await service.createMessage(payload);
    res.status(201).json(data);
  } catch (e) { next(e); }
}

export async function updateMessageController(req, res, next) {
  try {
    const data = await service.updateMessage(req.params.id, req.user.groupId, req.body);
    res.json(data);
  } catch (e) { next(e); }
}

export async function deleteMessageController(req, res, next) {
  try {
    const data = await service.deleteMessage(req.params.id, req.user.groupId);
    res.json(data);
  } catch (e) { next(e); }
}


