import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

interface RankingQuestionProps {
  question: string;
  options: string[];
  onChange: (values: string[]) => void;
  value?: string[];
}

export function RankingQuestion({ question, options, onChange, value = [...options] }: RankingQuestionProps) {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const items = Array.from(value);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    onChange(items);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{question}</h3>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="ranking" isDropDisabled={false}>
          {(provided) => (
            <div 
              {...provided.droppableProps} 
              ref={provided.innerRef} 
              className="space-y-2"
            >
              {value.map((item, index) => (
                <Draggable 
                  key={item} 
                  draggableId={item} 
                  index={index}
                  isDragDisabled={false}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="p-3 bg-white rounded-md border border-gray-200 shadow-sm cursor-move"
                    >
                      {index + 1}. {item}
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