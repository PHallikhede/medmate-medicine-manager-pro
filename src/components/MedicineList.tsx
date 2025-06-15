
import { useEffect, useState } from "react";
import { X, Pill, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface MedicineInfo {
  uses: string;
  sideEffects: string;
  fetched: boolean;
  error?: string;
}

interface MedicineListProps {
  medicines: string[];
  onRemoveMedicine: (index: number) => void;
}

const fetchMedicineInfo = async (name: string): Promise<MedicineInfo> => {
  try {
    const resp = await fetch(
      `https://api.fda.gov/drug/label.json?search=openfda.generic_name:"${encodeURIComponent(name)}"&limit=1`
    );
    if (!resp.ok) {
      return {
        uses: "Not available.",
        sideEffects: "Not available.",
        fetched: true,
        error: "No info found"
      };
    }
    const data = await resp.json();
    const info = data.results?.[0];
    return {
      uses: info?.indications_and_usage?.[0] || "Not available.",
      sideEffects: info?.adverse_reactions?.[0] || "Not available.",
      fetched: true,
    };
  } catch (e) {
    return {
      uses: "Not available.",
      sideEffects: "Not available.",
      fetched: true,
      error: "Error fetching info"
    };
  }
};

function getSimpleSentence(text: string) {
  if (!text || typeof text !== "string") return "Not available.";
  const first = text.split(/[\.\n]/).find(t => t.trim().split(" ").length > 3);
  if (!first) return "Not available.";
  return first
    .replace(/(contraindicated|intravenously|therapeutic|hypersensitivity|monitoring|dosage)/gi, "")
    .replace(/\s+/g, " ")
    .trim() + ".";
}

const MedicineList = ({ medicines, onRemoveMedicine }: MedicineListProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [medicineList, setMedicineList] = useState<string[]>([]);
  const [medicineInfo, setMedicineInfo] = useState<Record<string, MedicineInfo>>({});

  useEffect(() => {
    async function fetchMedicines() {
      if (!user) return;
      setLoading(true);
      const { data, error } = await supabase
        .from("medicines")
        .select("name")
        .eq("user_id", user.id);
      if (data) {
        const names = data.map((m) => m.name);
        setMedicineList(names);
      }
      setLoading(false);
    }
    fetchMedicines();
  }, [user]);

  useEffect(() => {
    if (!medicines || medicines.length === 0) return;
    setMedicineList(medicines);
  }, [medicines]);

  useEffect(() => {
    medicineList.forEach((name) => {
      if (!medicineInfo[name] || !medicineInfo[name].fetched) {
        fetchMedicineInfo(name).then((info) => {
          setMedicineInfo((prev) => ({
            ...prev,
            [name]: info
          }));
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [medicineList]);

  const handleRemove = async (index: number) => {
    if (!user) return;
    const name = medicineList[index];
    await supabase.from("medicines")
      .delete()
      .eq("user_id", user.id)
      .eq("name", name);
    setMedicineList((prev) => prev.filter((_, i) => i !== index));
    onRemoveMedicine(index);
    setMedicineInfo((prev) => {
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });
  };

  if (loading) {
    return <div className="text-center py-8 sm:py-12 text-slate-600 font-medium">Loading...</div>;
  }
  
  if (medicineList.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 text-slate-600">
        <div className="relative inline-block">
          <Pill className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-slate-300" />
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 absolute -top-2 -right-2 text-blue-300 animate-pulse" />
        </div>
        <p className="text-base sm:text-lg font-medium mb-2 text-slate-700">No medicines added yet</p>
        <p className="text-sm text-slate-600">Add your first medicine above to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {medicineList.map((medicine, index) => (
        <div
          key={medicine}
          className="group flex flex-col lg:flex-row items-start lg:items-center justify-between p-3 sm:p-4 lg:p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl sm:rounded-2xl border-2 border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="flex flex-1 items-start gap-3 sm:gap-4 w-full">
            <div className="bg-gradient-to-br from-blue-400 to-green-500 p-2 sm:p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-200 mt-1">
              <Pill className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="font-semibold text-slate-800 text-sm sm:text-base lg:text-lg break-words">{medicine}</span>
              <div className="mt-2">
                {medicineInfo[medicine] && medicineInfo[medicine].fetched ? (
                  <div className="bg-white/80 rounded-lg sm:rounded-xl p-2 sm:p-3 border border-slate-100">
                    <p className="text-xs sm:text-sm text-slate-700 font-medium">
                      <span className="font-semibold text-slate-800">Uses: </span>
                      {getSimpleSentence(medicineInfo[medicine].uses)}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-700 mt-1 mb-1 font-medium">
                      <span className="font-semibold text-slate-800">Side Effects: </span>
                      {getSimpleSentence(medicineInfo[medicine].sideEffects)}
                    </p>
                    {medicineInfo[medicine].error && (
                      <p className="text-xs text-red-600 font-medium">API Error: {medicineInfo[medicine].error}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic mt-2 font-medium">Looking up drug info…</p>
                )}
              </div>
            </div>
          </div>
          <div className="mt-2 lg:mt-0 self-end lg:self-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemove(index)}
              className="text-red-400 hover:text-red-600 hover:bg-red-100/80 rounded-xl p-2 sm:p-3 transition-all duration-200 hover:scale-110"
              aria-label={`Remove ${medicine}`}
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MedicineList;
