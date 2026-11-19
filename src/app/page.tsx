"use client";

import { useEffect, useState } from "react";
import { BirthCertificateForm } from "@/components/birth-certificate-form";
import { GameplayScreen } from "@/components/gameplay-screen";
import { advanceYear as runYear } from "@/lib/gameEngine";
import { getActiveSave, getHallOfFame, saveGame, saveHallOfFame } from "@/lib/storage";
import type { GameSave, GameScreen, PastLifeRecord } from "@/types/game";

type Modal = "guide" | "hall-of-fame" | null;

const guideSections = [
  ["Tujuan", "Jalani satu kehidupan, ambil keputusan setiap tahun, dan lihat jejak yang kamu tinggalkan di 14 kota Indonesia."],
  ["Stat & Uang", "Kesehatan, kebahagiaan, energi, dan sosial memengaruhi pilihan yang tersedia. Uang dipakai untuk kebutuhan, kesempatan, dan keadaan darurat."],
  ["+1 Tahun & Aksi", "Setiap tahun kamu memilih aksi utama. Konsekuensinya dapat langsung terasa atau baru muncul beberapa tahun kemudian."],
  ["Sekolah/UTBK/Kuliah", "Belajar membuka jalur baru. Nilai, biaya, dan pilihan kampus akan membentuk awal kariermu."],
  ["Kerja & Karier", "Cari pekerjaan, bangun keahlian, negosiasikan gaji, atau ambil risiko pindah jalur saat kesempatan datang."],
  ["Relasi & Anak", "Pertemanan, pasangan, dan keluarga butuh waktu serta perhatian. Keputusanmu juga dapat memengaruhi generasi berikutnya."],
  ["Karier Politik", "Bangun reputasi di lingkunganmu, masuk organisasi, dan tentukan seberapa jauh kamu ingin mengambil peran publik."],
  ["Harta/Kesehatan/Hukum", "Rumah, aset, kondisi tubuh, hingga perkara hukum dapat mengubah arah hidup. Siapkan dana dan pertimbangkan risiko."],
  ["Tips", "Tidak ada satu jalan paling benar. Jaga keseimbangan stat, sisihkan uang, dan baca setiap konsekuensi sebelum melangkah."],
] as const;

function createDemoRecord(generation: number): PastLifeRecord {
  const demos = [
    ["Sari Wulandari", "Warga Teladan", 82, "Yogyakarta", "Guru yang membangun perpustakaan kecil dan selalu membawa bekal untuk dibagi."],
    ["Bima Pratama", "Raja Warung Kopi", 74, "Makassar", "Membuka kedai sederhana, membesarkan tiga anak, dan hafal pesanan seluruh tetangga."],
    ["Nadia Putri", "Pejuang Kota", 91, "Bandung", "Meniti karier dari relawan kampus hingga menjadi pemimpin komunitas kotanya."],
  ] as const;
  const [name, finalTitle, ageAtDeath, city, summary] = demos[(generation - 1) % demos.length];

  return {
    id: `demo-${Date.now()}`,
    name,
    generation,
    finalTitle,
    ageAtDeath,
    city,
    summary,
    completedAt: new Date().toISOString(),
  };
}

function ModalShell({ children, onClose, titleId }: { children: React.ReactNode; onClose: () => void; titleId: string }) {
  return (
    <div className="fixed inset-0 z-10 flex items-end justify-center bg-[#231F20]/35 p-0 sm:items-center sm:p-5" role="presentation" onMouseDown={onClose}>
      <section role="dialog" aria-modal="true" aria-labelledby={titleId} className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-t-[2rem] border border-[#EADBC8] bg-white p-6 shadow-2xl sm:rounded-[2rem] sm:p-8" onMouseDown={(event) => event.stopPropagation()}>
        {children}
      </section>
    </div>
  );
}

export default function Home() {
  const [screen, setScreen] = useState<GameScreen>("home");
  const [activeSave, setActiveSave] = useState<GameSave | null>(null);
  const [hallOfFame, setHallOfFame] = useState<PastLifeRecord[]>([]);
  const [activeModal, setActiveModal] = useState<Modal>(null);

  useEffect(() => {
    setActiveSave(getActiveSave());
    setHallOfFame(getHallOfFame());
  }, []);

  function addDemoRecord() {
    const updatedRecords = [createDemoRecord(hallOfFame.length + 1), ...hallOfFame];
    saveHallOfFame(updatedRecords);
    setHallOfFame(updatedRecords);
  }

  function startLife(save: GameSave) {
    persistSave(save);
    setScreen("gameplay");
  }

  function persistSave(save: GameSave) {
    saveGame(save);
    setActiveSave(save);
    if (save.status === "deceased") {
      const recordId = `life-${save.profile.seed}`;
      setHallOfFame((records) => {
        if (records.some((record) => record.id === recordId)) return records;
        const nextRecords = [{ id: recordId, name: save.identity.name, generation: save.profile.generation, finalTitle: "Warga yang Bertahan", ageAtDeath: save.identity.age, city: save.identity.city, summary: save.lifeLog.slice(-1)[0]?.text ?? "Menjalani hidup dengan penuh warna.", completedAt: new Date().toISOString() }, ...records];
        saveHallOfFame(nextRecords);
        return nextRecords;
      });
    }
  }

  function advanceYear() {
    if (activeSave && !activeSave.pendingEvent) persistSave(runYear(activeSave));
  }

  function continueAsHeir() {
    if (!activeSave) return;
    const heir: GameSave = { ...activeSave, version: 3, status: "alive", identity: { ...activeSave.identity, name: `Ahli Waris ${activeSave.identity.name.split(" ")[0]}`, age: 18 }, profile: { ...activeSave.profile, generation: activeSave.profile.generation + 1, seed: Math.random().toString(36).slice(2, 10) }, stats: { happiness: 60, health: 70, intelligence: 55, appearance: 55, connection: 40 }, money: Math.max(0, activeSave.money), quota: { upgrades: 3, applications: 3, relationActions: {} }, pendingEvent: undefined, recentEventIds: [], job: undefined, lifeLog: [{ year: activeSave.currentYear, text: "Kamu menerima estafet keluarga dan memulai perjalanan generasi baru." }], updatedAt: new Date().toISOString() };
    persistSave(heir);
  }

  return (
    <main className="flex min-h-screen items-center justify-center overflow-hidden bg-[#FFF9F0] px-5 py-10 text-[#231F20]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(ellipse_at_top,_#FDE2C0_0,_transparent_70%)]" />
      {screen === "birth-certificate" ? (
        <BirthCertificateForm onBack={() => setScreen("home")} onBorn={startLife} />
      ) : screen === "gameplay" && activeSave ? (
        <GameplayScreen save={activeSave} onHome={() => setScreen("home")} onSave={persistSave} onNextYear={advanceYear} onHeir={continueAsHeir} onHelp={() => setActiveModal("guide")} />
      ) : (
        <section className="relative w-full max-w-md rounded-[2rem] border border-[#EADBC8] bg-white px-6 py-8 text-center shadow-xl shadow-[#8b6a45]/10 sm:px-9 sm:py-10">
          <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-[#F4A261]/40 bg-[#FFF2DF] px-3 py-1.5 text-xs font-bold text-[#9A4F1D]">
            <span className="text-xl" role="img" aria-label="Bendera Indonesia">🇮🇩</span>
            14 kota · satu kehidupan
          </div>
          <h1 className="mt-6 text-4xl font-black tracking-tight text-[#231F20] sm:text-5xl">Menjadi warga +62</h1>
          <p className="mx-auto mt-4 max-w-sm text-base leading-7 text-[#6B5E55]">Jalani satu hidup dari lahir sampai tua, tahun demi tahun, di 14 kota.</p>

          <div className="mt-8 space-y-3">
            <button type="button" onClick={() => setScreen("birth-certificate")} className="w-full rounded-xl bg-[#E63946] px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-[#E63946]/20 transition hover:-translate-y-0.5 hover:bg-[#cf2633] focus:outline-none focus:ring-2 focus:ring-[#E63946] focus:ring-offset-2">
              Lahir Sekarang
            </button>
            {activeSave && (
              <button type="button" onClick={() => setScreen("gameplay")} className="w-full rounded-xl border-2 border-[#2A9D8F] px-5 py-3 text-sm font-bold text-[#16776c] transition hover:bg-[#E4F5F2] focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:ring-offset-2">
                Lanjutkan hidup {activeSave.identity.name} ({activeSave.identity.age} th)
              </button>
            )}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 border-t border-[#F1E6D8] pt-4">
            <button type="button" onClick={() => setActiveModal("hall-of-fame")} className="rounded-xl px-2 py-3 text-sm font-bold text-[#118AB2] transition hover:bg-[#E5F5FA] focus:outline-none focus:ring-2 focus:ring-[#118AB2]">
              🏆 Hall of Fame{hallOfFame.length > 0 ? ` (${hallOfFame.length})` : ""}
            </button>
            <button type="button" onClick={() => setActiveModal("guide")} className="rounded-xl px-2 py-3 text-sm font-bold text-[#6B5E55] transition hover:bg-[#FFF2DF] focus:outline-none focus:ring-2 focus:ring-[#F4A261]">
              📖 Cara Main
            </button>
          </div>

          <p className="mt-7 text-xs leading-5 text-[#9A8A7D]">engine v0.1.0 · content v0.1.0 · progres tersimpan otomatis di browser ini</p>
        </section>
      )}

      {activeModal === "guide" && (
        <ModalShell titleId="guide-title" onClose={() => setActiveModal(null)}>
          <div className="flex items-start justify-between gap-4">
            <div><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#E63946]">Panduan</p><h2 id="guide-title" className="mt-1 text-2xl font-black">Cara Main</h2></div>
            <button type="button" aria-label="Tutup panduan" onClick={() => setActiveModal(null)} className="grid h-9 w-9 place-items-center rounded-full text-xl text-[#6B5E55] transition hover:bg-[#FFF2DF]">×</button>
          </div>
          <div className="mt-6 space-y-5">
            {guideSections.map(([title, description]) => <article key={title}><h3 className="font-bold text-[#231F20]">{title}</h3><p className="mt-1.5 text-sm leading-6 text-[#6B5E55]">{description}</p></article>)}
          </div>
        </ModalShell>
      )}

      {activeModal === "hall-of-fame" && (
        <ModalShell titleId="hall-title" onClose={() => setActiveModal(null)}>
          <div className="flex items-start justify-between gap-4">
            <div><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#118AB2]">Warisan hidup</p><h2 id="hall-title" className="mt-1 text-2xl font-black">Riwayat Generasi Sebelumnya</h2></div>
            <button type="button" aria-label="Tutup Hall of Fame" onClick={() => setActiveModal(null)} className="grid h-9 w-9 place-items-center rounded-full text-xl text-[#6B5E55] transition hover:bg-[#E5F5FA]">×</button>
          </div>
          {hallOfFame.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-[#EADBC8] bg-[#FFF9F0] p-6 text-center"><span className="text-3xl">🌱</span><p className="mt-3 font-bold">Belum ada generasi yang tercatat.</p><p className="mt-1 text-sm leading-6 text-[#6B5E55]">Tambahkan data contoh untuk melihat bentuk Hall of Fame.</p></div>
          ) : (
            <div className="mt-6 space-y-3">
              {hallOfFame.map((record) => <article key={record.id} className="rounded-2xl border border-[#EADBC8] p-4"><div className="flex justify-between gap-3"><div><h3 className="font-extrabold">{record.name}</h3><p className="mt-0.5 text-xs font-bold text-[#118AB2]">Generasi {record.generation} · {record.finalTitle}</p></div><span className="rounded-full bg-[#FFF2DF] px-2.5 py-1 text-xs font-bold text-[#9A4F1D]">{record.ageAtDeath} th</span></div><p className="mt-3 text-sm font-semibold text-[#6B5E55]">📍 {record.city}</p><p className="mt-1 text-sm leading-6 text-[#6B5E55]">{record.summary}</p></article>)}
            </div>
          )}
          <button type="button" onClick={addDemoRecord} className="mt-6 w-full rounded-xl bg-[#2A9D8F] px-4 py-3 text-sm font-extrabold text-white transition hover:bg-[#218579] focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:ring-offset-2">+ Tambah data contoh</button>
        </ModalShell>
      )}
    </main>
  );
}
