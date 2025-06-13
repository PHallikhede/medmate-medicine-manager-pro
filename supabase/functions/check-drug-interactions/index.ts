
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DrugInteractionRequest {
  medicines: string[];
}

interface DrugInteraction {
  drug1: string;
  drug2: string;
  description: string;
  severity: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { medicines }: DrugInteractionRequest = await req.json();
    console.log('Checking interactions for medicines:', medicines);

    const interactions: DrugInteraction[] = [];

    // Check interactions between each pair of medicines
    for (let i = 0; i < medicines.length; i++) {
      for (let j = i + 1; j < medicines.length; j++) {
        const drug1 = medicines[i].toLowerCase().trim();
        const drug2 = medicines[j].toLowerCase().trim();

        try {
          // First, get RxCUI for each drug
          const rxcui1 = await getRxCUI(drug1);
          const rxcui2 = await getRxCUI(drug2);

          if (rxcui1 && rxcui2) {
            // Check for interactions between the two drugs
            const interactionData = await checkInteraction(rxcui1, rxcui2);
            
            if (interactionData && interactionData.length > 0) {
              interactions.push({
                drug1: medicines[i],
                drug2: medicines[j],
                description: interactionData[0].description || 'Potential drug interaction detected. Consult your healthcare provider.',
                severity: interactionData[0].severity || 'moderate'
              });
            }
          }
        } catch (error) {
          console.error(`Error checking interaction between ${drug1} and ${drug2}:`, error);
        }
      }
    }

    return new Response(
      JSON.stringify({ interactions }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error('Error in check-drug-interactions function:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to check drug interactions' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

async function getRxCUI(drugName: string): Promise<string | null> {
  try {
    const response = await fetch(
      `https://rxnav.nlm.nih.gov/REST/rxcui.json?name=${encodeURIComponent(drugName)}&search=2`
    );
    const data = await response.json();
    
    if (data.idGroup && data.idGroup.rxnormId && data.idGroup.rxnormId.length > 0) {
      return data.idGroup.rxnormId[0];
    }
    return null;
  } catch (error) {
    console.error('Error getting RxCUI:', error);
    return null;
  }
}

async function checkInteraction(rxcui1: string, rxcui2: string): Promise<any[]> {
  try {
    const response = await fetch(
      `https://rxnav.nlm.nih.gov/REST/interaction/interaction.json?rxcui=${rxcui1}&rxcui=${rxcui2}`
    );
    const data = await response.json();
    
    if (data.interactionTypeGroup && data.interactionTypeGroup.length > 0) {
      const interactions = [];
      for (const group of data.interactionTypeGroup) {
        if (group.interactionType && group.interactionType.length > 0) {
          for (const interaction of group.interactionType) {
            if (interaction.interactionPair && interaction.interactionPair.length > 0) {
              interactions.push({
                description: interaction.interactionPair[0].description,
                severity: interaction.interactionPair[0].severity || 'moderate'
              });
            }
          }
        }
      }
      return interactions;
    }
    return [];
  } catch (error) {
    console.error('Error checking interaction:', error);
    return [];
  }
}

serve(handler);
