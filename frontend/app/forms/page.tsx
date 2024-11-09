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
  createdAt: string
}

export default function FormsPage() {
  const [forms, setForms] = useState<Form[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Simulate data fetching - replace with actual API call
  useEffect(() => {
    const fetchForms = async () => {
      try {
        setIsLoading(true)
        // Replace with actual API call
        const mockForms = [
          { id: 1, title: "Employee Satisfaction Survey", createdAt: "2024-03-20" },
          { id: 2, title: "Performance Review Form", createdAt: "2024-03-19" },
          { id: 3, title: "Onboarding Feedback", createdAt: "2024-03-18" },
        ]
        setForms(mockForms)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch forms')
      } finally {
        setIsLoading(false)
      }
    }

    fetchForms()
  }, [])

  const handleDelete = async (formId: number) => {
    try {
      // Implement delete logic here
      console.log(`Deleting form ${formId}`)
      // Optimistic update
      setForms(forms.filter(form => form.id !== formId))
    } catch (err) {
      // Handle error and possibly revert the optimistic update
      console.error('Failed to delete form:', err)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
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

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">Forms Management</h1>
        <Link href="/forms/create">
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Create New Form
          </Button>
        </Link>
      </div>

      {forms.length === 0 ? (
        <Card className="p-8 text-center">
          <CardContent>
            <p className="text-muted-foreground mb-4">No forms created yet</p>
            <Link href="/forms/create">
              <Button>Create Your First Form</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {forms.map((form) => (
            <Card key={form.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="line-clamp-2">{form.title}</CardTitle>
                <CardDescription>
                  Created on: {new Date(form.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <div className="flex flex-wrap gap-2">
                  <Link href={`/forms/${form.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">View</Button>
                  </Link>
                  <Link href={`/forms/${form.id}/edit`} className="flex-1">
                    <Button variant="outline" className="w-full">Edit</Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Form</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{form.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive hover:bg-destructive/90"
                          onClick={() => handleDelete(form.id)}
                        >
                          Delete
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
