import { Mail, Phone, Save, X } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const ProfileSettings = () => {
  const { editedUser, setEditedUser, isEditing, setIsEditing, saveUser } = useSettings();

  if (!editedUser) return null;

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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="w-4 h-4 inline mr-1" />
            Real Email
          </label>
          {isEditing ? (
            <input
              type="email"
              value={editedUser.real_email}
              onChange={(e) => setEditedUser({ ...editedUser, real_email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          ) : (
            <p className="text-gray-900">{editedUser.real_email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="w-4 h-4 inline mr-1" />
            Real Phone
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Firebase UID</label>
          <p className="text-gray-500 text-sm font-mono">{editedUser.firebase_uid}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
