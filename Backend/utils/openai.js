import "dotenv/config";

const getGroqAPIResponse = async (message) => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [{
                role: "user",
                content: message
            }]
        })
    };

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", options);
        const data = await response.json();

        // ✅ YE CHECK ADD KIYA
        if (!response.ok) {
            console.log("Groq Error:", response.status, data);
            throw new Error(`Groq API failed: ${response.status}`);
        }

        // ✅ YE BHI CHECK KARO
        if (!data.choices || data.choices.length === 0) {
            throw new Error("No response from Groq");
        }

        return data.choices[0].message.content;

    } catch(err) {
        console.log("getGroqAPIResponse Error:", err.message);
        throw err; // ✅ chat.js ke catch mein jayega
    }
};

export default getGroqAPIResponse;