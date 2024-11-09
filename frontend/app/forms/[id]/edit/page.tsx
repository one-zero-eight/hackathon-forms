'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Loader2, GripVertical, Trash2, Settings, Eye, ClipboardList, MessageSquare } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core'
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface FormNode {
  type: 'input' | 'select' | 'multiple-choice' | 'date' | 'likert' | 'ranking' | 'matching'
  id: string
  label?: string
  title?: string
  placeholder?: string
  options?: string[]
  left?: string[]
  right?: string[]
  answer?: string
  correctAnswer?: string | string[]
}

interface FormData {
  id: string
  title: string
  description?: string
  nodes?: FormNode[]
}

const NODE_TYPES = [
  { value: 'input', label: 'Text Input' },
  { value: 'select', label: 'Dropdown' },
  { value: 'multiple-choice', label: 'Multiple Choice' },
  { value: 'date', label: 'Date' },
  { value: 'likert', label: 'Likert Scale' },
  { value: 'ranking', label: 'Ranking' },
  { value: 'matching', label: 'Matching' },
] as const

function NodeEditor({ node, onUpdate }: { node: FormNode; onUpdate: (updates: Partial<FormNode>) => void }) {
  const rankingSensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const renderAnswerFields = () => (
    <div className="mt-4 pt-4 border-t space-y-4">
      <div>
        <Label className="text-muted-foreground">Correct Answer</Label>
        {node.type === 'multiple-choice' ? (
          <div className="mt-2 space-y-2">
            {node.options?.map((option, index) => (
              <label key={index} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={Array.isArray(node.correctAnswer) && node.correctAnswer.includes(option)}
                  onChange={(e) => {
                    const currentAnswers = Array.isArray(node.correctAnswer) ? node.correctAnswer : []
                    const newAnswers = e.target.checked
                      ? [...currentAnswers, option]
                      : currentAnswers.filter(answer => answer !== option)
                    onUpdate({ correctAnswer: newAnswers })
                  }}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <span className="text-sm">{option}</span>
              </label>
            ))}
          </div>
        ) : node.type === 'select' || node.type === 'likert' ? (
          <Select
            value={node.correctAnswer as string || undefined}
            onValueChange={(value) => onUpdate({ correctAnswer: value })}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select correct answer" />
            </SelectTrigger>
            <SelectContent>
              {node.options?.filter(option => option.trim() !== '').map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : node.type === 'input' ? (
          <Input
            value={node.correctAnswer as string || ''}
            onChange={(e) => onUpdate({ correctAnswer: e.target.value })}
            placeholder="Enter correct answer"
            className="mt-2"
          />
        ) : node.type === 'ranking' ? (
          <div className="mt-2 space-y-2">
            <p className="text-sm text-muted-foreground">Correct order (drag to reorder):</p>
            <DndContext
              sensors={rankingSensors}
              collisionDetection={closestCenter}
              onDragEnd={(event) => {
                const { active, over } = event
                if (!over || active.id === over.id) return

                const oldIndex = node.options?.findIndex(opt => opt === active.id)
                const newIndex = node.options?.findIndex(opt => opt === over.id)
                
                if (oldIndex === undefined || newIndex === undefined || !node.options) return

                const newOptions = arrayMove(node.options, oldIndex, newIndex)
                onUpdate({ 
                  options: newOptions,
                  correctAnswer: newOptions
                })
              }}
            >
              <SortableContext
                items={node.options || []}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {node.options?.map((option, index) => (
                    <SortableRankingAnswer
                      key={option}
                      item={option}
                      index={index}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        ) : node.type === 'matching' ? (
          <div className="mt-2 space-y-2">
            {node.left?.map((leftItem, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-sm w-1/3">{leftItem}</span>
                <Select
                  value={
                    Array.isArray(node.correctAnswer) 
                      ? node.correctAnswer[index] || undefined
                      : undefined
                  }
                  onValueChange={(value) => {
                    const currentAnswers = Array.isArray(node.correctAnswer) 
                      ? [...node.correctAnswer] 
                      : new Array(node.left?.length).fill(undefined)
                    currentAnswers[index] = value
                    onUpdate({ correctAnswer: currentAnswers })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select match" />
                  </SelectTrigger>
                  <SelectContent>
                    {node.right?.filter(rightItem => rightItem.trim() !== '').map((rightItem) => (
                      <SelectItem key={rightItem} value={rightItem}>
                        {rightItem}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div>
        <Label className="text-muted-foreground">Answer Explanation</Label>
        <Textarea
          value={node.answer || ''}
          onChange={(e) => onUpdate({ answer: e.target.value })}
          placeholder="Add an explanation for this answer..."
          className="mt-2"
        />
      </div>
    </div>
  )

  switch (node.type) {
    case 'input':
      return (
        <div className="space-y-4">
          <Input
            value={node.label || ''}
            onChange={(e) => onUpdate({ label: e.target.value })}
            placeholder="Label"
          />
          <Input
            value={node.placeholder || ''}
            onChange={(e) => onUpdate({ placeholder: e.target.value })}
            placeholder="Placeholder text"
          />
          {renderAnswerFields()}
        </div>
      )

    case 'select':
    case 'multiple-choice':
    case 'likert':
    case 'ranking':
      return (
        <div className="space-y-2">
          {node.options?.map((option, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={option}
                onChange={(e) => {
                  const newOptions = [...(node.options || [])]
                  newOptions[index] = e.target.value
                  onUpdate({ options: newOptions })
                }}
                placeholder={`Option ${index + 1}`}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const newOptions = node.options?.filter((_, i) => i !== index)
                  onUpdate({ options: newOptions })
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            onClick={() => {
              const newOptions = [...(node.options || []), 'New Option']
              onUpdate({ options: newOptions })
            }}
          >
            Add Option
          </Button>
          {renderAnswerFields()}
        </div>
      )

    case 'matching':
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Left Items</Label>
              {node.left?.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={item}
                    onChange={(e) => {
                      const newLeft = [...(node.left || [])]
                      newLeft[index] = e.target.value
                      onUpdate({ left: newLeft })
                    }}
                    placeholder={`Left ${index + 1}`}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const newLeft = node.left?.filter((_, i) => i !== index)
                      onUpdate({ left: newLeft })
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => {
                  const newLeft = [...(node.left || []), '']
                  onUpdate({ left: newLeft })
                }}
              >
                Add Left Item
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label>Right Items</Label>
              {node.right?.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={item}
                    onChange={(e) => {
                      const newRight = [...(node.right || [])]
                      newRight[index] = e.target.value
                      onUpdate({ right: newRight })
                    }}
                    placeholder={`Right ${index + 1}`}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const newRight = node.right?.filter((_, i) => i !== index)
                      onUpdate({ right: newRight })
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => {
                  const newRight = [...(node.right || []), '']
                  onUpdate({ right: newRight })
                }}
              >
                Add Right Item
              </Button>
            </div>
          </div>
          {renderAnswerFields()}
        </div>
      )

    default:
      return null
  }
}

function SortableNode({ 
  node,
  onUpdate,
  onDelete 
}: { 
  node: FormNode;
  onUpdate: (nodeId: string, updates: Partial<FormNode>) => void;
  onDelete: (nodeId: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: node.id })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative' as const,
    zIndex: isDragging ? 1 : 0,
  }

  return (
    <Card 
      ref={setNodeRef} 
      style={style} 
      className={`p-4 ${isDragging ? 'shadow-lg ring-2 ring-primary/20' : ''} transition-shadow duration-200`}
    >
      <div className="flex items-start gap-4">
        <button
          className="mt-2 cursor-move touch-none"
          aria-label="Drag to reorder"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
        </button>
        
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-4">
            <Input
              value={node.title || ''}
              onChange={(e) => onUpdate(node.id, { title: e.target.value })}
              placeholder="Question title"
              className="flex-1"
            />
            
            <Select
              value={node.type}
              onValueChange={(value) => onUpdate(node.id, { 
                type: value as FormNode['type']
              })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {NODE_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(node.id)}
              className="text-destructive"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>

          <NodeEditor 
            node={node} 
            onUpdate={(updates) => onUpdate(node.id, updates)} 
          />
        </div>
      </div>
    </Card>
  )
}

function SettingsTab({ formData, setFormData }: { 
  formData: FormData; 
  setFormData: (data: FormData) => void;
}) {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="formTitle">Form Title</Label>
          <Input
            id="formTitle"
            value={formData?.title || ''}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="formDescription">Description</Label>
          <Textarea
            id="formDescription"
            value={formData?.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="mt-1"
          />
        </div>
      </div>
    </Card>
  )
}

function QuestionsTab({ 
  formData,
  setFormData,
  handleUpdateNode,
  handleAddNode,
  handleDeleteNode,
  handleDragEnd,
  sensors 
}: {
  formData: FormData;
  setFormData: (data: FormData) => void;
  handleUpdateNode: (nodeId: string, updates: Partial<FormNode>) => void;
  handleAddNode: () => void;
  handleDeleteNode: (nodeId: string) => void;
  handleDragEnd: (event: any) => void;
  sensors: any;
}) {
  return (
    <div className="space-y-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={formData?.nodes?.map(node => node.id) || []}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {formData?.nodes?.map((node) => (
              <SortableNode 
                key={node.id} 
                node={node}
                onUpdate={handleUpdateNode}
                onDelete={handleDeleteNode}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <Button 
        onClick={handleAddNode}
        variant="outline"
        className="w-full"
      >
        Add Question
      </Button>
    </div>
  )
}

function AnswersTab({ formData }: { formData: FormData }) {
  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-2">Form Responses</h2>
        <p className="text-muted-foreground">No responses yet</p>
        {/* Add answers/responses UI here */}
      </Card>
    </div>
  )
}

function SortableRankingAnswer({ 
  item, 
  index 
}: { 
  item: string; 
  index: number 
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 bg-secondary/50 p-2 rounded ${
        isDragging ? 'ring-2 ring-primary/20' : ''
      }`}
    >
      <button
        className="cursor-move touch-none"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </button>
      <span className="text-sm font-medium">{index + 1}.</span>
      <span className="text-sm">{item}</span>
    </div>
  )
}

export default function EditFormPage() {
  const router = useRouter()
  const params = useParams()
  const [formData, setFormData] = useState<FormData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("questions")

  useEffect(() => {
    const fetchForm = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/forms/${params.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch form')
        }
        const data = await response.json()
        setFormData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchForm()
    }
  }, [params.id])

  const handleSaveForm = async () => {
    if (!formData) return
    
    try {
      setIsSaving(true)
      const response = await fetch(`/api/forms/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      
      if (!response.ok) throw new Error('Failed to save form')
      
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save changes')
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdateNode = (nodeId: string, updates: Partial<FormNode>) => {
    if (!formData?.nodes) return
    
    setFormData({
      ...formData,
      nodes: formData.nodes.map(node => 
        node.id === nodeId ? { ...node, ...updates } : node
      ),
    })
  }

  const handleAddNode = () => {
    if (!formData) return
    
    const newNode: FormNode = {
      id: crypto.randomUUID(),
      type: 'input',
      title: 'New Question',
      answer: '',
      correctAnswer: '',
    }
    
    setFormData({
      ...formData,
      nodes: [...(formData.nodes || []), newNode],
    })
  }

  const handleDeleteNode = (nodeId: string) => {
    if (!formData?.nodes) return
    
    setFormData({
      ...formData,
      nodes: formData.nodes.filter(node => node.id !== nodeId),
    })
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    
    if (!over || active.id === over.id || !formData?.nodes) return
    
    const oldIndex = formData.nodes.findIndex(node => node.id === active.id)
    const newIndex = formData.nodes.findIndex(node => node.id === over.id)
    
    setFormData({
      ...formData,
      nodes: arrayMove(formData.nodes, oldIndex, newIndex),
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }

  if (!formData) {
    return (
      <Card className="p-8 text-center max-w-md mx-auto mt-8">
        <p className="text-muted-foreground mb-4">Form not found</p>
        <Button onClick={() => router.push('/forms')}>Back to Forms</Button>
      </Card>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-[400px] grid-cols-3">
            <TabsTrigger value="questions" className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              Questions
            </TabsTrigger>
            <TabsTrigger value="answers" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Answers
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
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
            
            <Button 
              onClick={handleSaveForm}
              disabled={isSaving}
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </div>

        <TabsContent value="questions" className="space-y-4">
          <h1 className="text-2xl font-bold">Questions</h1>
          <QuestionsTab
            formData={formData}
            setFormData={setFormData}
            handleUpdateNode={handleUpdateNode}
            handleAddNode={handleAddNode}
            handleDeleteNode={handleDeleteNode}
            handleDragEnd={handleDragEnd}
            sensors={sensors}
          />
        </TabsContent>

        <TabsContent value="answers">
          <h1 className="text-2xl font-bold">Answers</h1>
          <AnswersTab formData={formData} />
        </TabsContent>

        <TabsContent value="settings">
          <h1 className="text-2xl font-bold">Settings</h1>
          <SettingsTab 
            formData={formData} 
            setFormData={setFormData} 
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}