import { RankingFormNode } from "@/components/forms/view/FormContext";
import { useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";

export function RankingQuestion({ node }: { node: RankingFormNode }) {
  const [value, setValue] = useState<{ origIndex: number; text: string }[]>(
    node.options.map((text, index) => ({ origIndex: index, text })),
  );

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const newValue = [...value];
    const [removed] = newValue.splice(result.source.index, 1);
    newValue.splice(result.destination.index, 0, removed);

    setValue(newValue);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{node.title}</h3>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable
          droppableId="ranking"
          isDropDisabled={false}
          isCombineEnabled={false}
          ignoreContainerClipping={false}
        >
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {value.map(({ origIndex, text }, index) => (
                <Draggable
                  key={origIndex}
                  draggableId={text}
                  index={index}
                  isDragDisabled={false}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="cursor-move rounded-md border border-gray-200 bg-white p-3 shadow-sm"
                    >
                      {index + 1}. {text}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
