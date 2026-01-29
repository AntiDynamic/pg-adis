import { VerificationStatus } from '../types';
<<<<<<< HEAD
=======
import { Badge } from './ui/Badge';
>>>>>>> d9bc5d3c1a2923fd1ec3b256229a32f9b8be8f9d

interface VerificationStatusBadgeProps {
  status: VerificationStatus;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function VerificationStatusBadge({ 
  status, 
  size = 'md', 
  showLabel = true 
}: VerificationStatusBadgeProps) {
  const getStatusConfig = (status: VerificationStatus) => {
    switch (status) {
      case 'verified':
        return {
          icon: '✓',
          label: 'Verified',
          color: 'bg-green-500/10 text-green-400 border-green-500/20',
          fullColor: 'bg-green-500 text-white'
        };
      case 'pending_verification':
        return {
          icon: '⏳',
          label: 'Pending Review',
          color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
          fullColor: 'bg-yellow-500 text-white'
        };
      case 'rejected':
        return {
          icon: '✕',
          label: 'Rejected',
          color: 'bg-red-500/10 text-red-400 border-red-500/20',
          fullColor: 'bg-red-500 text-white'
        };
      case 'resubmission_required':
        return {
          icon: '↻',
          label: 'Resubmission Required',
          color: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
          fullColor: 'bg-orange-500 text-white'
        };
    }
  };

  const config = getStatusConfig(status);
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  return (
    <span 
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${config.color} ${sizeClasses[size]}`}
    >
      <span>{config.icon}</span>
      {showLabel && <span>{config.label}</span>}
    </span>
  );
}

// Variant for full-color display (e.g., in cards)
export function VerificationStatusBadgeSolid({ status }: { status: VerificationStatus }) {
  const config = {
    verified: { icon: '✓', label: 'Verified', color: 'bg-green-500' },
    pending_verification: { icon: '⏳', label: 'Pending', color: 'bg-yellow-500' },
    rejected: { icon: '✕', label: 'Rejected', color: 'bg-red-500' },
    resubmission_required: { icon: '↻', label: 'Resubmit', color: 'bg-orange-500' }
  }[status];

  return (
    <span className={`inline-flex items-center gap-1.5 ${config.color} text-white text-xs px-3 py-1 rounded-full font-medium`}>
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
}
