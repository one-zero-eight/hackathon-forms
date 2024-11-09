import { useFormResponse } from "@/components/forms/view/FormResponsesContext";
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
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo } from "react";

type RankingItem = {
  id: string;
  origIndex: number;
  text: string;
};

const SortableItem = ({
  item,
  index,
}: {
  item: RankingItem;
  index: number;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-move rounded-md border border-gray-200 bg-white p-3 shadow-sm"
      aria-label={`Drag to reorder. Current position ${index + 1}: ${item.text}`}
    >
      {index + 1}. {item.text}
    </div>
  );
};

export function RankingQuestion({
  node,
  question,
}: {
  node: apiTypes.SchemaFormNodeOutput;
  question: apiTypes.SchemaRanking;
}) {
  const { response, setResponse } = useFormResponse<number[]>(node.id);

  const startItems: RankingItem[] = useMemo(
    () =>
      question.options.map((text, index) => ({
        id: `${index}-${text}`,
        origIndex: index,
        text,
      })),
    [question.options],
  );
  const actualItems = useMemo(() => {
    if (!response || response.length !== startItems.length) {
      return startItems;
    } else {
      return response.map((index) => startItems[index]);
    }
  }, [response, startItems]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = actualItems.findIndex((item) => item.id === active.id);
    const newIndex = actualItems.findIndex((item) => item.id === over.id);

    const newItems = [...actualItems];
    newItems.splice(oldIndex, 1);
    newItems.splice(newIndex, 0, actualItems[oldIndex]);

    setResponse(newItems.map((item) => item.origIndex));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={actualItems}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {actualItems.map((item, index) => (
            <SortableItem key={item.id} item={item} index={index} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
