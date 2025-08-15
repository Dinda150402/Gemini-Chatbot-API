import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

// ==== Tambahan setup __dirname untuk ESN ( import style ) ====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// memasukkan express ke variable app
const app = express();

//mengakses GoogleGenAI dengan API key dari file .env lalu dialiaskan ke variable AI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// memasukkan gemini 2.5 flash ke variable GEMINI MODEL
const GEMINI_MODEL = "gemini-2.5-flash";

// menggunakan library cors. karena akan kita akses express api dari frontend
app.use(cors());

// menggunakan express.json karena akan kita hasilkan input dan output json
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// memasukkan 3000 sebagai nomor PORT
const PORT = 3000;

// ketika dijalankan akan menulis di consol Server is running ...
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.post('/api/chat', async (req, res) => {
    try {
        const { messages } = req.body;
        if(!Array.isArray(messages)) throw new Error("Messages must be an array");
        const contents = messages.map(msg => ({
            role: msg.role,
            parts: [{text: msg.content}]
        }));
        const resp = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents
        });
        res.json({ result: extractText(resp)});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// fungsi pengecekan isi response dari gemini sdk
function extractText(resp) {
    try {
        const text =
            resp?.response?.candidates?.[0]?.content?.parts?.[0]?.text ??
            resp?.candidates?.[0]?.content?.parts?.[0]?.text ??
            resp?.response?.candidates?.[0]?.content?.text;

        return text ?? JSON.stringify(resp, null, 2);
    } catch (err) {
        console.log("Error extracting text:", err);
        return JSON.stringify(resp, null, 2);
    }
}


