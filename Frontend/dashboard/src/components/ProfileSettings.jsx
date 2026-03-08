import { Mail, Phone, Save, X, User } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';

const ProfileSettings = () => {
  const { editedUser, setEditedUser, isEditing, setIsEditing, saveUser } = useSettings();
  const { user: authUser } = useAuth();

  if (!editedUser) return null;

  // Use Firebase auth data for display, fallback to editedUser
  const displayEmail = authUser?.email || editedUser.real_email || 'Not set';
  const displayName = authUser?.displayName || editedUser.display_name || 'Anonymous User';
  const photoURL = authUser?.photoURL || editedUser.photo_url;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
        {isEditing ? (
          <div className="flex gap-2">
            <button
              onClick={saveUser}
              className="flex items-center gap-2 px-4 py-2 text-green-600 bg-green-50 rounded-lg hover:bg-green-100"
            >
              <Save className="w-4 h-4" /> Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              <X className="w-4 h-4" /> Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100"
          >
            Edit Profile
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Profile Picture & Name */}
        <div className="flex items-center gap-4">
          {photoURL ? (
            <img src={photoURL} alt="Profile" className="w-16 h-16 rounded-full" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
              <User className="w-8 h-8 text-indigo-600" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-medium text-gray-900">{displayName}</h3>
            <p className="text-sm text-gray-500">
              {authUser?.isAnonymous ? 'Guest User' : 'Registered User'}
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="w-4 h-4 inline mr-1" />
            Email Address
          </label>
          <p className="text-gray-900">{displayEmail}</p>
          {authUser?.isAnonymous && (
            <p className="text-xs text-amber-600 mt-1">Sign in with Google to link an email</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="w-4 h-4 inline mr-1" />
            Phone Number
          </label>
          {isEditing ? (
            <input
              type="tel"
              value={editedUser.real_phone || ''}
              onChange={(e) => setEditedUser({ ...editedUser, real_phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Not set"
            />
          ) : (
            <p className="text-gray-900">{editedUser.real_phone || 'Not set'}</p>
          )}
        </div>

        <div className="pt-4 border-t border-gray-200">
          <label className="block text-sm font-medium text-gray-500 mb-2">Account ID</label>
          <p className="text-gray-400 text-xs font-mono">{editedUser.firebase_uid}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
