
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
  // OpenFDA API docs: https://open.fda.gov/apis/drug/drugsfda/
  // We'll use the label endpoint for medicine uses and side effects
  // fallback text if not found
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
    // Parse uses & side effects if available (may be arrays)
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

const MedicineList = ({ medicines, onRemoveMedicine }: MedicineListProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [medicineList, setMedicineList] = useState<string[]>([]);
  const [medicineInfo, setMedicineInfo] = useState<Record<string, MedicineInfo>>({});

  // Fetch medicines from backend when user is ready
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

  // Sync prop (app-level) medicines (for instant update)
  useEffect(() => {
    if (!medicines || medicines.length === 0) return;
    setMedicineList(medicines);
  }, [medicines]);

  // Fetch API info for each medicine (if not fetched before)
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
    return <div className="text-center py-12 text-muted-foreground">Loading...</div>;
  }
  if (medicineList.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <div className="relative inline-block">
          <Pill className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <Sparkles className="w-6 h-6 absolute -top-2 -right-2 text-blue-300 animate-pulse" />
        </div>
        <p className="text-lg font-medium mb-2">No medicines added yet</p>
        <p className="text-sm text-muted-foreground">Add your first medicine above to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {medicineList.map((medicine, index) => (
        <div
          key={medicine}
          className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl border-2 border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="flex flex-1 items-start gap-4 w-full">
            <div className="bg-gradient-to-br from-blue-400 to-green-500 p-2 sm:p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-200 mt-1">
              <Pill className="w-5 h-5 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="font-semibold text-foreground text-base sm:text-lg break-all">{medicine}</span>
              <div className="mt-2">
                {/* Medicine API info block */}
                {medicineInfo[medicine] && medicineInfo[medicine].fetched ? (
                  <div className="bg-white/70 rounded-xl p-2 border border-slate-100">
                    <p className="text-[13px] text-slate-700">
                      <span className="font-semibold">Uses: </span>
                      {medicineInfo[medicine].uses || "Not available."}
                    </p>
                    <p className="text-[13px] text-slate-700 mt-1 mb-1">
                      <span className="font-semibold">Side Effects: </span>
                      {medicineInfo[medicine].sideEffects || "Not available."}
                    </p>
                    {medicineInfo[medicine].error && (
                      <p className="text-xs text-red-500">API Error: {medicineInfo[medicine].error}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic mt-2">Looking up drug info…</p>
                )}
              </div>
            </div>
          </div>
          <div className="mt-2 sm:mt-0 self-end sm:self-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemove(index)}
              className="text-red-400 hover:text-red-600 hover:bg-red-100/80 rounded-xl p-3 transition-all duration-200 hover:scale-110"
              aria-label={`Remove ${medicine}`}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MedicineList;

