import { VerificationStatus } from '../types/blockchain';

const VerificationBadge = ({ status }) => {
  if (status === VerificationStatus.VERIFIED) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
        <span className="mr-1">🔒</span>
        Verified on Blockchain
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
      <span className="mr-1">⏳</span>
      Pending
    </span>
  );
};

export default VerificationBadge;
