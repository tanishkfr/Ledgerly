import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { WalletView } from './components/WalletView';
import { ProfileView } from './components/ProfileView'; 
import { AnalyticsView } from './components/AnalyticsView';
import { EquitiesView } from './components/EquitiesView';
import { ExchangeView } from './components/ExchangeView';
import { InsuranceView } from './components/InsuranceView';
import { SplashScreen } from './components/SplashScreen';
import { generateFinancialInsight } from './services/geminiService';
import { createTransaction } from './services/transactionService';
import { FinancialSummary, UserProfile } from './types';
import { NoiseOverlay } from './components/NoiseOverlay';
import { BrandLogo } from './components/BrandLogo';
import { Header } from './components/Header';
import { TransactionModal } from './components/TransactionModal';
import { BalanceModal } from './components/BalanceModal';
import { getTimestamp } from './utils'; 
import { CheckCircle2, Plus } from 'lucide-react';

// Initial Data
const INITIAL_DATA: FinancialSummary = {
  totalBalance: 24500.80,
  monthlySavings: 3200,
  monthlyGoal: 5000,
  cashFlowData: [
    { name: 'Mon', value: 21000 },
    { name: 'Tue', value: 21500 },
    { name: 'Wed', value: 20800 },
    { name: 'Thu', value: 23000 },
    { name: 'Fri', value: 24500 },
    { name: 'Sat', value: 24200 },
    { name: 'Sun', value: 24500 },
  ],
  recentTransactions: [
    { id: '1', merchant: 'Figma Pro', amount: -15.00, date: getTimestamp(2), category: 'Software', status: 'CLEARED' },
    { id: '2', merchant: 'Client Transfer #402', amount: 4500.00, date: getTimestamp(45), category: 'Income', status: 'CLEARED' },
    { id: '3', merchant: 'Vercel Usage', amount: -45.20, date: getTimestamp(120), category: 'Hosting', status: 'PENDING' },
    { id: '4', merchant: 'Linear App', amount: -12.00, date: getTimestamp(180), category: 'Software', status: 'CLEARED' },
    { id: '5', merchant: 'Uber Business', amount: -34.50, date: getTimestamp(240), category: 'Travel', status: 'CLEARED' },
    { id: '6', merchant: 'AWS Services', amount: -142.20, date: getTimestamp(300), category: 'Infrastructure', status: 'CLEARED' },
  ]
};

const INITIAL_PROFILE: UserProfile = {
  fullName: 'John Doe',
  email: 'john.doe@ledgerly.com',
  role: 'Senior Freelancer',
  twoFactor: true,
  apiKey: 'pk_live_51M...',
  initials: 'JD'
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState<FinancialSummary>(INITIAL_DATA);
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [insight, setInsight] = useState<string>("Initializing neural analysis...");
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [latency, setLatency] = useState(12);
  
  // UX State
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('SYSTEM_STATUS: SUCCESS');
  const [lastAddedTxId, setLastAddedTxId] = useState<string | null>(null);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  // Event Listener for Modal (Universal Link Logic)
  useEffect(() => {
    const handleOpenModal = () => setIsTxModalOpen(true);
    window.addEventListener('open-transaction-modal', handleOpenModal);
    return () => window.removeEventListener('open-transaction-modal', handleOpenModal);
  }, []);

  // --- Real-Time Data Polling Logic ---
  useEffect(() => {
    const fetchRealTimeMetrics = () => {
      if (lastAddedTxId) return;

      setData(prevData => {
        const volatility = (Math.random() - 0.5) * 150; 
        const newBalance = prevData.totalBalance + volatility;
        const updatedCashFlow = [...prevData.cashFlowData];
        if (updatedCashFlow.length > 0) {
          const lastIdx = updatedCashFlow.length - 1;
          const flowDrift = (Math.random() - 0.5) * 400;
          updatedCashFlow[lastIdx] = {
            ...updatedCashFlow[lastIdx],
            value: Math.max(0, updatedCashFlow[lastIdx].value + flowDrift)
          };
        }
        return { ...prevData, totalBalance: newBalance, cashFlowData: updatedCashFlow };
      });
    };

    const pollingInterval = setInterval(fetchRealTimeMetrics, 15000);
    const latencyInterval = setInterval(() => {
       setLatency(prev => Math.max(8, Math.min(45, prev + (Math.random() - 0.5) * 10)));
    }, 2000);

    return () => {
      clearInterval(pollingInterval);
      clearInterval(latencyInterval);
    };
  }, [lastAddedTxId]);

  useEffect(() => {
    const fetchInsight = async () => {
      setLoadingInsight(true);
      const result = await generateFinancialInsight(data);
      setInsight(result);
      setLoadingInsight(false);
    };
    fetchInsight();
  }, []); 

  const handleAddTransaction = (txData: any) => {
    const updatedData = createTransaction(data, txData);
    setData(updatedData);
    const newTxId = updatedData.recentTransactions[0].id;
    setLastAddedTxId(newTxId);
    triggerToast('SYSTEM_STATUS: TRANSACTION_RECORDED');
    setTimeout(() => {
      setLastAddedTxId(null);
    }, 3000);
  };

  const handleUpdateProfile = (newProfile: Partial<UserProfile>) => {
    setUserProfile(prev => ({
      ...prev,
      ...newProfile,
      initials: newProfile.fullName 
        ? newProfile.fullName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
        : prev.initials
    }));
    triggerToast('SYSTEM_STATUS: PROFILE_UPDATED');
  };
  
  const handleUpdateBalance = (newBalance: number) => {
    setData(prev => ({ ...prev, totalBalance: newBalance }));
    triggerToast('SYSTEM_STATUS: BALANCE_CALIBRATED');
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView 
            data={data} 
            userProfile={userProfile}
            insight={insight} 
            loadingInsight={loadingInsight} 
            highlightedTxId={lastAddedTxId} 
            onNavigate={setActiveTab}
            onOpenTransactionModal={() => setIsTxModalOpen(true)}
            onManageBalance={() => setIsBalanceModalOpen(true)}
            onShowToast={triggerToast}
          />
        );
      case 'analytics':
        return <AnalyticsView data={data} />;
      case 'equities':
        return <EquitiesView />;
      case 'exchange':
        return <ExchangeView />;
      case 'insurance':
        return <InsuranceView />;
      case 'settings':
        return <ProfileView initialProfile={userProfile} onSave={handleUpdateProfile} />;
      // Fallback or legacy support
      case 'wallet':
        return <WalletView data={data} />;
      default:
        return (
          <DashboardView 
            data={data} 
            userProfile={userProfile}
            insight={insight} 
            loadingInsight={loadingInsight} 
            highlightedTxId={lastAddedTxId} 
            onNavigate={setActiveTab}
            onOpenTransactionModal={() => setIsTxModalOpen(true)}
            onManageBalance={() => setIsBalanceModalOpen(true)}
            onShowToast={triggerToast}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-fluoro-yellow selection:text-black relative overflow-x-hidden antialiased flex flex-col">
      <NoiseOverlay />

      <AnimatePresence>
        {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      </AnimatePresence>

      <TransactionModal 
        isOpen={isTxModalOpen} 
        onClose={() => setIsTxModalOpen(false)}
        onSubmit={handleAddTransaction}
      />
      
      <BalanceModal 
        isOpen={isBalanceModalOpen}
        onClose={() => setIsBalanceModalOpen(false)}
        currentBalance={data.totalBalance}
        onUpdate={handleUpdateBalance}
      />

      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="fixed top-24 left-1/2 z-[90] flex items-center gap-3 bg-black/90 backdrop-blur-md border border-fluoro-yellow px-6 py-3 rounded-full shadow-[0_0_20px_rgba(210,255,0,0.3)]"
          >
            <CheckCircle2 className="text-fluoro-yellow" size={18} />
            <span className="text-xs font-mono font-bold text-white tracking-wider">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col relative">
          {/* Atmosphere */}
          <div className="fixed top-0 right-0 w-[50vw] h-[50vh] bg-fluoro-yellow rounded-full blur-[200px] opacity-[0.03] pointer-events-none z-0" />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.015] pointer-events-none z-0">
             <BrandLogo size={600} />
          </div>

          <Header 
            userProfile={userProfile} 
            latency={latency} 
            onNavigate={setActiveTab} 
          />

          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

          <button 
             onClick={() => setIsTxModalOpen(true)}
             className="fixed bottom-24 right-6 z-[80] bg-fluoro-yellow text-black w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(210,255,0,0.4)] hover:scale-110 active:scale-95 active:shadow-[0_0_30px_rgba(210,255,0,0.6)] transition-all md:hidden border border-white/20"
          >
             <Plus size={28} strokeWidth={3} />
          </button>
          
          {/* Main Content Area - "Zero-G" Spacing */}
          {/* Header is 70px. pt-28 (112px) leaves ~42px visual gap. Perfect for Zero-G feel. */}
          <main className="flex-1 w-full relative z-10 pt-28 px-6 md:px-12 md:pl-32 pb-24 transition-all duration-300">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-[1400px] mx-auto"
            >
              {renderContent()}
            </motion.div>
            
            <footer className="w-full text-center py-12 z-10 relative mt-24">
               <div className="flex flex-col items-center gap-2">
                 <p className="text-[10px] font-mono text-neutral-600 tracking-widest">
                   © 2026 LEDGERLY SYSTEMS. ALL RIGHTS RESERVED.
                 </p>
                 <div className="flex items-center gap-2 text-[9px] font-mono text-neutral-700">
                    <span className="w-1 h-1 bg-green-900 rounded-full" />
                    STABILITY_PROTOCOL: <span className="text-green-800 hover:text-green-500 cursor-pointer transition-colors">ACTIVE</span>
                 </div>
               </div>
            </footer>
          </main>
      </div>
    </div>
  );
}