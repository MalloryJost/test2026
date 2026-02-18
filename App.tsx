
import React, { useState, useEffect, useMemo } from 'react';
import { CalculatorTab, MortgageData, InvestmentData, AffordabilityData } from './types';
import { calculateMortgage, calculateInvestment, calculateAffordability } from './utils/calculations';
import { getAIPropertyAdvice } from './services/geminiService';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  Calculator, 
  TrendingUp, 
  Wallet, 
  ChevronRight, 
  Info, 
  Sparkles,
  RefreshCcw,
  Home,
  DollarSign
} from 'lucide-react';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

export default function App() {
  const [activeTab, setActiveTab] = useState<CalculatorTab>(CalculatorTab.MORTGAGE);
  const [aiInsight, setAiInsight] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Default States
  const [mortgageData, setMortgageData] = useState<MortgageData>({
    homePrice: 450000,
    downPayment: 90000,
    loanTerm: 30,
    interestRate: 6.5,
    propertyTax: 5400,
    insurance: 1200
  });

  const [investmentData, setInvestmentData] = useState<InvestmentData>({
    purchasePrice: 350000,
    monthlyRent: 2800,
    otherIncome: 0,
    managementFee: 200,
    maintenance: 150,
    vacancyRate: 5,
    downPayment: 70000,
    interestRate: 6.8
  });

  const [affordabilityData, setAffordabilityData] = useState<AffordabilityData>({
    annualIncome: 120000,
    monthlyDebts: 500,
    downPayment: 50000,
    interestRate: 6.5
  });

  // Computed Values
  const mortgageResults = useMemo(() => calculateMortgage(mortgageData), [mortgageData]);
  const investmentResults = useMemo(() => calculateInvestment(investmentData), [investmentData]);
  const affordabilityResults = useMemo(() => calculateAffordability(affordabilityData), [affordabilityData]);

  const handleAiInsight = async () => {
    setIsAiLoading(true);
    const data = activeTab === CalculatorTab.MORTGAGE ? mortgageData : 
                 activeTab === CalculatorTab.INVESTMENT ? investmentData : affordabilityData;
    const insight = await getAIPropertyAdvice(data, activeTab);
    setAiInsight(insight);
    setIsAiLoading(false);
  };

  const chartData = mortgageResults.amortization.map(point => ({
    name: `Year ${point.month}`,
    Balance: Math.round(point.remainingBalance),
    Interest: Math.round(point.interest * 12),
    Principal: Math.round(point.principal * 12)
  }));

  const pieData = [
    { name: 'Principal & Interest', value: mortgageResults.monthlyPayment - (mortgageData.propertyTax/12) - (mortgageData.insurance/12) },
    { name: 'Property Tax', value: mortgageData.propertyTax / 12 },
    { name: 'Insurance', value: mortgageData.insurance / 12 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-72 bg-white border-r border-slate-200 p-6 flex flex-col gap-6 lg:fixed lg:h-full z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Calculator className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">EstatePro</h1>
        </div>

        <nav className="space-y-1">
          <button 
            onClick={() => setActiveTab(CalculatorTab.MORTGAGE)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === CalculatorTab.MORTGAGE ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <Home size={20} />
            Mortgage
          </button>
          <button 
            onClick={() => setActiveTab(CalculatorTab.INVESTMENT)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === CalculatorTab.INVESTMENT ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <TrendingUp size={20} />
            Investment
          </button>
          <button 
            onClick={() => setActiveTab(CalculatorTab.AFFORDABILITY)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === CalculatorTab.AFFORDABILITY ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <Wallet size={20} />
            Affordability
          </button>
        </nav>

        <div className="mt-auto p-4 bg-slate-900 rounded-2xl text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2 text-indigo-400">
              <Sparkles size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">AI Powered</span>
            </div>
            <p className="text-sm text-slate-300 mb-4">Get personalized strategy advice from our AI expert.</p>
            <button 
              onClick={handleAiInsight}
              disabled={isAiLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {isAiLoading ? <RefreshCcw className="animate-spin" size={16} /> : 'Get Analysis'}
            </button>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-72 p-6 md:p-10 space-y-8">
        
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {activeTab === CalculatorTab.MORTGAGE && 'Mortgage Calculator'}
              {activeTab === CalculatorTab.INVESTMENT && 'Rental Investment Analysis'}
              {activeTab === CalculatorTab.AFFORDABILITY && 'Home Affordability Tool'}
            </h2>
            <p className="text-slate-500 mt-1">Make informed decisions with professional-grade data visualization.</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 bg-white px-3 py-1.5 rounded-full border border-slate-200">
            <Info size={14} />
            Live Market Projections
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Inputs Section */}
          <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 space-y-6">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Calculator size={18} className="text-indigo-600" />
              Calculator Inputs
            </h3>
            
            <div className="space-y-4">
              {activeTab === CalculatorTab.MORTGAGE && (
                <>
                  <InputGroup label="Home Price" value={mortgageData.homePrice} onChange={(v) => setMortgageData({...mortgageData, homePrice: v})} prefix="$" />
                  <InputGroup label="Down Payment" value={mortgageData.downPayment} onChange={(v) => setMortgageData({...mortgageData, downPayment: v})} prefix="$" />
                  <div className="grid grid-cols-2 gap-4">
                    <InputGroup label="Interest Rate" value={mortgageData.interestRate} onChange={(v) => setMortgageData({...mortgageData, interestRate: v})} suffix="%" step={0.1} />
                    <InputGroup label="Loan Term" value={mortgageData.loanTerm} onChange={(v) => setMortgageData({...mortgageData, loanTerm: v})} suffix="Yrs" />
                  </div>
                  <InputGroup label="Property Tax (Annual)" value={mortgageData.propertyTax} onChange={(v) => setMortgageData({...mortgageData, propertyTax: v})} prefix="$" />
                  <InputGroup label="Home Insurance (Annual)" value={mortgageData.insurance} onChange={(v) => setMortgageData({...mortgageData, insurance: v})} prefix="$" />
                </>
              )}

              {activeTab === CalculatorTab.INVESTMENT && (
                <>
                  <InputGroup label="Purchase Price" value={investmentData.purchasePrice} onChange={(v) => setInvestmentData({...investmentData, purchasePrice: v})} prefix="$" />
                  <InputGroup label="Monthly Rent" value={investmentData.monthlyRent} onChange={(v) => setInvestmentData({...investmentData, monthlyRent: v})} prefix="$" />
                  <div className="grid grid-cols-2 gap-4">
                    <InputGroup label="Mgmt Fee" value={investmentData.managementFee} onChange={(v) => setInvestmentData({...investmentData, managementFee: v})} prefix="$" />
                    <InputGroup label="Maintenance" value={investmentData.maintenance} onChange={(v) => setInvestmentData({...investmentData, maintenance: v})} prefix="$" />
                  </div>
                  <InputGroup label="Vacancy Rate" value={investmentData.vacancyRate} onChange={(v) => setInvestmentData({...investmentData, vacancyRate: v})} suffix="%" />
                  <InputGroup label="Down Payment" value={investmentData.downPayment} onChange={(v) => setInvestmentData({...investmentData, downPayment: v})} prefix="$" />
                </>
              )}

              {activeTab === CalculatorTab.AFFORDABILITY && (
                <>
                  <InputGroup label="Annual Gross Income" value={affordabilityData.annualIncome} onChange={(v) => setAffordabilityData({...affordabilityData, annualIncome: v})} prefix="$" />
                  <InputGroup label="Monthly Debts" value={affordabilityData.monthlyDebts} onChange={(v) => setAffordabilityData({...affordabilityData, monthlyDebts: v})} prefix="$" />
                  <InputGroup label="Down Payment Saved" value={affordabilityData.downPayment} onChange={(v) => setAffordabilityData({...affordabilityData, downPayment: v})} prefix="$" />
                  <InputGroup label="Expected Interest Rate" value={affordabilityData.interestRate} onChange={(v) => setAffordabilityData({...affordabilityData, interestRate: v})} suffix="%" step={0.1} />
                </>
              )}
            </div>
          </section>

          {/* Results Section */}
          <div className="xl:col-span-2 space-y-8">
            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeTab === CalculatorTab.MORTGAGE && (
                <>
                  <MetricCard label="Monthly Payment" value={mortgageResults.monthlyPayment} isCurrency />
                  <MetricCard label="Total Interest" value={mortgageResults.totalInterest} isCurrency />
                  <MetricCard label="Total Loan Cost" value={mortgageResults.totalCost} isCurrency />
                </>
              )}
              {activeTab === CalculatorTab.INVESTMENT && (
                <>
                  <MetricCard label="Monthly Cash Flow" value={investmentResults.monthlyCashFlow} isCurrency />
                  <MetricCard label="Cap Rate" value={investmentResults.capRate} suffix="%" />
                  <MetricCard label="Cash-on-Cash" value={investmentResults.cashOnCash} suffix="%" />
                </>
              )}
              {activeTab === CalculatorTab.AFFORDABILITY && (
                <>
                  <MetricCard label="Estimated Home Price" value={affordabilityResults.maxHomePrice} isCurrency />
                  <MetricCard label="Max Monthly Mortgage" value={affordabilityResults.maxMonthlyPayment} isCurrency />
                  <MetricCard label="Loan-to-Income Ratio" value={((affordabilityResults.maxHomePrice - affordabilityData.downPayment) / (affordabilityData.annualIncome || 1)).toFixed(2)} suffix="x" />
                </>
              )}
            </div>

            {/* AI Insight Box (if available) */}
            {aiInsight && (
              <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-8 relative">
                <div className="flex items-center gap-2 mb-4 text-indigo-700 font-bold">
                  <Sparkles size={20} />
                  AI Property Strategy Insight
                </div>
                <div className="text-indigo-900 leading-relaxed whitespace-pre-line text-sm md:text-base prose prose-indigo">
                  {aiInsight}
                </div>
                <button 
                  onClick={() => setAiInsight('')}
                  className="absolute top-4 right-4 text-indigo-300 hover:text-indigo-500"
                >
                  <RefreshCcw size={16} />
                </button>
              </div>
            )}

            {/* Visualizations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Chart 1: Payment Breakdown / Amortization */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
                <h4 className="font-bold text-slate-800 mb-6 flex items-center justify-between">
                  Monthly Breakdown
                  <span className="text-xs text-slate-400 font-normal">Est. Values</span>
                </h4>
                <div className="h-64">
                  {activeTab === CalculatorTab.MORTGAGE ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                          {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Tooltip formatter={(value: number) => `$${Math.round(value).toLocaleString()}`} />
                        <Legend verticalAlign="bottom" height={36}/>
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[{ name: 'Income', val: activeTab === CalculatorTab.INVESTMENT ? investmentData.monthlyRent : affordabilityData.annualIncome/12 }, { name: 'Expense', val: activeTab === CalculatorTab.INVESTMENT ? (investmentData.managementFee + investmentData.maintenance) : affordabilityData.monthlyDebts }]}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip />
                        <Bar dataKey="val" fill="#6366f1" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Chart 2: Projections over time */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
                <h4 className="font-bold text-slate-800 mb-6 flex items-center justify-between">
                  Loan Balance Projection
                  <span className="text-xs text-slate-400 font-normal">Year-by-Year</span>
                </h4>
                <div className="h-64">
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} hide />
                        <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                        <Area type="monotone" dataKey="Balance" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorBalance)" />
                      </AreaChart>
                    </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Reusable UI Components
const InputGroup = ({ label, value, onChange, prefix, suffix, step = 1 }: { label: string, value: number, onChange: (v: number) => void, prefix?: string, suffix?: string, step?: number }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
    <div className="relative group">
      {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">{prefix}</span>}
      <input 
        type="number" 
        value={value}
        step={step}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className={`w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all ${prefix ? 'pl-8' : ''} ${suffix ? 'pr-12' : ''}`}
      />
      {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">{suffix}</span>}
    </div>
  </div>
);

const MetricCard = ({ label, value, isCurrency, suffix }: { label: string, value: number | string, isCurrency?: boolean, suffix?: string }) => {
  const displayValue = typeof value === 'number' 
    ? (isCurrency ? `$${Math.round(value).toLocaleString()}` : value.toLocaleString())
    : value;

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:border-indigo-200 transition-colors">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-slate-900">{displayValue}</span>
        {suffix && <span className="text-sm font-semibold text-slate-400">{suffix}</span>}
      </div>
    </div>
  );
};
