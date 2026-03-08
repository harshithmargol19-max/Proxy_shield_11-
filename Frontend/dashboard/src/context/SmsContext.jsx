import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { fetchMessages } from '../services/smsApi';
import { MessageStatus, SecurityStatus, StatusConfig, MessageType, defaultInboxFilter } from '../types/sms';

const SmsContext = createContext(null);

export const useMessages = () => {
  const context = useContext(SmsContext);
  if (!context) {
    throw new Error('useMessages must be used within SmsProvider');
  }
  return context;
};

// Transform backend data to match sms.txt format
const transformMessage = (msg) => {
  // Extract subject from first line of content
  const firstLine = msg.sanitized_content?.split('\n')[0] || '';
  const subject = firstLine.length > 50 ? firstLine.substring(0, 50) + '...' : firstLine;
  
  // Get service name from shield_id
  const service_name = msg.shield_id?.linked_services?.[0] || 'Unknown Service';
  
  // Map backend status to security status
  const security_status = msg.status === MessageStatus.DELIVERED ? SecurityStatus.SAFE :
                          msg.status === MessageStatus.FILTERED ? SecurityStatus.SUSPICIOUS :
                          msg.status === MessageStatus.BLOCKED ? SecurityStatus.PHISHING : 'pending';
  
  // Format time
  const date = new Date(msg.received_at);
  const timeStr = date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
  
  // Extract links for preview
  const urlRegex = /https?:\/\/[^\s]+/g;
  const links = msg.sanitized_content?.match(urlRegex) || [];
  const safe_link_preview = links.length > 0 && msg.status === MessageStatus.DELIVERED ? links[0] : null;
  
  return {
    id: msg._id,
    sender: msg.sender || 'Unknown',
    subject: subject || 'No Subject',
    message_type: msg.type,
    service_name: service_name,
    timestamp: timeStr,
    fullDate: msg.received_at,
    security_status: security_status,
    tracker_removed: msg.status === MessageStatus.FILTERED,
    phishing_detected: msg.status === MessageStatus.BLOCKED,
    safe_link_preview: safe_link_preview,
    content: msg.sanitized_content || '',
    status: msg.status,
    recipient: msg.recipient,
    rawMessage: msg,
  };
};

export const SmsProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState(defaultInboxFilter);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const loadMessages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchMessages();
      const data = response.data || response;
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to load messages');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const transformedMessages = useMemo(() => messages.map(transformMessage), [messages]);

  const filteredMessages = useMemo(() => {
    return transformedMessages
      .filter((msg) => {
        const matchesSearch =
          filter.search === '' ||
          msg.sender.toLowerCase().includes(filter.search.toLowerCase()) ||
          msg.subject.toLowerCase().includes(filter.search.toLowerCase()) ||
          msg.service_name.toLowerCase().includes(filter.search.toLowerCase());
        const matchesType = filter.messageType === 'all' || msg.message_type === filter.messageType;
        const matchesSecurity = filter.securityStatus === 'all' || msg.security_status === filter.securityStatus;
        return matchesSearch && matchesType && matchesSecurity;
      })
      .sort((a, b) => new Date(b.fullDate) - new Date(a.fullDate));
  }, [transformedMessages, filter]);

  const updateFilter = (newFilter) => {
    setFilter((prev) => ({ ...prev, ...newFilter }));
  };

  const selectMessage = (id) => {
    const msg = transformedMessages.find((m) => m.id === id);
    setSelectedMessage(msg);
  };

  const clearSelection = () => {
    setSelectedMessage(null);
  };

  const stats = useMemo(() => ({
    total: messages.length,
    email: messages.filter((m) => m.type === MessageType.EMAIL).length,
    sms: messages.filter((m) => m.type === MessageType.SMS).length,
    safe: messages.filter((m) => m.status === MessageStatus.DELIVERED).length,
    suspicious: messages.filter((m) => m.status === MessageStatus.FILTERED).length,
    phishing: messages.filter((m) => m.status === MessageStatus.BLOCKED).length,
  }), [messages]);

  return (
    <SmsContext.Provider
      value={{
        messages: filteredMessages,
        allMessages: transformedMessages,
        rawMessages: messages,
        loading,
        error,
        filter,
        updateFilter,
        selectedMessage,
        selectMessage,
        clearSelection,
        refreshMessages: loadMessages,
        stats,
      }}
    >
      {children}
    </SmsContext.Provider>
  );
};

export default SmsContext;
