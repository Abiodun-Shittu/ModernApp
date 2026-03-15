import { FaArrowUp } from 'react-icons/fa';
import { Button } from '../ui/button';
import { useForm } from 'react-hook-form';

export type ChatFormData = {
   prompt: string;
};

type Props = {
   onSubmit: (data: ChatFormData) => void;
};

const ChatInput = ({ onSubmit }: Props) => {
   const { register, handleSubmit, reset, formState } = useForm<ChatFormData>();

   const submit = handleSubmit((data) => {
      reset({ prompt: '' });
      onSubmit(data);
   });

   const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         submit();
      }
   };
   return (
      <form
         onSubmit={submit}
         onKeyDown={handleKeyDown}
         className="flex flex-col gap-2 items-end border-2 p-4 rounded-lg"
      >
         <textarea
            autoFocus
            className="w-full border-0 focus:outline-0 resize-none"
            placeholder="Ask anything..."
            maxLength={1000}
            {...register('prompt', {
               required: true,
               validate: (value) => value.trim().length > 0,
            })}
         />
         <Button
            disabled={!formState.isValid}
            type="submit"
            className="rounded-full w-9 h-9"
         >
            <FaArrowUp />
         </Button>
      </form>
   );
};

export default ChatInput;
