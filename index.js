import express from "express";
import { GoogleGenAI } from "@google/genai";
import 'dotenv/config'

const API_KEY = process.env.GEMINI_API_KEY;
const port = 3000;
const app = express();
const ai = new GoogleGenAI({ apiKey:  API_KEY});

// common middlewares
app.use(express.json());
app.use(express.static("public"));

app.get("/", async (req, res) => {
    res.render("home.ejs");
});

app.post("/chat", async (req, res) => {
    try {
        const prompt = req.body?.prompt;
        
        if(!prompt) {
            return res.status(400).json({ message: "Prompt is required."});
        }

        const aiResponse = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
        });
        
        if(!aiResponse) {
            throw new Error("Something went wrong, try again later");
        }

        const response = aiResponse.text;

        res.status(200).json({ response: response}).end();
    } catch (error) {
        console.log("Error in generaring ai response:", error);
        res.status(500).json({ message: "Something went wrong, try again later."})
        .end();
    }
});



// const prompt = "write a function to add node in existing linked list. choose c language.";
// async function main() {
//   const response = await ai.models.generateContent({
//     model: "gemini-2.0-flash",
//     contents: prompt,
//   });
//   console.log(response.text);
// }
// await main();



app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});


