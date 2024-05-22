import { EntriesDTO } from "./macros.dto";

export const convertObjectFoodEntriesToStringEntries = (entries: EntriesDTO[]): string[] => {
  const final_array: string[] = [];
  for (let i = 0; i < entries.length; i++) {
    final_array.push(JSON.stringify(entries[i]));
  }
  return final_array;
}

export const convertStringFoodEntriesToObjectEntries = (entries: string[]): EntriesDTO[] => {
  const final_array: EntriesDTO[] = [];
  for (let i = 0; i < entries.length; i++) {
    final_array.push(JSON.parse(entries[i]));
  }
  return final_array;
}