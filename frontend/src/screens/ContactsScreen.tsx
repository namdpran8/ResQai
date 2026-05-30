import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Phone, Trash2, AlertTriangle } from "lucide-react";

interface ContactsScreenProps {
  isDark: boolean;
  onNavigate: (screen: string) => void;
}

interface Contact {
  id: number;
  name: string;
  primaryPhone: string;
  secondaryPhone: string;
  address: string;
}

const STORAGE_KEY = "resqai_contacts";

export default function ContactsScreen({
  isDark,
  onNavigate,
}: ContactsScreenProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showAdd, setShowAdd] = useState(false);

  const [form, setForm] = useState({
    name: "",
    primaryPhone: "",
    secondaryPhone: "",
    address: "",
  });

  // ✅ Improved Dark / Light Styling
  const pageBg = isDark ? "bg-zinc-950" : "bg-slate-100";
  const cardBg = isDark
    ? "bg-zinc-900 border border-zinc-800"
    : "bg-white border border-gray-200";

  const textPrimary = isDark ? "text-white" : "text-gray-900";
  const textSecondary = isDark ? "text-zinc-400" : "text-gray-500";

  // ✅ Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setContacts(JSON.parse(stored));
    }
  }, []);

  // ✅ Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
  }, [contacts]);

  const handleAdd = () => {
    if (!form.name || !form.primaryPhone) return;

    const newContact: Contact = {
      id: Date.now(),
      ...form,
    };

    setContacts((prev) => [...prev, newContact]);

    setForm({
      name: "",
      primaryPhone: "",
      secondaryPhone: "",
      address: "",
    });

    setShowAdd(false);
  };

  const handleDelete = (id: number) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  // ✅ SOS Function
  const handleSOS = () => {
    if (contacts.length === 0) {
      alert("No emergency contacts saved!");
      return;
    }

    const message = encodeURIComponent(
      "🚨 EMERGENCY ALERT 🚨\nI need immediate help.\nPlease contact me immediately.\n- Sent via ResQAI"
    );

    contacts.forEach((contact) => {
      const smsLink = `sms:${contact.primaryPhone}?body=${message}`;
      window.open(smsLink);
    });
  };

  return (
    <div className={`absolute inset-0 ${pageBg} overflow-hidden`}>
      <div
        className="relative z-10 h-full flex flex-col overflow-y-auto"
        style={{ paddingBottom: "90px" }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-5 pt-4 pb-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onNavigate("home")}
            className={`w-8 h-8 rounded-xl flex items-center justify-center ${cardBg}`}
          >
            <ArrowLeft size={14} className={textPrimary} />
          </motion.button>

          <div>
            <h1 className={`text-base font-bold ${textPrimary}`}>
              Emergency Contacts
            </h1>
            <p className={`text-[11px] ${textSecondary}`}>
              {contacts.length} contacts registered
            </p>
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowAdd(!showAdd)}
            className="ml-auto w-8 h-8 rounded-xl bg-red-500/15 border border-red-500/25 flex items-center justify-center"
          >
            <Plus size={14} className="text-red-400" />
          </motion.button>
        </div>

        {/* SOS Button */}
        <div className="px-5 mb-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSOS}
            className="w-full py-3 rounded-2xl bg-red-600 hover:bg-red-500 transition text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-red-900/30"
          >
            <AlertTriangle size={16} />
            Send SOS Alert
          </motion.button>
        </div>

        {/* Add Contact Form */}
        {showAdd && (
          <div className="px-5 mb-4">
            <div className={`p-4 rounded-2xl ${cardBg}`}>
              <input
                type="text"
                placeholder="Full Name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                className={`w-full mb-3 rounded-xl px-3 py-2 text-sm outline-none transition
                ${
                  isDark
                    ? "bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 focus:border-red-500"
                    : "bg-gray-100 border border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-red-500"
                }`}
              />

              <input
                type="tel"
                placeholder="Primary Phone"
                value={form.primaryPhone}
                onChange={(e) =>
                  setForm({ ...form, primaryPhone: e.target.value })
                }
                className={`w-full mb-3 rounded-xl px-3 py-2 text-sm outline-none transition
                ${
                  isDark
                    ? "bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 focus:border-red-500"
                    : "bg-gray-100 border border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-red-500"
                }`}
              />

              <input
                type="tel"
                placeholder="Secondary Phone (Optional)"
                value={form.secondaryPhone}
                onChange={(e) =>
                  setForm({ ...form, secondaryPhone: e.target.value })
                }
                className={`w-full mb-3 rounded-xl px-3 py-2 text-sm outline-none transition
                ${
                  isDark
                    ? "bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 focus:border-red-500"
                    : "bg-gray-100 border border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-red-500"
                }`}
              />

              <textarea
                placeholder="Address"
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
                className={`w-full mb-3 rounded-xl px-3 py-2 text-sm outline-none transition
                ${
                  isDark
                    ? "bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 focus:border-red-500"
                    : "bg-gray-100 border border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-red-500"
                }`}
              />

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleAdd}
                className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 transition text-white text-sm font-semibold"
              >
                Save Contact
              </motion.button>
            </div>
          </div>
        )}

        {/* Contacts List */}
        <div className="px-5 flex flex-col gap-3">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className={`p-4 rounded-2xl ${cardBg}`}
            >
              <p className={`text-sm font-bold ${textPrimary}`}>
                {contact.name}
              </p>

              <p className={`text-xs ${textSecondary}`}>
                📞 {contact.primaryPhone}
              </p>

              {contact.secondaryPhone && (
                <p className={`text-xs ${textSecondary}`}>
                  ☎ Secondary: {contact.secondaryPhone}
                </p>
              )}

              <p className={`text-xs ${textSecondary}`}>
                📍 {contact.address}
              </p>

              <div className="flex gap-2 mt-3">
                <a
                  href={`tel:${contact.primaryPhone}`}
                  className="flex-1 py-2 rounded-xl bg-green-600/20 border border-green-500/30 text-green-400 text-center text-xs font-semibold"
                >
                  Call Primary
                </a>

                {contact.secondaryPhone && (
                  <a
                    href={`tel:${contact.secondaryPhone}`}
                    className="flex-1 py-2 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 text-center text-xs font-semibold"
                  >
                    Call Secondary
                  </a>
                )}

                <button
                  onClick={() => handleDelete(contact.id)}
                  className="w-9 rounded-xl bg-red-500/15 border border-red-500/25 flex items-center justify-center"
                >
                  <Trash2 size={14} className="text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}