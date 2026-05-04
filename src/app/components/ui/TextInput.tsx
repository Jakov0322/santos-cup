type TextInputProps = {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  error?: string;
};

export function TextInput({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  error,
}: TextInputProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-[#062B55]">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        className={`w-full rounded-2xl border bg-white px-4 py-4 outline-none transition ${
          error
            ? "border-red-500"
            : "border-slate-200 focus:border-[#00C8E8]"
        }`}
      />

      {error ? (
        <p className="mt-2 text-sm font-semibold text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}