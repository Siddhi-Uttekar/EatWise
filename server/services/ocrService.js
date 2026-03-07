import { createWorker } from "tesseract.js";

const logger = (log) => {
  console.log(`[Tesseract]: ${log.status} (${(log.progress * 100).toFixed(2)}%)`);
};

export async function extractText(imageBuffer) {
    console.log("Starting OCR process...");
    const worker = await createWorker("eng", 1, { logger });

    try{
        const{
            data:{text},
        } = await worker.recognize(imageBuffer);
        console.log("OCR extracted text:", text);

        if (!text.trim()) {
      console.warn("No text found in image after OCR.");
      throw new Error("No text found in image")
    }

    return text
    }
    finally{
        console.log("Terminating Tesseract worker.");
        await worker.terminate();
    }
}
