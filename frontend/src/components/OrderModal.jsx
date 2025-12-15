import React from 'react';
import { X, ShoppingCart } from 'lucide-react';

const OrderModal = ({ order, isOpen, onClose, onReorder }) => {
  if (!isOpen || !order) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'processing':
        return 'Processing';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      default:
        return 'Unknown';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Group items by order to calculate totals
  const orderItems = order.items || [];
  const itemCount = orderItems.length;
  const orderTotal = order.order_total || orderItems.reduce((sum, item) => sum + (item.total_price || item.price * item.quantity), 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 flex justify-between items-center p-6 border-b border-gray-200 bg-white">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Order #{order.order_number}</h2>
            <p className="text-gray-600 text-sm mt-1">{formatDate(order.order_date)}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Order Status Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-xs text-gray-600 uppercase tracking-wide">Status</p>
              <p className={`mt-2 inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {getStatusLabel(order.status)}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-xs text-gray-600 uppercase tracking-wide">Items</p>
              <p className="mt-2 text-lg font-semibold text-gray-900">{itemCount}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-xs text-gray-600 uppercase tracking-wide">Delivery Date</p>
              <p className="mt-2 text-lg font-semibold text-gray-900">
                {order.delivery_date ? formatDate(order.delivery_date) : 'N/A'}
              </p>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <p className="text-xs text-amber-700 uppercase tracking-wide font-semibold">Order Total</p>
              <p className="mt-2 text-2xl font-bold text-amber-900">€{orderTotal.toFixed(2)}</p>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
            <div className="space-y-3 border border-gray-200 rounded-lg overflow-hidden">
              {orderItems.map((item, index) => (
                <div
                  key={item.id || index}
                  className={`px-4 py-3 flex justify-between items-center ${
                    index !== orderItems.length - 1 ? 'border-b border-gray-200' : ''
                  }`}
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.product_name}</p>
                    <p className="text-xs text-gray-500 mt-1">SKU: {item.product_sku}</p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-sm text-gray-600">
                      {item.quantity} × €{item.price.toFixed(2)}
                    </p>
                    <p className="font-semibold text-gray-900">€{(item.total_price || item.quantity * item.price).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Subtotal</span>
              <span className="text-gray-900">€{orderTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
              <span className="text-gray-700 font-medium">Shipping</span>
              <span className="text-green-600 font-medium">Free</span>
            </div>
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-300">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-lg font-bold text-amber-900">€{orderTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => onReorder(order)}
            className="flex-1 px-4 py-3 bg-amber-700 text-white font-medium rounded-lg hover:bg-amber-800 transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            Reorder
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;

