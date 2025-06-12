
import { useState } from "react";
import { AlertTriangle, CheckCircle, Search, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InteractionCheckerProps {
  medicines: string[];
}

const InteractionChecker = ({ medicines }: InteractionCheckerProps) => {
  const [isChecking, setIsChecking] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);
  const [interactions, setInteractions] = useState<string[]>([]);

  // Simulated drug interactions database
  const drugInteractions: { [key: string]: string[] } = {
    "aspirin": ["warfarin", "ibuprofen", "alcohol"],
    "warfarin": ["aspirin", "ibuprofen", "vitamin k"],
    "ibuprofen": ["aspirin", "warfarin", "lisinopril"],
    "lisinopril": ["ibuprofen", "potassium"],
    "metformin": ["alcohol", "contrast dye"],
    "simvastatin": ["grapefruit", "gemfibrozil"],
  };

  const checkInteractions = () => {
    setIsChecking(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const foundInteractions: string[] = [];
      
      for (let i = 0; i < medicines.length; i++) {
        for (let j = i + 1; j < medicines.length; j++) {
          const med1 = medicines[i].toLowerCase();
          const med2 = medicines[j].toLowerCase();
          
          if (drugInteractions[med1]?.includes(med2) || drugInteractions[med2]?.includes(med1)) {
            foundInteractions.push(`${medicines[i]} and ${medicines[j]} may interact`);
          }
        }
      }
      
      setInteractions(foundInteractions);
      setHasChecked(true);
      setIsChecking(false);
    }, 1500);
  };

  if (medicines.length < 2) {
    return (
      <div className="text-center py-12 text-gray-500">
        <div className="relative inline-block">
          <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <Shield className="w-6 h-6 absolute -top-2 -right-2 text-orange-300 animate-pulse" />
        </div>
        <p className="text-lg font-medium mb-2">Add at least 2 medicines</p>
        <p className="text-sm text-gray-400">We'll check for potential interactions between them</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button
        onClick={checkInteractions}
        disabled={isChecking}
        className="w-full h-14 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold text-lg"
      >
        {isChecking ? (
          <>
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3"></div>
            Analyzing Interactions...
          </>
        ) : (
          <>
            <Search className="w-6 h-6 mr-3" />
            Check Drug Interactions
          </>
        )}
      </Button>

      {hasChecked && (
        <div className="mt-6 animate-fade-in">
          {interactions.length > 0 ? (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200/60 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-br from-red-400 to-pink-500 p-2 rounded-xl">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-red-800 text-xl">⚠️ Potential Interactions Found</h3>
              </div>
              <ul className="space-y-3">
                {interactions.map((interaction, index) => (
                  <li key={index} className="text-red-700 bg-red-100/80 p-4 rounded-xl border border-red-200 font-medium">
                    {interaction}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-red-600 mt-4 p-3 bg-red-100/50 rounded-xl border border-red-200">
                <strong>Important:</strong> Please consult your healthcare provider about these potential interactions.
              </p>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200/60 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-2 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-green-800 text-xl">✅ No Known Interactions</h3>
              </div>
              <p className="text-green-700 font-medium">
                Great news! No known interactions found between your current medicines.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InteractionChecker;
