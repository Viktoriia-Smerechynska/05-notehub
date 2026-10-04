import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

import { useDebouncedCallback } from "use-debounce";
import css from "./App.module.css";
import { fetchNotes } from "../../services/noteService";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import SearchBox from "../SearchBox/SearchBox";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

const App = () => {
  const [page, setPage] = useState<number>(1);
  const [inputValue, setInputValue] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearchQuery(value);
    setPage(1);
  }, 500);

  const handleSearchChange = (value: string) => {
    setInputValue(value);
    debouncedSearch(value);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", page, searchQuery],
    queryFn: () => fetchNotes(page, searchQuery),
    placeholderData: keepPreviousData,
  });

  const handlePageChange = (selectedItem: { selected: number }): void => {
    setPage(selectedItem.selected + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const notes = data?.notes || [];
  const totalPages = data?.totalPages || 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={inputValue} onChange={handleSearchChange} />

        {!isLoading && !isError && totalPages > 1 && (
          <Pagination
            pageCount={totalPages}
            forcePage={page - 1}
            onPageChange={handlePageChange}
          />
        )}

        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      <main className={css.content}>
        {isLoading && <Loader />}

        {isError && !isLoading && <ErrorMessage />}

        {}
        {!isLoading && !isError && notes.length > 0 && (
          <NoteList notes={notes} />
        )}

        {!isLoading && !isError && notes.length === 0 && searchQuery && (
          <p
            style={{
              color: "#aaa",
              textAlign: "center",
              fontSize: "16px",
              marginTop: "40px",
            }}
          >
            No notes found matching your search.
          </p>
        )}
      </main>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onCancel={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
};

export default App;
