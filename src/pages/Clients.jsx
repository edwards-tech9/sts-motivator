import { useState, useEffect } from 'react';
import { Search, Plus, Filter, ChevronRight, MessageSquare, Clipboard, BarChart3, MoreVertical, X, UserPlus, Users, TrendingUp, AlertTriangle, CreditCard, DollarSign, Settings, Sparkles, Send } from 'lucide-react';
import { PageTransition, SlideIn, StaggerContainer } from '../components/ui/AnimatedComponents';
import { getAthletes, saveAthlete, addMessage } from '../services/localStorage';
import {
  getPayPalSettings,
  getPriceTiers,
  getLastPaymentAmount,
  createPaymentRequest,
  sendPaymentRequestToClient,
  formatCurrency,
} from '../services/paypalService';
import { generateSmartMessages } from '../services/smartMessaging';
import PaymentSettings from '../components/coach/PaymentSettings';

// Default clients
const defaultClients = [
  { id: 'c1', name: 'John Davidson', program: 'Strength 4x', sevenDay: 86, thirtyDay: 91, status: 'good', avatar: 'JD', goal: 'Strength', level: 'Intermediate', startDate: 'March 2024', prs: 3, gained: '+12 lbs', email: 'john@example.com', lastActive: '2 hours ago' },
  { id: 'c2', name: 'Emma Sullivan', program: 'Hypertrophy', sevenDay: 100, thirtyDay: 88, status: 'good', avatar: 'ES', goal: 'Muscle Gain', level: 'Advanced', startDate: 'Jan 2024', prs: 5, gained: '+8 lbs', email: 'emma@example.com', lastActive: '30 min ago' },
  { id: 'c3', name: 'Sarah Martinez', program: 'Fat Loss', sevenDay: 0, thirtyDay: 45, status: 'alert', avatar: 'SM', goal: 'Fat Loss', level: 'Beginner', startDate: 'Oct 2024', prs: 1, gained: '-15 lbs', email: 'sarah@example.com', lastActive: '7 days ago' },
  { id: 'c4', name: 'Jake Thompson', program: 'Athletic', sevenDay: 43, thirtyDay: 67, status: 'watch', avatar: 'JT', goal: 'Athletic Performance', level: 'Intermediate', startDate: 'Aug 2024', prs: 2, gained: '+5 lbs', email: 'jake@example.com', lastActive: '3 days ago' },
  { id: 'c5', name: 'Maria Lopez', program: 'General', sevenDay: 71, thirtyDay: 82, status: 'good', avatar: 'ML', goal: 'General Fitness', level: 'Intermediate', startDate: 'May 2024', prs: 4, gained: '+3 lbs', email: 'maria@example.com', lastActive: '1 hour ago' },
];

const getStatusColor = (status) => {
  switch (status) {
    case 'good': return 'bg-green-500';
    case 'watch': return 'bg-yellow-500';
    case 'alert': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'good': return 'On Track';
    case 'watch': return 'Watch';
    case 'alert': return 'Needs Attention';
    default: return 'Unknown';
  }
};

// Client Detail Modal
const ClientDetailModal = ({ client, onClose, onMessage, onAssignProgram }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [coachingTipsExpanded, setCoachingTipsExpanded] = useState(true);

  // Generate smart, psychology-driven coaching suggestions
  const coachingTips = generateSmartMessages(client.id, client.name, {
    goal: client.goal,
    level: client.level,
    status: client.status,
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return { border: 'border-l-red-500', bg: 'bg-red-500/5', dot: 'bg-red-400' };
      case 'medium': return { border: 'border-l-yellow-500', bg: 'bg-yellow-500/5', dot: 'bg-yellow-400' };
      default: return { border: 'border-l-blue-500', bg: 'bg-blue-500/5', dot: 'bg-blue-400' };
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 overflow-y-auto">
      <div className="min-h-screen">
        {/* Header */}
        <div className="sticky top-0 bg-carbon-900/95 backdrop-blur-lg border-b border-carbon-700 p-4 flex items-center justify-between">
          <button
            onClick={onClose}
            className="p-2 hover:bg-carbon-800 rounded-lg transition-colors"
          >
            <X className="text-gray-400" size={24} />
          </button>
          <h2 className="text-white font-bold">Client Details</h2>
          <div className="w-10" />
        </div>

        <div className="p-6">
          {/* Client Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-gold-500 to-gold-300 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
              {client.avatar}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">{client.name}</h1>
              <p className="text-gray-400">{client.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`w-2 h-2 rounded-full ${getStatusColor(client.status)}`} />
                <span className="text-gray-500 text-sm">{getStatusLabel(client.status)} · Last active {client.lastActive}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => onMessage(client)}
              className="flex items-center justify-center gap-2 bg-carbon-800 hover:bg-carbon-700 p-4 rounded-xl transition-colors"
            >
              <MessageSquare className="text-gold-400" size={20} />
              <span className="text-white font-semibold">Message</span>
            </button>
            <button
              onClick={() => onAssignProgram(client)}
              className="flex items-center justify-center gap-2 bg-carbon-800 hover:bg-carbon-700 p-4 rounded-xl transition-colors"
            >
              <Clipboard className="text-gold-400" size={20} />
              <span className="text-white font-semibold">Assign Program</span>
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            <div className="bg-carbon-800/50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-white">{client.sevenDay}%</p>
              <p className="text-gray-500 text-xs">7-Day</p>
            </div>
            <div className="bg-carbon-800/50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-white">{client.thirtyDay}%</p>
              <p className="text-gray-500 text-xs">30-Day</p>
            </div>
            <div className="bg-carbon-800/50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-green-400">{client.gained}</p>
              <p className="text-gray-500 text-xs">Progress</p>
            </div>
            <div className="bg-carbon-800/50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-gold-400">{client.prs}</p>
              <p className="text-gray-500 text-xs">PRs</p>
            </div>
          </div>

          {/* Coaching Tips - Smart AI-Generated Suggestions */}
          {coachingTips.length > 0 && (
            <div className="bg-gradient-to-r from-gold-500/10 to-gold-400/5 border border-gold-500/20 rounded-2xl mb-6 overflow-hidden">
              <button
                onClick={() => setCoachingTipsExpanded(!coachingTipsExpanded)}
                className="w-full flex items-center justify-between p-4 hover:bg-gold-500/5 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="text-gold-400" size={18} />
                  <span className="text-gold-400 font-bold text-sm tracking-wider">COACHING TIPS</span>
                  <span className="text-gray-500 text-xs">What to say to {client.name.split(' ')[0]}</span>
                </div>
                <ChevronRight
                  size={18}
                  className={`text-gold-400 transition-transform ${coachingTipsExpanded ? 'rotate-90' : ''}`}
                />
              </button>
              {coachingTipsExpanded && (
                <div className="px-4 pb-4 space-y-2">
                  <p className="text-gray-400 text-xs mb-2">
                    Help {client.name.split(' ')[0]} MAKE GAINS:
                  </p>
                  {coachingTips.map((tip, i) => {
                    const colors = getPriorityColor(tip.priority);
                    return (
                      <div
                        key={i}
                        className={`p-3 rounded-xl border-l-2 ${colors.border} ${colors.bg}`}
                      >
                        <p className="text-gray-200 text-sm leading-relaxed">{tip.message}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
                          <p className="text-gray-500 text-xs">{tip.reason}</p>
                        </div>
                      </div>
                    );
                  })}
                  <button
                    onClick={() => onMessage(client)}
                    className="w-full mt-3 flex items-center justify-center gap-2 bg-gold-500/20 hover:bg-gold-500/30 text-gold-400 font-semibold py-3 rounded-xl transition-colors"
                  >
                    <Send size={16} />
                    Send Message Now
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto">
            {['Overview', 'Progress', 'Workouts', 'Notes'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
                  activeTab === tab.toLowerCase()
                    ? 'bg-gold-gradient text-carbon-900'
                    : 'bg-carbon-800 text-gray-400 hover:bg-carbon-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="bg-carbon-800/50 rounded-2xl p-5">
                <h3 className="text-white font-bold mb-4">Current Program</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gold-400 font-semibold">{client.program}</p>
                    <p className="text-gray-500 text-sm">Week 3 of 4 · Started {client.startDate}</p>
                  </div>
                  <ChevronRight className="text-gray-500" size={20} />
                </div>
              </div>

              <div className="bg-carbon-800/50 rounded-2xl p-5">
                <h3 className="text-white font-bold mb-4">Client Info</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Goal</span>
                    <span className="text-white">{client.goal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Level</span>
                    <span className="text-white">{client.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Member Since</span>
                    <span className="text-white">{client.startDate}</span>
                  </div>
                </div>
              </div>

              <div className="bg-carbon-800/50 rounded-2xl p-5">
                <h3 className="text-white font-bold mb-4">Recent PRs</h3>
                <div className="space-y-2">
                  {[
                    { exercise: 'Back Squat', weight: '315 lbs', date: '2 days ago' },
                    { exercise: 'Bench Press', weight: '205 lbs', date: '1 week ago' },
                    { exercise: 'Deadlift', weight: '395 lbs', date: '2 weeks ago' },
                  ].map((pr, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-carbon-700/50 last:border-0">
                      <span className="text-gray-300">{pr.exercise}</span>
                      <div className="text-right">
                        <span className="text-gold-400 font-semibold">{pr.weight}</span>
                        <span className="text-gray-500 text-xs ml-2">{pr.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="bg-carbon-800/50 rounded-2xl p-5">
              <h3 className="text-white font-bold mb-4">Strength Progress</h3>
              <div className="space-y-4">
                {[
                  { name: 'Squat', from: 285, to: 315, change: 11 },
                  { name: 'Bench', from: 185, to: 205, change: 11 },
                  { name: 'Deadlift', from: 365, to: 395, change: 8 },
                ].map((lift) => (
                  <div key={lift.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">{lift.name}</span>
                      <span className="text-gray-300">
                        {lift.from} → {lift.to}{' '}
                        <span className="text-green-400">(+{lift.change}%)</span>
                      </span>
                    </div>
                    <div className="h-2 bg-carbon-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-gold-500 to-gold-300 rounded-full"
                        style={{ width: `${(lift.to / 450) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'workouts' && (
            <div className="space-y-3">
              {[
                { name: 'Lower Body Strength', date: 'Today', status: 'completed', duration: '52 min' },
                { name: 'Upper Body Push', date: 'Yesterday', status: 'completed', duration: '48 min' },
                { name: 'Lower Body Hypertrophy', date: '3 days ago', status: 'completed', duration: '55 min' },
                { name: 'Upper Body Pull', date: '4 days ago', status: 'skipped', duration: '-' },
              ].map((workout, i) => (
                <div key={i} className="bg-carbon-800/50 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold">{workout.name}</p>
                    <p className="text-gray-500 text-sm">{workout.date}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-semibold ${workout.status === 'completed' ? 'text-green-400' : 'text-red-400'}`}>
                      {workout.status === 'completed' ? 'Completed' : 'Skipped'}
                    </span>
                    {workout.duration !== '-' && (
                      <p className="text-gray-500 text-xs">{workout.duration}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4">
              <textarea
                placeholder="Add a note about this client..."
                className="w-full bg-carbon-800 border border-carbon-700 rounded-xl p-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-gold-500/50 resize-none h-32"
              />
              <button className="w-full bg-gold-gradient text-carbon-900 font-bold py-3 rounded-xl">
                Save Note
              </button>
              <div className="space-y-3">
                <div className="bg-carbon-800/50 rounded-xl p-4">
                  <p className="text-gray-300 text-sm">Great progress on squat depth. Continue focusing on controlled eccentrics.</p>
                  <p className="text-gray-500 text-xs mt-2">Dec 3, 2024</p>
                </div>
                <div className="bg-carbon-800/50 rounded-xl p-4">
                  <p className="text-gray-300 text-sm">Mentioned some knee discomfort - monitor and consider deload if persists.</p>
                  <p className="text-gray-500 text-xs mt-2">Nov 28, 2024</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Add Client Modal with Payment Request
const AddClientModal = ({ onClose, onAdd }) => {
  const [step, setStep] = useState(1); // 1: client info, 2: payment
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    goal: 'General Fitness',
    level: 'Beginner',
  });
  const [paymentSettings] = useState(getPayPalSettings());
  const [priceTiers] = useState(getPriceTiers());
  const [lastAmount] = useState(getLastPaymentAmount());
  const [selectedTier, setSelectedTier] = useState(null);
  const [customAmount, setCustomAmount] = useState(lastAmount || '');
  const [sendPayment, setSendPayment] = useState(true);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [added, setAdded] = useState(false);
  const [paymentSent, setPaymentSent] = useState(false);

  // Get current amount (from tier or custom)
  const currentAmount = selectedTier ? selectedTier.amount : (parseFloat(customAmount) || 0);

  const handleContinueToPayment = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;
    setStep(2);
  };

  const handleSubmit = async () => {
    const newClient = {
      id: `client_${Date.now()}`,
      name: formData.name,
      email: formData.email,
      avatar: formData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
      program: 'No Program',
      sevenDay: 0,
      thirtyDay: 0,
      status: 'good',
      goal: formData.goal,
      level: formData.level,
      startDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      prs: 0,
      gained: '0 lbs',
      lastActive: 'Just now',
    };

    // Save to localStorage
    saveAthlete({
      id: newClient.id,
      name: newClient.name,
      email: newClient.email,
      avatar: newClient.avatar,
      currentProgram: null,
      status: 'active',
      createdAt: new Date().toISOString(),
    });

    onAdd(newClient);
    setAdded(true);

    // Send payment request if enabled and amount > 0
    if (sendPayment && currentAmount > 0 && paymentSettings.isConfigured) {
      const result = createPaymentRequest(
        newClient.id,
        formData.email,
        currentAmount,
        billingCycle
      );

      if (result.success) {
        await sendPaymentRequestToClient(result.request);
        setPaymentSent(true);
      }
    }

    setTimeout(() => onClose(), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-carbon-900 rounded-3xl w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-carbon-700 flex items-center justify-between sticky top-0 bg-carbon-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold-500/20 rounded-xl flex items-center justify-center">
              {step === 1 ? (
                <UserPlus className="text-gold-400" size={20} />
              ) : (
                <CreditCard className="text-gold-400" size={20} />
              )}
            </div>
            <div>
              <p className="text-white font-semibold">
                {step === 1 ? 'Add New Client' : 'Payment Setup'}
              </p>
              <p className="text-gray-500 text-sm">
                {step === 1 ? 'Step 1 of 2: Client info' : 'Step 2 of 2: Billing'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-carbon-800 rounded-xl">
            <X className="text-gray-400" size={20} />
          </button>
        </div>

        {added ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="text-green-400" size={28} />
            </div>
            <p className="text-white font-semibold text-lg">Client Added!</p>
            <p className="text-gray-400 text-sm mt-1">
              Invitation sent to {formData.email}
            </p>
            {paymentSent && (
              <p className="text-green-400 text-sm mt-2">
                Payment request ({formatCurrency(currentAmount)}/{billingCycle}) sent
              </p>
            )}
          </div>
        ) : step === 1 ? (
          <form onSubmit={handleContinueToPayment} className="p-6 space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="John Smith"
                className="w-full bg-carbon-800 border border-carbon-700 rounded-xl py-3 px-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-gold-500/50"
                required
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="john@example.com"
                className="w-full bg-carbon-800 border border-carbon-700 rounded-xl py-3 px-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-gold-500/50"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Goal</label>
                <select
                  value={formData.goal}
                  onChange={(e) => setFormData(prev => ({ ...prev, goal: e.target.value }))}
                  className="w-full bg-carbon-800 border border-carbon-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-gold-500/50"
                >
                  <option>General Fitness</option>
                  <option>Strength</option>
                  <option>Muscle Gain</option>
                  <option>Fat Loss</option>
                  <option>Athletic Performance</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Level</label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
                  className="w-full bg-carbon-800 border border-carbon-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-gold-500/50"
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gold-gradient text-carbon-900 font-bold py-3 rounded-xl hover:scale-[1.02] transition-transform mt-4"
            >
              Continue to Payment
            </button>
          </form>
        ) : (
          <div className="p-6 space-y-4">
            {/* Send Payment Toggle */}
            <div className="flex items-center justify-between bg-carbon-800/50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <DollarSign className="text-green-400" size={20} />
                <div>
                  <p className="text-white font-semibold">Send Payment Request</p>
                  <p className="text-gray-500 text-sm">Request recurring payment from client</p>
                </div>
              </div>
              <button
                onClick={() => setSendPayment(!sendPayment)}
                className={`w-12 h-7 rounded-full transition-colors relative ${
                  sendPayment ? 'bg-green-500' : 'bg-carbon-700'
                }`}
              >
                <span
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                    sendPayment ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {sendPayment && (
              <>
                {/* PayPal Warning */}
                {!paymentSettings.isConfigured && (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                    <p className="text-yellow-400 text-sm">
                      Set up your PayPal account in Payment Settings to send payment requests.
                    </p>
                  </div>
                )}

                {/* Price Tiers */}
                {priceTiers.length > 0 && (
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Quick Select Amount</label>
                    <div className="grid grid-cols-3 gap-2">
                      {priceTiers.map((tier) => (
                        <button
                          key={tier.id}
                          type="button"
                          onClick={() => {
                            setSelectedTier(tier);
                            setCustomAmount('');
                          }}
                          className={`p-3 rounded-xl text-center transition-colors ${
                            selectedTier?.id === tier.id
                              ? 'bg-gold-500/20 border border-gold-500/50'
                              : 'bg-carbon-800 hover:bg-carbon-700'
                          }`}
                        >
                          <p className={`font-bold ${selectedTier?.id === tier.id ? 'text-gold-400' : 'text-white'}`}>
                            {formatCurrency(tier.amount)}
                          </p>
                          <p className="text-gray-500 text-xs">{tier.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Custom Amount */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    {priceTiers.length > 0 ? 'Or Enter Custom Amount' : 'Payment Amount'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setSelectedTier(null);
                      }}
                      placeholder={lastAmount ? `Last: ${lastAmount}` : '0.00'}
                      className="w-full bg-carbon-800 border border-carbon-700 rounded-xl py-3 pl-8 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-gold-500/50"
                    />
                  </div>
                </div>

                {/* Billing Cycle */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Billing Cycle</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'weekly', label: 'Weekly' },
                      { id: 'monthly', label: 'Monthly' },
                      { id: 'yearly', label: 'Yearly' },
                    ].map((cycle) => (
                      <button
                        key={cycle.id}
                        type="button"
                        onClick={() => setBillingCycle(cycle.id)}
                        className={`py-2 px-4 rounded-xl text-sm font-semibold transition-colors ${
                          billingCycle === cycle.id
                            ? 'bg-gold-gradient text-carbon-900'
                            : 'bg-carbon-800 text-gray-400 hover:bg-carbon-700'
                        }`}
                      >
                        {cycle.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                {currentAmount > 0 && (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                    <p className="text-green-400 text-sm">
                      Client will be billed <strong>{formatCurrency(currentAmount)}</strong> {billingCycle}
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-carbon-700 text-gray-300 font-semibold py-3 rounded-xl"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={sendPayment && currentAmount <= 0 && paymentSettings.isConfigured}
                className="flex-1 bg-gold-gradient text-carbon-900 font-bold py-3 rounded-xl hover:scale-[1.02] transition-transform disabled:opacity-50"
              >
                {sendPayment && currentAmount > 0 ? 'Add & Send Request' : 'Add Client'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Quick Message Modal with Smart Suggestions
const QuickMessageModal = ({ client, onClose }) => {
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  // Generate smart, context-aware message suggestions based on athlete data
  const smartMessages = generateSmartMessages(client.id, client.name, {
    goal: client.goal,
    level: client.level,
    status: client.status,
  });

  // Get priority icon for each suggestion
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      default: return '🟢';
    }
  };

  const handleSend = () => {
    if (!message.trim()) return;
    addMessage({
      senderId: 'coach',
      recipientId: client.id,
      text: message.trim(),
      read: false,
    });
    setSent(true);
    setTimeout(() => onClose(), 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-carbon-900 rounded-3xl w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-carbon-700 flex items-center justify-between sticky top-0 bg-carbon-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-gold-300 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {client.avatar}
            </div>
            <div>
              <p className="text-white font-semibold">{client.name}</p>
              <p className="text-gray-500 text-sm">Send a message</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-carbon-800 rounded-xl">
            <X className="text-gray-400" size={20} />
          </button>
        </div>

        {sent ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="text-green-400" size={28} />
            </div>
            <p className="text-white font-semibold text-lg">Message Sent!</p>
            <p className="text-gray-400 text-sm mt-1">{client.name} will be notified</p>
          </div>
        ) : (
          <div className="p-6">
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <p className="text-gray-400 text-sm">Smart suggestions:</p>
                <span className="text-xs text-gray-500">Based on {client.name}'s data</span>
              </div>
              {smartMessages.map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => setMessage(suggestion.message)}
                  className={`w-full text-left p-3 rounded-xl transition-colors ${
                    message === suggestion.message
                      ? 'bg-gold-500/20 border border-gold-500/30'
                      : 'bg-carbon-800 hover:bg-carbon-700'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-sm mt-0.5">{getPriorityIcon(suggestion.priority)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-300 text-sm leading-relaxed">{suggestion.message}</p>
                      <p className="text-gray-500 text-xs mt-1 flex items-center gap-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          suggestion.priority === 'high' ? 'bg-red-400' :
                          suggestion.priority === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                        }`} />
                        {suggestion.reason}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message or select above..."
              className="w-full bg-carbon-800 border border-carbon-700 rounded-xl p-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-gold-500/50 resize-none"
              rows={3}
            />

            <button
              onClick={handleSend}
              disabled={!message.trim()}
              className="w-full mt-4 bg-gold-gradient text-carbon-900 font-bold py-3 rounded-xl hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Send Message
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Assign Program Modal
const AssignProgramModal = ({ client, onClose, onAssign }) => {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [assigned, setAssigned] = useState(false);

  const programs = [
    { id: 1, name: 'Beginner Strength', weeks: 4, days: 3, focus: 'Full Body' },
    { id: 2, name: 'Intermediate Hypertrophy', weeks: 6, days: 4, focus: 'Upper/Lower' },
    { id: 3, name: '4-Week Strength Block', weeks: 4, days: 4, focus: 'Compound Lifts' },
    { id: 4, name: 'Athletic Performance', weeks: 8, days: 5, focus: 'Power & Speed' },
    { id: 5, name: 'Fat Loss Circuit', weeks: 6, days: 4, focus: 'HIIT + Weights' },
  ];

  const handleAssign = () => {
    if (!selectedProgram) return;
    onAssign?.(client, selectedProgram);
    setAssigned(true);
    setTimeout(() => onClose(), 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-carbon-900 rounded-3xl w-full max-w-md overflow-hidden">
        <div className="p-6 border-b border-carbon-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold-500/20 rounded-xl flex items-center justify-center">
              <Clipboard className="text-gold-400" size={20} />
            </div>
            <div>
              <p className="text-white font-semibold">Assign Program</p>
              <p className="text-gray-500 text-sm">for {client.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-carbon-800 rounded-xl">
            <X className="text-gray-400" size={20} />
          </button>
        </div>

        {assigned ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clipboard className="text-green-400" size={28} />
            </div>
            <p className="text-white font-semibold text-lg">Program Assigned!</p>
            <p className="text-gray-400 text-sm mt-1">{selectedProgram?.name} sent to {client.name}</p>
          </div>
        ) : (
          <div className="p-6">
            <p className="text-gray-400 text-sm mb-4">Select a program:</p>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {programs.map((program) => (
                <button
                  key={program.id}
                  onClick={() => setSelectedProgram(program)}
                  className={`w-full text-left p-4 rounded-xl transition-colors ${
                    selectedProgram?.id === program.id
                      ? 'bg-gold-500/20 border border-gold-500/30'
                      : 'bg-carbon-800 hover:bg-carbon-700'
                  }`}
                >
                  <p className="text-white font-semibold">{program.name}</p>
                  <p className="text-gray-500 text-sm">
                    {program.weeks} weeks · {program.days}x/week · {program.focus}
                  </p>
                </button>
              ))}
            </div>

            <button
              onClick={handleAssign}
              disabled={!selectedProgram}
              className="w-full mt-4 bg-gold-gradient text-carbon-900 font-bold py-3 rounded-xl hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Assign Program
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Clients Page
const Clients = () => {
  const [clients, setClients] = useState(defaultClients);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedClient, setSelectedClient] = useState(null);
  const [showAddClient, setShowAddClient] = useState(false);
  const [messageClient, setMessageClient] = useState(null);
  const [assignProgramClient, setAssignProgramClient] = useState(null);
  const [showPaymentSettings, setShowPaymentSettings] = useState(false);

  useEffect(() => {
    // Load any saved athletes from localStorage
    const storedAthletes = getAthletes();
    if (storedAthletes.length > 0) {
      const mappedClients = storedAthletes.map(a => ({
        id: a.id,
        name: a.name,
        email: a.email || '',
        program: a.currentProgram || 'No Program',
        sevenDay: Math.floor(Math.random() * 40) + 60,
        thirtyDay: Math.floor(Math.random() * 40) + 60,
        status: a.status === 'needs_attention' ? 'alert' : a.status === 'active' ? 'good' : 'watch',
        avatar: a.avatar || a.name.split(' ').map(n => n[0]).join('').slice(0, 2),
        goal: 'General Fitness',
        level: 'Intermediate',
        startDate: new Date(a.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        prs: Math.floor(Math.random() * 5) + 1,
        gained: `${Math.floor(Math.random() * 20) - 5} lbs`,
        lastActive: 'Recently',
      }));
      // Merge with defaults, avoiding duplicates
      const existingIds = mappedClients.map(c => c.id);
      const mergedClients = [...mappedClients, ...defaultClients.filter(c => !existingIds.includes(c.id))];
      setClients(mergedClients);
    }
  }, []);

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          client.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || client.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: clients.length,
    active: clients.filter(c => c.status === 'good').length,
    needsAttention: clients.filter(c => c.status === 'alert').length,
  };

  const handleAssignProgram = (client, program) => {
    setClients(prev =>
      prev.map(c =>
        c.id === client.id
          ? { ...c, program: program.name }
          : c
      )
    );
  };

  return (
    <PageTransition>
      <div className="min-h-screen pb-32">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-carbon-900/90 backdrop-blur-lg border-b border-slate-800">
          <div className="p-4">
            <SlideIn direction="down">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Users className="text-gold-400" size={28} />
                  <div>
                    <h1 className="text-white text-xl font-bold">Clients</h1>
                    <p className="text-gray-400 text-sm">{stats.total} athletes</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowPaymentSettings(true)}
                    className="p-2 bg-carbon-800 hover:bg-carbon-700 rounded-xl transition-colors"
                    aria-label="Payment settings"
                  >
                    <CreditCard size={20} className="text-gray-400" />
                  </button>
                  <button
                    onClick={() => setShowAddClient(true)}
                    className="p-2 bg-gold-gradient rounded-xl"
                    aria-label="Add new client"
                  >
                    <Plus size={20} className="text-carbon-900" />
                  </button>
                </div>
              </div>
            </SlideIn>

            {/* Search */}
            <SlideIn delay={50}>
              <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="text"
                  placeholder="Search clients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-carbon-800 border border-carbon-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-gold-500/50"
                />
              </div>
            </SlideIn>

            {/* Filter Tabs */}
            <SlideIn delay={100}>
              <div className="flex gap-2">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'good', label: 'On Track' },
                  { id: 'watch', label: 'Watch' },
                  { id: 'alert', label: 'Attention' },
                ].map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setFilterStatus(filter.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                      filterStatus === filter.id
                        ? 'bg-gold-gradient text-carbon-900'
                        : 'bg-carbon-800 text-gray-400 hover:bg-carbon-700'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </SlideIn>
          </div>
        </header>

        {/* Stats Cards */}
        <SlideIn delay={150}>
          <div className="p-4 grid grid-cols-3 gap-3">
            <div className="bg-carbon-800/50 rounded-xl p-3 text-center">
              <Users className="text-blue-400 mx-auto mb-1" size={20} />
              <p className="text-2xl font-bold text-white">{stats.total}</p>
              <p className="text-gray-500 text-xs">Total</p>
            </div>
            <div className="bg-carbon-800/50 rounded-xl p-3 text-center">
              <TrendingUp className="text-green-400 mx-auto mb-1" size={20} />
              <p className="text-2xl font-bold text-white">{stats.active}</p>
              <p className="text-gray-500 text-xs">Active</p>
            </div>
            <div className="bg-carbon-800/50 rounded-xl p-3 text-center">
              <AlertTriangle className="text-red-400 mx-auto mb-1" size={20} />
              <p className="text-2xl font-bold text-white">{stats.needsAttention}</p>
              <p className="text-gray-500 text-xs">Attention</p>
            </div>
          </div>
        </SlideIn>

        {/* Client List */}
        <div className="px-4 space-y-3">
          <StaggerContainer staggerDelay={50}>
            {filteredClients.length === 0 ? (
              <div className="text-center py-12">
                <Users className="mx-auto text-gray-600 mb-4" size={48} />
                <p className="text-gray-400">No clients found</p>
              </div>
            ) : (
              filteredClients.map((client) => (
                <SlideIn key={client.id}>
                  <button
                    onClick={() => setSelectedClient(client)}
                    className="w-full bg-carbon-800/50 hover:bg-carbon-800 rounded-2xl p-4 flex items-center justify-between transition-colors text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center text-white font-bold">
                          {client.avatar}
                        </div>
                        <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 ${getStatusColor(client.status)} rounded-full border-2 border-carbon-900`} />
                      </div>
                      <div>
                        <p className="text-white font-semibold">{client.name}</p>
                        <p className="text-gray-500 text-sm">{client.program}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <p className="text-white font-semibold">{client.sevenDay}%</p>
                        <p className="text-gray-500 text-xs">7-Day</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">{client.thirtyDay}%</p>
                        <p className="text-gray-500 text-xs">30-Day</p>
                      </div>
                      <ChevronRight className="text-gray-500" size={20} />
                    </div>
                  </button>
                </SlideIn>
              ))
            )}
          </StaggerContainer>
        </div>
      </div>

      {/* Modals */}
      {selectedClient && (
        <ClientDetailModal
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
          onMessage={(client) => {
            setSelectedClient(null);
            setMessageClient(client);
          }}
          onAssignProgram={(client) => {
            setSelectedClient(null);
            setAssignProgramClient(client);
          }}
        />
      )}

      {showAddClient && (
        <AddClientModal
          onClose={() => setShowAddClient(false)}
          onAdd={(newClient) => {
            setClients(prev => [newClient, ...prev]);
          }}
        />
      )}

      {messageClient && (
        <QuickMessageModal
          client={messageClient}
          onClose={() => setMessageClient(null)}
        />
      )}

      {assignProgramClient && (
        <AssignProgramModal
          client={assignProgramClient}
          onClose={() => setAssignProgramClient(null)}
          onAssign={handleAssignProgram}
        />
      )}

      {showPaymentSettings && (
        <PaymentSettings onClose={() => setShowPaymentSettings(false)} />
      )}
    </PageTransition>
  );
};

export default Clients;
