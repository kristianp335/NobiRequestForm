import React from 'react'
import { createRoot } from 'react-dom/client'
import NOBIFormApp from './components/NOBIFormApp'

class NOBIFormElement extends HTMLElement {
  private root: any = null
  private initialized = false

  connectedCallback() {
    // Only initialize once to prevent conflicts with other client extensions
    if (this.initialized) return
    
    // Use regular DOM instead of Shadow DOM for better Liferay compatibility
    const container = document.createElement('div')
    container.className = 'nobi-form-wrapper'
    this.appendChild(container)
    
    // Create React root and render
    this.root = createRoot(container)
    this.root.render(<NOBIFormApp />)
    this.initialized = true
  }

  disconnectedCallback() {
    if (this.root) {
      this.root.unmount()
      this.root = null
    }
    this.initialized = false
  }
}

// Only define the custom element if it hasn't been defined already
if (!customElements.get('nobi-form')) {
  customElements.define('nobi-form', NOBIFormElement)
}

export default NOBIFormElement