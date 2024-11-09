import { NextResponse } from 'next/server'
import { mockForms } from '../mockDb'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const form = mockForms.find(form => form.id === id)
    
    if (!form) {
      return NextResponse.json(
        { error: 'Form not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(form)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const formIndex = mockForms.findIndex(form => form.id === id)
    
    if (formIndex === -1) {
      return NextResponse.json(
        { error: 'Form not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    
    mockForms[formIndex] = {
      ...mockForms[formIndex],
      ...body,
      id: id
    }

    return NextResponse.json(mockForms[formIndex])
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 