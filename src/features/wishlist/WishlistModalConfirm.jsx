import { createPortal } from "react-dom"

export default function WishlistModalConfirm({ onCancel, onConfirm, isLoading }) {
  return (
    createPortal(<div className="fixed inset-0 bg-black/30 backdrop-blur flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4 dark:text-white">Clear Wishlist?</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Are you sure you want to remove all items from your wishlist? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              "Clear All"
            )}
          </button>
        </div>
      </div>
    </div>, document.body)
  );
}
