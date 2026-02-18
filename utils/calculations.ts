
import { MortgageData, CalculationResults, AmortizationPoint, InvestmentData, AffordabilityData } from '../types';

export const calculateMortgage = (data: MortgageData): CalculationResults => {
  const principal = data.homePrice - data.downPayment;
  const monthlyRate = data.interestRate / 100 / 12;
  const totalMonths = data.loanTerm * 12;

  const monthlyPayment = principal * 
    (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
    (Math.pow(1 + monthlyRate, totalMonths) - 1);

  const amortization: AmortizationPoint[] = [];
  let remainingBalance = principal;
  let totalInterest = 0;

  for (let i = 1; i <= totalMonths; i++) {
    const interest = remainingBalance * monthlyRate;
    const principalPaid = monthlyPayment - interest;
    remainingBalance -= principalPaid;
    totalInterest += interest;

    if (i % 12 === 0 || i === totalMonths) {
      amortization.push({
        month: i / 12,
        principal: principalPaid,
        interest: interest,
        remainingBalance: Math.max(0, remainingBalance)
      });
    }
  }

  return {
    monthlyPayment: monthlyPayment + (data.propertyTax / 12) + (data.insurance / 12),
    totalInterest,
    totalCost: principal + totalInterest,
    amortization
  };
};

export const calculateInvestment = (data: InvestmentData) => {
  const grossRent = (data.monthlyRent + data.otherIncome) * 12;
  const vacancyLoss = grossRent * (data.vacancyRate / 100);
  const effectiveGrossIncome = grossRent - vacancyLoss;
  
  const operatingExpenses = (data.managementFee + data.maintenance) * 12;
  const netOperatingIncome = effectiveGrossIncome - operatingExpenses;
  
  const capRate = (netOperatingIncome / data.purchasePrice) * 100;
  const cashOnCash = (netOperatingIncome / data.downPayment) * 100;

  return {
    noi: netOperatingIncome,
    capRate,
    cashOnCash,
    monthlyCashFlow: netOperatingIncome / 12
  };
};

export const calculateAffordability = (data: AffordabilityData) => {
  // Conservative estimate: 28% of gross income for mortgage
  const monthlyIncome = data.annualIncome / 12;
  const availableForMortgage = (monthlyIncome * 0.28) - data.monthlyDebts;
  
  const monthlyRate = data.interestRate / 100 / 12;
  const totalMonths = 30 * 12; // Standard 30 year term

  const maxLoan = availableForMortgage / 
    ((monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
    (Math.pow(1 + monthlyRate, totalMonths) - 1));

  return {
    maxHomePrice: maxLoan + data.downPayment,
    maxMonthlyPayment: availableForMortgage
  };
};
