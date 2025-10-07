// Ensure this import path is correct
import { UserData } from "@/frontend/features/loan-journey/types";

// A dummy function to generate a CIBIL score for the POC
const getDummyCibilScore = (salary: number): number => {
  if (salary > 75000) return 780;
  if (salary > 40000) return 720;
  return 680;
};

// --- THIS IS THE FIX ---
// Ensure the function is exported using `export const`.
export const calculateLoanOffer = (userData: UserData) => {
  const monthlySalary = Number(userData.monthlySalary) || 0;
  const cibilScore = getDummyCibilScore(monthlySalary);

  if (monthlySalary < 25000 || cibilScore < 680) {
    return {
      isApproved: false,
      message: "Sorry, based on the provided details, we are unable to offer a loan at this time.",
    };
  }

  // Determine loan amount multiplier based on CIBIL
  let multiplier = 10;
  if (cibilScore > 750) {
    multiplier = 20;
  } else if (cibilScore > 700) {
    multiplier = 15;
  }

  const maxLoanAmount = Math.min(monthlySalary * multiplier, 1000000); // Capped at 10 Lakhs

  // Determine interest rate
  const interestRate = cibilScore > 750 ? 12.5 : 15.0;

  // Generate some EMI plans
  const emiPlans = [12, 24, 36].map(tenure => {
    const monthlyRate = interestRate / 100 / 12;
    const emi = (maxLoanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / (Math.pow(1 + monthlyRate, tenure) - 1);
    return {
      tenure, // months
      emi: Math.round(emi),
    };
  });

  return {
    isApproved: true,
    maxLoanAmount: Math.round(maxLoanAmount / 1000) * 1000, // Round to nearest thousand
    interestRate,
    emiPlans,
  };
};