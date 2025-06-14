
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

interface FunctionResponse {
  interactions: DrugInteraction[];
  errors?: string[]; // To report issues like unrecognized drugs
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    const { medicines }: DrugInteractionRequest = await req.json();
    console.log('Checking interactions for medicines:', medicines);

    const responsePayload: FunctionResponse = {
      interactions: [],
      errors: [],
    };

    if (!medicines || medicines.length < 2) {
      responsePayload.errors?.push("Please provide at least two medicines to check for interactions.");
      return new Response(
        JSON.stringify(responsePayload),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const rxcuiCache = new Map<string, string | null>();

    // Pre-fetch all RxCUIs, collect drug names with no RxCUI found in an error.
    for (const medicineName of medicines) {
      const trimmed = medicineName.toLowerCase().trim();
      if (!rxcuiCache.has(trimmed)) {
        const rxcui = await getRxCUI(trimmed);
        rxcuiCache.set(trimmed, rxcui);
        if (!rxcui) {
          responsePayload.errors?.push(`Could not find RxCUI for medicine: ${medicineName}. It might be misspelled or not recognized.`);
          console.warn(`Could not find RxCUI for medicine: ${medicineName}`);
        }
      }
    }

    let hasAnyInteraction = false;

    for (let i = 0; i < medicines.length; i++) {
      for (let j = i + 1; j < medicines.length; j++) {
        const drug1Name = medicines[i];
        const drug2Name = medicines[j];
        const rxcui1 = rxcuiCache.get(drug1Name.toLowerCase().trim());
        const rxcui2 = rxcuiCache.get(drug2Name.toLowerCase().trim());

        if (rxcui1 && rxcui2) {
          try {
            const interactionData = await checkInteraction(rxcui1, rxcui2);
            if (interactionData && interactionData.length > 0) {
              hasAnyInteraction = true;
              interactionData.forEach(interaction => {
                responsePayload.interactions.push({
                  drug1: drug1Name,
                  drug2: drug2Name,
                  description: interaction.description || 'Potential drug interaction detected. Consult your healthcare provider.',
                  severity: interaction.severity || 'moderate'
                });
              });
            }
          } catch (error) {
            console.error(`Error checking interaction between ${drug1Name} (${rxcui1}) and ${drug2Name} (${rxcui2}):`, error?.message ?? error);
            responsePayload.errors?.push(`Failed to check interaction between ${drug1Name} and ${drug2Name}.`);
          }
        }
      }
    }

    // If no interactions and no errors, set a default message for clarity.
    if (!hasAnyInteraction && (!responsePayload.errors || responsePayload.errors.length === 0)) {
      responsePayload.errors?.push("No known dangerous interactions found between the medicines you entered.");
    }

    if (responsePayload.errors && responsePayload.errors.length === 0) {
      delete responsePayload.errors;
    }

    return new Response(
      JSON.stringify(responsePayload),
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
      JSON.stringify({ interactions: [], errors: ['Failed to process drug interaction check due to an internal error.'] }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

async function getRxCUI(drugName: string): Promise<string | null> {
  const url = `https://rxnav.nlm.nih.gov/REST/rxcui.json?name=${encodeURIComponent(drugName)}&search=2`;
  console.log(`Fetching RxCUI for ${drugName} from ${url}`);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`RxNav API error for ${drugName}: ${response.status} ${response.statusText}`);
      const errorBody = await response.text();
      console.error(`RxNav API error body for ${drugName}: ${errorBody}`);
      return null;
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const textResponse = await response.text();
      console.warn(`Received non-JSON response for ${drugName} from RxNav (getRxCUI): ${textResponse.substring(0,100)}`);
      // If it's a known "Not found" text, handle it. Otherwise, it's an unexpected non-JSON.
      if (textResponse.toLowerCase().includes("not found")) { 
        return null;
      }
      // For other non-JSON, we might still want to log it as an error or treat as not found.
      console.error(`Unexpected non-JSON response for ${drugName} from RxNav.`);
      return null;
    }
    
    const data = await response.json();
    if (data.idGroup && data.idGroup.rxnormId && data.idGroup.rxnormId.length > 0) {
      console.log(`Found RxCUI for ${drugName}: ${data.idGroup.rxnormId[0]}`);
      return data.idGroup.rxnormId[0];
    }
    console.log(`No RxCUI found for ${drugName} in RxNav response.`);
    return null;
  } catch (error) {
    // This catch is for network errors or if .json() fails on an already identified JSON content type
    console.error(`Error fetching or parsing RxCUI for ${drugName}:`, error.message);
    return null;
  }
}

async function checkInteraction(rxcui1: string, rxcui2: string): Promise<any[]> {
  const url = `https://rxnav.nlm.nih.gov/REST/interaction/interaction.json?rxcui=${rxcui1}&rxcui=${rxcui2}`;
  console.log(`Checking interaction between ${rxcui1} and ${rxcui2} from ${url}`);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`RxNav API error for interaction ${rxcui1}-${rxcui2}: ${response.status} ${response.statusText}`);
      const errorBody = await response.text();
      console.error(`RxNav API error body for interaction ${rxcui1}-${rxcui2}: ${errorBody}`);
      return [];
    }
    
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const textResponse = await response.text();
      console.warn(`Received non-JSON response for interaction ${rxcui1}-${rxcui2} from RxNav: ${textResponse.substring(0,100)}`);
       // If it's a known "Not found" text, handle it. Otherwise, it's an unexpected non-JSON.
      if (textResponse.toLowerCase().includes("no interaction found")) { 
        return []; // This is a valid scenario, no interactions.
      }
      console.error(`Unexpected non-JSON response for interaction ${rxcui1}-${rxcui2} from RxNav.`);
      return [];
    }

    const data = await response.json();
    if (data.interactionTypeGroup && data.interactionTypeGroup.length > 0) {
      const interactions = [];
      for (const group of data.interactionTypeGroup) {
        if (group.interactionType && group.interactionType.length > 0) {
          for (const interaction of group.interactionType) {
            if (interaction.interactionPair && interaction.interactionPair.length > 0) {
              interactions.push({
                description: interaction.interactionPair[0].description,
                severity: interaction.interactionPair[0].severity || 'moderate' // Default severity if not provided
              });
            }
          }
        }
      }
      console.log(`Found ${interactions.length} interactions between ${rxcui1} and ${rxcui2}`);
      return interactions;
    }
    console.log(`No interaction data structure found for ${rxcui1} and ${rxcui2}`);
    return [];
  } catch (error) {
    console.error(`Error fetching or parsing interaction data for ${rxcui1}-${rxcui2}:`, error.message);
    return []; // Return empty array on error to not break the whole check
  }
}

serve(handler);

