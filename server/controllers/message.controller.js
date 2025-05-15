import Message from '../models/Message.js';
import User from '../models/User.js';

// Send a new message
export const sendMessage = async (req, res) => {
  try {
    const { sender, receiver, messageType, content, invitation } = req.body;

    // Validate receiver exists
    const receiverUser = await User.findById(receiver);
    if (!receiverUser) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    // For invitations, validate child exists
    if (messageType === 'invitation') {
      const child = await User.findById(invitation.childId);
      if (!child || child.role !== 'student') {
        return res.status(400).json({ message: 'Invalid child specified' });
      }
    }

    const newMessage = new Message({
      sender,
      receiver,
      messageType,
      content,
      invitation
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all messages for a user
export const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }]
    })
      .populate('sender', 'name email role')
      .populate('receiver', 'name email role')
      .populate('invitation.childId', 'name email')
      .sort({ createdAt: -1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get unread messages count
export const getUnreadCount = async (req, res) => {
  try {
    const { userId } = req.params;
    const count = await Message.countDocuments({
      receiver: userId,
      isRead: false
    });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mark message as read
export const markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    const message = await Message.findByIdAndUpdate(
      messageId,
      { isRead: true },
      { new: true }
    );
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    res.json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Respond to invitation
export const respondToInvitation = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { status } = req.body;

    const message = await Message.findById(messageId);
    if (!message || message.messageType !== 'invitation') {
      return res.status(400).json({ message: 'Invalid invitation' });
    }

    // Update invitation status
    message.invitation.status = status;
    await message.save();

    // If accepted, add child to parent's children array
    if (status === 'accepted') {
      await User.findByIdAndUpdate(message.receiver, {
        $addToSet: { children: message.invitation.childId }
      });
    }

    res.json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    await Message.findByIdAndDelete(messageId);
    res.json({ message: 'Message deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};