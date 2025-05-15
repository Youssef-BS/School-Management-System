import express from 'express';
import {
  sendMessage,
  getMessages,
  getUnreadCount,
  markAsRead,
  respondToInvitation,
  deleteMessage
} from '../controllers/message.controller.js';


const router = express.Router();


router.route('/')
  .post(sendMessage);

router.route('/user/:userId')
  .get(getMessages);

router.route('/unread/:userId')
  .get(getUnreadCount);

router.route('/read/:messageId')
  .put(markAsRead);

router.route('/invitation/:messageId')
  .put(respondToInvitation);

router.route('/:messageId')
  .delete(deleteMessage);

export default router;