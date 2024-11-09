'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

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
  nodes: FormNode[]
}

export default function EditFormPage() {
  const router = useRouter()
  const params = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState<FormData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await fetch(`/api/forms/${params.id}`)
        if (!response.ok) throw new Error('Failed to fetch form')
        const data = await response.json()
        setFormData(data)
      } catch (error) {
        setError('Error loading form')
        setTimeout(() => router.push('/forms'), 2000)
      } finally {
        setIsLoading(false)
      }
    }

    fetchForm()
  }, [params.id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData) return

    try {
      const response = await fetch(`/api/forms/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Failed to update form')
      
      setError('Form updated successfully')
      setTimeout(() => router.push('/forms'), 2000)
    } catch (error) {
      setError('Error updating form')
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!formData) return
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleNodeChange = (index: number, field: string, value: any) => {
    if (!formData) return
    const updatedNodes = [...formData.nodes]
    updatedNodes[index] = {
      ...updatedNodes[index],
      [field]: value
    }
    setFormData({
      ...formData,
      nodes: updatedNodes
    })
  }

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    )
  }

  if (!formData) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p className="text-lg text-gray-500">Form not found</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Form</h1>
        <button
          onClick={() => router.push('/forms')}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100"
          aria-label="Cancel editing form"
        >
          Cancel
        </button>
      </div>

      {error && (
        <div className={`mb-4 rounded-md p-4 ${
          error.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label 
            htmlFor="title"
            className="text-sm font-medium leading-none"
          >
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter form title"
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Form Elements</h2>
          {formData.nodes.map((node, index) => (
            <div key={node.id} className="rounded-lg border border-gray-200 p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-medium">{node.type.charAt(0).toUpperCase() + node.type.slice(1)}</h3>
                <button
                  type="button"
                  onClick={() => {
                    const updatedNodes = formData.nodes.filter((_, i) => i !== index)
                    setFormData({ ...formData, nodes: updatedNodes })
                  }}
                  className="text-red-500 hover:text-red-600"
                  aria-label="Remove form element"
                >
                  Remove
                </button>
              </div>

              {(node.label || node.title) && (
                <div className="mb-3">
                  <label className="text-sm font-medium">
                    {node.type === 'input' ? 'Label' : 'Title'}
                  </label>
                  <input
                    type="text"
                    value={node.label || node.title}
                    onChange={(e) => handleNodeChange(index, node.type === 'input' ? 'label' : 'title', e.target.value)}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
              )}

              {node.placeholder && (
                <div className="mb-3">
                  <label className="text-sm font-medium">Placeholder</label>
                  <input
                    type="text"
                    value={node.placeholder}
                    onChange={(e) => handleNodeChange(index, 'placeholder', e.target.value)}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
              )}

              {node.options && (
                <div className="mb-3">
                  <label className="text-sm font-medium">Options</label>
                  {node.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="mt-2 flex items-center gap-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...node.options!]
                          newOptions[optionIndex] = e.target.value
                          handleNodeChange(index, 'options', newOptions)
                        }}
                        className="flex-1 rounded-md border border-gray-300 px-3 py-2"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newOptions = node.options!.filter((_, i) => i !== optionIndex)
                          handleNodeChange(index, 'options', newOptions)
                        }}
                        className="text-red-500 hover:text-red-600"
                        aria-label="Remove option"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const newOptions = [...node.options!, '']
                      handleNodeChange(index, 'options', newOptions)
                    }}
                    className="mt-2 text-sm text-blue-500 hover:text-blue-600"
                  >
                    Add Option
                  </button>
                </div>
              )}

              {node.type === 'matching' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Left Items</label>
                    {node.left?.map((item, itemIndex) => (
                      <div key={itemIndex} className="mt-2 flex items-center gap-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => {
                            const newLeft = [...node.left!]
                            newLeft[itemIndex] = e.target.value
                            handleNodeChange(index, 'left', newLeft)
                          }}
                          className="flex-1 rounded-md border border-gray-300 px-3 py-2"
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="text-sm font-medium">Right Items</label>
                    {node.right?.map((item, itemIndex) => (
                      <div key={itemIndex} className="mt-2 flex items-center gap-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => {
                            const newRight = [...node.right!]
                            newRight[itemIndex] = e.target.value
                            handleNodeChange(index, 'right', newRight)
                          }}
                          className="flex-1 rounded-md border border-gray-300 px-3 py-2"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/forms')}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100"
            aria-label="Cancel editing form"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
            aria-label="Save form changes"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}