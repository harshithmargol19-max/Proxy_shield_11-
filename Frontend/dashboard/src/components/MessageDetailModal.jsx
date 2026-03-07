import { X, Mail, Shield, Link as LinkIcon, AlertTriangle, CheckCircle, MessageSquare } from 'lucide-react';
import SecurityBadge from './SecurityBadge';
import MessageTypeBadge from './MessageTypeBadge';
import { useMessages } from '../context/SmsContext';
import { MessageStatus } from '../types/sms';

const MessageDetailModal = ({ isOpen, onClose }) => {
  const { selectedMessage, clearSelection } = useMessages();

  if (!isOpen || !selectedMessage) return null;

  const extractLinks = (content) => {
    const urlRegex = /https?:\/\/[^\s]+/g;
    return content?.match(urlRegex) || [];
  };

  const links = extractLinks(selectedMessage.content);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />
        <div className="relative inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Message Details</h2>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  {selectedMessage.message_type === 'email' ? (
                    <Mail className="w-6 h-6 text-indigo-600" />
                  ) : (
                    <MessageSquare className="w-6 h-6 text-indigo-600" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedMessage.subject}</h3>
                  <p className="text-sm text-gray-500">From: {selectedMessage.sender}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <SecurityBadge status={selectedMessage.status} />
                <MessageTypeBadge type={selectedMessage.message_type} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Shield className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 uppercase">Service</p>
                  <p className="text-sm font-medium text-gray-900">{selectedMessage.service_name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 uppercase">Recipient</p>
                  <p className="text-sm font-medium text-gray-900">{selectedMessage.recipient}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-gray-900">Security Information</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className={`p-3 rounded-lg border ${selectedMessage.tracker_removed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center gap-2">
                    {selectedMessage.tracker_removed ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-gray-400" />
                    )}
                    <span className="text-sm font-medium text-gray-900">Tracker Removed</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedMessage.tracker_removed ? 'Yes - Trackers cleaned' : 'No trackers detected'}
                  </p>
                </div>
                <div className={`p-3 rounded-lg border ${selectedMessage.phishing_detected ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center gap-2">
                    {selectedMessage.phishing_detected ? (
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                    <span className="text-sm font-medium text-gray-900">Phishing Check</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedMessage.phishing_detected ? 'Phishing detected!' : 'No threats found'}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Message Content</h4>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <p className="text-sm text-gray-900 whitespace-pre-line">{selectedMessage.content}</p>
              </div>
            </div>

            {links.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <LinkIcon className="w-5 h-5" />
                  Links Found
                </h4>
                <div className="space-y-2">
                  {links.map((link, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border flex items-center gap-2 ${
                        selectedMessage.phishing_detected
                          ? 'bg-red-50 border-red-200'
                          : 'bg-blue-50 border-blue-200'
                      }`}
                    >
                      <LinkIcon className={`w-4 h-4 ${selectedMessage.phishing_detected ? 'text-red-600' : 'text-blue-600'}`} />
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-sm ${selectedMessage.phishing_detected ? 'text-red-700' : 'text-blue-700'} hover:underline`}
                      >
                        {link}
                      </a>
                      {selectedMessage.phishing_detected && (
                        <span className="text-xs text-red-600 font-medium ml-auto">⚠️ Suspicious</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageDetailModal;
