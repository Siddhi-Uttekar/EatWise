import React, { useState, useEffect } from "react";
import { getAnalysisHistory } from "../modules/api";
import  ResultCard  from "./ResultCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getAnalysisHistory();
        setHistory(data);
      } catch (err) {
        setError("Failed to fetch history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return <div className="text-center p-8">Loading history...</div>;
  }

  if (error) {
    return (
      <div className="text-center p-8 text-destructive">{error}</div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-primary mb-8 text-center">
        Analysis History
      </h1>
      {history.length === 0 ? (
        <p className="text-center text-muted-foreground">No history found.</p>
      ) : (
        <Accordion type="single" collapsible className="w-full">
          {history.map((item) => (
            <AccordionItem value={`item-${item.id}`} key={item.id}>
              <AccordionTrigger>
                <div className="flex items-center space-x-4">
                  {item.image_path && (
                    <img
                      src={`http://localhost:5000${item.image_path}`}
                      alt="Analyzed food label"
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div>
                    <p className="font-semibold">
                      Analysis from{" "}
                      {new Date(item.created_at).toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Overall Rating: {item.report_data.overallRating}
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ResultCard analysis={item.report_data} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}
