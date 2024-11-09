"use client";

import {
  EditableFormProvider,
  useEditableForm,
} from "@/components/forms/edit/EditableFormContext";
import { EditableNodeRenderer } from "@/components/forms/edit/EditableNodeRenderer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
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
import {
  ClipboardList,
  Eye,
  GripVertical,
  MessageSquare,
  Settings,
  Trash2,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

const NODE_TYPES = [
  { value: "input", label: "Text Input" },
  { value: "select", label: "Dropdown" },
  { value: "multiple-choice", label: "Multiple Choice" },
  { value: "date", label: "Date" },
  { value: "likert", label: "Likert Scale" },
  { value: "ranking", label: "Ranking" },
  { value: "matching", label: "Matching" },
] as const;

function SortableNode({ node }: { node: apiTypes.SchemaFormNodeOutput }) {
  const { handleUpdateNode, handleDeleteNode } = useEditableForm();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: node.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: "relative" as const,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`p-4 ${isDragging ? "shadow-lg ring-2 ring-primary/20" : ""} transition-shadow duration-200`}
    >
      <div className="flex items-start gap-4">
        <button
          className="mt-2 cursor-move touch-none"
          aria-label="Drag to reorder"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5 text-muted-foreground transition-colors hover:text-primary" />
        </button>

        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-4">
            <Input
              value={node.content.title || ""}
              onChange={(e) =>
                handleUpdateNode(node.id, {
                  content: { ...node.content, title: e.target.value },
                })
              }
              placeholder="Question title"
              className="flex-1"
            />

            <Select
              value={node.question.question_type}
              onValueChange={(value) =>
                handleUpdateNode(node.id, {
                  question: {
                    ...node.question,
                    // @ts-expect-error error
                    question_type:
                      value as apiTypes.SchemaFormNodeOutput["question"]["question_type"],
                  },
                })
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {NODE_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDeleteNode?.(node.id)}
              className="text-destructive"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>

          <EditableNodeRenderer node={node} />
        </div>
      </div>
    </Card>
  );
}

function SettingsTab() {
  const { editableForm, replaceForm } = useEditableForm();
  if (!editableForm) return;

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="formTitle">Название формы</Label>
          <Input
            id="formTitle"
            placeholder="Введите название формы"
            value={editableForm?.title || ""}
            onChange={(e) =>
              replaceForm?.({ ...editableForm, title: e.target.value })
            }
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="formDescription">Описание</Label>
          <Textarea
            id="formDescription"
            placeholder="Введите описание формы"
            value={editableForm?.description || ""}
            onChange={(e) =>
              replaceForm?.({ ...editableForm, description: e.target.value })
            }
            className="mt-1"
          />
        </div>
      </div>
    </Card>
  );
}

function QuestionsTab() {
  const { editableForm, replaceForm, handleAddNode } = useEditableForm();

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over || active.id === over.id || !editableForm?.nodes) return;

    const oldIndex = editableForm.nodes.findIndex(
      (node) => node.id === active.id,
    );
    const newIndex = editableForm.nodes.findIndex(
      (node) => node.id === over.id,
    );

    replaceForm?.({
      ...editableForm,
      nodes: arrayMove(editableForm.nodes, oldIndex, newIndex),
    });
  };

  return (
    <div className="space-y-4">
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
              <SortableNode key={node.id} node={node} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <Button onClick={handleAddNode} variant="outline" className="w-full">
        Добавить вопрос
      </Button>
    </div>
  );
}

function AnswersTab() {
  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h2 className="mb-2 text-xl font-semibold">Ответы на форму</h2>
        <p className="text-muted-foreground">Пока нет ответов</p>
        {/* Add answers/responses UI here */}
      </Card>
    </div>
  );
}

export default function EditFormPage() {
  const router = useRouter();
  const params = useParams();
  const [activeTab, setActiveTab] = useState("questions");

  // if (isPending) {
  //   return (
  //     <div className="flex min-h-[400px] items-center justify-center">
  //       <Loader2 className="h-8 w-8 animate-spin text-primary" />
  //     </div>
  //   );
  // }
  //
  // if (error) {
  //   return (
  //     <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
  //       <p className="mb-4 text-destructive">{error}</p>
  //       <Button onClick={() => window.location.reload()}>Try Again</Button>
  //     </div>
  //   );
  // }

  // if (!formData) {
  //   return (
  //     <Card className="mx-auto mt-8 max-w-md p-8 text-center">
  //       <p className="mb-4 text-muted-foreground">Form not found</p>
  //       <Button onClick={() => router.push("/forms")}>Back to Forms</Button>
  //     </Card>
  //   );
  // }

  return (
    <div className="container mx-auto space-y-6 px-4">
      <EditableFormProvider id={params.id as string}>
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <TabsList className="grid w-[400px] grid-cols-3">
              <TabsTrigger
                value="questions"
                className="flex items-center gap-2"
              >
                <ClipboardList className="h-4 w-4" />
                Вопросы
              </TabsTrigger>
              <TabsTrigger value="answers" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Ответы
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Настройки
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => router.push(`/forms/${params.id}`)}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Preview
              </Button>

              {/*<Button onClick={handleSaveForm} disabled={isSaving}>*/}
              {/*  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}*/}
              {/*  Save Changes*/}
              {/*</Button>*/}
            </div>
          </div>

          <TabsContent value="questions" className="space-y-4">
            <h1 className="text-2xl font-bold">Questions</h1>
            <QuestionsTab />
          </TabsContent>

          <TabsContent value="answers">
            <h1 className="text-2xl font-bold">Answers</h1>
            <AnswersTab />
          </TabsContent>

          <TabsContent value="settings">
            <h1 className="text-2xl font-bold">Settings</h1>
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </EditableFormProvider>
    </div>
  );
}
