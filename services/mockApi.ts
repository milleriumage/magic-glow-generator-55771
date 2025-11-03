
interface PurchaseConfirmation {
  unlocked: boolean;
  message: string;
}

interface RewardConfirmation {
    success: boolean;
    credits_added: number;
    new_balance: number;
    message: string;
}

export const confirmPurchase = async (
  itemId: string,
  price: number,
  currentBalance: number,
  deductCredits: (amount: number, description: string) => boolean
): Promise<PurchaseConfirmation> => {
  console.log(`API: Attempting to purchase item ${itemId} for ${price} credits.`);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (currentBalance >= price) {
        const success = deductCredits(price, `Purchase of item ${itemId}`);
        if (success) {
            console.log(`API: Purchase successful for item ${itemId}.`);
            resolve({ unlocked: true, message: "Purchase confirmed!" });
        } else {
             console.error(`API: Purchase failed for item ${itemId} due to deduction error.`);
            reject({ unlocked: false, message: "Failed to deduct credits." });
        }
      } else {
        console.error(`API: Purchase failed for item ${itemId}. Insufficient funds.`);
        reject({ unlocked: false, message: "Insufficient credits." });
      }
    }, 1000); // Simulate network latency
  });
};


export const rewardCredit = async (
    rewardAmount: number,
    currentBalance: number,
    addReward: () => void
): Promise<RewardConfirmation> => {
    console.log("API: Validating ad watch and rewarding credits.");
    return new Promise((resolve) => {
        setTimeout(() => {
            addReward();
            const newBalance = currentBalance + rewardAmount;
            console.log(`API: Reward successful. Added ${rewardAmount} credits. New balance: ${newBalance}`);
            resolve({
                success: true,
                credits_added: rewardAmount,
                new_balance: newBalance,
                message: `+${rewardAmount} credits received!`,
            });
        }, 1500); // Simulate validation and database update
    });
};

export const createStripeSession = async (packageId: string): Promise<{ success: boolean; sessionId: string }> => {
    console.log(`API: Creating Stripe session for package ${packageId}`);
    return new Promise(resolve => {
        setTimeout(() => {
            const sessionId = `sess_${Date.now()}`;
            console.log(`API: Stripe session created: ${sessionId}`);
            resolve({ success: true, sessionId });
        }, 1000);
    });
}
