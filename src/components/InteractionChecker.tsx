import { useState } from "react";
import { AlertTriangle, CheckCircle, Search, Shield, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface InteractionCheckerProps {
  medicines: string[];
}

interface DrugInteraction {
  drug1: string;
  drug2: string;
  description: string;
  severity: string;
}

interface InteractionResponse {
  interactions: DrugInteraction[];
  errors?: string[];
}

const InteractionChecker = ({ medicines }: InteractionCheckerProps) => {
  const [isChecking, setIsChecking] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);
  const [interactions, setInteractions] = useState<DrugInteraction[]>([]);
  const [apiErrors, setApiErrors] = useState<string[]>([]);
  const { toast } = useToast();

  const checkInteractions = async () => {
    setIsChecking(true);
    setHasChecked(false);
    setInteractions([]);
    setApiErrors([]);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('check-drug-interactions', {
        body: { medicines }
      });

      if (functionError) {
        console.error('Error invoking edge function:', functionError);
        toast({
          title: "Function Error",
          description: "Failed to call the interaction checker function. Please try again.",
          variant: "destructive",
        });
        setApiErrors(["Failed to call the interaction checker function."]);
        setIsChecking(false);
        setHasChecked(true); // Show that a check attempt was made, even if it failed
        return;
      }
      const responseData = data as InteractionResponse;
      
      setInteractions(responseData.interactions || []);
      setApiErrors(responseData.errors || []);
      setHasChecked(true);

      // Show important interaction or error directly
      if (responseData.interactions && responseData.interactions.length > 0) {
        toast({
          title: "Warning: Dangerous Interaction Detected!",
          description: responseData.interactions
            .map(item => `${item.drug1} + ${item.drug2}: ${item.description}`)
            .join(" "),
          variant: "destructive",
        });
      } else if (responseData.errors && responseData.errors.length > 0) {
        toast({
          title: "Notice",
          description: responseData.errors.join(" "),
          variant: "default",
        });
      } else {
        toast({
          title: "No Known Dangerous Interactions",
          description: "No dangerous interactions were found for the medicines you entered.",
        });
      }

    } catch (error) {
      console.error('Error in checkInteractions component logic:', error);
      toast({
        title: "Client Error",
        description: "An unexpected error occurred on the client side. Please try again.",
        variant: "destructive",
      });
       setApiErrors(["An unexpected error occurred."]);
       setHasChecked(true);
    } finally {
      setIsChecking(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    const severityLower = severity.toLowerCase();
    if (severityLower.includes('high') || severityLower.includes('major')) return "from-red-400 to-red-600";
    if (severityLower.includes('moderate')) return "from-orange-400 to-orange-600";
    return "from-yellow-400 to-yellow-600";
  };

  const getSeverityBgColor = (severity: string) => {
    const severityLower = severity.toLowerCase();
    if (severityLower.includes('high') || severityLower.includes('major')) return "from-red-50 to-red-100";
    if (severityLower.includes('moderate')) return "from-orange-50 to-orange-100";
    return "from-yellow-50 to-yellow-100";
  };

  const getSeverityBorderColor = (severity: string) => {
    const severityLower = severity.toLowerCase();
    if (severityLower.includes('high') || severityLower.includes('major')) return "border-red-200";
    if (severityLower.includes('moderate')) return "border-orange-200";
    return "border-yellow-200";
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
            Check Drug Interactions (Live API)
          </>
        )}
      </Button>
      {hasChecked && (
        <div className="mt-6 animate-fade-in">
          {/* 1. Show interaction warning card if found */}
          {interactions.length > 0 && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200/60 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gradient-to-br from-red-400 to-pink-500 p-2 rounded-xl">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-red-800 text-xl">⚠️ Dangerous Interactions Found</h3>
                </div>
                <div className="space-y-4">
                  {interactions.map((interaction, index) => (
                    <div key={index} className={`bg-gradient-to-r ${getSeverityBgColor(interaction.severity)} p-4 rounded-xl border-2 ${getSeverityBorderColor(interaction.severity)} shadow-sm`}>
                      <div className="flex items-start gap-3">
                        <div className={`bg-gradient-to-br ${getSeverityColor(interaction.severity)} p-2 rounded-lg flex-shrink-0`}>
                          <AlertTriangle className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-bold text-gray-800">
                              {interaction.drug1} + {interaction.drug2}
                            </h4>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium text-white bg-gradient-to-r ${getSeverityColor(interaction.severity)}`}>
                              {interaction.severity.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {interaction.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-red-600 mt-4 p-3 bg-red-100/50 rounded-xl border border-red-200">
                  <strong>Important:</strong> Please consult your healthcare provider about these potential interactions.
                </p>
              </div>
            </div>
          )}

          {/* 2. Show notices or API errors */}
          {apiErrors.length > 0 && (
            <div className="mb-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200/60 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-2 rounded-xl">
                  <Info className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-yellow-800 text-xl">Notices & Results</h3>
              </div>
              <ul className="list-disc list-inside text-yellow-700 space-y-1">
                {apiErrors.map((err, index) => (
                  <li key={index}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* 3. If neither interactions nor errors: show green card */}
          {interactions.length === 0 && apiErrors.length === 0 && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200/60 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-2 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-green-800 text-xl">✅ No Known Dangerous Interactions</h3>
              </div>
              <p className="text-green-700 font-medium">
                Great news! No dangerous interactions found between the recognized medicines.
              </p>
              <p className="text-sm text-green-600 mt-2">
                Note: Always consult your healthcare provider for comprehensive medical advice.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default InteractionChecker;
