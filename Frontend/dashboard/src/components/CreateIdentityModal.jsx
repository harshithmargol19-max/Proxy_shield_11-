import { useState } from 'react';
import { X, Plus, Shield, Mail, Phone, Globe, Loader2, User } from 'lucide-react';
import { useIdentities } from '../context/IdentityContext';
import { useAuth } from '../context/AuthContext';

const CreateIdentityModal = ({ isOpen, onClose }) => {
  const { createIdentity } = useIdentities();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    website: '',
    linked_services: ''
  });

  // Get user's email from auth
  const userEmail = user?.email || user?.real_email || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!userEmail) {
        setError('Please sign in with an email account to create proxy identities');
        setLoading(false);
        return;
      }

      const data = {
        real_email: userEmail,
        website: formData.website,
        linked_services: formData.linked_services 
          ? formData.linked_services.split(',').map(s => s.trim())
          : [formData.website]
      };

      const result = await createIdentity(data);
      
      if (result.success) {
        setSuccess({
          proxy_email: result.identity.proxy_email,
          proxy_phone: result.identity.proxy_phone
        });
        setFormData({ website: '', linked_services: '' });
      } else {
        setError(result.error || 'Failed to create identity');
      }
    } catch (err) {
      setError(err.message || 'Failed to create identity');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ website: '', linked_services: '' });
    setError(null);
    setSuccess(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Shield className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Create Shield Identity</h2>
              <p className="text-sm text-gray-500">Generate a new proxy identity</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {success ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium mb-3">Shield Identity Created!</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-green-600" />
                    <span className="text-gray-600">Proxy Email:</span>
                    <code className="bg-green-100 px-2 py-0.5 rounded text-green-800 text-xs">
                      {success.proxy_email}
                    </code>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-green-600" />
                    <span className="text-gray-600">Proxy Phone:</span>
                    <code className="bg-green-100 px-2 py-0.5 rounded text-green-800 text-xs">
                      {success.proxy_phone}
                    </code>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setSuccess(null)}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Create Another
                </button>
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                  {error}
                </div>
              )}

              {/* Show logged-in user's email */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Logged in as:</span>
                </div>
                <p className="mt-1 font-medium text-gray-900">{userEmail || 'Not signed in with email'}</p>
                <p className="mt-1 text-xs text-gray-500">
                  Proxy emails will forward to this address automatically
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Globe className="w-4 h-4 inline mr-1" />
                  Website / Service
                </label>
                <input
                  type="text"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="e.g., amazon.com, netflix.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Linked Services (optional)
                </label>
                <input
                  type="text"
                  value={formData.linked_services}
                  onChange={(e) => setFormData({ ...formData, linked_services: e.target.value })}
                  placeholder="Comma-separated: shopping, payments"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Proxy email and phone will be auto-generated
                </p>
              </div>

              <div className="bg-indigo-50 rounded-lg p-3">
                <p className="text-xs text-indigo-700">
                  <strong>How it works:</strong> A proxy email like <code>you+shield_amazon_xyz@gmail.com</code> will be generated. 
                  All emails sent to this address are automatically forwarded to your real inbox.
                  The identity can be burned if compromised.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Generate Shield Identity
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateIdentityModal;
