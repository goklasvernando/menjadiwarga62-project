import { cities } from "@/data/game-data";
import { pickContextualEvent } from "@/lib/eventSelector";
import type { EventChoice, GameSave, PlayerStats, StatKey } from "@/types/game";

const clamp = (value: number) => Math.min(100, Math.max(0, value));
const applyStats = (stats: PlayerStats, effect: Partial<PlayerStats>): PlayerStats => ({
  happiness: clamp(stats.happiness + (effect.happiness ?? 0)),
  health: clamp(stats.health + (effect.health ?? 0)),
  intelligence: clamp(stats.intelligence + (effect.intelligence ?? 0)),
  appearance: clamp(stats.appearance + (effect.appearance ?? 0)),
  connection: clamp(stats.connection + (effect.connection ?? 0)),
});
export const getCity = (name: string) => cities.find((city) => city.name === name) ?? cities[0];
export const formatRupiah = (value: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);

export function resolveEvent(save: GameSave, choice: EventChoice): GameSave {
  const effect = choice.effect;
  const nextStats = applyStats(save.stats, { happiness: effect.bahagia, health: effect.sehat, intelligence: effect.pintar, appearance: effect.tampang, connection: effect.ordal });
  const closeEffect = effect.relationDelta ?? 0;
  const relationships = closeEffect ? save.relationships.map((relationship, index) => index === 0 ? { ...relationship, closeness: clamp(relationship.closeness + closeEffect) } : relationship) : save.relationships;
  const eventId = save.pendingEvent?.event.id;
  const recentEventIds = eventId ? [...save.recentEventIds, eventId].slice(-5) : save.recentEventIds;
  return { ...save, stats: nextStats, money: save.money + (effect.kas ?? 0), relationships, recentEventIds, pendingEvent: undefined, lifeLog: [...save.lifeLog, { year: save.currentYear, text: choice.outcomeText }], updatedAt: new Date().toISOString() };
}

export function advanceYear(save: GameSave): GameSave {
  const city = getCity(save.identity.city); const nextAge = save.identity.age + 1; const nextYear = save.currentYear + 1;
  const income = save.job ? save.job.monthlySalary * 12 : 0; const living = nextAge >= 18 ? city.livingCost * 12 : 0; const tax = income > 54_000_000 ? Math.round((income - 54_000_000) * 0.05) : 0;
  const balance = save.money + income - living - tax - (save.hasBirthControl ? 600_000 : 0);
  const debtPenalty = balance < 0 ? { happiness: -8, health: -5 } : {};
  const agePenalty = nextAge >= 75 ? { health: -4 } : {};
  const stats = applyStats(applyStats(save.stats, debtPenalty), agePenalty);
  const died = stats.health === 0 || nextAge >= 95;
  const cashText = `Arus kas: ${formatRupiah(income)} pemasukan − ${formatRupiah(living + tax)} pengeluaran.`;
  const advanced: GameSave = { ...save, status: died ? "deceased" : "alive", identity: { ...save.identity, age: nextAge }, currentYear: nextYear, money: balance, stats, pendingEvent: undefined, quota: { upgrades: 3, applications: 3, relationActions: {} }, lifeLog: [...save.lifeLog, { year: nextYear, text: died ? "Perjalanan hidupmu telah sampai di ujungnya." : cashText }], updatedAt: new Date().toISOString() };
  const event = died ? null : pickContextualEvent(advanced);
  return { ...advanced, pendingEvent: event ? { event, age: nextAge } : undefined };
}

export function useUpgrade(save: GameSave, stat: StatKey, cost: number, effect: number): GameSave | null {
  if (save.quota.upgrades <= 0 || save.money < cost || save.identity.age < 6) return null;
  return { ...save, money: save.money - cost, stats: applyStats(save.stats, { [stat]: effect }), quota: { ...save.quota, upgrades: save.quota.upgrades - 1 }, lifeLog: [...save.lifeLog, { year: save.currentYear, text: `Kamu meningkatkan ${stat} melalui aktivitas pengembangan diri.` }], updatedAt: new Date().toISOString() };
}
