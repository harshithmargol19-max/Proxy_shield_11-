import { Info, Calendar, Clock, AlertTriangle, Trash2 } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { StatusConfig, AccountStatus } from '../types/settings';

const AccountSettings = () => {
  const { user, stats } = useSettings();

  if (!user) return null;

  const statusConfig = StatusConfig[user.status] || StatusConfig[AccountStatus.ACTIVE];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Account Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Account Status</span>
            </div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor} border ${statusConfig.borderColor}`}>
              {statusConfig.label}
            </span>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Member Since</span>
            </div>
            <p className="text-sm font-medium text-gray-900">
              {new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Last Login</span>
            </div>
            <p className="text-sm font-medium text-gray-900">
              {new Date(user.last_login).toLocaleString()}
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Account Age</span>
            </div>
            <p className="text-sm font-medium text-gray-900">{stats.accountAge} days</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Stats</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-indigo-50 rounded-lg">
            <p className="text-2xl font-bold text-indigo-600">{stats.totalDevices}</p>
            <p className="text-sm text-gray-600">Total Devices</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{stats.activeDevices}</p>
            <p className="text-sm text-gray-600">Active (24h)</p>
          </div>
        </div>
      </div>

      <div className="bg-red-50 rounded-lg shadow-sm border border-red-200 p-6">
        <h2 className="text-lg font-semibold text-red-900 mb-4">Danger Zone</h2>
        <p className="text-sm text-red-700 mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
          <Trash2 className="w-4 h-4" />
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default AccountSettings;
