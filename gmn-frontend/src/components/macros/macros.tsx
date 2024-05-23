"use client"

import { getMacrosFromUserID, updateMacroEntriesFromMacroID } from "@/api/macros/macros.api"
import { EntriesDTO, MacrosDTO } from "@/api/macros/macros.dto"
import { UserDTO } from "@/api/user/user.dto"
import { BaseSyntheticEvent, useEffect, useState } from "react"
import style from "./macros.module.scss";
import Image from "next/image"
import EditButton from "../edit-button/edit-button"
import { convertObjectFoodEntriesToStringEntries, convertStringFoodEntriesToObjectEntries } from "@/api/macros/macros.utils"

const Entry = (props: {
  entry: EntriesDTO
  index: number,
  update_entry: Function,
  remove_entry: Function
}) => {
  const [edit_mode, setEditMode] = useState<boolean>(false);
  const [name, setName] = useState<string>(props.entry.name || "Entry #" + (props.index + 1));
  const [cals, setCals] = useState<number>(props.entry.calories);
  const [pro, setPro] = useState<number>(props.entry.protein);
  const [fats, setFats] = useState<number>(props.entry.fats);
  const [carbs, setCarbs] = useState<number>(props.entry.carbs);

  const toggleEditMode = async (e: BaseSyntheticEvent) => {
    e.preventDefault();
    if (edit_mode) {
      props.update_entry(props.index, name, cals, pro, fats, carbs);
    }
    setEditMode(!edit_mode);
  }

  return (
    <div className="subject" style={{ "position": "relative" }}>
      {edit_mode ? (
        <>
          <input type="text" placeholder="Name" defaultValue={name} onChange={(e: BaseSyntheticEvent) => setName(e.target.value)} />
          <input type="number" placeholder="Calories (kcal)" defaultValue={cals} onChange={(e: BaseSyntheticEvent) => setCals(e.target.value)} />
          <input type="number" placeholder="Protein (g)" defaultValue={pro} onChange={(e: BaseSyntheticEvent) => setPro(e.target.value)} />
          <input type="number" placeholder="Fats (g)" defaultValue={fats} onChange={(e: BaseSyntheticEvent) => setFats(e.target.value)} />
          <input type="number" placeholder="Carbs (g)" defaultValue={carbs} onChange={(e: BaseSyntheticEvent) => setCarbs(e.target.value)} />
          <section style={{ "display": "flex", "justifyContent": "space-between" }}>
            <button onClick={(e) => props.remove_entry(e)}>Remove</button>
          </section>
        </>
      ) : (
        <>
          <span>{name}</span>
          <span>Calories: {cals}kcal</span>
          <span>Protein: {pro}g</span>
          <span>Carbs: {carbs}g</span>
          <span>Fats: {fats}g</span>
        </>
      )}

      <div className={style.edit}>
        <EditButton on_click={toggleEditMode} />
      </div>
    </div>
  )
}

const FoodEntries = (props: {
  user: UserDTO,
  macros: MacrosDTO,
  add_new_entry: Function
}) => {
  const [raw_entries, setRawEntries] = useState<string[]>(props.macros.entries || []);
  const [entries, setEntries] = useState<EntriesDTO[]>([]);

  const addTempEntry = (e: BaseSyntheticEvent) => {
    e.preventDefault();
    setEntries((old) => [...old, {
      name: "",
      calories: 0,
      protein: 0,
      fats: 0,
      carbs: 0
    }]);
  }

  useEffect(() => {
    setEntries(convertStringFoodEntriesToObjectEntries(raw_entries));
  }, [raw_entries]);

  const updateEntries = async (index: number, name: string, cals: number, pro: number, fats: number, carbs: number) => {
    if (entries[index] === undefined || entries[index] === null) return;

    entries[index].calories = cals;
    entries[index].carbs = carbs;
    entries[index].fats = fats;
    entries[index].protein = pro;
    entries[index].name = name;
    setEntries(entries);
    const u = await updateMacroEntriesFromMacroID(props.macros.id, convertObjectFoodEntriesToStringEntries(entries));
    props.add_new_entry(entries);
  }

  return (
    <div className={style.entries_container}>
      <button onClick={addTempEntry} className={style.add}>
        <Image
          src="/icons/add.svg"
          alt="Add"
          sizes="100%"
          width={0}
          height={0}
        />
        <span>Add Item</span>
      </button>
      <div className={style.entries}>
        {entries.map((entry, index) => {
          return (
            <Entry index={index} update_entry={updateEntries} remove_entry={(e: BaseSyntheticEvent) => { e.preventDefault() }} entry={entry} key={index} />
          );
        })}
      </div>
    </div>
  );
}

const Macros = (props: {
  user: UserDTO
}) => {
  const [today_macros, setTodayMacros] = useState<MacrosDTO | null>(null);
  const [calories, setCalories] = useState<number>(0);
  const [fats, setFats] = useState<number>(0);
  const [protein, setProtein] = useState<number>(0);
  const [carbs, setCarbs] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const macro = await getMacrosFromUserID(props.user.id);
      setTodayMacros(macro);
      if (macro !== null) {
        setCalories(macro.calories);
        setFats(macro.fats);
        setProtein(macro.protein);
        setCarbs(macro.carbs);
      }

      setLoading(false);
    })();
  }, [props.user.id]);

  const addedNewFoodEntry = (entries: EntriesDTO[]) => {
    if (today_macros === null) return;

    let cals = 0;
    let carbs = 0;
    let protein = 0;
    let fats = 0;

    for (let i = 0; i < entries.length; i++) {
      cals += Number.parseInt(entries[i].calories.toString());
      carbs += Number.parseInt(entries[i].carbs.toString());
      protein += Number.parseInt(entries[i].protein.toString());
      fats += Number.parseInt(entries[i].fats.toString());
    }

    setCalories(cals);
    setCarbs(carbs);
    setProtein(protein);
    setFats(fats);
  }

  return (
    <>
      <h2>Macros</h2>
      {loading ? (
        <span>Loading...</span>
      ) : (
        <>
          {today_macros === null ? (
            <span>Failed to get macros data. This is most likely an issue on our end and not yours.</span>
          ) : (
            <>
              <span>Calories: {calories}kcal</span>
              <span>Protein: {protein}g</span>
              <span>Carbs: {carbs}g</span>
              <span>Fats: {fats}g</span>
              <FoodEntries add_new_entry={addedNewFoodEntry} macros={today_macros} user={props.user} />
            </>
          )}
        </>
      )}
    </>
  );
}

export default Macros;