import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'info' | 'error';
}

export const Toast: React.FC<ToastProps> = ({ message, type }) => {
  return (
    <div className="toast-container">
      <div className={`toast ${type}`}>
        {type === 'success' && <CheckCircle2 size={18} />}
        {type === 'info' && <Info size={18} />}
        {type === 'error' && <AlertCircle size={18} />}
        <span>{message}</span>
      </div>
    </div>
  );
};
