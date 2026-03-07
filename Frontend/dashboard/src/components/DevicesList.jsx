import { Monitor, Smartphone, Tablet, Trash2, CheckCircle } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { DeviceTypeConfig, DeviceType } from '../types/settings';

const DevicesList = () => {
  const { user, removeDevice } = useSettings();

  if (!user) return null;

  const getDeviceIcon = (type) => {
    switch (type) {
      case DeviceType.DESKTOP:
        return <Monitor className="w-5 h-5" />;
      case DeviceType.MOBILE:
        return <Smartphone className="w-5 h-5" />;
      case DeviceType.TABLET:
        return <Tablet className="w-5 h-5" />;
      default:
        return <Monitor className="w-5 h-5" />;
    }
  };

  const isRecentlyActive = (lastActive) => {
    return new Date(lastActive) > new Date(Date.now() - 24 * 60 * 60 * 1000);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Connected Devices</h2>

      <div className="space-y-4">
        {user.devices.map((device) => {
          const config = DeviceTypeConfig[device.device_type] || DeviceTypeConfig[DeviceType.OTHER];
          const recentlyActive = isRecentlyActive(device.last_active);

          return (
            <div
              key={device.device_id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  recentlyActive ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'
                }`}>
                  {getDeviceIcon(device.device_type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">{device.device_name}</span>
                    <span className="text-xs text-gray-500">{config.label}</span>
                    {recentlyActive && (
                      <span className="flex items-center text-xs text-green-600">
                        <CheckCircle className="w-3 h-3 mr-1" /> Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Last active: {new Date(device.last_active).toLocaleString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeDevice(device.device_id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                title="Remove device"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {user.devices.length === 0 && (
        <p className="text-center text-gray-500 py-8">No connected devices</p>
      )}
    </div>
  );
};

export default DevicesList;
