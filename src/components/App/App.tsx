import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import {
  keepPreviousData,
  useQuery,
} from "@tanstack/react-query";

import { fetchNotes } from "../../services/noteService";

import SearchBox from "../SearchBox/SearchBox";
import NoteList from "../NoteList/NoteList";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import Pagination from "../Pagination/Pagination";

import css from "./App.module.css";

const PER_PAGE = 12;

export default function App() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["notes", page, search],

    queryFn: () =>
      fetchNotes({
        page,
        perPage: PER_PAGE,
        search,
      }),

    placeholderData: keepPreviousData,
  });

  const handleSearch = useDebouncedCallback(
    (value: string) => {
      setSearch(value);
      setPage(1);
    },
    500,
  );

  const handleSearchChange = (value: string) => {
    setInputValue(value);
    handleSearch(value);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox
          value={inputValue}
          onChange={handleSearchChange}
        />

        <Pagination
          pageCount={totalPages}
          currentPage={page}
          onPageChange={handlePageChange}
        />

        <button
          className={css.button}
          type="button"
          onClick={() => setIsModalOpen(true)}
        >
          Create note +
        </button>
      </header>

      <main>
        {isLoading && (
          <p className={css.message}>
            Loading notes...
          </p>
        )}

        {isError && (
          <p className={css.error}>
            Error:{" "}
            {error instanceof Error
              ? error.message
              : "Something went wrong"}
          </p>
        )}

        {!isLoading && !isError && (
          <NoteList notes={notes} />
        )}
      </main>

      {isModalOpen && (
        <Modal
          onClose={() => setIsModalOpen(false)}
        >
          <NoteForm
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}