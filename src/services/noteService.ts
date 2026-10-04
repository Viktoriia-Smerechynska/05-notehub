import axios from "axios";
import type { Note } from "../types/note";

const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

const notehubApi = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    "Content-Type": "application/json",
  },
});

export interface FetchNotesResponse {
  notes: Note[];
  page: number;
  totalPages: number; // Потрібно для перевірки умови рендеру пагінації
  totalNotes: number;
}

export interface CreateNoteData {
  title: string;
  body: string;
  tags?: string[];
}

/**
 * Оновлена функція завантаження нотаток з підтримкою page та perPage відповідно до ТЗ
 */
export const fetchNotes = async (
  page: number = 1,
  search: string = "",
): Promise<FetchNotesResponse> => {
  const response = await notehubApi.get<FetchNotesResponse>("/notes", {
    params: {
      page,
      perPage: 12, // Сувора вимога ТЗ: передавати параметр perPage (наприклад, 12 нотаток на сторінку)
      search,
    },
  });
  return response.data;
};

export const createNote = async (noteData: CreateNoteData): Promise<Note> => {
  const response = await notehubApi.post<Note>("/notes", noteData);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await notehubApi.delete<Note>(`/notes/${id}`);
  return response.data;
};
