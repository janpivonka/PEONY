import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Jsi PS3B Core Agent. Ovládáš 3D rozhraní.
    Pokud uživatel chce změnit barvu nebo režim, přidej na konec odpovědi technický tag:
    [CMD:{"color": "#HEX_KOD", "boost": true/false}]

    Uživatel píše: ${message}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ text });
  } catch (error) {
    return NextResponse.json({ text: "Error" }, { status: 500 });
  }
}