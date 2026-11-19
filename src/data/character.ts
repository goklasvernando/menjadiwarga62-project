import type { Gender, OriginMode } from "@/types/game";

export const cities = ["Jakarta", "Bandung", "Surabaya", "Yogyakarta", "Semarang", "Medan", "Makassar", "Denpasar", "Palembang", "Balikpapan", "Malang", "Solo", "Padang", "Manado"] as const;

export const originModes: OriginMode[] = [
  { id: "ordinary", label: "Hidup biasa (nasib acak)", difficulty: "Sedang", description: "Mulai dari nol dan biarkan nasib menentukan warna keluarga serta modal awalmu.", startingAge: 0, startingMoney: 0 },
  { id: "sultan", label: "Anak Sultan Ibu Kota", difficulty: "Santai", description: "Lahir dengan akses, tabungan, dan ekspektasi keluarga yang sama-sama besar.", startingAge: 0, startingMoney: 150_000_000, familyBackground: "Keluarga berada" },
  { id: "civil-servant", label: "Anak Pegawai Negeri", difficulty: "Santai", description: "Hidup relatif stabil dengan jaringan keluarga yang rapi dan teratur.", startingAge: 0, startingMoney: 20_000_000, familyBackground: "Keluarga pegawai negeri" },
  { id: "pinjol", label: "Lahir di Keluarga Pinjol", difficulty: "Sulit", description: "Kamu lahir di rumah yang tagihannya datang lebih cepat daripada kabar baik.", startingAge: 0, startingMoney: -5_000_000, familyBackground: "Keluarga terlilit utang" },
  { id: "golden-voice", label: "Suara Emas dari Timur", difficulty: "Sedang", description: "Bakatmu sering mencuri perhatian, tetapi panggung besar masih jauh di sana.", startingAge: 16, startingMoney: 1_500_000, familyBackground: "Keluarga musisi lokal" },
  { id: "smk-rantau", label: "Lulusan SMK Merantau", difficulty: "Sedang", description: "Koper tipis, keterampilan praktis, dan tekad untuk membuktikan diri di kota orang.", startingAge: 18, startingMoney: 2_000_000, familyBackground: "Keluarga pekerja keras" },
  { id: "fresh-grad", label: "Fresh Graduate ke Ibu Kota", difficulty: "Sedang", description: "Ijazah baru, ambisi besar, dan saldo yang harus bertahan sampai panggilan kerja datang.", startingAge: 22, startingMoney: 3_500_000, familyBackground: "Keluarga kelas menengah" },
  { id: "phk", label: "Korban PHK Umur 35", difficulty: "Sulit", description: "Kamu harus menyusun ulang hidup ketika penghasilan utama tiba-tiba berhenti.", startingAge: 35, startingMoney: 4_000_000, familyBackground: "Keluarga pencari nafkah" },
  { id: "ex-prisoner", label: "Baru Bebas dari Lapas", difficulty: "Sulit", description: "Kamu mendapat kesempatan kedua, dengan kepercayaan orang lain yang harus dibangun perlahan.", startingAge: 30, startingMoney: 500_000, familyBackground: "Mencari awal yang baru" },
];

const firstNames: Record<Gender, string[]> = {
  male: ["Dimas", "Raka", "Bagas", "Rizky", "Fajar", "Ardi", "Bayu", "Galang"],
  female: ["Ayu", "Salsa", "Nadira", "Intan", "Citra", "Nabila", "Rani", "Tika"],
};
const lastNames = ["Pratama", "Wulandari", "Saputra", "Permata", "Kusuma", "Ramadhan", "Lestari", "Nugroho"];
const fatherNames = ["Budi", "Joko", "Agus", "Hendra", "Dedi", "Yusuf"];
const motherNames = ["Siti", "Dewi", "Rina", "Yuni", "Maya", "Sri"];
export const traits = ["Ceria", "Ulet", "Santuy", "Ambisius", "Peka", "Berani", "Teliti", "Supel"];
export const familyBackgrounds = ["Keluarga sederhana", "Keluarga pekerja keras", "Keluarga perantau", "Keluarga hangat", "Keluarga penuh tuntutan"];

function pick<T>(items: readonly T[]): T { return items[Math.floor(Math.random() * items.length)]; }
export function randomFirstName(gender: Gender): string { return pick(firstNames[gender]); }
export function randomLastName(): string { return pick(lastNames); }
export function randomFatherName(): string { return pick(fatherNames); }
export function randomMotherName(): string { return pick(motherNames); }
export function randomCity(): string { return pick(cities); }
