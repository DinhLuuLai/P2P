import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Check, CheckCheck, MessageSquare, Send, Sparkles } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/StateViews';
import { useApp } from '../context/AppContext';
import { authService } from '../services/authService';
import { chatService } from '../services/chatService';
import { listingService } from '../services/listingService';
import type { Conversation, Listing, Message } from '../types';
import { cn, formatPrice, formatRelativeTime } from '../utils/format';

export function MessagesPage() {
  const { user, loginDemo, refreshCounts } = useApp();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(searchParams.get('conv'));
  const [messages, setMessages] = useState<Message[]>([]);
  const [linkedListing, setLinkedListing] = useState<Listing | null>(null);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    let active = true;

    async function initChat() {
      const targetUserId = searchParams.get('to');
      const listingId = searchParams.get('listing') ?? undefined;

      if (targetUserId && targetUserId !== user!.id) {
        const conv = await chatService.startOrGetConversation(user!.id, targetUserId, listingId);
        if (active) setActiveConvId(conv.id);
      }

      const list = await chatService.getConversations(user!.id);
      if (active) {
        setConversations(list);
        if (!activeConvId && !targetUserId && list.length > 0 && window.innerWidth >= 768) {
          setActiveConvId(list[0].id);
        }
      }
    }

    initChat();
    return () => {
      active = false;
    };
  }, [user, searchParams]);

  useEffect(() => {
    if (!activeConvId || !user) return;
    let active = true;

    async function loadMessages() {
      const msgs = await chatService.getMessages(activeConvId!);
      chatService.markConversationRead(activeConvId!, user!.id);
      refreshCounts();

      const conv = conversations.find((c) => c.id === activeConvId);
      if (conv?.listingId) {
        const l = await listingService.getListingById(conv.listingId);
        if (active) setLinkedListing(l);
      } else {
        if (active) setLinkedListing(null);
      }

      if (active) {
        setMessages(msgs);
        setConversations((prev) =>
          prev.map((c) => (c.id === activeConvId ? { ...c, unreadCount: 0 } : c))
        );
      }
    }

    loadMessages();
    return () => {
      active = false;
    };
  }, [activeConvId, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <EmptyState
          icon={<MessageSquare className="h-7 w-7" />}
          title="Đăng nhập để sử dụng Tin nhắn"
          description="Kết nối và trao đổi trực tiếp với người bán hoặc người mua ngay trên Student P2P."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <Button onClick={loginDemo} leftIcon={<Sparkles className="h-4 w-4" />}>
                Dùng tài khoản Demo
              </Button>
              <Button variant="outline" onClick={() => navigate('/auth?mode=login')}>
                Đăng nhập
              </Button>
            </div>
          }
        />
      </div>
    );
  }

  const activeConv = conversations.find((c) => c.id === activeConvId) ?? null;
  const getPartner = (conv: Conversation) => {
    const partnerId = conv.participantIds.find((id) => id !== user.id) ?? user.id;
    return authService.getUserById(partnerId);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConvId || !draft.trim() || sending) return;
    setSending(true);
    try {
      const sent = await chatService.sendMessage(activeConvId, user.id, draft);
      setMessages((prev) => [...prev, sent]);
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConvId ? { ...c, lastMessage: sent.content, updatedAt: sent.createdAt } : c
        )
      );
      setDraft('');
    } finally {
      setSending(false);
    }
  };

  const activePartner = activeConv ? getPartner(activeConv) : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 animate-fade-in">
      <h1 className="mb-4 font-display text-2xl font-bold text-slate-900 dark:text-white">
        Tin nhắn P2P
      </h1>

      <Card className="grid h-[calc(100vh-14rem)] min-h-[480px] grid-cols-1 overflow-hidden md:grid-cols-12">
        {/* Conversation List */}
        <div
          className={cn(
            'flex flex-col border-r border-slate-200 dark:border-slate-800 md:col-span-4',
            activeConvId ? 'hidden md:flex' : 'flex'
          )}
        >
          <div className="border-b border-slate-100 px-4 py-3 text-xs font-semibold tracking-wider text-slate-500 uppercase dark:border-slate-800">
            Cuộc trò chuyện ({conversations.length})
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/70">
            {conversations.length === 0 ? (
              <div className="p-6 text-center text-sm text-slate-500">Chưa có cuộc trò chuyện nào.</div>
            ) : (
              conversations.map((conv) => {
                const partner = getPartner(conv);
                const selected = conv.id === activeConvId;
                return (
                  <button
                    key={conv.id}
                    type="button"
                    onClick={() => setActiveConvId(conv.id)}
                    className={cn(
                      'flex w-full items-start gap-3 p-4 text-left transition cursor-pointer',
                      selected
                        ? 'bg-indigo-50/80 dark:bg-indigo-950/40'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    )}
                  >
                    <Avatar
                      src={partner?.avatar}
                      name={partner?.name ?? 'Sinh viên'}
                      size="md"
                      verified={partner?.verifiedStudent}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                          {partner?.name ?? 'Sinh viên'}
                        </span>
                        <span className="shrink-0 text-[11px] text-slate-400">
                          {formatRelativeTime(conv.updatedAt)}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center justify-between gap-2">
                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                          {conv.lastMessage}
                        </p>
                        {conv.unreadCount > 0 && (
                          <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 px-1.5 text-[10px] font-bold text-white">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Active Chat Window */}
        <div
          className={cn(
            'flex flex-col md:col-span-8',
            activeConvId ? 'flex' : 'hidden md:flex'
          )}
        >
          {activeConv && activePartner ? (
            <>
              {/* Header */}
              <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveConvId(null)}
                    aria-label="Quay lại danh sách"
                    className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 md:hidden dark:hover:bg-slate-800"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <Avatar
                    src={activePartner.avatar}
                    name={activePartner.name}
                    size="sm"
                    verified={activePartner.verifiedStudent}
                  />
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                      {activePartner.name}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {activePartner.university}
                    </p>
                  </div>
                </div>

                {linkedListing && (
                  <Link
                    to={`/listing/${linkedListing.id}`}
                    className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs transition hover:border-indigo-300 sm:flex dark:border-slate-700 dark:bg-slate-800"
                  >
                    <span className="max-w-44 truncate font-medium text-slate-700 dark:text-slate-200">
                      {linkedListing.title}
                    </span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      {formatPrice(linkedListing.price, linkedListing.listingType)}
                    </span>
                  </Link>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50/50 p-4 dark:bg-slate-950/40">
                {messages.map((msg) => {
                  const isMine = msg.senderId === user.id;
                  return (
                    <div
                      key={msg.id}
                      className={cn('flex flex-col', isMine ? 'items-end' : 'items-start')}
                    >
                      <div
                        className={cn(
                          'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-xs sm:max-w-[70%]',
                          isMine
                            ? 'rounded-br-sm bg-indigo-600 text-white'
                            : 'rounded-bl-sm border border-slate-200 bg-white text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100'
                        )}
                      >
                        {msg.content}
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-400">
                        <span>{formatRelativeTime(msg.createdAt)}</span>
                        {isMine &&
                          (msg.isRead ? (
                            <CheckCheck className="h-3 w-3 text-indigo-500" />
                          ) : (
                            <Check className="h-3 w-3" />
                          ))}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form
                onSubmit={handleSend}
                className="flex items-center gap-2 border-t border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900"
              >
                <input
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Nhập tin nhắn trao đổi..."
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
                <Button type="submit" disabled={!draft.trim() || sending} leftIcon={<Send className="h-4 w-4" />}>
                  Gửi
                </Button>
              </form>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center p-8 text-center text-slate-500">
              <MessageSquare className="mb-3 h-10 w-10 text-slate-300 dark:text-slate-700" />
              <p className="text-sm font-medium">Chọn một cuộc trò chuyện để bắt đầu nhắn tin</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
