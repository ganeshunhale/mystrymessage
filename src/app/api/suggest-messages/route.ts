import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
export const config = {
    runtime: "edge"
}
// this is not working becouse OpenAi api is paid or limit is excided
export const openai = new OpenAI({ apiKey: process.env.OPEN_AI_SECRET_KEY })
export async function POST(request: NextRequest) {

    const { message } = await request.json()
    if (!message || typeof message !== "string") {

        return NextResponse.json({ success: false, message: "Invalid message" }, { status: 400 })
    }
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        async start(controller) {
            try {
                const chatStream  = await openai.chat.completions.create({
                    model: 'gpt-3.5-turbo',
                    messages: [{ role: "user", content: message }],
                    stream: true
                })

                for await (const chunk of chatStream) {
                    const token = chunk.choices[0]?.delta?.content;
                    if (token) {
                      controller.enqueue(encoder.encode(token));
                    }
                  }
                controller.close()
          

            } catch (error) {
                controller.enqueue(encoder.encode(`[Error:${error}]`))
                controller.close();
            }
        }
    })

    return new Response(stream, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-cache',
        },
      });



}