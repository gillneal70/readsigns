import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MessageCircle } from "lucide-react";

export default function SpiritualConsultationSite() {
  const [form, setForm] = useState({
    name: "",
    motherName: "",
    email: "",
    service: "",
    message: "",
    cardPhoto: null,
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "cardPhoto") {
      setForm({ ...form, cardPhoto: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("motherName", form.motherName);
    formData.append("email", form.email);
    formData.append("service", form.service);
    formData.append("message", form.message);
    if (form.cardPhoto) {
      formData.append("cardPhoto", form.cardPhoto);
    }

    try {
      const res = await fetch("/send-email.php", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.status === "success") {
        setStatus({ type: "success", message: "Your consultation request has been sent!" });
        setForm({ name: "", motherName: "", email: "", service: "", message: "", cardPhoto: null });
      } else {
        setStatus({ type: "error", message: data.message || "Failed to send email." });
      }
    } catch (error) {
      setStatus({ type: "error", message: "An error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-black text-white">
      <section className="py-16 px-4 max-w-3xl mx-auto">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-3xl font-bold text-center mb-8"
        >
          Book a Consultation
        </motion.h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your Name"
            required
            className="w-full p-3 rounded bg-purple-900/50 border border-purple-700"
          />
          <input
            type="text"
            name="motherName"
            value={form.motherName}
            onChange={handleChange}
            placeholder="Your Mother's Name"
            required
            className="w-full p-3 rounded bg-purple-900/50 border border-purple-700"
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Your Email"
            required
            className="w-full p-3 rounded bg-purple-900/50 border border-purple-700"
          />
          <select
            name="service"
            value={form.service}
            onChange={handleChange}
            required
            className="w-full p-3 rounded bg-purple-900/50 border border-purple-700"
          >
            <option value="">Select a Service</option>
            <option>Card Reading - $200</option>
            <option>Ifa Oracle Service - $150</option>
            <option>Talking to the Dead - $2500</option>
            <option>Palm Readings - $200</option>
          </select>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Additional details (optional)"
            rows="4"
            className="w-full p-3 rounded bg-purple-900/50 border border-purple-700"
          ></textarea>
          <div>
            <label className="block mb-2 text-sm">Upload Gift Card Photo (if applicable)</label>
            <input
              type="file"
              name="cardPhoto"
              accept="image/*"
              onChange={handleChange}
              className="w-full p-3 rounded bg-purple-900/50 border border-purple-700"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-purple-700 hover:bg-purple-800 text-white text-lg py-3"
            disabled={loading}
          >
            {loading ? "Sending..." : "Submit Request"}
          </Button>
        </form>

        {status && (
          <p
            className={`mt-4 text-center font-semibold ${
              status.type === "success" ? "text-green-400" : "text-red-400"
            }`}
          >
            {status.message}
          </p>
        )}
      </section>

      <footer className="py-10 text-center border-t border-purple-800">
        <h3 className="text-xl mb-4 font-semibold">Contact & Support</h3>
        <div className="flex justify-center gap-6 mb-4">
          <a href="mailto:spiritconsult@example.com" className="flex items-center gap-2 hover:text-purple-400">
            <Mail size={20} /> Email
          </a>
          <a href="tel:+2348000000000" className="flex items-center gap-2 hover:text-purple-400">
            <Phone size={20} /> Call
          </a>
          <a href="https://wa.me/2348000000000" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-purple-400">
            <MessageCircle size={20} /> WhatsApp
          </a>
        </div>
        <p className="text-gray-400 text-sm">© {new Date().getFullYear()} Spiritual Consultation Service. All rights reserved.</p>
      </footer>
    </div>
  );
}