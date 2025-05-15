import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  messageType: {
    type: String,
    enum: ['normal', 'invitation', 'notification'],
    default: 'normal'
  },
  content: {
    type: String,
    required: function() {
      return this.messageType === 'normal';
    }
  },

  invitation: {
    childId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    },
    relationship: {
      type: String,
      enum: ['father', 'mother', 'guardian', 'other']
    }
  },
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


messageSchema.index({ sender: 1 });
messageSchema.index({ receiver: 1 });
messageSchema.index({ isRead: 1 });
messageSchema.index({ createdAt: -1 });

const Message = mongoose.model('Message', messageSchema);
export default Message;