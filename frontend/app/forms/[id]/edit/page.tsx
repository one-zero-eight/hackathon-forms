'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Loader2, GripVertical, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core'
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface FormNode {
  type: 'input' | 'select' | 'multiple-choice' | 'date' | 'likert' | 'ranking' | 'matching'
  id: string
  label?: string
  title?: string
  placeholder?: string
  options?: string[]
  left?: string[]
  right?: string[]
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
              const newOptions = [...(node.options || []), '']
              onUpdate({ options: newOptions })
            }}
          >
            Add Option
          </Button>
        </div>
      )

    case 'matching':
      return (
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

export default function EditFormPage() {
  const router = useRouter()
  const params = useParams()
  const [formData, setFormData] = useState<FormData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Form</h1>
        <Button 
          onClick={handleSaveForm}
          disabled={isSaving}
        >
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="formTitle">Form Title</Label>
            <Input
              id="formTitle"
              value={formData?.title || ''}
              onChange={(e) => setFormData(formData ? { ...formData, title: e.target.value } : null)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="formDescription">Description</Label>
            <Textarea
              id="formDescription"
              value={formData?.description || ''}
              onChange={(e) => setFormData(formData ? { ...formData, description: e.target.value } : null)}
              className="mt-1"
            />
          </div>
        </div>
      </Card>

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
    </div>
  )
}