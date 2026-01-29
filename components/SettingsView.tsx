import React from 'react';
import { User, Bell, Shield, Smartphone, ChevronRight } from 'lucide-react';
import { PageHeader } from './PageHeader';

export const SettingsView: React.FC = () => {
  return (
    <div className="animate-in fade-in duration-500 max-w-3xl">
      <PageHeader 
        title="SYSTEM.CONFIG"
        subtitle="PREFERENCES_&_SECURITY"
      />

      <div className="space-y-8">
        {/* Profile Section */}
        <div className="bg-neutral-900/20 border border-neutral-800 rounded-2xl p-6">
           <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-2xl font-bold text-white">
                JD
              </div>
              <div>
                 <h2 className="text-xl font-bold text-white">John Doe</h2>
                 <p className="font-mono text-xs text-neutral-500">FREELANCER_PRO_TIER</p>
              </div>
              <button className="ml-auto text-xs font-mono border border-neutral-700 px-4 py-2 rounded-lg hover:border-fluoro-yellow hover:text-fluoro-yellow transition-colors">
                 EDIT_PROFILE
              </button>
           </div>
        </div>

        {/* Settings List */}
        <div className="bg-neutral-900/20 border border-neutral-800 rounded-2xl overflow-hidden">
           {[
             { icon: User, label: 'Account Information', desc: 'Email, Phone, Address' },
             { icon: Bell, label: 'Notifications', desc: 'Push, Email, SMS' },
             { icon: Shield, label: 'Security & Privacy', desc: '2FA, Password, Sessions' },
             { icon: Smartphone, label: 'App Integrations', desc: 'Stripe, PayPal, Slack' },
           ].map((item, i) => (
             <div key={i} className="flex items-center p-6 border-b border-neutral-800/50 last:border-0 hover:bg-neutral-900/50 cursor-pointer group transition-colors">
                <div className="p-3 bg-neutral-800 rounded-lg text-neutral-400 group-hover:text-fluoro-yellow transition-colors mr-4">
                   <item.icon size={20} />
                </div>
                <div className="flex-1">
                   <h3 className="font-bold text-white text-sm">{item.label}</h3>
                   <p className="text-xs text-neutral-500 font-mono">{item.desc}</p>
                </div>
                <ChevronRight size={16} className="text-neutral-600 group-hover:translate-x-1 transition-transform" />
             </div>
           ))}
        </div>

        {/* Danger Zone */}
        <div className="border border-red-900/30 bg-red-900/5 rounded-2xl p-6">
           <h3 className="text-red-500 font-bold text-sm mb-2">DANGER_ZONE</h3>
           <p className="text-xs text-neutral-500 mb-4">Irreversible actions regarding your account data.</p>
           <button className="text-xs font-mono text-red-500 border border-red-900/50 px-4 py-2 rounded-lg hover:bg-red-900/20 transition-colors">
             DELETE_ACCOUNT
           </button>
        </div>
      </div>
    </div>
  );
};