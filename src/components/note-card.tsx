import * as Dialog from '@radix-ui/react-dialog';

import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { X } from 'lucide-react';

interface DateCardProps {
  note: {
    id: string;
    date: Date;
    content: string;
  },
  onNoteDeleted: (id: string) => void;
}

export function NoteCard({ note, onNoteDeleted }: DateCardProps) {
  function deletedNote() {
    return onNoteDeleted(note.id);
  }

    return (
       <Dialog.Root>
         <Dialog.DialogTrigger className='rounded-md bg-slate-800 text-left flex flex-col gap-3 p-5 overflow-hidden relative outline-none focus-visible:ring-2 focus-visible:ring-lime-400 hover:ring-2 hover:ring-slate-600 cursor-pointer'>
          <span className='text-sm font-medium text-slate-300'>
            {formatDistanceToNow(note.date, {locale: ptBR, addSuffix: true})}
          </span>
          <p className='text-sm leading-6 text-slate-400'>
            {note.content}
          </p>

          <div className='absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-black/0 pointer-events-none' />
        </Dialog.DialogTrigger>

        <Dialog.Portal>
          <Dialog.DialogOverlay className='inset-0 fixed bg-black/50' />
          <Dialog.Content className='inset-0 md:inset-auto md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md outline-none overflow-hidden flex flex-col fixed md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2'>
            <Dialog.Close className='absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100'>
              <X className='size-5' />
            </Dialog.Close>

            <div className='flex flex-1 flex-col gap-3 p-5'>
              <span className='text-sm font-medium text-slate-300'>
                {formatDistanceToNow(note.date, {locale: ptBR, addSuffix: true})}
              </span>
              <p className='text-sm leading-6 text-slate-400'>
                {note.content}
              </p>
            </div>

            <button
              onClick={deletedNote} 
              type='button'
              className='w-full bg-slate-800 py-4 text-center text-sm text-slate-300 font-medium outline-none group'            
            >
              Deseja <span className='text-red-400 group-hover:underline'>apagar essa nota</span>?
            </button>
          </Dialog.Content> 
        </Dialog.Portal>
       </Dialog.Root>
    );
} 

// usar o o dialog trigger no elemento em que eu for clicar para abrir o modal
// dialog content e o que vai aparecer quando eu clicar no modal
// dialog portal "teleporta o conteudo de dentro dele para a raiz da aplicacao", para que e conteudo fique por cima dos outros e ocupe a tela inteira
// dialog overlay e a tela escura que aparece e da a impressao de que o conteudo esta por cima de tudo e da tela toda

// flex-1 "quer dizer que o elemento vai ocupar todo o espaco disponivel porem se outro elemento precisar de espaco ele reduz um pouco"

// diferenca entre vh e %, vh e relacionado ao tamanho da tela ja o % e relacionado com o elemento pai