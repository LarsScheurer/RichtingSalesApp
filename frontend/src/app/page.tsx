// In frontend/src/app/page.tsx

"use client";

import { useState } from "react";
import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "../firebase/config"; // We moeten dit configuratiebestand zo aanmaken

export default function Home() {
  const [analysis, setAnalysis] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalysis = async () => {
    setIsLoading(true);
    setError("");
    setAnalysis("");

    try {
      const functions = getFunctions(app);
      const runBrancheAnalysis = httpsCallable(functions, 'runBrancheAnalysis');
      const result: any = await runBrancheAnalysis({ websiteUrl: 'www.heijmans.nl' });
      
      if (result.data.status === "success") {
        setAnalysis(result.data.analysis);
      } else {
        setError(result.data.message || "An unknown error occurred.");
      }
    } catch (err: any) {
      console.error("Error calling function:", err);
      setError(err.message || "Failed to generate analysis from Gemini.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-gray-50">
      <div className="w-full max-w-4xl text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Richting Sales Analyse Tool
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Klik op de knop om een testanalyse te starten voor Heijmans.nl.
        </p>
        <button
          onClick={handleAnalysis}
          disabled={isLoading}
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          {isLoading ? "Analyse wordt uitgevoerd..." : "Start Echte Analyse"}
        </button>

        <div className="mt-12 text-left p-6 bg-white rounded-lg shadow-inner border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Gegenereerd Rapport:
          </h2>
          {isLoading && <p className="text-gray-500">Moment geduld, de analyse wordt voorbereid...</p>}
          {error && <p className="text-red-600 font-semibold">Er is een fout opgetreden: {error}</p>}
          {analysis && <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: analysis.replace(/\n/g, '<br />') }} />}
          {!isLoading && !error && !analysis && <p className="text-gray-400">Het rapport zal hier verschijnen.</p>}
        </div>
      </div>
    </main>
  );
}
