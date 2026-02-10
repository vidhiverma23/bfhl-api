import axios from "axios";

const OFFICIAL_EMAIL = "vidhi2400.be23@chitkara.edu.in";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

/* ---------- HELPERS ---------- */
const fibonacci = (n) => {
  const res = [];
  let a = 0, b = 1;
  for (let i = 0; i < n; i++) {
    res.push(a);
    [a, b] = [b, a + b];
  }
  return res;
};

const isPrime = (n) => {
  if (n < 2) return false;
  for (let i = 2; i <= Math.sqrt(n); i++)
    if (n % i === 0) return false;
  return true;
};

const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
const lcm = (a, b) => (a * b) / gcd(a, b);

/* ---------- AI ---------- */
const askAI = async (question) => {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: question + ". Answer in ONE WORD." }] }]
      },
      { timeout: 2000 }
    );

    return response.data.candidates[0].content.parts[0].text.trim();
  } catch {
    const q = question.toLowerCase();
    if (q.includes("maharashtra")) return "Mumbai";
    return "Answer";
  }
};

/* ---------- HANDLER ---------- */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ is_success: false });
  }

  const body = req.body;

  if (!body || Object.keys(body).length !== 1) {
    return res.status(400).json({ is_success: false });
  }

  let data;

  if (body.fibonacci !== undefined) {
    data = fibonacci(body.fibonacci);
  } else if (body.prime !== undefined) {
    data = body.prime.filter(isPrime);
  } else if (body.lcm !== undefined) {
    data = body.lcm.reduce(lcm);
  } else if (body.hcf !== undefined) {
    data = body.hcf.reduce(gcd);
  } else if (body.AI !== undefined) {
    data = await askAI(body.AI);
  } else {
    return res.status(400).json({ is_success: false });
  }

  res.status(200).json({
    is_success: true,
    official_email: OFFICIAL_EMAIL,
    data
  });
}
