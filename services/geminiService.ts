import { GoogleGenAI, Type } from "@google/genai";
import { AppAction } from "../types";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates marketing content using Gemini 3 Pro with Thinking Mode.
 * High thinking budget for complex strategy and creative writing.
 */
export const generateMarketingStrategy = async (
  businessName: string,
  industry: string,
  offers: string
): Promise<string> => {
  try {
    const prompt = `
      Agis en tant que gestionnaire de réseaux sociaux senior. Crée un calendrier de contenu pour un profil Google Business Profile.
      Nom de l'entreprise: ${businessName}
      Industrie: ${industry}
      Offres Clés/Focus: ${offers}

      Veuillez générer en FRANÇAIS :
      1. Une description d'entreprise GMB (optimisée pour le SEO).
      2. 8 Google Business Posts (mélange de Mises à jour, Offres et Éducatif).
      
      Formate la sortie comme un objet JSON avec les clés : "description" (string) et "posts" (tableau d'objets avec title, content, type).
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
            posts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  content: { type: Type.STRING },
                  type: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    return response.text || "{}";
  } catch (error) {
    console.error("Error generating strategy:", error);
    throw error;
  }
};

/**
 * Edits an existing image based on a text prompt using Gemini 2.5 Flash Image.
 * Maps to the "Nano Banana" functionality request.
 */
export const editImageWithGemini = async (
  base64Image: string,
  mimeType: string,
  prompt: string
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    // Extract the image from the response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image generated in response");
  } catch (error) {
    console.error("Error editing image:", error);
    throw error;
  }
};

/**
 * Generates a new image from scratch using a text prompt.
 * Uses Gemini 2.5 Flash Image.
 */
export const generateImageFromPrompt = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: {
          imageConfig: {
              aspectRatio: "1:1"
          }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image generated");
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};

/**
 * Sends a message to the Chat Agent using Gemini 3 Pro with Google Search.
 * Now supports identifying App Actions.
 */
export const sendMessageToAgent = async (
  message: string,
  history: Array<{ role: 'user' | 'model', text: string }>
): Promise<{ text: string, sources?: Array<{ uri: string, title: string }>, action?: AppAction }> => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: `Vous êtes un agent expert en Google Business Profile (GMB) et en SEO local & organique.
        Votre mission est d'aider l'utilisateur à optimiser sa présence en ligne.
        
        Règles:
        - Répondez toujours en Français.
        - Soyez concis, professionnel et proactif.
        - Utilisez les données de recherche Google pour fournir des informations à jour.
        
        INTÉGRATION DE L'APPLICATION:
        Vous avez la capacité de diriger l'utilisateur vers différentes sections de l'application.
        Si la demande de l'utilisateur implique une action disponible dans l'application, vous DEVEZ ajouter un bloc JSON à la toute fin de votre réponse.
        
        Chemins disponibles :
        - /dashboard : Vue d'ensemble, statistiques rapides.
        - /profile : Modifier le nom, la description, les horaires, les services.
        - /content : Générer des posts, créer une stratégie de contenu.
        - /images : Créer ou éditer des images (Studio Nano Banana).
        - /metrics : Voir les graphiques détaillés et ajouter des données.
        - /reputation : Gérer les avis et la satisfaction client.
        - /competitors : Analyser la concurrence.
        - /checklist : Voir les tâches à faire (Audit).

        Format du bloc JSON d'action (à mettre À LA FIN de la réponse uniquement) :
        |||JSON_ACTION_START|||
        {
          "type": "NAVIGATE",
          "path": "/chemin_correspondant",
          "label": "Texte court du bouton"
        }
        |||JSON_ACTION_END|||

        Exemple : Si l'utilisateur dit "Je veux changer mes horaires", répondez en texte puis ajoutez le bloc JSON pour aller vers /profile.
        Exemple : Si l'utilisateur dit "Analyse mes stats", dirigez vers /metrics.
        Exemple : Si l'utilisateur dit "Aide-moi à écrire un post", dirigez vers /content.
        `,
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const response = await chat.sendMessage({ message });
    
    let fullText = response.text || "Je n'ai pas pu générer de réponse.";
    let action: AppAction | undefined;

    // Parse for Action JSON
    const actionRegex = /\|\|\|JSON_ACTION_START\|\|\|([\s\S]*?)\|\|\|JSON_ACTION_END\|\|\|/;
    const match = fullText.match(actionRegex);

    if (match && match[1]) {
        try {
            action = JSON.parse(match[1].trim());
            // Remove the JSON block from the display text
            fullText = fullText.replace(actionRegex, '').trim();
        } catch (e) {
            console.error("Failed to parse action JSON", e);
        }
    }

    // Extract sources from grounding metadata if available
    const sources: Array<{ uri: string, title: string }> = [];
    if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
      response.candidates[0].groundingMetadata.groundingChunks.forEach((chunk: any) => {
        if (chunk.web?.uri && chunk.web?.title) {
          sources.push({ uri: chunk.web.uri, title: chunk.web.title });
        }
      });
    }

    return {
      text: fullText,
      sources: sources.length > 0 ? sources : undefined,
      action
    };

  } catch (error) {
    console.error("Error in chat agent:", error);
    throw error;
  }
};

/**
 * Analyzes a review and generates a response.
 */
export const generateReviewResponse = async (
    reviewText: string,
    rating: number,
    authorName: string,
    businessName: string
): Promise<{ response: string, sentiment: 'positive' | 'neutral' | 'negative' }> => {
    try {
        const prompt = `
            Analyse l'avis client suivant pour l'entreprise "${businessName}".
            Auteur: ${authorName}
            Note: ${rating}/5
            Texte: "${reviewText}"

            Tâche 1: Détermine le sentiment (positive, neutral, negative).
            Tâche 2: Rédige une réponse professionnelle, empathique et optimisée pour le SEO (incluant des mots-clés subtils liés à l'activité).

            Réponds UNIQUEMENT avec ce JSON :
            {
                "sentiment": "positive" | "neutral" | "negative",
                "response": "Le texte de la réponse ici"
            }
        `;

        const result = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json'
            }
        });

        return JSON.parse(result.text || '{"sentiment": "neutral", "response": "Merci pour votre avis."}');
    } catch (error) {
        console.error("Error generating review response:", error);
        throw error;
    }
};

/**
 * Competitor Analysis using Thinking Mode for deeper strategic insight.
 */
export const analyzeCompetitors = async (
    myBusiness: string,
    competitors: string[]
): Promise<any[]> => {
    try {
        const prompt = `
            Effectue une analyse concurrentielle pour l'entreprise "${myBusiness}" face à ces concurrents : ${competitors.join(', ')}.
            
            Pour chaque concurrent, identifie (en te basant sur des connaissances générales de leur présence en ligne ou en simulant des archétypes de concurrents si inconnus) :
            1. 3 Points Forts probables (Strengths)
            2. 3 Points Faibles probables (Weaknesses)
            3. 3 Mots-clés sur lesquels ils se positionnent probablement.

            Retourne un tableau JSON.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                thinkingConfig: { thinkingBudget: 16384 },
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                            keywords: { type: Type.ARRAY, items: { type: Type.STRING } }
                        }
                    }
                }
            }
        });

        return JSON.parse(response.text || '[]');
    } catch (error) {
        console.error("Error analyzing competitors:", error);
        throw error;
    }
};