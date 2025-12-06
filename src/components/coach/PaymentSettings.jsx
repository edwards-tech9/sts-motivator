import { useState, useEffect } from 'react';
import { CreditCard, Plus, Trash2, X, Check, Edit2, DollarSign, Mail, Building } from 'lucide-react';
import {
  getPayPalSettings,
  savePayPalSettings,
  getPriceTiers,
  savePriceTiers,
  addPriceTier,
  deletePriceTier,
  formatCurrency,
} from '../../services/paypalService';

// PayPal Settings Modal
const PaymentSettings = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('account');
  const [settings, setSettings] = useState(getPayPalSettings());
  const [tiers, setTiers] = useState(getPriceTiers());
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editingTier, setEditingTier] = useState(null);
  const [newTier, setNewTier] = useState({ name: '', amount: '', description: '' });
  const [showAddTier, setShowAddTier] = useState(false);

  const handleSaveSettings = () => {
    setSaving(true);
    const result = savePayPalSettings(settings);
    setTimeout(() => {
      setSaving(false);
      if (result.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    }, 500);
  };

  const handleAddTier = () => {
    if (!newTier.name || !newTier.amount) return;

    const tier = addPriceTier({
      name: newTier.name,
      amount: parseFloat(newTier.amount),
      description: newTier.description || '',
    });

    setTiers([...tiers, tier]);
    setNewTier({ name: '', amount: '', description: '' });
    setShowAddTier(false);
  };

  const handleDeleteTier = (tierId) => {
    deletePriceTier(tierId);
    setTiers(tiers.filter(t => t.id !== tierId));
  };

  const handleUpdateTier = (tierId, updates) => {
    const updatedTiers = tiers.map(t =>
      t.id === tierId ? { ...t, ...updates } : t
    );
    setTiers(updatedTiers);
    savePriceTiers(updatedTiers);
    setEditingTier(null);
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 overflow-y-auto">
      <div className="min-h-screen">
        {/* Header */}
        <div className="sticky top-0 bg-carbon-900/95 backdrop-blur-lg border-b border-carbon-700 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
              <CreditCard className="text-green-400" size={20} />
            </div>
            <div>
              <h2 className="text-white font-bold">Payment Settings</h2>
              <p className="text-gray-500 text-sm">Configure PayPal & pricing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-carbon-800 rounded-lg transition-colors"
          >
            <X className="text-gray-400" size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="p-4 border-b border-carbon-800">
          <div className="flex gap-2">
            {[
              { id: 'account', label: 'PayPal Account', icon: Mail },
              { id: 'pricing', label: 'Price Tiers', icon: DollarSign },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  activeTab === tab.id
                    ? 'bg-gold-gradient text-carbon-900'
                    : 'bg-carbon-800 text-gray-400 hover:bg-carbon-700'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 max-w-lg mx-auto">
          {/* PayPal Account Tab */}
          {activeTab === 'account' && (
            <div className="space-y-6">
              <div className="bg-carbon-800/50 rounded-2xl p-5">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Building size={18} className="text-gold-400" />
                  Business Information
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Business Name</label>
                    <input
                      type="text"
                      value={settings.businessName || ''}
                      onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                      placeholder="Your Coaching Business"
                      className="w-full bg-carbon-900 border border-carbon-700 rounded-xl py-3 px-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-gold-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">PayPal Email</label>
                    <input
                      type="email"
                      value={settings.email || ''}
                      onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                      placeholder="payments@yourbusiness.com"
                      className="w-full bg-carbon-900 border border-carbon-700 rounded-xl py-3 px-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-gold-500/50"
                    />
                    <p className="text-gray-500 text-xs mt-2">
                      This is the PayPal account where you'll receive payments
                    </p>
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Currency</label>
                    <select
                      value={settings.currency || 'USD'}
                      onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                      className="w-full bg-carbon-900 border border-carbon-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-gold-500/50"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="CAD">CAD ($)</option>
                      <option value="AUD">AUD ($)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Status indicator */}
              <div className={`rounded-xl p-4 ${settings.isConfigured || (settings.email && settings.email.includes('@')) ? 'bg-green-500/10 border border-green-500/30' : 'bg-yellow-500/10 border border-yellow-500/30'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${settings.isConfigured || (settings.email && settings.email.includes('@')) ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  <span className={settings.isConfigured || (settings.email && settings.email.includes('@')) ? 'text-green-400' : 'text-yellow-400'}>
                    {settings.isConfigured || (settings.email && settings.email.includes('@')) ? 'PayPal account connected' : 'Enter your PayPal email to receive payments'}
                  </span>
                </div>
              </div>

              <button
                onClick={handleSaveSettings}
                disabled={saving}
                className="w-full bg-gold-gradient text-carbon-900 font-bold py-3 rounded-xl hover:scale-[1.02] transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? (
                  'Saving...'
                ) : saved ? (
                  <>
                    <Check size={18} />
                    Saved!
                  </>
                ) : (
                  'Save Settings'
                )}
              </button>
            </div>
          )}

          {/* Price Tiers Tab */}
          {activeTab === 'pricing' && (
            <div className="space-y-4">
              <div className="bg-carbon-800/50 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold flex items-center gap-2">
                    <DollarSign size={18} className="text-gold-400" />
                    Your Price Tiers
                  </h3>
                  <button
                    onClick={() => setShowAddTier(true)}
                    className="p-2 bg-gold-500/20 hover:bg-gold-500/30 rounded-lg transition-colors"
                  >
                    <Plus className="text-gold-400" size={18} />
                  </button>
                </div>

                <p className="text-gray-500 text-sm mb-4">
                  Quick-select pricing options when adding clients. Only you see these tiers.
                </p>

                <div className="space-y-3">
                  {tiers.map((tier) => (
                    <div
                      key={tier.id}
                      className="bg-carbon-900 rounded-xl p-4 flex items-center justify-between group"
                    >
                      {editingTier === tier.id ? (
                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            value={tier.name}
                            onChange={(e) => {
                              const updated = tiers.map(t =>
                                t.id === tier.id ? { ...t, name: e.target.value } : t
                              );
                              setTiers(updated);
                            }}
                            className="w-full bg-carbon-800 border border-carbon-700 rounded-lg py-2 px-3 text-white text-sm focus:outline-none focus:border-gold-500/50"
                          />
                          <div className="flex gap-2">
                            <input
                              type="number"
                              value={tier.amount}
                              onChange={(e) => {
                                const updated = tiers.map(t =>
                                  t.id === tier.id ? { ...t, amount: parseFloat(e.target.value) || 0 } : t
                                );
                                setTiers(updated);
                              }}
                              className="flex-1 bg-carbon-800 border border-carbon-700 rounded-lg py-2 px-3 text-white text-sm focus:outline-none focus:border-gold-500/50"
                            />
                            <button
                              onClick={() => handleUpdateTier(tier.id, tier)}
                              className="px-3 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm font-semibold"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div>
                            <p className="text-white font-semibold">{tier.name}</p>
                            <p className="text-gray-500 text-sm">{tier.description}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-gold-400 font-bold text-lg">
                              {formatCurrency(tier.amount, settings.currency)}
                            </span>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => setEditingTier(tier.id)}
                                className="p-1.5 hover:bg-carbon-700 rounded-lg"
                              >
                                <Edit2 className="text-gray-400" size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteTier(tier.id)}
                                className="p-1.5 hover:bg-red-500/20 rounded-lg"
                              >
                                <Trash2 className="text-red-400" size={14} />
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}

                  {tiers.length === 0 && (
                    <p className="text-gray-500 text-center py-8">
                      No price tiers yet. Add one to get started.
                    </p>
                  )}
                </div>
              </div>

              {/* Add New Tier Form */}
              {showAddTier && (
                <div className="bg-carbon-800/50 rounded-2xl p-5">
                  <h4 className="text-white font-semibold mb-4">Add New Tier</h4>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={newTier.name}
                      onChange={(e) => setNewTier({ ...newTier, name: e.target.value })}
                      placeholder="Tier name (e.g., Premium)"
                      className="w-full bg-carbon-900 border border-carbon-700 rounded-xl py-3 px-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-gold-500/50"
                    />
                    <input
                      type="number"
                      value={newTier.amount}
                      onChange={(e) => setNewTier({ ...newTier, amount: e.target.value })}
                      placeholder="Amount (e.g., 199)"
                      className="w-full bg-carbon-900 border border-carbon-700 rounded-xl py-3 px-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-gold-500/50"
                    />
                    <input
                      type="text"
                      value={newTier.description}
                      onChange={(e) => setNewTier({ ...newTier, description: e.target.value })}
                      placeholder="Description (optional)"
                      className="w-full bg-carbon-900 border border-carbon-700 rounded-xl py-3 px-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-gold-500/50"
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setShowAddTier(false);
                          setNewTier({ name: '', amount: '', description: '' });
                        }}
                        className="flex-1 bg-carbon-700 text-gray-300 font-semibold py-3 rounded-xl"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddTier}
                        disabled={!newTier.name || !newTier.amount}
                        className="flex-1 bg-gold-gradient text-carbon-900 font-bold py-3 rounded-xl disabled:opacity-50"
                      >
                        Add Tier
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentSettings;
