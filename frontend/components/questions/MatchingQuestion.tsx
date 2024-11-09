import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface MatchingQuestionProps {
  question: string;
  items: { left: string; right: string }[];
  onChange: (matches: Record<string, string>) => void;
  value?: Record<string, string>;
}

export function MatchingQuestion({ question, items, onChange, value = {} }: MatchingQuestionProps) {
  const rightOptions = items.map(item => item.right);

  const handleMatch = (leftItem: string, rightItem: string) => {
    onChange({
      ...value,
      [leftItem]: rightItem
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{question}</h3>
      <div className="space-y-3">
        {items.map(({ left }) => (
          <div key={left} className="flex items-center space-x-4">
            <span className="w-1/3">{left}</span>
            <Select
              value={value[left]}
              onValueChange={(selected) => handleMatch(left, selected)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Match with..." />
              </SelectTrigger>
              <SelectContent>
                {rightOptions.map((right) => (
                  <SelectItem key={right} value={right}>
                    {right}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
    </div>
  )
} 