import axios from "axios";
import type { Note, NoteTag } from "../types/note";

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
  totalPages: number;
  totalNotes: number;
}

// ВИПРАВЛЕНО: Інтерфейс суворо використовує title, content та tag (без body та tags) за вимогою ментора
export interface CreateNoteData {
  title: string;
  content: string; // Нове поле відповідно до API
  tag: NoteTag; // Нове поле в однині відповідно до API
}

export const fetchNotes = async (
  page: number = 1,
  search: string = "",
): Promise<FetchNotesResponse> => {
  const response = await notehubApi.get<FetchNotesResponse>("/notes", {
    params: {
      page,
      perPage: 12,
      search,
    },
  });
  return response.data;
};

// ВИПРАВЛЕНО: Функція тепер приймає та відправляє на бекенд тільки чисті очікувані дані
export const createNote = async (noteData: CreateNoteData): Promise<Note> => {
  const response = await notehubApi.post<Note>("/notes", noteData);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await notehubApi.delete<Note>(`/notes/${id}`);
  return response.data;
};
