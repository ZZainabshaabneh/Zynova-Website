import React, { useEffect, useState } from 'react';
import { Notification } from '../types';
import BellIcon from './icons/BellIcon';
import XIcon from './icons/XIcon';
import ClipboardListIcon from './icons/ClipboardListIcon';

interface NotificationToastProps {
  notification: Notification;
  onClose: () => void;
  index: number;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ notification, onClose, index }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true); // Animate in
    const timer = setTimeout(() => {
      setVisible(false); // Animate out
      setTimeout(onClose, 300); // Remove from DOM after animation
    }, 5000); // Auto-dismiss after 5 seconds

    return () => clearTimeout(timer);
  }, [notification, onClose]);

  const isOrder = notification.type === 'order';

  const Icon = isOrder ? 
    <ClipboardListIcon className="h-6 w-6 text-indigo-500" aria-hidden="true" /> :
    <BellIcon className="h-6 w-6 text-green-500" aria-hidden="true" />;

  return (
    <div
      className="fixed bottom-5 right-5 z-50 w-full max-w-sm bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden transition-all duration-300"
      style={{
        transform: `translateY(${visible ? `-${index * 110}%` : '100%'})`,
        opacity: visible ? 1 : 0,
        bottom: `${(index * 0) + 1.25}rem` // Stacking notifications
      }}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">{Icon}</div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-slate-900">{isOrder ? 'New Order!' : 'New Activity!'}</p>
            <p className="mt-1 text-sm text-slate-500">{notification.message}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className="bg-white rounded-md inline-flex text-slate-400 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <XIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationToast;
