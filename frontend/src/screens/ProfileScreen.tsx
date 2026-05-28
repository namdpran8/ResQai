import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Camera,
  Pencil,
  Save,
} from "lucide-react";

interface ProfileScreenProps {
  isDark: boolean;
  onNavigate: (screen: string) => void;
}

interface ProfileData {
  profileImage: string;
  fullName: string;
  age: string;
  gender: string;
  phone: string;
  address: string;
  bloodGroup: string;
  allergies: string;
  conditions: string;
  medications: string;
  emergencyId: string;
}

const STORAGE_KEY = "resqai_profile";

const defaultProfile: ProfileData = {
  profileImage: "",
  fullName: "",
  age: "",
  gender: "",
  phone: "",
  address: "",
  bloodGroup: "",
  allergies: "",
  conditions: "",
  medications: "",
  emergencyId: `RESQ-${Math.floor(100000 + Math.random() * 900000)}`,
};

export default function ProfileScreen({
  isDark,
  onNavigate,
}: ProfileScreenProps) {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [isEditing, setIsEditing] = useState(true);

  const pageBg = isDark ? "bg-zinc-950" : "bg-slate-100";
  const cardBg = isDark
    ? "bg-zinc-900 border border-zinc-800"
    : "bg-white border border-gray-200";

  const textPrimary = isDark ? "text-white" : "text-gray-900";
  const textSecondary = isDark ? "text-zinc-400" : "text-gray-500";

  const inputClass = `w-full rounded-xl px-3 py-2 text-sm outline-none transition ${
    isDark
      ? "bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 focus:border-red-500"
      : "bg-gray-100 border border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-red-500"
  }`;

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setProfile(JSON.parse(stored));
      setIsEditing(false);
    }
  }, []);

  const updateField = (
    key: keyof ProfileData,
    value: string
  ) => {
    setProfile((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    setIsEditing(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      updateField("profileImage", reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const initials =
    profile.fullName.trim().length > 0
      ? profile.fullName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : "U";

  return (
    <div className={`absolute inset-0 ${pageBg}`}>
      <div
        className="h-full overflow-y-auto px-5 pt-4"
        style={{ paddingBottom: "90px" }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onNavigate("home")}
            className={`w-8 h-8 rounded-xl flex items-center justify-center ${cardBg}`}
          >
            <ArrowLeft size={14} className={textPrimary} />
          </motion.button>

          <h1 className={`text-base font-bold ${textPrimary}`}>
            Medical Profile
          </h1>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() =>
              isEditing ? handleSave() : setIsEditing(true)
            }
            className="ml-auto h-8 px-3 rounded-xl bg-red-500/15 border border-red-500/25 flex items-center gap-1"
          >
            {isEditing ? (
              <>
                <Save size={13} className="text-red-400" />
                <span className="text-[11px] font-semibold text-red-400">
                  Save
                </span>
              </>
            ) : (
              <>
                <Pencil size={13} className="text-red-400" />
                <span className="text-[11px] font-semibold text-red-400">
                  Edit
                </span>
              </>
            )}
          </motion.button>
        </div>

        {/* Profile Card */}
        <div className={`rounded-3xl ${cardBg} p-5 mb-4`}>
          <div className="flex items-center gap-4">
            <div className="relative">
              {profile.profileImage ? (
                <img
                  src={profile.profileImage}
                  className="w-20 h-20 rounded-3xl object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-3xl bg-red-600/20 border border-red-500/30 flex items-center justify-center">
                  <span className="text-2xl font-bold text-red-400">
                    {initials}
                  </span>
                </div>
              )}

              {isEditing && (
                <label className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center cursor-pointer">
                  <Camera size={14} className="text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div>
              <p className={`text-lg font-bold ${textPrimary}`}>
                {profile.fullName || "Your Name"}
              </p>
              <p className={`text-xs ${textSecondary}`}>
                Emergency ID: {profile.emergencyId}
              </p>
            </div>
          </div>
        </div>

        {/* Personal Details */}
        <div className={`rounded-3xl ${cardBg} p-4 mb-4`}>
          <h2 className={`text-sm font-bold ${textPrimary} mb-3`}>
            Personal Details
          </h2>

          <div className="space-y-3">
            <input
              disabled={!isEditing}
              placeholder="Full Name"
              value={profile.fullName}
              onChange={(e) =>
                updateField("fullName", e.target.value)
              }
              className={inputClass}
            />

            <div className="grid grid-cols-2 gap-3">
              <input
                disabled={!isEditing}
                type="number"
                placeholder="Age"
                value={profile.age}
                onChange={(e) =>
                  updateField("age", e.target.value)
                }
                className={inputClass}
              />

              <select
                disabled={!isEditing}
                value={profile.gender}
                onChange={(e) =>
                  updateField("gender", e.target.value)
                }
                className={inputClass}
              >
                <option value="">Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <input
              disabled={!isEditing}
              placeholder="Phone Number"
              value={profile.phone}
              onChange={(e) =>
                updateField("phone", e.target.value)
              }
              className={inputClass}
            />

            <textarea
              disabled={!isEditing}
              placeholder="Full Address"
              value={profile.address}
              onChange={(e) =>
                updateField("address", e.target.value)
              }
              className={`${inputClass} min-h-70px resize-none`}
            />
          </div>
        </div>

        {/* Medical Details */}
        <div className={`rounded-3xl ${cardBg} p-4 mb-4`}>
          <h2 className={`text-sm font-bold ${textPrimary} mb-3`}>
            Medical Details
          </h2>

          <div className="space-y-3">
            <select
              disabled={!isEditing}
              value={profile.bloodGroup}
              onChange={(e) =>
                updateField("bloodGroup", e.target.value)
              }
              className={inputClass}
            >
              <option value="">Blood Group</option>
              <option>A+</option>
              <option>A-</option>
              <option>B+</option>
              <option>B-</option>
              <option>AB+</option>
              <option>AB-</option>
              <option>O+</option>
              <option>O-</option>
            </select>

            <textarea
              disabled={!isEditing}
              placeholder="Allergies"
              value={profile.allergies}
              onChange={(e) =>
                updateField("allergies", e.target.value)
              }
              className={`${inputClass} min-h-70px resize-none`}
            />

            <textarea
              disabled={!isEditing}
              placeholder="Medical Conditions"
              value={profile.conditions}
              onChange={(e) =>
                updateField("conditions", e.target.value)
              }
              className={`${inputClass} min-h-70px resize-none`}
            />

            <textarea
              disabled={!isEditing}
              placeholder="Current Medications"
              value={profile.medications}
              onChange={(e) =>
                updateField("medications", e.target.value)
              }
              className={`${inputClass} min-h-70px resize-none`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}