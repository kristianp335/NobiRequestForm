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
    return <div className="nobi-form-loading">Loading form data...</div>
  }

  return (
    <div className="sheet sheet-lg">
      <style>{`
        .nobi-form-loading {
          text-align: center;
          padding: 2rem;
        }
      `}</style>
      
      <div className="sheet-header">
        <h2 className="sheet-title">NOBI Request Form</h2>
      </div>
      
      <div className="sheet-section">
        {message && (
          <div className={`alert ${message.includes('Error') ? 'alert-danger alert-dismissible' : 'alert-success alert-dismissible'}`}>
            {message}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label className="control-label">Company *</label>
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
            
            <div className="col-md-6">
              <div className="form-group">
                <label className="control-label">Company Number</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.companyNumber}
                  onChange={(e) => handleInputChange('companyNumber', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label className="control-label">Contact Number</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.contactNumber}
                  onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                />
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="form-group">
                <label className="control-label">Cost Centre</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.costCentre}
                  onChange={(e) => handleInputChange('costCentre', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label className="control-label">Currency</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                />
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="form-group">
                <label className="control-label">Date *</label>
                <input 
                  type="date" 
                  className="form-control" 
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label className="control-label">General Ledger To Be Charged</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.generalLedgerToBeCharged}
                  onChange={(e) => handleInputChange('generalLedgerToBeCharged', e.target.value)}
                />
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="form-group">
                <label className="control-label">Invoice Net Amount</label>
                <input 
                  type="number" 
                  step="0.01"
                  className="form-control" 
                  value={formData.invoiceNetAmount}
                  onChange={(e) => handleInputChange('invoiceNetAmount', parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label className="control-label">Invoice VAT Amount</label>
                <input 
                  type="number" 
                  step="0.01"
                  className="form-control" 
                  value={formData.invoiceVatAmount}
                  onChange={(e) => handleInputChange('invoiceVatAmount', parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="form-group">
                <label className="control-label">Line Manager Full Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.lineManagerFullname}
                  onChange={(e) => handleInputChange('lineManagerFullname', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label className="control-label">Multiple Bank Account Number</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.multipleBankAccountNumberToBeUsed}
                  onChange={(e) => handleInputChange('multipleBankAccountNumberToBeUsed', e.target.value)}
                />
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="form-group">
                <label className="control-label">NOBI Category *</label>
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

          <div className="form-group">
            <label className="control-label">Requesting Department/Store</label>
            <input 
              type="text" 
              className="form-control" 
              value={formData.requestingDepartmentStore}
              onChange={(e) => handleInputChange('requestingDepartmentStore', e.target.value)}
            />
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label className="control-label">Requestor First Name *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.requestorFirstName}
                  onChange={(e) => handleInputChange('requestorFirstName', e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="form-group">
                <label className="control-label">Requestor Surname *</label>
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

          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label className="control-label">SAP Vendor Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.sAPVendorName}
                  onChange={(e) => handleInputChange('sAPVendorName', e.target.value)}
                />
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="form-group">
                <label className="control-label">SAP Vendor Number</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.sAPVendorNumber}
                  onChange={(e) => handleInputChange('sAPVendorNumber', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label className="control-label">Total Price</label>
                <input 
                  type="number" 
                  step="0.01"
                  className="form-control" 
                  value={formData.totalPrice}
                  onChange={(e) => handleInputChange('totalPrice', parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="form-group">
                <label className="control-label">Vendor Name</label>
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
            <label className="control-label">Vendor Address Details</label>
            <textarea 
              className="form-control" 
              rows={3}
              value={formData.vendorAddressDetails}
              onChange={(e) => handleInputChange('vendorAddressDetails', e.target.value)}
            />
          </div>

          <div className="sheet-footer">
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit NOBI Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NOBIFormApp