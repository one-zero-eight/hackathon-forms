interface MultipleChoiceQuestionProps {
  question: string;
  options: string[];
  onChange: (values: string[]) => void;
  value?: string[];
}

export function MultipleChoiceQuestion({ question, options, onChange, value = [] }: MultipleChoiceQuestionProps) {
  const toggleOption = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter((v) => v !== option));
    } else {
      onChange([...value, option]);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{question}</h3>
      <div className="space-y-2">
        {options.map((option) => (
          <label key={option} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={value.includes(option)}
              onChange={() => toggleOption(option)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </div>
  )
} 