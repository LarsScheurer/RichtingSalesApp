// In functions/src/index.ts

import {onCall, HttpsError} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {setGlobalOptions} from "firebase-functions/v2";
import {GoogleGenerativeAI} from "@google/generative-ai";

setGlobalOptions({region: "europe-west4"});

export const runBrancheAnalysis = onCall({secrets: ["GEMINI_API_KEY"]}, async (request) => {
  logger.info("Starting FINAL branche analysis with Gemini 1.5 PRO!");

  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) {
    logger.error("GEMINI_API_KEY secret not found.");
    throw new HttpsError("internal", "API key for Gemini is not configured.");
  }
  const genAI = new GoogleGenerativeAI(geminiApiKey);

  const websiteUrl = request.data.websiteUrl;
  if (!websiteUrl || typeof websiteUrl !== "string") {
    logger.error("No websiteUrl provided.");
    throw new HttpsError("invalid-argument", "Please provide a websiteUrl.");
  }

  logger.info(`Generating analysis for: ${websiteUrl}`);

  try {
    const model = genAI.getGenerativeModel({model: "gemini-1.5-pro-latest"});

    const prompt = `
      Voer een diepgaande brancheanalyse uit voor de organisatie
      die te identificeren is via hun website: ${websiteUrl}.

      Hanteer de instructies uit het '20250623 Handboek Branche-analyse Richting'
      als een strikt kader. Genereer een volledig rapport met alle 10 hoofdstukken
      zoals daarin beschreven, inclusief de vereiste tabellen en matrices.

      Schrijf het rapport vanuit de rol en het perspectief van
      'een externe strategisch adviseur voor de Arbo Risico Databank'.
      Richt het advies als een persoonlijk schrijven aan 'de directie'
      van de te analyseren organisatie.

      Baseer de schrijfstijl op een professionele, deskundige en adviserende toon.
      Zorg ervoor dat alle matrices en tabellen met beoordelingen
      gebruikmaken van visuele symbolen (zoals '●' en '○') in plaats van
      tekstuele omschrijvingen ('hoog'/'laag').
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysisText = response.text();

    logger.info("Successfully generated analysis from Gemini.");

    return {
      status: "success",
      message: "Analysis complete.",
      analysis: analysisText,
    };
  } catch (error) {
    logger.error("Error calling Gemini API:", error);
    throw new HttpsError("internal", "Failed to generate analysis from Gemini.");
  }
});
