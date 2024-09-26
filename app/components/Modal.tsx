import React from 'react';

interface ModalProps {
  title: string;
  content: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;  // Optionnel, permet de changer le texte du bouton de confirmation
  cancelText?: string;   // Optionnel, permet de changer le texte du bouton d'annulation
}

const Modal: React.FC<ModalProps> = ({
  title,
  content,
  onConfirm,
  onCancel,
  confirmText = "Confirmer",
  cancelText = "Annuler",
}) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <p className="mt-4 text-gray-600">{content}</p>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
