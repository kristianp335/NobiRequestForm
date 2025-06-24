import React, { useState, useEffect } from 'react'

interface Company {
  key: string
  name: string
}

interface NOBICategory {
  key: string
  name: string
}

interface Currency {
  code: string
  symbol: string
  name: string
  flag: string
}

interface FormData {
  company: Company
  companyNumber: string
  contactNumber: string
  costCentre: string
  currency: string
  date: string
  generalLedgerToBeCharged: string
  invoiceNetAmount: string | number
  invoiceVatAmount: string | number
  lineManagerFullname: string
  multipleBankAccountNumberToBeUsed: string
  nOBICategory: NOBICategory
  requestingDepartmentStore: string
  requestorFirstName: string
  requestorSurname: string
  sAPVendorName: string
  sAPVendorNumber: string
  totalPrice: string | number
  vendorAddressDetails: string
  vendorName: string
}

const NOBIFormApp: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([])
  const [nobiCategories, setNOBICategories] = useState<NOBICategory[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const totalPages = 2

  const currencies: Currency[] = [
    { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
    { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
    { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', flag: '🇦🇺' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', flag: '🇨🇦' },
    { code: 'CHF', symbol: '₣', name: 'Swiss Franc', flag: '🇨🇭' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', flag: '🇨🇳' },
    { code: 'SEK', symbol: 'kr', name: 'Swedish Krona', flag: '🇸🇪' },
    { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar', flag: '🇳🇿' },
    { code: 'MXN', symbol: '$', name: 'Mexican Peso', flag: '🇲🇽' },
    { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', flag: '🇸🇬' },
    { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar', flag: '🇭🇰' },
    { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone', flag: '🇳🇴' },
    { code: 'KRW', symbol: '₩', name: 'South Korean Won', flag: '🇰🇷' },
    { code: 'TRY', symbol: '₺', name: 'Turkish Lira', flag: '🇹🇷' },
    { code: 'RUB', symbol: '₽', name: 'Russian Ruble', flag: '🇷🇺' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳' },
    { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', flag: '🇧🇷' },
    { code: 'ZAR', symbol: 'R', name: 'South African Rand', flag: '🇿🇦' }
  ]
  
  const [formData, setFormData] = useState<FormData>({
    company: { key: '', name: '' },
    companyNumber: '',
    contactNumber: '',
    costCentre: '',
    currency: '',
    date: new Date().toISOString().split('T')[0],
    generalLedgerToBeCharged: '',
    invoiceNetAmount: '',
    invoiceVatAmount: '',
    lineManagerFullname: '',
    multipleBankAccountNumberToBeUsed: '',
    nOBICategory: { key: '', name: '' },
    requestingDepartmentStore: '',
    requestorFirstName: '',
    requestorSurname: '',
    sAPVendorName: '',
    sAPVendorNumber: '',
    totalPrice: '',
    vendorAddressDetails: '',
    vendorName: ''
  })

  // Get Liferay auth token
  const getAuthToken = () => {
    return (window as any).Liferay?.authToken || ''
  }

  // Fetch user account from Liferay API
  const fetchUserAccount = async () => {
    try {
      const authToken = getAuthToken()
      const response = await fetch(`/o/headless-admin-user/v1.0/my-user-account?p_auth=${authToken}`)
      const data = await response.json()
      if (data.givenName && data.familyName) {
        setFormData(prev => ({
          ...prev,
          requestorFirstName: data.givenName,
          requestorSurname: data.familyName
        }))
      }
    } catch (error) {
      console.error('Error fetching user account:', error)
    }
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
      await Promise.all([fetchUserAccount(), fetchCompanies(), fetchNOBICategories()])
      setLoading(false)
    }
    
    loadData()

    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('nobi-form-dark-mode')
    if (savedDarkMode === 'true') {
      setIsDarkMode(true)
    }
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    localStorage.setItem('nobi-form-dark-mode', newDarkMode.toString())
  }

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
      // Auto-generate random 4-digit company number
      const randomCompanyNumber = Math.floor(1000 + Math.random() * 9000).toString()
      handleInputChange('companyNumber', randomCompanyNumber)
    }
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedKey = e.target.value
    const selectedCategory = nobiCategories.find(c => c.key === selectedKey)
    if (selectedCategory) {
      handleInputChange('nOBICategory', selectedCategory)
    }
  }

  const calculateProgress = () => {
    const totalFields = 20
    let completedFields = 0
    
    if (formData.requestorFirstName) completedFields++
    if (formData.requestorSurname) completedFields++
    if (formData.company.key) completedFields++
    if (formData.companyNumber) completedFields++
    if (formData.contactNumber) completedFields++
    if (formData.costCentre) completedFields++
    if (formData.date) completedFields++
    if (formData.generalLedgerToBeCharged) completedFields++
    if (formData.lineManagerFullname) completedFields++
    if (formData.requestingDepartmentStore) completedFields++
    if (formData.sAPVendorName) completedFields++
    if (formData.sAPVendorNumber) completedFields++
    if (formData.vendorName) completedFields++
    if (formData.vendorAddressDetails) completedFields++
    if (formData.nOBICategory.key) completedFields++
    if (formData.multipleBankAccountNumberToBeUsed) completedFields++
    if (formData.currency) completedFields++
    if (formData.invoiceNetAmount && parseFloat(formData.invoiceNetAmount.toString()) > 0) completedFields++
    if (formData.invoiceVatAmount && parseFloat(formData.invoiceVatAmount.toString()) > 0) completedFields++
    if (formData.totalPrice && parseFloat(formData.totalPrice.toString()) > 0) completedFields++
    
    return Math.round((completedFields / totalFields) * 100)
  }

  const handleNext = () => {
    if (currentPage < totalPages && !isTransitioning) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentPage(currentPage + 1)
        setIsTransitioning(false)
      }, 150)
    }
  }

  const handlePrev = () => {
    if (currentPage > 1 && !isTransitioning) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentPage(currentPage - 1)
        setIsTransitioning(false)
      }, 150)
    }
  }

  const validateAmount = (value: string): string => {
    if (!value) return ''
    
    const numValue = parseFloat(value)
    if (isNaN(numValue)) return 'Please enter a valid number'
    if (numValue > 100000) return 'Amount cannot exceed £100,000'
    if (numValue < 0) return 'Amount cannot be negative'
    
    // Check for exactly 2 decimal places
    const decimalMatch = value.match(/\.(\d+)$/)
    if (decimalMatch && decimalMatch[1].length !== 2) {
      return 'Please enter exactly 2 decimal places (e.g., 123.45)'
    }
    
    return ''
  }

  const handleAmountChange = (field: keyof FormData, value: string) => {
    // Allow empty string, numbers, and decimal point
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      handleInputChange(field, value)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage('')

    try {
      const authToken = getAuthToken()
      
      // Convert currency code to symbol and ensure numeric values for submission
      const selectedCurrency = currencies.find(c => c.code === formData.currency)
      const submissionData = {
        ...formData,
        currency: selectedCurrency ? selectedCurrency.symbol : formData.currency,
        invoiceNetAmount: parseFloat(formData.invoiceNetAmount.toString()) || 0,
        invoiceVatAmount: parseFloat(formData.invoiceVatAmount.toString()) || 0,
        totalPrice: parseFloat(formData.totalPrice.toString()) || 0
      }
      
      const response = await fetch(`/o/c/nobprequests/?p_auth=${authToken}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
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
          invoiceNetAmount: '',
          invoiceVatAmount: '',
          lineManagerFullname: '',
          multipleBankAccountNumberToBeUsed: '',
          nOBICategory: { key: '', name: '' },
          requestingDepartmentStore: '',
          requestorFirstName: '',
          requestorSurname: '',
          sAPVendorName: '',
          sAPVendorNumber: '',
          totalPrice: '',
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

  const renderPageContent = () => {
    if (currentPage === 1) {
      return (
        <div className={`page-content ${isTransitioning ? 'transitioning' : ''}`}>
          <h3 className="section-title">Section 1: About You</h3>
          
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
                <label className="control-label">Company Number *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.companyNumber}
                  onChange={(e) => handleInputChange('companyNumber', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label className="control-label">Contact Number *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.contactNumber}
                  onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="form-group">
                <label className="control-label">Cost Centre *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.costCentre}
                  onChange={(e) => handleInputChange('costCentre', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="row">
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
            
            <div className="col-md-6">
              <div className="form-group">
                <label className="control-label">General Ledger To Be Charged *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.generalLedgerToBeCharged}
                  onChange={(e) => handleInputChange('generalLedgerToBeCharged', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="control-label">Line Manager Full Name *</label>
            <input 
              type="text" 
              className="form-control" 
              value={formData.lineManagerFullname}
              onChange={(e) => handleInputChange('lineManagerFullname', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="control-label">Requesting Department/Store *</label>
            <input 
              type="text" 
              className="form-control" 
              value={formData.requestingDepartmentStore}
              onChange={(e) => handleInputChange('requestingDepartmentStore', e.target.value)}
              required
            />
          </div>
        </div>
      )
    } else {
      return (
        <div className={`page-content ${isTransitioning ? 'transitioning' : ''}`}>
          <h3 className="section-title">Section 2: About the Vendor</h3>
          
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label className="control-label">SAP Vendor Name *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.sAPVendorName}
                  onChange={(e) => handleInputChange('sAPVendorName', e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="form-group">
                <label className="control-label">SAP Vendor Number *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.sAPVendorNumber}
                  onChange={(e) => handleInputChange('sAPVendorNumber', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="control-label">Vendor Name *</label>
            <input 
              type="text" 
              className="form-control" 
              value={formData.vendorName}
              onChange={(e) => handleInputChange('vendorName', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="control-label">Vendor Address Details *</label>
            <textarea 
              className="form-control" 
              rows={3}
              value={formData.vendorAddressDetails}
              onChange={(e) => handleInputChange('vendorAddressDetails', e.target.value)}
              required
            />
          </div>

          <div className="row">
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
            
            <div className="col-md-6">
              <div className="form-group">
                <label className="control-label">Multiple Bank Account Number *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.multipleBankAccountNumberToBeUsed}
                  onChange={(e) => handleInputChange('multipleBankAccountNumberToBeUsed', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label className="control-label">Currency *</label>
                <select 
                  className="form-control" 
                  value={formData.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                  required
                >
                  <option value="">Select Currency</option>
                  {currencies.map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.flag} {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="form-group">
                <label className="control-label">Invoice Net Amount *</label>
                <input 
                  type="text" 
                  className={`form-control ${validateAmount(formData.invoiceNetAmount.toString()) ? 'error' : ''}`}
                  value={formData.invoiceNetAmount}
                  onChange={(e) => handleAmountChange('invoiceNetAmount', e.target.value)}
                  placeholder="0.00"
                  required
                />
                {validateAmount(formData.invoiceNetAmount.toString()) && (
                  <div className="form-error">{validateAmount(formData.invoiceNetAmount.toString())}</div>
                )}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label className="control-label">Invoice VAT Amount *</label>
                <input 
                  type="text" 
                  className={`form-control ${validateAmount(formData.invoiceVatAmount.toString()) ? 'error' : ''}`}
                  value={formData.invoiceVatAmount}
                  onChange={(e) => handleAmountChange('invoiceVatAmount', e.target.value)}
                  placeholder="0.00"
                  required
                />
                {validateAmount(formData.invoiceVatAmount.toString()) && (
                  <div className="form-error">{validateAmount(formData.invoiceVatAmount.toString())}</div>
                )}
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="form-group">
                <label className="control-label">Total Price *</label>
                <input 
                  type="text" 
                  className={`form-control ${validateAmount(formData.totalPrice.toString()) ? 'error' : ''}`}
                  value={formData.totalPrice}
                  onChange={(e) => handleAmountChange('totalPrice', e.target.value)}
                  placeholder="0.00"
                  required
                />
                {validateAmount(formData.totalPrice.toString()) && (
                  <div className="form-error">{validateAmount(formData.totalPrice.toString())}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )
    }
  }

  if (loading) {
    return <div className="nobi-form-loading">Loading form data...</div>
  }

  return (
    <div className={`sheet sheet-lg nobi-form-container ${isDarkMode ? 'dark' : ''}`}>
      <button 
        className="dark-mode-toggle"
        onClick={toggleDarkMode}
        title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>
      <style>{`
        .nobi-form-container {
          transition: background-color 0.3s ease, color 0.3s ease;
          position: relative;
        }
        .nobi-form-container.dark {
          background-color: #2d2d2d;
          color: #e9ecef;
        }
        .nobi-form-container.dark .sheet {
          background-color: #2d2d2d;
          border-color: #404040;
        }
        .nobi-form-container.dark .form-control {
          background-color: #404040;
          border-color: #555;
          color: #e9ecef;
        }
        .nobi-form-container.dark .form-control:focus {
          background-color: #4a4a4a;
          border-color: var(--btn-primary-background-color, #007bff);
          box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
        }
        .nobi-form-container.dark .control-label {
          color: #e9ecef;
        }
        .nobi-form-container.dark .section-title {
          color: #e9ecef;
        }
        .nobi-form-container.dark .sheet-title {
          color: #e9ecef;
        }
        .nobi-form-container.dark .btn-primary {
          background-color: var(--btn-primary-background-color, #007bff);
          border-color: var(--btn-primary-background-color, #007bff);
        }
        .nobi-form-container.dark .btn-secondary {
          background-color: #6c757d;
          border-color: #6c757d;
          color: #fff;
        }
        .nobi-form-container.dark .page-dot {
          background-color: #555;
        }
        .nobi-form-container.dark .page-dot.active {
          background-color: var(--btn-primary-background-color, #007bff);
        }
        .nobi-form-container.dark .form-control.error {
          border-color: #dc3545;
          background-color: #4a2c2c;
        }
        .nobi-form-container.dark .progress-container {
          background-color: #404040;
        }
        .nobi-form-container.dark .progress-bar {
          background-color: #555;
        }
        .dark-mode-toggle {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: 1px solid #dee2e6;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          transition: all 0.3s ease;
          z-index: 10;
        }
        .nobi-form-container.dark .dark-mode-toggle {
          border-color: #555;
          color: #e9ecef;
        }
        .dark-mode-toggle:hover {
          background-color: #f8f9fa;
        }
        .nobi-form-container.dark .dark-mode-toggle:hover {
          background-color: #404040;
        }
        .nobi-form-loading {
          text-align: center;
          padding: 2rem;
        }
        .progress-container {
          margin: 1rem 0 2rem 0;
          background: #f8f9fa;
          border-radius: 8px;
          padding: 1rem;
        }
        .progress-bar {
          width: 100%;
          height: 8px;
          background-color: #e9ecef;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--btn-primary-background-color, #007bff), var(--btn-primary-background-color, #0056b3));
          border-radius: 4px;
          transition: width 0.3s ease;
          position: relative;
        }
        .progress-fill::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer {
          0% { 
            transform: translateX(-100%);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% { 
            transform: translateX(100%);
            opacity: 0;
          }
        }
        .progress-text {
          font-size: 0.875rem;
          color: #6c757d;
          text-align: center;
        }
        .page-navigation {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 2rem;
        }
        .page-indicator {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }
        .page-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: #dee2e6;
          transition: background-color 0.3s ease;
        }
        .page-dot.active {
          background-color: var(--btn-primary-background-color, #007bff);
        }
        .section-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #495057;
          margin-bottom: 1.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid var(--btn-primary-background-color, #007bff);
        }
        .page-content {
          animation: fadeInSlide 0.4s ease-out;
          opacity: 1;
          transform: translateX(0);
        }
        .page-content.transitioning {
          opacity: 0;
          transform: translateX(-10px);
          transition: opacity 0.15s ease-in, transform 0.15s ease-in;
        }
        @keyframes fadeInSlide {
          0% {
            opacity: 0;
            transform: translateX(20px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .form-error {
          color: #dc3545;
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }
        .form-control.error {
          border-color: #dc3545;
          box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
        }
      `}</style>
      
      <div className="sheet-header">
        <h2 className="sheet-title">NOBI Request Form</h2>
      </div>
      
      <div className="sheet-section">
        {/* Progress Indicator */}
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
          <div className="progress-text">
            Progress: {calculateProgress()}% Complete
          </div>
        </div>

        {message && (
          <div className={`alert ${message.includes('Error') ? 'alert-danger alert-dismissible' : 'alert-success alert-dismissible'}`}>
            {message}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {renderPageContent()}

          {/* Page Navigation */}
          <div className="page-navigation">
            <div>
              {currentPage > 1 && (
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={handlePrev}
                >
                  ← Previous
                </button>
              )}
            </div>
            
            <div className="page-indicator">
              {Array.from({ length: totalPages }, (_, i) => (
                <div 
                  key={i} 
                  className={`page-dot ${currentPage === i + 1 ? 'active' : ''}`}
                ></div>
              ))}
            </div>
            
            <div>
              {currentPage < totalPages ? (
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={handleNext}
                >
                  Next →
                </button>
              ) : (
                <button 
                  type="submit" 
                  className="btn btn-success" 
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit NOBI Request'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NOBIFormApp