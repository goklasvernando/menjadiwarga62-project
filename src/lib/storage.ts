import type { GameSave, PastLifeRecord } from "@/types/game";

export const ACTIVE_GAME_KEY = "menjadi-warga-62:activeGame";
export const HALL_OF_FAME_KEY = "menjadi-warga-62:hallOfFame";

function isGameSave(value: unknown): value is GameSave {
  if (!value || typeof value !== "object") return false;

  const save = value as Partial<GameSave>;
  return (
    save.version === 3 &&
    (save.status === "alive" || save.status === "deceased") &&
    typeof save.identity?.name === "string" &&
    typeof save.identity?.age === "number" &&
    typeof save.identity?.city === "string" &&
    Array.isArray(save.lifeLog) &&
    Array.isArray(save.relationships)
  );
}

function isPastLifeRecord(value: unknown): value is PastLifeRecord {
  if (!value || typeof value !== "object") return false;

  const record = value as Partial<PastLifeRecord>;
  return (
    typeof record.id === "string" &&
    typeof record.name === "string" &&
    typeof record.generation === "number" &&
    typeof record.finalTitle === "string" &&
    typeof record.ageAtDeath === "number" &&
    typeof record.city === "string" &&
    typeof record.summary === "string" &&
    typeof record.completedAt === "string"
  );
}

export function getGameSave(): GameSave | null {
  if (typeof window === "undefined") return null;

  try {
    const storedValue = window.localStorage.getItem(ACTIVE_GAME_KEY);
    if (!storedValue) return null;

    const parsedValue: unknown = JSON.parse(storedValue);
    return isGameSave(parsedValue) ? parsedValue : null;
  } catch {
    return null;
  }
}

export function getActiveSave(): GameSave | null {
  const save = getGameSave();
  return save?.status === "alive" ? save : null;
}

export function saveGame(save: GameSave): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ACTIVE_GAME_KEY, JSON.stringify(save));
}

export function clearGameSave(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ACTIVE_GAME_KEY);
}

export function getHallOfFame(): PastLifeRecord[] {
  if (typeof window === "undefined") return [];

  try {
    const storedValue = window.localStorage.getItem(HALL_OF_FAME_KEY);
    if (!storedValue) return [];

    const parsedValue: unknown = JSON.parse(storedValue);
    return Array.isArray(parsedValue) ? parsedValue.filter(isPastLifeRecord) : [];
  } catch {
    return [];
  }
}

export function saveHallOfFame(records: PastLifeRecord[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(HALL_OF_FAME_KEY, JSON.stringify(records));
}
