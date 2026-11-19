export type LifeStatus = "alive" | "deceased";
export type Gender = "male" | "female";
export type Difficulty = "Santai" | "Sedang" | "Sulit";
export type GameScreen = "home" | "birth-certificate" | "gameplay";
export type StatKey = "happiness" | "health" | "intelligence" | "appearance" | "connection";
export type GameplayTab = "career" | "relations" | "upgrade" | "more";

export interface PlayerIdentity { name: string; age: number; city: string; gender: Gender; parents?: { father: string; mother: string }; }
export interface PlayerStats { happiness: number; health: number; intelligence: number; appearance: number; connection: number; }
export interface LifeLogEntry { year: number; text: string; }
export interface AnnualQuota { upgrades: number; applications: number; relationActions: Record<string, number>; }
export interface Job { id: string; title: string; category: "reguler" | "asn" | "bintang"; monthlySalary: number; experience: number; }
export interface Education { level: "Belum sekolah" | "SD" | "SMP" | "SMA" | "Kuliah" | "Lulus"; status: "Sedang" | "Lulus"; utbkScore?: number; kip: boolean; }
export interface Relationship { id: string; name: string; role: "Ayah" | "Ibu" | "Pacar" | "Pasangan" | "Anak" | "Teman" | "Mantan"; age: number; closeness: number; description: string; }
export interface EventEffect { bahagia?: number; sehat?: number; pintar?: number; tampang?: number; ordal?: number; kas?: number; relationDelta?: number; }
export interface EventChoice { id: string; label: string; outcomeText: string; effect: EventEffect; }
export interface GameEvent { id: string; title: string; description: string; minAge: number; maxAge: number; requiresMarried?: boolean; maxCash?: number; tags?: string[]; choices: EventChoice[]; }
export interface PendingEvent { event: GameEvent; age: number; }
export interface OriginMode { id: string; label: string; difficulty: Difficulty; description: string; startingAge: number; startingMoney: number; familyBackground?: string; }
export interface BirthFormData { modeId: string; gender: Gender; firstName: string; lastName: string; city: string; fatherName?: string; motherName?: string; }
export interface CharacterProfile { trait: string; familyBackground: string; modeLabel: string; difficulty: Difficulty; generation: number; seed: string; }
export interface GameSave {
  version: 3; status: LifeStatus; identity: PlayerIdentity; stats: PlayerStats; money: number; currentYear: number; profile: CharacterProfile; lifeLog: LifeLogEntry[];
  quota: AnnualQuota; relationships: Relationship[]; education: Education; job?: Job; pendingEvent?: PendingEvent; legalRecord: number; hasBirthControl: boolean; isMarried: boolean; fame: number; recentEventIds: string[]; updatedAt: string;
}
export type GameState = GameSave;
export interface PastLifeRecord { id: string; name: string; generation: number; finalTitle: string; ageAtDeath: number; city: string; summary: string; completedAt: string; }
