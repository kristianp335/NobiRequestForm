import React, { useState, useEffect } from 'react'

interface Company {
  key: string
  name: string
}

interface NOBICategory {
  key: string
  name: string
}

interface FormData {
  company: Company
  companyNumber: string
  contactNumber: string
  costCentre: string
  currency: string
  date: string
  generalLedgerToBeCharged: string
  invoiceNetAmount: number
  invoiceVatAmount: number
  lineManagerFullname: string
  multipleBankAccountNumberToBeUsed: string
  nOBICategory: NOBICategory
  requestingDepartmentStore: string
  requestorFirstName: string
  requestorSurname: string
  sAPVendorName: string
  sAPVendorNumber: string
  totalPrice: number
  vendorAddressDetails: string
  vendorName: string
}

const NOBIFormApp: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([])
  const [nobiCategories, setNOBICategories] = useState<NOBICategory[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  
  const [formData, setFormData] = useState<FormData>({
    company: { key: '', name: '' },
    companyNumber: '',
    contactNumber: '',
    costCentre: '',
    currency: '',
    date: new Date().toISOString().split('T')[0],
    generalLedgerToBeCharged: '',
    invoiceNetAmount: 0,
    invoiceVatAmount: 0,
    lineManagerFullname: '',
    multipleBankAccountNumberToBeUsed: '',
    nOBICategory: { key: '', name: '' },
    requestingDepartmentStore: '',
    requestorFirstName: '',
    requestorSurname: '',
    sAPVendorName: '',
    sAPVendorNumber: '',
    totalPrice: 0,
    vendorAddressDetails: '',
    vendorName: ''
  })

  // Get Liferay auth token
  const getAuthToken = () => {
    return (window as any).Liferay?.authToken || ''
  }

  // Fetch companies from Liferay API
  const fetchCompanies = async () => {
    try {
      const authToken = getAuthToken()
      const response = await fetch(`/o/headless-admin-list-type/v1.0/list-type-definitions/334341?p_auth=${authToken}`)
      const data = await response.json()
      
      if (data.listTypeEntries) {
        setCompanies(data.listTypeEntries.map((entry: any) => ({
          key: entry.key,
          name: entry.name
        })))
      }
    } catch (error) {
      console.error('Error fetching companies:', error)
      setMessage('Error loading companies. Please refresh the page.')
    }
  }

  // Fetch NOBI categories from Liferay API
  const fetchNOBICategories = async () => {
    try {
      const authToken = getAuthToken()
      const response = await fetch(`/o/headless-admin-list-type/v1.0/list-type-definitions/334543?p_auth=${authToken}`)
      const data = await response.json()
      
      if (data.listTypeEntries) {
        setNOBICategories(data.listTypeEntries.map((entry: any) => ({
          key: entry.key,
          name: entry.name
        })))
      }
    } catch (error) {
      console.error('Error fetching NOBI categories:', error)
      setMessage('Error loading NOBI categories. Please refresh the page.')
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([fetchCompanies(), fetchNOBICategories()])
      setLoading(false)
    }
    
    loadData()
  }, [])

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedKey = e.target.value
    const selectedCompany = companies.find(c => c.key === selectedKey)
    if (selectedCompany) {
      handleInputChange('company', selectedCompany)
    }
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedKey = e.target.value
    const selectedCategory = nobiCategories.find(c => c.key === selectedKey)
    if (selectedCategory) {
      handleInputChange('nOBICategory', selectedCategory)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage('')

    try {
      const authToken = getAuthToken()
      const response = await fetch(`/o/c/nobprequests/?p_auth=${authToken}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setMessage('NOBI request submitted successfully!')
        // Reset form
        setFormData({
          company: { key: '', name: '' },
          companyNumber: '',
          contactNumber: '',
          costCentre: '',
          currency: '',
          date: new Date().toISOString().split('T')[0],
          generalLedgerToBeCharged: '',
          invoiceNetAmount: 0,
          invoiceVatAmount: 0,
          lineManagerFullname: '',
          multipleBankAccountNumberToBeUsed: '',
          nOBICategory: { key: '', name: '' },
          requestingDepartmentStore: '',
          requestorFirstName: '',
          requestorSurname: '',
          sAPVendorName: '',
          sAPVendorNumber: '',
          totalPrice: 0,
          vendorAddressDetails: '',
          vendorName: ''
        })
      } else {
        const errorData = await response.json()
        setMessage(`Error submitting request: ${errorData.message || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Submission error:', error)
      setMessage('Error submitting request. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading form data...</div>
  }

  return (
    <div className="nobi-form-container">
      <style>{`
        .nobi-form-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          font-family: var(--bs-font-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif);
        }
        
        .form-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          color: var(--bs-dark, #212529);
        }
        
        .form-group {
          margin-bottom: 1rem;
        }
        
        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: var(--bs-dark, #212529);
        }
        
        .form-control {
          display: block;
          width: 100%;
          padding: 0.375rem 0.75rem;
          font-size: 1rem;
          font-weight: 400;
          line-height: 1.5;
          color: var(--bs-body-color, #212529);
          background-color: var(--bs-body-bg, #fff);
          background-image: none;
          border: 1px solid var(--bs-border-color, #ced4da);
          border-radius: 0.375rem;
          transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
        }
        
        .form-control:focus {
          color: var(--bs-body-color, #212529);
          background-color: var(--bs-body-bg, #fff);
          border-color: var(--bs-primary, #0d6efd);
          outline: 0;
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
        }
        
        .btn {
          display: inline-block;
          font-weight: 400;
          line-height: 1.5;
          color: var(--bs-body-color, #212529);
          text-align: center;
          text-decoration: none;
          vertical-align: middle;
          cursor: pointer;
          user-select: none;
          background-color: transparent;
          border: 1px solid transparent;
          padding: 0.375rem 0.75rem;
          font-size: 1rem;
          border-radius: 0.375rem;
          transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
        }
        
        .btn-primary {
          color: #fff;
          background-color: var(--bs-primary, #0d6efd);
          border-color: var(--bs-primary, #0d6efd);
        }
        
        .btn-primary:hover {
          color: #fff;
          background-color: #0b5ed7;
          border-color: #0a58ca;
        }
        
        .btn:disabled {
          pointer-events: none;
          opacity: 0.65;
        }
        
        .alert {
          position: relative;
          padding: 0.75rem 1.25rem;
          margin-bottom: 1rem;
          border: 1px solid transparent;
          border-radius: 0.375rem;
        }
        
        .alert-success {
          color: #155724;
          background-color: #d4edda;
          border-color: #c3e6cb;
        }
        
        .alert-danger {
          color: #721c24;
          background-color: #f8d7da;
          border-color: #f5c6cb;
        }
        
        .loading {
          text-align: center;
          padding: 2rem;
          font-size: 1.1rem;
        }
        
        .form-row {
          display: flex;
          flex-wrap: wrap;
          margin-right: -0.5rem;
          margin-left: -0.5rem;
        }
        
        .form-col {
          flex: 0 0 50%;
          max-width: 50%;
          padding-right: 0.5rem;
          padding-left: 0.5rem;
        }
        
        @media (max-width: 768px) {
          .form-col {
            flex: 0 0 100%;
            max-width: 100%;
          }
        }
      `}</style>
      
      <h2 className="form-title">NOBI Request Form</h2>
      
      {message && (
        <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'}`}>
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-col">
            <div className="form-group">
              <label className="form-label">Company *</label>
              <select 
                className="form-control" 
                value={formData.company.key} 
                onChange={handleCompanyChange}
                required
              >
                <option value="">Select Company</option>
                {companies.map(company => (
                  <option key={company.key} value={company.key}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="form-col">
            <div className="form-group">
              <label className="form-label">NOBI Category *</label>
              <select 
                className="form-control" 
                value={formData.nOBICategory.key} 
                onChange={handleCategoryChange}
                required
              >
                <option value="">Select NOBI Category</option>
                {nobiCategories.map(category => (
                  <option key={category.key} value={category.key}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-col">
            <div className="form-group">
              <label className="form-label">Requestor First Name *</label>
              <input 
                type="text" 
                className="form-control" 
                value={formData.requestorFirstName}
                onChange={(e) => handleInputChange('requestorFirstName', e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="form-col">
            <div className="form-group">
              <label className="form-label">Requestor Surname *</label>
              <input 
                type="text" 
                className="form-control" 
                value={formData.requestorSurname}
                onChange={(e) => handleInputChange('requestorSurname', e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-col">
            <div className="form-group">
              <label className="form-label">Company Number</label>
              <input 
                type="text" 
                className="form-control" 
                value={formData.companyNumber}
                onChange={(e) => handleInputChange('companyNumber', e.target.value)}
              />
            </div>
          </div>
          
          <div className="form-col">
            <div className="form-group">
              <label className="form-label">Contact Number</label>
              <input 
                type="text" 
                className="form-control" 
                value={formData.contactNumber}
                onChange={(e) => handleInputChange('contactNumber', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-col">
            <div className="form-group">
              <label className="form-label">Cost Centre</label>
              <input 
                type="text" 
                className="form-control" 
                value={formData.costCentre}
                onChange={(e) => handleInputChange('costCentre', e.target.value)}
              />
            </div>
          </div>
          
          <div className="form-col">
            <div className="form-group">
              <label className="form-label">Currency</label>
              <input 
                type="text" 
                className="form-control" 
                value={formData.currency}
                onChange={(e) => handleInputChange('currency', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-col">
            <div className="form-group">
              <label className="form-label">Date *</label>
              <input 
                type="date" 
                className="form-control" 
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="form-col">
            <div className="form-group">
              <label className="form-label">General Ledger To Be Charged</label>
              <input 
                type="text" 
                className="form-control" 
                value={formData.generalLedgerToBeCharged}
                onChange={(e) => handleInputChange('generalLedgerToBeCharged', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-col">
            <div className="form-group">
              <label className="form-label">Invoice Net Amount</label>
              <input 
                type="number" 
                step="0.01"
                className="form-control" 
                value={formData.invoiceNetAmount}
                onChange={(e) => handleInputChange('invoiceNetAmount', parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
          
          <div className="form-col">
            <div className="form-group">
              <label className="form-label">Invoice VAT Amount</label>
              <input 
                type="number" 
                step="0.01"
                className="form-control" 
                value={formData.invoiceVatAmount}
                onChange={(e) => handleInputChange('invoiceVatAmount', parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-col">
            <div className="form-group">
              <label className="form-label">Line Manager Full Name</label>
              <input 
                type="text" 
                className="form-control" 
                value={formData.lineManagerFullname}
                onChange={(e) => handleInputChange('lineManagerFullname', e.target.value)}
              />
            </div>
          </div>
          
          <div className="form-col">
            <div className="form-group">
              <label className="form-label">Multiple Bank Account Number</label>
              <input 
                type="text" 
                className="form-control" 
                value={formData.multipleBankAccountNumberToBeUsed}
                onChange={(e) => handleInputChange('multipleBankAccountNumberToBeUsed', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Requesting Department/Store</label>
          <input 
            type="text" 
            className="form-control" 
            value={formData.requestingDepartmentStore}
            onChange={(e) => handleInputChange('requestingDepartmentStore', e.target.value)}
          />
        </div>

        <div className="form-row">
          <div className="form-col">
            <div className="form-group">
              <label className="form-label">SAP Vendor Name</label>
              <input 
                type="text" 
                className="form-control" 
                value={formData.sAPVendorName}
                onChange={(e) => handleInputChange('sAPVendorName', e.target.value)}
              />
            </div>
          </div>
          
          <div className="form-col">
            <div className="form-group">
              <label className="form-label">SAP Vendor Number</label>
              <input 
                type="text" 
                className="form-control" 
                value={formData.sAPVendorNumber}
                onChange={(e) => handleInputChange('sAPVendorNumber', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-col">
            <div className="form-group">
              <label className="form-label">Total Price</label>
              <input 
                type="number" 
                step="0.01"
                className="form-control" 
                value={formData.totalPrice}
                onChange={(e) => handleInputChange('totalPrice', parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
          
          <div className="form-col">
            <div className="form-group">
              <label className="form-label">Vendor Name</label>
              <input 
                type="text" 
                className="form-control" 
                value={formData.vendorName}
                onChange={(e) => handleInputChange('vendorName', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Vendor Address Details</label>
          <textarea 
            className="form-control" 
            rows={3}
            value={formData.vendorAddressDetails}
            onChange={(e) => handleInputChange('vendorAddressDetails', e.target.value)}
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit NOBI Request'}
        </button>
      </form>
    </div>
  )
}

export default NOBIFormApp