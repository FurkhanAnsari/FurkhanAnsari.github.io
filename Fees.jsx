import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { studentAPI, paymentAPI } from '../../services/api';
import { toast } from 'react-hot-toast';
import { 
  CreditCard,
  Receipt,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Shield
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';

// Initialize Stripe (use your publishable key)
const stripePromise = loadStripe('pk_test_placeholder');

// Stripe Card Element Styling
const cardStyle = {
  style: {
    base: {
      color: '#e2e3e5',
      fontFamily: 'DM Sans, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#7c7e86'
      },
      backgroundColor: 'transparent'
    },
    invalid: {
      color: '#ef4444',
      iconColor: '#ef4444'
    }
  }
};

// Payment Form Component
function PaymentForm({ amount, onSuccess, onCancel }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      // Create payment intent
      const { data } = await paymentAPI.createPaymentIntent({ amount });
      
      // Confirm payment
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        }
      });

      if (result.error) {
        setError(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        // Confirm payment on backend
        await paymentAPI.confirmPayment({
          paymentIntentId: result.paymentIntent.id,
          feeId: data.feeId
        });
        
        toast.success('Payment successful!');
        onSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 rounded-xl bg-dark-800/50 border border-dark-700">
        <p className="text-sm text-dark-400 mb-2">Amount to Pay</p>
        <p className="text-3xl font-bold text-white">
          ₹{amount?.toLocaleString('en-IN')}
        </p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-dark-200">
          Card Details
        </label>
        <div className="p-4 rounded-xl bg-dark-800 border border-dark-700 focus-within:border-primary-500 transition-colors">
          <CardElement options={cardStyle} />
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <div className="flex items-center gap-2 text-sm text-dark-400">
        <Shield className="w-4 h-4" />
        <span>Your payment is secured with Stripe</span>
      </div>

      <div className="flex gap-3">
        <Button 
          type="button" 
          variant="secondary" 
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          loading={loading}
          disabled={!stripe}
          className="flex-1"
        >
          Pay Now
        </Button>
      </div>
    </form>
  );
}

export default function StudentFees() {
  const [feesData, setFeesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      const response = await studentAPI.getFees();
      setFeesData(response.data);
    } catch (error) {
      toast.error('Failed to load fee details');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handlePaymentSuccess = () => {
    setIsPaymentModalOpen(false);
    fetchFees();
  };

  const openPaymentModal = (amount) => {
    setPaymentAmount(amount);
    setIsPaymentModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const { summary, pendingFees, paidFees } = feesData || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-white">Fee Payment</h1>
        <p className="text-dark-400 mt-1">View and pay your school fees</p>
      </div>

      {/* Fee Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 rounded-xl bg-dark-800/50">
              <p className="text-sm text-dark-400 mb-1">Total Fee</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(summary?.totalFee)}</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-accent-500/10">
              <p className="text-sm text-dark-400 mb-1">Paid</p>
              <p className="text-2xl font-bold text-accent-400">{formatCurrency(summary?.paidAmount)}</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-primary-500/10">
              <p className="text-sm text-dark-400 mb-1">Pending</p>
              <p className="text-2xl font-bold text-primary-400">{formatCurrency(summary?.pendingAmount)}</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-dark-800/50">
              <p className="text-sm text-dark-400 mb-1">Status</p>
              <div className="mt-2">
                <Badge 
                  variant={
                    summary?.feeStatus === 'paid' ? 'success' :
                    summary?.feeStatus === 'partial' ? 'info' : 'warning'
                  }
                  className="text-base px-4 py-1"
                >
                  {summary?.feeStatus || 'Pending'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-dark-400">Payment Progress</span>
              <span className="text-sm text-dark-400">
                {summary?.totalFee > 0 
                  ? Math.round((summary?.paidAmount / summary?.totalFee) * 100) 
                  : 0
                }%
              </span>
            </div>
            <div className="h-3 bg-dark-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-accent-500 to-accent-400 rounded-full transition-all duration-500"
                style={{ 
                  width: `${summary?.totalFee > 0 ? (summary?.paidAmount / summary?.totalFee) * 100 : 0}%` 
                }}
              />
            </div>
          </div>

          {/* Pay Button */}
          {summary?.pendingAmount > 0 && (
            <div className="mt-6 flex justify-center">
              <Button 
                onClick={() => openPaymentModal(summary.pendingAmount)}
                icon={CreditCard}
                className="px-8"
              >
                Pay {formatCurrency(summary.pendingAmount)} Now
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pending Fees */}
      {pendingFees?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              Pending Payments
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-dark-800">
              {pendingFees.map((fee, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between px-6 py-4"
                >
                  <div>
                    <p className="font-medium text-white capitalize">{fee.feeType} Fee</p>
                    <p className="text-sm text-dark-400">{fee.transactionId}</p>
                    {fee.dueDate && (
                      <p className="text-xs text-amber-400 mt-1">
                        Due: {formatDate(fee.dueDate)}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-semibold text-white">{formatCurrency(fee.amount)}</p>
                    <Button 
                      size="sm"
                      onClick={() => openPaymentModal(fee.amount)}
                    >
                      Pay
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-accent-400" />
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {paidFees?.length > 0 ? (
            <div className="divide-y divide-dark-800">
              {paidFees.map((fee, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between px-6 py-4 hover:bg-dark-800/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-accent-500/10 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-accent-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{fee.receiptNumber}</p>
                      <p className="text-sm text-dark-400">
                        {formatDate(fee.paidAt)} • {fee.feeType}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold text-accent-400">{formatCurrency(fee.amount)}</p>
                      <Badge variant="success">Paid</Badge>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => toast.success('Receipt downloaded')}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-dark-400">
              <Receipt className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No payment history yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Modal */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title="Make Payment"
      >
        <Elements stripe={stripePromise}>
          <PaymentForm 
            amount={paymentAmount}
            onSuccess={handlePaymentSuccess}
            onCancel={() => setIsPaymentModalOpen(false)}
          />
        </Elements>
      </Modal>
    </div>
  );
}

