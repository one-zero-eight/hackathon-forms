import { ChoicesWrapper } from "@/components/forms/edit/ChoicesWrapper";
import { useEditableForm } from "@/components/forms/edit/EditableFormContext";
import { Label } from "@/components/ui/label";
import { apiTypes } from "@/lib/api";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

export function RankingQuestion({
  node,
  question,
}: {
  node: apiTypes.SchemaFormNodeOutput;
  question: apiTypes.SchemaRanking;
}) {
  const { updateNodeQuestion } = useEditableForm();

  const rankingSensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  return (
    <ChoicesWrapper node={node} questionOptions={question.options ?? []}>
      <Label className="text-muted-foreground">
        Correct order (drag to reorder):
      </Label>
      <div className="mt-2 space-y-2">
        <DndContext
          sensors={rankingSensors}
          collisionDetection={closestCenter}
          onDragEnd={(event) => {
            const { active, over } = event;
            if (!over || active.id === over.id) return;

            const oldIndex = question.options?.findIndex(
              (opt) => opt === active.id,
            );
            const newIndex = question.options?.findIndex(
              (opt) => opt === over.id,
            );

            if (
              oldIndex === undefined ||
              newIndex === undefined ||
              !question.options
            )
              return;

            const newOptions = arrayMove(question.options, oldIndex, newIndex);
            updateNodeQuestion(node.id, {
              correct_answer: newOptions,
            });
          }}
        >
          <SortableContext
            items={question.options || []}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {question.options?.map((option, index) => (
                <SortableRankingAnswer
                  key={index}
                  item={option}
                  index={index}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </ChoicesWrapper>
  );
}

function SortableRankingAnswer({
  item,
  index,
}: {
  item: string;
  index: number;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 rounded bg-secondary/50 p-2 ${
        isDragging ? "ring-2 ring-primary/20" : ""
      }`}
    >
      <button className="cursor-move touch-none" {...attributes} {...listeners}>
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </button>
      <span className="text-sm font-medium">{index + 1}.</span>
      <span className="text-sm">{item}</span>
    </div>
  );
}
