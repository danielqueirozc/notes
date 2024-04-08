import { ChangeEvent, useState } from 'react';
import logo from './assets/Logo.svg';
import { NewNoteCard } from './components/new-note-card';
import { NoteCard } from './components/note-card';
 
interface note {
  id: string;
  date: Date;
  content: string;
}

export function App() {
  const [notes, setNotes] = useState<note[]>(() => {
    const noteOnStorage = localStorage.getItem('notes');
    
    if (noteOnStorage) {
      return JSON.parse(noteOnStorage);
    }

    return [];
  });

  const [search, setSearch] = useState('');

  function onNoteCreated(content: string) {
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content,
    }

    const notesArray = [newNote, ...notes]

    setNotes(notesArray);

    localStorage.setItem('notes', JSON.stringify(notesArray));
  }

  // JSON = JavaScript object notation = representacao em string de qualquer valor primitivo do JavaScript
  // parse e o caminho contrario do stringfy, entao ele vai voltar a ser um array

  // Math.random = geracao de ids mas pode ser que ele gere dois ids iguais


  function onNoteDeleted(id: string) {
    const notesArray = notes.filter(note => {
      return note.id !== id;
    })

    setNotes(notesArray);

    localStorage.setItem('notes', JSON.stringify(notesArray));
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value;

    setSearch(query);
  }

  const filteredNotes = search !== ''
  ? notes.filter(note => note.content.includes(search))
  : notes;

  return (
    <div className="max-w-6xl mx-auto my-12 space-y-6 px-5">
      <img src={logo} alt="logo nlw expert" />

      <form className='w-full'>
        <input 
          type="text" 
          placeholder='Busque em suas notas...'
          className='w-full bg-transparent text-3xl font-semibold tracking-tigh outline-none placeholder:text-slate-500'
          onChange={handleSearch}
        />
      </form>

      <div className='h-px bg-slate-700' />

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]'>
        <NewNoteCard onNoteCreated={onNoteCreated}  />
        {filteredNotes.map(note => <NoteCard key={note.id} note={note} onNoteDeleted={onNoteDeleted} />)}
      </div>
    </div>
  )
}
 
