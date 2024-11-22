const Message = require("../models/message");
const User = require("../models/user");

exports.getConversations = async (req, res, next) => {
  try {
    const userId = req.session.passport.user.id;

    const messages = await Message.find({
      $or: [{ sender: userId }, { recipient: userId }],
    })
      .sort({ timestamp: -1 })
      .populate("sender recipient", "firstName lastName");

    const conversations = [];
    const seenUsers = new Set();

    messages.forEach((msg) => {
      const otherUser = msg.sender._id.equals(userId) ? msg.recipient : msg.sender;

      if (!seenUsers.has(otherUser._id.toString())) {
        seenUsers.add(otherUser._id.toString());
        conversations.push({
          userId: otherUser._id,
          userName: `${otherUser.firstName} ${otherUser.lastName}`,
          lastMessage: msg.content,
          timestamp: msg.timestamp,
          unread: !msg.read && msg.sender._id.equals(otherUser._id),
        });
      }
    });

    res.render("messaging/conversations", { conversations });
  } catch (error) {
    next(error);
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const userId = req.session.passport.user.id;
    const otherId = req.params.userId;

    // Get messages
    const messages = await Message.find({
      $or: [
        { sender: userId, recipient: otherId },
        { sender: otherId, recipient: userId },
      ],
    })
      .populate("sender recipient", "firstName lastName")
      .sort({ timestamp: 1 });

    // Mark messages as read
    await Message.updateMany({ sender: otherId, recipient: userId, read: false }, { read: true });

    // Get other user's info for the chat header
    const otherUser = await User.findById(otherId, "firstName lastName");
    const currentUser = await User.findById(req.session.passport.user.id, "firstName lastName");

    res.render("messaging/chat", {
      messages,
      otherUser,
      currentUser,
    });
  } catch (error) {
    next(error);
  }
};
