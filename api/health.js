export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ is_success: false });
  }

  res.status(200).json({
    is_success: true,
    official_email: "vidhi2400.be23@chitkara.edu.in"
  });
}
