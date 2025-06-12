
import { useState } from "react";
import { AlertTriangle, CheckCircle, Search } from "lucide-react";
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
      <div className="text-center py-6 text-gray-500">
        <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
        <p>Add at least 2 medicines to check for interactions</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Button
        onClick={checkInteractions}
        disabled={isChecking}
        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
      >
        {isChecking ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Checking Interactions...
          </>
        ) : (
          <>
            <Search className="w-4 h-4 mr-2" />
            Check Interactions
          </>
        )}
      </Button>

      {hasChecked && (
        <div className="mt-4">
          {interactions.length > 0 ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h3 className="font-semibold text-red-800">⚠️ Potential Interactions Found</h3>
              </div>
              <ul className="space-y-2">
                {interactions.map((interaction, index) => (
                  <li key={index} className="text-red-700 bg-red-100 p-2 rounded-lg">
                    {interaction}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-red-600 mt-3">
                Please consult your healthcare provider about these potential interactions.
              </p>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-green-800">✅ No Known Interactions</h3>
              </div>
              <p className="text-green-700 mt-2">
                No known interactions found between your current medicines.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InteractionChecker;
