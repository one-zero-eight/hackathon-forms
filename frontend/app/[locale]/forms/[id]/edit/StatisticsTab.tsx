import { useEditableForm } from "@/components/forms/edit/EditableFormContext";
import { Card } from "@/components/ui/card";
import { $api, apiTypes } from "@/lib/api";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface StatsAnswers {
  [key: string | number]: number;
}

interface NodeStats {
  answers: StatsAnswers;
  total_answers: number;
}

interface Statistics {
  total_answers: number;
  total_questions: number;
  by_nodes: {
    [key: string]: NodeStats;
  };
}

export function StatisticsTab() {
  const t = useTranslations();
  const { editableForm } = useEditableForm();
  const [selectedNodeId, setSelectedNodeId] = useState<string>("");

  const { data: stats, isLoading } = $api.useQuery(
    "get",
    "/form/{form_id}/statistics/",
    {
      params: { path: { form_id: editableForm?.id ?? "" } },
    }
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!stats || !editableForm?.nodes) {
    return (
      <Card className="p-4 sm:p-6 md:p-8">
        <h2 className="mb-2 text-lg sm:text-xl font-semibold">
          {t("forms.statistics.noData")}
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          {t("forms.statistics.description")}
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
          {t("forms.edit.tabs.statistics")}
        </h1>
      </div>

      <Select 
        value={selectedNodeId} 
        onValueChange={setSelectedNodeId}
      >
        <SelectTrigger className="w-full max-w-md">
          <SelectValue placeholder={t("forms.statistics.selectQuestion")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">
            {t("forms.statistics.selectQuestion")}
          </SelectItem>
          {editableForm?.nodes?.map((node) => (
            <SelectItem key={node.id} value={String(node.id)}>
              {node.content.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="grid gap-4">
        {selectedNodeId ? (
          <QuestionStats
            node={editableForm?.nodes?.find((n) => String(n.id) === selectedNodeId)}
            stats={stats?.by_nodes?.[selectedNodeId]}
          />
        ) : (
          <Card className="p-4">
            <p className="text-muted-foreground">
              {t("forms.statistics.selectQuestionPrompt")}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}

interface QuestionStatsProps {
  node: apiTypes.SchemaFormNodeOutput | undefined;
  stats: NodeStats | undefined;
}

const QuestionStats = ({ node, stats }: QuestionStatsProps) => {
  const t = useTranslations();

  if (!node || !stats) {
    return (
      <Card className="p-4">
        <p className="text-muted-foreground">{t("forms.statistics.noData")}</p>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">{node.content.title}</h3>
      
      {node.question.question_type === "select" && (
        <ChoiceStats stats={stats} options={node.question.options} />
      )}
      {node.question.question_type === "multiple_choice" && (
        <ChoiceStats stats={stats} options={node.question.options} />
      )}
      {node.question.question_type === "scale" && (
        <ScaleStats stats={stats} scale={node.question.scale} />
      )}
    </Card>
  );
}

interface ChoiceStatsProps {
  stats: NodeStats;
  options: string[];
}

const ChoiceStats = ({ stats, options }: ChoiceStatsProps) => {
  return (
    <div className="space-y-2">
      {options.map((option, index) => {
        const count = stats.answers[option as keyof typeof stats.answers] || 0;
        const percentage = stats.total_answers ? (count / stats.total_answers) * 100 : 0;
        
        return (
          <div key={index} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>{option}</span>
              <span>{count} ({percentage.toFixed(1)}%)</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface ScaleStatsProps {
  stats: NodeStats;
  scale: string[];
}

const ScaleStats = ({ stats, scale }: ScaleStatsProps) => {
  return (
    <div className="space-y-2">
      {scale.map((option, index) => {
        const count = stats.answers[index as keyof typeof stats.answers] || 0;
        const percentage = stats.total_answers ? (count / stats.total_answers) * 100 : 0;
        
        return (
          <div key={index} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>{option}</span>
              <span>{`${count} (${percentage.toFixed(1)}%)`}</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
