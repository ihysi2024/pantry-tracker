"use server";

const LLAMA_API_URL = "https://api.llama-api.com/chat/completions"

export const getLlamaCompletion = async(name) => {
    console.log(name);
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.LLAMA_API_TOKEN}`,
        "Access-Control-Allow-Origin": "*"
    }
    try {
        const response = await fetch(LLAMA_API_URL, {
            method: "POST",
            headers, 
            body: JSON.stringify({
                messages: [{role: "user", content: `Give me the calories, carbs, fat, fiber, and protein for a typical serving size of ${name} with each fact on a separate line and in the format Calorie: Number Unit with a line break after each colon`}],
            })
        })
        const data = await response.json()
        console.log(data);
        console.log(data.choices[0].message.content)
        return data.choices[0].message.content;
    }
    catch (e) {
        console.log("error")
        console.log(e);
        throw (e);
    }
}