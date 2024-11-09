import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SelectQuestionProps {
  question: string;
  options: string[];
  onChange: (value: string) => void;
  value?: string;
}

export function SelectQuestion({ question, options, onChange, value }: SelectQuestionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{question}</h3>
      <Select onValueChange={onChange} value={value}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
} 