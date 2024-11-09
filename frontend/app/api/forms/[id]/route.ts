import { NextResponse } from 'next/server'
import { mockForms } from '../mockDb'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const form = mockForms.get(params.id)
    
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
    const form = mockForms.get(params.id)
    
    if (!form) {
      return NextResponse.json(
        { error: 'Form not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    
    mockForms.set(params.id, {
      ...form,
      ...body,
      id: params.id
    })

    return NextResponse.json(mockForms.get(params.id))
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 