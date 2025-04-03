import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

type FieldProps = {
  label: string;
  isTextArea?: boolean;
} & (
  | InputHTMLAttributes<HTMLInputElement>
  | TextareaHTMLAttributes<HTMLTextAreaElement>
);

export default function TextField({
  label,
  isTextArea = false,
  ...props
}: FieldProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-[#333]">
        {label}
        {props.required && "*"}
      </label>
      {isTextArea ? (
        <textarea
          {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFB71B] focus:border-[#7A0019]"
        />
      ) : (
        <input
          {...(props as InputHTMLAttributes<HTMLInputElement>)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFB71B] focus:border-[#7A0019]"
        />
      )}
    </div>
  );
}
