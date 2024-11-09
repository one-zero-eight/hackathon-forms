interface DateQuestionProps {
  question: string;
  onChange: (value: string) => void;
  value?: string;
}

export function DateQuestion({ question, onChange, value }: DateQuestionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{question}</h3>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-gray-300 px-3 py-2"
      />
    </div>
  )
} 