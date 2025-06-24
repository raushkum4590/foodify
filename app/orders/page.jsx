import OrderHistory from '../_components/OrderHistory';
import Header from '../_components/Header';

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <OrderHistory />
    </div>
  );
}
