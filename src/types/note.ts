export type NoteTag = string;

export interface Note {
  id: string;
  title: string;
  body: string;
  tags: NoteTag[];
  createdAt: string;
  updatedAt: string;
}
