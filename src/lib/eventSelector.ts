import { contextualEvents } from "@/data/events";
import type { GameEvent, GameState } from "@/types/game";

const interpolate = (text: string, state: GameState) => text
  .replaceAll("{nama}", state.identity.name)
  .replaceAll("{ayahName}", state.identity.parents?.father ?? "Ayah")
  .replaceAll("{ibuName}", state.identity.parents?.mother ?? "Ibu")
  .replaceAll("{kota}", state.identity.city);

function interpolateEvent(event: GameEvent, state: GameState): GameEvent {
  return {
    ...event,
    title: interpolate(event.title, state),
    description: interpolate(event.description, state),
    choices: event.choices.map((choice) => ({ ...choice, label: interpolate(choice.label, state), outcomeText: interpolate(choice.outcomeText, state) })),
  };
}

export function pickContextualEvent(state: GameState): GameEvent | null {
  const candidates = contextualEvents.filter((event) =>
    state.identity.age >= event.minAge &&
    state.identity.age <= event.maxAge &&
    (!event.requiresMarried || state.isMarried) &&
    (event.maxCash === undefined || state.money <= event.maxCash) &&
    !state.recentEventIds.includes(event.id),
  );
  if (candidates.length === 0) return null;
  return interpolateEvent(candidates[Math.floor(Math.random() * candidates.length)], state);
}
