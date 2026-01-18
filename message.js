class InvalidMessageError extends Error {
  constructor(m) {
    super(m);
    this.name = "InvalidMessageError";
  }
}
class UserNotFoundError extends Error {
  constructor(m) {
    super(m);
    this.name = "UserNotFoundError";
  }
}

class MessagingOperation {
  constructor(messageId, sender, receiver, timestamp) {
    if (new.target === MessagingOperation) {
      throw new Error("Cannot instantiate abstract class");
    }
    this.messageId = messageId;
    this.sender = sender;
    this.receiver = receiver;
    this.timestamp = timestamp;
  }
  send() {
    throw new Error("send() must be implemented in subclass");
  }
  delete() {
    throw new Error("delete() must be implemented in subclass");
  }
}

class TextMessage extends MessagingOperation {
  constructor(messageId, sender, receiver, timestamp, content) {
    super(messageId, sender, receiver, timestamp);
    this.content = content;
    this.isRead = false;
  }
  send() {
    console.log(
      `Sending message from ${this.sender} to ${this.receiver}: "${this.content}"`
    );
  }
  delete() {
    console.log(`Message with ID ${this.messageId} deleted`);
  }
  get content() {
    return this.content;
  }
  notify(receiver, message) {
    console.log(
      ` Notification for ${receiver}: New message "${message.content}" from ${message.sender}`
    );
  }
  set content(value) {
    if (typeof value !== "string") {
      throw new Error("Content must be a string");
    }
    if (value.length > 1500) {
      throw new Error(`Content exceeds maximum length of ${this.maxLength}`);
    }
    this.content = value;
  }
  markRead() {
    this.isRead = true;
  }

  markUnread() {
    this.isRead = false;
  }
}
class MultimediaMessage extends MessagingOperation {
  constructor(messageId, sender, receiver, timestamp, filePath, fileType) {
    super(messageId, sender, receiver, timestamp);
    this.filePath = filePath;
    this.fileType = fileType;
  }
  send() {
    console.log(
      `Sending ${this.fileType} file from ${this.sender} to ${this.receiver}: ${this.filePath}`
    );
  }
  delete() {
    console.log(`Multimedia message with ID ${this.messageId} deleted.`);
  }
}

class User {
  constructor(name, contactInfo) {
    this.name = name;
    this.contactInfo = contactInfo;
    this.conversations = [];
    this.isOnline = true;
  }
  get name() {
    return _name;
  }
  set name(value) {
    if (typeof value !== "string" || value.trim().length === 0) {
      throw new Error("Invalid name");
    }
    this._name = value;
  }
  get contactInfo() {
    return this._contactInfo;
  }
  set contactInfo(value) {
    let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(value)) {
      throw new Error("Invalid Email address");
    }
    this._contactInfo = value;
  }
  createConversation(users) {
    if (!users?.length) {
      throw new Error("Must provide at least one user");
    }
    const conversation = {
      id: Date.now(),
      participants: [this, ...users],
      messages: [],
      notificationsMuted: false,
    };
    this.conversations.push(conversation);
    return conversation;
  }

  muteNotifications(conversationId) {
    const conversation = this.conversations.find(
      (c) => c.id === conversationId
    );
    if (!conversation) {
      throw new Error("Conversation not found");
    }
    conversation.notificationsMuted = true;
    console.log(`Notifications muted for conversation ID: ${conversationId}`);
  }
}

class Conversation {
  constructor() {
    this.users = [];
    this.history = [];
  }
  addUser(user) {
    if (!this.users.includes(user)) {
      this.users.push(user);
      console.log(`${user.name} added to the conversation.`);
    }
  }
  getHistory(limit) {
    if (limit && typeof limit === "number") {
      return this.history.slice(-limit);
    }
    return this.history;
  }
  addMessage(message) {
    this.history.push(message);
  }
}
