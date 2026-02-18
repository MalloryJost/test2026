
export interface MortgageData {
  homePrice: number;
  downPayment: number;
  loanTerm: number;
  interestRate: number;
  propertyTax: number;
  insurance: number;
}

export interface InvestmentData {
  purchasePrice: number;
  monthlyRent: number;
  otherIncome: number;
  managementFee: number;
  maintenance: number;
  vacancyRate: number;
  downPayment: number;
  interestRate: number;
}

export interface AffordabilityData {
  annualIncome: number;
  monthlyDebts: number;
  downPayment: number;
  interestRate: number;
}

export interface CalculationResults {
  monthlyPayment: number;
  totalInterest: number;
  totalCost: number;
  amortization: AmortizationPoint[];
}

export interface AmortizationPoint {
  month: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

export enum CalculatorTab {
  MORTGAGE = 'MORTGAGE',
  INVESTMENT = 'INVESTMENT',
  AFFORDABILITY = 'AFFORDABILITY'
}
