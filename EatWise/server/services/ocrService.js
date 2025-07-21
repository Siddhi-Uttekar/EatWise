import { createWorker } from "tesseract.js";

export async function extractText(imageBuffer) {
    const worker = await createWorker("eng");

    try{
        const{
            data:{text},
        } = await worker.recognize(imageBuffer);

        if (!text.trim()) {
      throw new Error("No text found in image")
    }

    return text
    }
    finally{
        await worker.terminate();
    }
}