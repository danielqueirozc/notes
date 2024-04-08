import { ChangeEvent, FormEvent, useState } from 'react';

import * as Dialog from '@radix-ui/react-dialog';

import { X } from 'lucide-react';

import { toast } from 'sonner';

interface NewNoteCardProps {
    onNoteCreated: (content: string) => void; 
}

let speechRecognition: SpeechRecognition | null;

export function NewNoteCard({ onNoteCreated }: NewNoteCardProps) {
    const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true);
    const [content, setContent] = useState('');
    const [isRecording, setIsRecording] = useState(false);

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

        if (content === '') {
            return;
        }

        // return = vai bloquear o restante do codigo, portando o usuario nao podera fazer uma nota sem passar ao menos 1 caractere 

        onNoteCreated(content);

        setContent('');

        setShouldShowOnboarding(true);

        toast.success('Nota criada com sucesso!')
    }

    function handleStartRecording() {
        const isSpeechRecognitionAPIAvailable = 'SpeechRecognition' in window ||'webkitSpeechRecognition' in window;

        // quando for uma variavel do tipo boolean escrever como se fosse uma porgunta

        if (!isSpeechRecognitionAPIAvailable) {
            alert('Infelizmente o seu navegador nao suporta a API de gravacao');

            return;
        }

        setIsRecording(true);
        setShouldShowOnboarding(false);

        const speechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition
        
        speechRecognition = new speechRecognitionAPI();

        speechRecognition.lang ='pt-BR'; // linguagem
        speechRecognition.continuous = true; // se eu parar de falar a api so vai parar de gravar quando eu clicar para parar, se estiver com false quando eu paro de falar a api tambem para de gravar
        speechRecognition.maxAlternatives = 1; // quando a api nao entende oque eu falo ela vai assumir 1 sugestao do que eu falei ou seja, a api vai tentar gravar 1 palavra semelhante a que eu falei
        speechRecognition.interimResults = true; // faz com que a api va trazendo os resultados quando eu ainda estou falando ao inves de so trazer os resultados quando eu terminar de falar

        speechRecognition.onresult = (event) => {
            const transcription = Array.from(event.results).reduce((text, result) => {
            // esse metodo array.from permite converter qualquer tipo de iterator para array
                return text.concat(result[0].transcript);
            }, '')

            setContent(transcription);
        }

        speechRecognition.onerror = (event) => {
            console.error(event);
        }

        speechRecognition.start();
    }

    function handleStopRecording() {
        setIsRecording(false);

        if (speechRecognition !== null) {
            speechRecognition.stop();
        }
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
                <Dialog.Overlay className='inset-0 fixed bg-black/50' />
                
                <Dialog.Content className='inset-0 md:inset-auto md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md outline-none overflow-hidden flex flex-col fixed md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2'>
                    <Dialog.Close className='absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100'>
                        <X className='size-5' />
                    </Dialog.Close>

                    <form  className='flex-1 flex flex-col'>
                        <div className='flex flex-1 flex-col gap-3 p-5'>
                        <span className='text-sm font-medium text-slate-300'>
                            Adicionar nota
                        </span>
                        {shouldShowOnboarding ? ( 
                            <p className='text-sm leading-6 text-slate-400'>
                                Comece <button type='button' onClick={handleStartRecording} className='font-medium text-lime-400 hover:underline'>gravando uma nota</button> em áudio ou se preferir <button type='button' onClick={handleStartEditor} className='font-medium text-lime-400 hover:underline'>utilize apenas texto</button>.
                            </p>
                        ): (
                            <textarea 
                                autoFocus
                                className='text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none'
                                onChange={handleContentChanged}
                                value={content}
                            />
                        )}
                        </div>

                        {isRecording ? (
                            <button
                                onClick={handleStopRecording}                            
                                type='submit'
                                className='w-full flex items-center justify-center gap-2 bg-slate-900 py-4 text-center text-sm text-slate-300 font-medium outline-none hover:text-slate-100'            
                            >
                                <div className='size-3 rounded-full bg-red-500 animate-pulse' />
                                Gravando! (Clique p/ interromper)
                            </button>
                        ) : (
                            <button
                                onClick={handleSaveNote} 
                                type='button'
                                className='w-full bg-lime-400 py-4 text-center text-sm text-lime-950 font-medium outline-none hover:bg-lime-500'            
                            >
                                Salvar notas
                             </button>
                        )}

                        {/* <button 
                            type='submit'
                            className='w-full bg-lime-400 py-4 text-center text-sm text-lime-950 font-medium outline-none hover:bg-lime-500'            
                        >
                            Salvar notas
                        </button> */}
                    </form>
                </Dialog.Content> 
            </Dialog.Portal>
        </Dialog.Root>
    );
}