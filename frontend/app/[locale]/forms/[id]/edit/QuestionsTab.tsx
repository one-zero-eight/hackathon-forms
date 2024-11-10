import { useEditableForm } from "@/components/forms/edit/EditableFormContext";
import { EditableNodeRenderer } from "@/components/forms/edit/EditableNodeRenderer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { apiTypes } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ArrowDown, ArrowUp, GripVertical } from "lucide-react";

export function QuestionsTab() {
  const { editableForm, moveNode, addNode } = useEditableForm();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !editableForm?.nodes) return;

    const newIndex = editableForm.nodes.findIndex(
      (node) => node.id === over.id,
    );
    if (newIndex === -1) return;

    moveNode(active.id, newIndex);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Questions</h1>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={editableForm?.nodes?.map((node) => node.id) || []}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {editableForm?.nodes?.map((node) => (
              <QuestionCard key={node.id} node={node} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <Button onClick={addNode} variant="outline" className="w-full">
        Добавить вопрос
      </Button>
    </div>
  );
}

function QuestionCard({ node }: { node: apiTypes.SchemaFormNodeOutput }) {
  const { editableForm, moveNode } = useEditableForm();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: node.id });

  const currentIndex =
    editableForm?.nodes?.findIndex((n) => n.id === node.id) ?? 0;

  return (
    <Card
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        position: "relative" as const,
        zIndex: isDragging ? 1 : 0,
      }}
      className={cn(
        "py-4 pr-4 transition-shadow duration-200",
        isDragging && "shadow-lg ring-2 ring-primary/20",
      )}
    >
      <div className="flex items-start">
        <div className="flex flex-col items-center px-2 pt-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border-[1px]">
            {currentIndex + 1}
          </div>
          <button
            className={cn(
              "mt-2",
              currentIndex === 0 ? "hidden" : "cursor-pointer",
            )}
            aria-label="Move above"
            onClick={() => moveNode(node.id, currentIndex - 1)}
            disabled={currentIndex === 0}
          >
            <ArrowUp className="h-5 w-5 text-muted-foreground transition-colors hover:text-primary" />
          </button>
          <button
            className="mt-2 cursor-move touch-none"
            aria-label="Drag to reorder"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-5 w-5 text-muted-foreground transition-colors hover:text-primary" />
          </button>
          <button
            className={cn(
              "mt-2",
              currentIndex === (editableForm?.nodes?.length ?? 1) - 1
                ? "hidden"
                : "cursor-pointer",
            )}
            aria-label="Move below"
            onClick={() => moveNode(node.id, currentIndex + 1)}
            disabled={currentIndex === (editableForm?.nodes?.length ?? 1) - 1}
          >
            <ArrowDown className="h-5 w-5 text-muted-foreground transition-colors hover:text-primary" />
          </button>
        </div>

        <EditableNodeRenderer node={node} />
      </div>
    </Card>
  );
}
