'use client'

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash2, Plus, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

interface Form {
  id: number
  title: string
  description?: string
  createdAt: string
}

export default function FormsPage() {
  const [forms, setForms] = useState<Form[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleFetchForms = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch('/api/forms')
      if (!response.ok) {
        throw new Error('Failed to fetch forms')
      }
      const data = await response.json()
      setForms(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch forms')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    handleFetchForms()
  }, [])

  const handleDelete = async (formId: number) => {
    try {
      const response = await fetch(`/api/forms?id=${formId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete form')
      }

      setForms(prevForms => prevForms.filter(form => form.id !== formId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete form')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]" role="status" aria-label="Loading forms">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="sr-only">Loading forms...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center" role="alert">
        <p className="text-destructive mb-4">{error}</p>
        <Button 
          onClick={handleFetchForms}
          aria-label="Retry loading forms"
        >
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold">Мои формы</h1>
        <Button asChild>
          <Link href="/forms/create">
            <Plus className="mr-2" />
            Создать форму
          </Link>
        </Button>
      </div>

      {forms.length === 0 ? (
        <Card className="p-8 text-center">
          <CardContent>
            <p className="text-muted-foreground mb-4">No forms created yet</p>
            <Link href="/forms/create">
              <Button aria-label="Create your first form">Create Your First Form</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div 
          className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
          role="list"
          aria-label="Forms list"
        >
          {forms.map((form) => (
            <Card key={form.id} className="flex flex-col h-full" role="listitem">
              <CardHeader className="flex-none">
                <CardTitle className="text-xl line-clamp-2">{form.title}</CardTitle>
                <CardDescription>
                  {form.description && (
                    <p className="line-clamp-2 mb-2 text-sm">{form.description}</p>
                  )}
                  <p className="text-sm">
                    Created on: {form.createdAt ? new Date(form.createdAt).toLocaleDateString() : 'Unknown date'}
                  </p>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex items-end pt-4">
                <div className="flex gap-2 w-full">
                  <Link 
                    href={`/forms/${form.id}/edit`} 
                    className="flex-1"
                    aria-label={`Edit form: ${form.title}`}
                  >
                    <Button variant="outline" className="w-full h-9">
                      Edit
                    </Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 h-9"
                        aria-label={`Delete form: ${form.title}`}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Удалить форму?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Это действие нельзя отменить. Форма будет удалена навсегда.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Отмена</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive hover:bg-destructive/90"
                          onClick={() => handleDelete(form.id)}
                        >
                          Удалить
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
