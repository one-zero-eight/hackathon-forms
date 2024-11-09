import { mockForms } from './mockDb'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    return NextResponse.json(mockForms)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch forms' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'Form ID is required' },
        { status: 400 }
      )
    }

    const formIndex = mockForms.findIndex(form => form.id === id)
    if (formIndex === -1) {
      return NextResponse.json(
        { error: 'Form not found' },
        { status: 404 }
      )
    }

    mockForms.splice(formIndex, 1)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete form' },
      { status: 500 }
    )
  }
} 