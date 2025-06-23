import React from 'react'
import { createRoot } from 'react-dom/client'
import NOBIFormApp from './components/NOBIFormApp'

class NOBIFormElement extends HTMLElement {
  private root: any = null

  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: 'open' })
    
    // Create container
    const container = document.createElement('div')
    shadowRoot.appendChild(container)
    
    // Create React root and render
    this.root = createRoot(container)
    this.root.render(<NOBIFormApp />)
  }

  disconnectedCallback() {
    if (this.root) {
      this.root.unmount()
    }
  }
}

// Define the custom element
customElements.define('nobi-form', NOBIFormElement)

export default NOBIFormElement