import * as Dialog from '@radix-ui/react-dialog';

import { X } from 'lucide-react';
import { ChangeEvent, FormEvent, useState } from 'react';

export function NewNoteCard() {
    const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true);
    const [content, setContent] = useState('');

    function handleStartEditor() {
        return setShouldShowOnboarding(false);
    }

    function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>) {
        setContent(event.target.value);

        if (event.target.value === '') {
            return setShouldShowOnboarding(true);
        }
    }
    
    // <> = generic

    function handleSaveNote(event: FormEvent) {
        event.preventDefault();

        console.log(content);
    }

    return (
        <Dialog.Root>
            <Dialog.Trigger className='flex flex-col gap-3 rounded-md bg-slate-700 text-left p-5 outline-none focus-visible:ring-2 focus-visible:ring-lime-400 hover:ring-2 hover:ring-slate-600 cursor-pointer'>
                <span className='text-sm font-medium text-slate-200'>
                    Adicionar nota
                </span>
                <p className='text-sm leading-6 text-slate-400'>
                    Grave uma nota em áudio que será convertida para texto automaticamente.
                </p>
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.DialogOverlay className='inset-0 fixed bg-black/50' />
                
                <Dialog.Content className='max-w-[640px] w-full h-[60vh] bg-slate-700 rounded-md outline-none overflow-hidden flex flex-col fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
                    <Dialog.Close className='absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100'>
                        <X className='size-5' />
                    </Dialog.Close>

                    <form onSubmit={handleSaveNote} className='flex-1 flex flex-col'>
                        <div className='flex flex-1 flex-col gap-3 p-5'>
                        <span className='text-sm font-medium text-slate-300'>
                            Adicionar nota
                        </span>
                        {shouldShowOnboarding ? (
                            <p className='text-sm leading-6 text-slate-400'>
                                Comece <button className='font-medium text-lime-400 hover:underline'>gravando uma nota</button> em áudio ou se preferir <button onClick={handleStartEditor} className='font-medium text-lime-400 hover:underline'>utilize apenas texto</button>.
                            </p>
                        ): (
                            <textarea 
                                autoFocus
                                className='text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none'
                                onChange={handleContentChanged}
                            />
                        )}
                        </div>

                        <button 
                        type='submit'
                        className='w-full bg-lime-400 py-4 text-center text-sm text-lime-950 font-medium outline-none hover:bg-lime-500'            
                        >
                        Salvar notas
                        </button>
                    </form>
                </Dialog.Content> 
            </Dialog.Portal>
        </Dialog.Root>
    );
}