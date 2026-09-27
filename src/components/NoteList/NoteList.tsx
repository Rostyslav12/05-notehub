import type { Note } from "../../types/note";
import css from "./NoteList.module.css";

interface NoteListProps {
  notes: Note[];
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export default function NoteList({
  notes,
  onDelete,
  isDeleting,
}: NoteListProps) {
  if (notes.length === 0) {
    return null;
  }

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li className={css.listItem} key={note.id}>
          <h2 className={css.title}>{note.title}</h2>

          <p className={css.content}>{note.content}</p>

          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>

            <button
              className={css.button}
              type="button"
              onClick={() => onDelete(note.id)}
              disabled={isDeleting}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}