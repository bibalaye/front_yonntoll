import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

type AlertType = 'success' | 'error' | 'info' | 'warning';

interface AlertProps {
  type: AlertType;
  title: string;
  message: string;
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({ type, title, message, onClose }) => {
  const getAlertStyles = (type: AlertType) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-500 text-green-700';
      case 'error':
        return 'bg-red-50 border-red-500 text-red-700';
      case 'warning':
        return 'bg-yellow-50 border-yellow-500 text-yellow-700';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-500 text-blue-700';
    }
  };

  const getIcon = (type: AlertType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5" />;
      case 'error':
        return <AlertCircle className="h-5 w-5" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5" />;
      case 'info':
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  return (
    <div className={`rounded-md p-4 border-l-4 ${getAlertStyles(type)}`} role="alert">
      <div className="flex">
        <div className="flex-shrink-0">
          {getIcon(type)}
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium">{title}</h3>
          <div className="mt-2 text-sm">
            <p>{message}</p>
          </div>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${getAlertStyles(type)}`}
                onClick={onClose}
              >
                <span className="sr-only">Dismiss</span>
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;