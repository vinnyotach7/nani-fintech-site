const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
}

const db = admin.firestore();

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { name, email, phone, country, message, formType } = req.body;

await db.collection("contact_submissions").add({
  name,
  email,
  phone,
  country,
  message,
  formType,
  createdAt: admin.firestore.FieldValue.serverTimestamp(),
});

    return res.status(200).json({ message: "Success" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error submitting form" });
  }
};