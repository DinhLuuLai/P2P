import { MOCK_CONVERSATIONS, MOCK_MESSAGES } from '../data/mockData';
import type { Conversation, Message } from '../types';
import { readStorage, simulateNetwork, writeStorage } from './apiClient';
import { STORAGE_KEYS } from './storageKeys';

function getStoredConversations(): Conversation[] {
  const existing = readStorage<Conversation[] | null>(STORAGE_KEYS.CONVERSATIONS, null);
  if (!existing || existing.length === 0) {
    writeStorage(STORAGE_KEYS.CONVERSATIONS, MOCK_CONVERSATIONS);
    return MOCK_CONVERSATIONS;
  }
  return existing;
}

function getStoredMessages(): Message[] {
  const existing = readStorage<Message[] | null>(STORAGE_KEYS.MESSAGES, null);
  if (!existing || existing.length === 0) {
    writeStorage(STORAGE_KEYS.MESSAGES, MOCK_MESSAGES);
    return MOCK_MESSAGES;
  }
  return existing;
}

export const chatService = {
  async getConversations(userId: string): Promise<Conversation[]> {
    const all = getStoredConversations()
      .filter((c) => c.participantIds.includes(userId))
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    return simulateNetwork(all, 120);
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    const all = getStoredMessages()
      .filter((m) => m.conversationId === conversationId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    return simulateNetwork(all, 100);
  },

  async sendMessage(conversationId: string, senderId: string, content: string): Promise<Message> {
    const trimmed = content.trim();
    if (!trimmed) throw new Error('Nội dung tin nhắn không được trống.');

    const nowIso = new Date().toISOString();
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId,
      content: trimmed,
      createdAt: nowIso,
      isRead: false,
    };

    const messages = getStoredMessages();
    writeStorage(STORAGE_KEYS.MESSAGES, [...messages, newMessage]);

    const conversations = getStoredConversations();
    const nextConvs = conversations.map((c) =>
      c.id === conversationId ? { ...c, lastMessage: trimmed, updatedAt: nowIso } : c
    );
    writeStorage(STORAGE_KEYS.CONVERSATIONS, nextConvs);

    return simulateNetwork(newMessage, 100);
  },

  async startOrGetConversation(
    currentUserId: string,
    targetUserId: string,
    listingId?: string
  ): Promise<Conversation> {
    const conversations = getStoredConversations();
    const existing = conversations.find(
      (c) =>
        c.participantIds.includes(currentUserId) &&
        c.participantIds.includes(targetUserId) &&
        (!listingId || c.listingId === listingId)
    );
    if (existing) return simulateNetwork(existing, 100);

    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      participantIds: [currentUserId, targetUserId],
      listingId,
      lastMessage: 'Bắt đầu cuộc trò chuyện mới',
      updatedAt: new Date().toISOString(),
      unreadCount: 0,
    };
    writeStorage(STORAGE_KEYS.CONVERSATIONS, [newConv, ...conversations]);
    return simulateNetwork(newConv, 150);
  },

  markConversationRead(conversationId: string, currentUserId: string): void {
    const conversations = getStoredConversations();
    writeStorage(
      STORAGE_KEYS.CONVERSATIONS,
      conversations.map((c) => (c.id === conversationId ? { ...c, unreadCount: 0 } : c))
    );

    const messages = getStoredMessages();
    writeStorage(
      STORAGE_KEYS.MESSAGES,
      messages.map((m) =>
        m.conversationId === conversationId && m.senderId !== currentUserId ? { ...m, isRead: true } : m
      )
    );
  },
};
