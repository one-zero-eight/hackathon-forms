interface LikertQuestionProps {
  question: string;
  onChange: (value: number) => void;
  value?: number;
}

export function LikertQuestion({ question, onChange, value }: LikertQuestionProps) {
  const options = [
    { value: 1, label: 'Strongly Disagree' },
    { value: 2, label: 'Disagree' },
    { value: 3, label: 'Neutral' },
    { value: 4, label: 'Agree' },
    { value: 5, label: 'Strongly Agree' },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{question}</h3>
      <div className="flex justify-between">
        {options.map((option) => (
          <label key={option.value} className="flex flex-col items-center space-y-2">
            <input
              type="radio"
              name={question}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="h-4 w-4"
            />
            <span className="text-sm text-center">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  )
} 