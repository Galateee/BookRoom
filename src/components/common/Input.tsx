import './Input.css';

interface InputProps {
  label: string;
  type?: string;
  value: string | number;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  min?: string | number;
  max?: string | number;
}

export function Input({
  label,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required = false,
  disabled = false,
  min,
  max,
}: InputProps) {
  return (
    <div className="input-field">
      <label className="input-field__label">
        {label}
        {required && <span className="input-field__required">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        min={min}
        max={max}
        className={`input-field__input ${error ? 'input-field__input--error' : ''}`}
      />
      {error && <span className="input-field__error">{error}</span>}
    </div>
  );
}
