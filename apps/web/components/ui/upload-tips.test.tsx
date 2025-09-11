import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { UploadTips } from './upload-tips'

describe('UploadTips', () => {
  it('renders a list of helpful tips with accessible label', () => {
    render(<UploadTips />)
    // Section with aria-label
    const section = screen.getByLabelText(/Dicas de Foto/i)
    expect(section).toBeInTheDocument()
    // A few representative tips
    expect(screen.getByText(/boa iluminação/i)).toBeInTheDocument()
    expect(screen.getByText(/foto nítida/i)).toBeInTheDocument()
    expect(screen.getByText(/Fundo simples/i)).toBeInTheDocument()
  })
})

