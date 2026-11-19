"use client";

import { useState } from "react";
import { cities, familyBackgrounds, originModes, randomCity, randomFatherName, randomFirstName, randomLastName, randomMotherName, traits } from "@/data/character";
import type { BirthFormData, Difficulty, GameSave, Gender } from "@/types/game";

interface BirthCertificateFormProps {
  onBack: () => void;
  onBorn: (save: GameSave) => void;
}

const difficultyClasses: Record<Difficulty, string> = {
  Santai: "bg-[#DDF3EE] text-[#16776C]",
  Sedang: "bg-[#FFF0DB] text-[#A45A19]",
  Sulit: "bg-[#FDE1E3] text-[#B4232D]",
};

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function randomStat(difficulty: Difficulty): number {
  const bonus = difficulty === "Santai" ? 12 : difficulty === "Sulit" ? -7 : 0;
  return Math.min(95, Math.max(20, 48 + Math.floor(Math.random() * 28) + bonus));
}

export function BirthCertificateForm({ onBack, onBorn }: BirthCertificateFormProps) {
  const [form, setForm] = useState<BirthFormData>(() => ({
    modeId: "ordinary",
    gender: "male",
    firstName: randomFirstName("male"),
    lastName: randomLastName(),
    city: "Acak",
    fatherName: randomFatherName(),
    motherName: randomMotherName(),
  }));
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const selectedMode = originModes.find((mode) => mode.id === form.modeId) ?? originModes[0];

  function updateForm(patch: Partial<BirthFormData>) {
    setForm((current) => ({ ...current, ...patch }));
  }

  function setGender(gender: Gender) {
    updateForm({ gender, firstName: randomFirstName(gender) });
  }

  function randomizeAll() {
    const gender: Gender = Math.random() > 0.5 ? "male" : "female";
    updateForm({
      gender,
      firstName: randomFirstName(gender),
      lastName: randomLastName(),
      city: randomCity(),
      fatherName: randomFatherName(),
      motherName: randomMotherName(),
    });
  }

  function handleBorn() {
    const city = form.city === "Acak" ? randomCity() : form.city;
    const name = `${form.firstName.trim() || randomFirstName(form.gender)} ${form.lastName.trim() || randomLastName()}`;
    const currentYear = new Date().getFullYear();
    const save: GameSave = {
      version: 3,
      status: "alive",
      identity: {
        name,
        age: selectedMode.startingAge,
        city,
        gender: form.gender,
        parents: form.fatherName?.trim() && form.motherName?.trim() ? { father: form.fatherName.trim(), mother: form.motherName.trim() } : undefined,
      },
      profile: {
        trait: pick(traits),
        familyBackground: selectedMode.familyBackground ?? pick(familyBackgrounds),
        modeLabel: selectedMode.label,
        difficulty: selectedMode.difficulty,
        generation: 1,
        seed: Math.random().toString(36).slice(2, 10),
      },
      stats: {
        happiness: randomStat(selectedMode.difficulty),
        health: randomStat(selectedMode.difficulty),
        intelligence: randomStat(selectedMode.difficulty),
        appearance: randomStat(selectedMode.difficulty),
        connection: randomStat(selectedMode.difficulty),
      },
      money: selectedMode.startingMoney,
      currentYear,
      lifeLog: [{ year: currentYear, text: `${name} memulai kisah hidup di ${city}.` }],
      quota: { upgrades: 3, applications: 3, relationActions: {} },
      relationships: [
        { id: "father", name: form.fatherName?.trim() || randomFatherName(), role: "Ayah", age: 30, closeness: 65, description: "Keluarga inti" },
        { id: "mother", name: form.motherName?.trim() || randomMotherName(), role: "Ibu", age: 28, closeness: 70, description: "Keluarga inti" },
      ],
      education: { level: selectedMode.startingAge >= 22 ? "Lulus" : "Belum sekolah", status: selectedMode.startingAge >= 22 ? "Lulus" : "Sedang", kip: false },
      legalRecord: 0,
      hasBirthControl: false,
      isMarried: false,
      fame: 0,
      recentEventIds: [],
      updatedAt: new Date().toISOString(),
    };
    onBorn(save);
  }

  return (
    <section className="relative w-full max-w-xl rounded-[2rem] border border-[#EADBC8] bg-white p-5 shadow-xl shadow-[#8B6A45]/10 sm:p-8">
      <header className="flex items-center gap-4 border-b border-[#F1E6D8] pb-5">
        <button type="button" aria-label="Kembali ke Home" onClick={onBack} className="grid h-10 w-10 place-items-center rounded-xl border border-[#EADBC8] text-lg font-bold text-[#231F20] transition hover:bg-[#FFF2DF]">←</button>
        <div><p className="text-xs font-extrabold tracking-[0.2em] text-[#E63946]">MULAI PERJALANAN</p><h1 className="mt-1 text-2xl font-black text-[#231F20]">AKTA KELAHIRAN</h1></div>
      </header>

      <div className="mt-6 space-y-5">
        <label className="block"><span className="text-sm font-extrabold text-[#231F20]">Mode hidup</span>
          <select value={form.modeId} onChange={(event) => updateForm({ modeId: event.target.value })} className="mt-2 w-full rounded-xl border border-[#EADBC8] bg-white px-3 py-3 text-sm font-semibold text-[#231F20] outline-none focus:border-[#118AB2] focus:ring-2 focus:ring-[#118AB2]/20">
            {originModes.map((mode) => <option key={mode.id} value={mode.id}>{mode.label} · {mode.difficulty}</option>)}
          </select>
        </label>
        <div className="rounded-xl bg-[#FFF9F0] p-4"><div className="flex items-center gap-2"><span className={`rounded-full px-2.5 py-1 text-xs font-extrabold ${difficultyClasses[selectedMode.difficulty]}`}>{selectedMode.difficulty}</span><span className="text-xs font-bold text-[#6B5E55]">Usia awal {selectedMode.startingAge} th</span></div><p className="mt-2 text-sm leading-6 text-[#6B5E55]">{selectedMode.description}</p></div>

        <div><span className="text-sm font-extrabold text-[#231F20]">Jenis kelamin</span><div className="mt-2 grid grid-cols-2 gap-2">
          {(["male", "female"] as const).map((gender) => <button key={gender} type="button" onClick={() => setGender(gender)} className={`rounded-xl border px-3 py-3 text-sm font-bold transition ${form.gender === gender ? "border-[#118AB2] bg-[#E5F5FA] text-[#087294]" : "border-[#EADBC8] text-[#6B5E55] hover:bg-[#FFF9F0]"}`}>{gender === "male" ? "Laki-laki" : "Perempuan"}</button>)}
        </div></div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block"><span className="text-sm font-extrabold">Nama depan</span><div className="mt-2 flex gap-2"><input value={form.firstName} onChange={(event) => updateForm({ firstName: event.target.value })} className="min-w-0 flex-1 rounded-xl border border-[#EADBC8] px-3 py-3 text-sm outline-none focus:border-[#118AB2]" /><button type="button" aria-label="Acak nama depan" onClick={() => updateForm({ firstName: randomFirstName(form.gender) })} className="rounded-xl border border-[#EADBC8] px-3 text-lg hover:bg-[#FFF2DF]">🎲</button></div></label>
          <label className="block"><span className="text-sm font-extrabold">Nama belakang</span><div className="mt-2 flex gap-2"><input value={form.lastName} onChange={(event) => updateForm({ lastName: event.target.value })} className="min-w-0 flex-1 rounded-xl border border-[#EADBC8] px-3 py-3 text-sm outline-none focus:border-[#118AB2]" /><button type="button" aria-label="Acak nama belakang" onClick={() => updateForm({ lastName: randomLastName() })} className="rounded-xl border border-[#EADBC8] px-3 text-lg hover:bg-[#FFF2DF]">🎲</button></div></label>
        </div>

        <label className="block"><span className="text-sm font-extrabold">Kota lahir</span><select value={form.city} onChange={(event) => updateForm({ city: event.target.value })} className="mt-2 w-full rounded-xl border border-[#EADBC8] bg-white px-3 py-3 text-sm outline-none focus:border-[#118AB2]">{["Acak", ...cities].map((city) => <option key={city}>{city}</option>)}</select></label>

        <div className="border-t border-[#F1E6D8] pt-4"><button type="button" onClick={() => setIsAdvancedOpen((open) => !open)} className="text-sm font-extrabold text-[#16776C]">{isAdvancedOpen ? "▼" : "▶"} Lanjutan</button>
          {isAdvancedOpen && <div className="mt-3 rounded-xl bg-[#E4F5F2] p-4"><p className="text-sm leading-6 text-[#37645E]">Kasta keluarga dan sifat bawaan tidak bisa dipilih — ditentukan nasib saat lahir.</p><div className="mt-4 grid gap-3 sm:grid-cols-2"><label className="text-sm font-bold">Nama Ayah<div className="mt-1 flex gap-2"><input value={form.fatherName ?? ""} onChange={(event) => updateForm({ fatherName: event.target.value })} className="min-w-0 flex-1 rounded-lg border border-[#BDE2DB] bg-white px-2.5 py-2"/><button type="button" onClick={() => updateForm({ fatherName: randomFatherName() })}>🎲</button></div></label><label className="text-sm font-bold">Nama Ibu<div className="mt-1 flex gap-2"><input value={form.motherName ?? ""} onChange={(event) => updateForm({ motherName: event.target.value })} className="min-w-0 flex-1 rounded-lg border border-[#BDE2DB] bg-white px-2.5 py-2"/><button type="button" onClick={() => updateForm({ motherName: randomMotherName() })}>🎲</button></div></label></div><button type="button" onClick={randomizeAll} className="mt-4 text-sm font-extrabold text-[#087294]">🎲 Acak Semua</button></div>}
        </div>
      </div>
      <button type="button" onClick={handleBorn} className="mt-7 w-full rounded-xl bg-[#E63946] px-5 py-4 text-sm font-black tracking-[0.14em] text-white shadow-lg shadow-[#E63946]/20 transition hover:-translate-y-0.5 hover:bg-[#CF2633] focus:outline-none focus:ring-2 focus:ring-[#E63946] focus:ring-offset-2">LAHIR</button>
    </section>
  );
}
