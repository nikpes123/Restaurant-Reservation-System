"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleMap, Marker, StandaloneSearchBox, useJsApiLoader } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = 'AIzaSyBie-S4ED-xXW6R1ZCBykpPrlRCM8tDtOk'; // <-- User's real key
const mapContainerStyle = { width: '100%', height: '300px', borderRadius: '1rem', marginBottom: '1.5rem' };
const defaultCenter = { lat: 40.7128, lng: -74.0060 }; // Default to New York

const currencySymbols = {
  'AED': 'د.إ', // UAE Dirham
  'AFN': '؋', // Afghan Afghani
  'ALL': 'L', // Albanian Lek
  'AMD': '֏', // Armenian Dram
  'ANG': 'ƒ', // Netherlands Antillean Guilder
  'AOA': 'Kz', // Angolan Kwanza
  'ARS': '$', // Argentine Peso
  'AUD': 'A$', // Australian Dollar
  'AWG': 'ƒ', // Aruban Florin
  'AZN': '₼', // Azerbaijani Manat
  'BAM': 'KM', // Bosnia-Herzegovina Convertible Mark
  'BBD': '$', // Barbadian Dollar
  'BDT': '৳', // Bangladeshi Taka
  'BGN': 'лв', // Bulgarian Lev
  'BHD': '.د.ب', // Bahraini Dinar
  'BIF': 'FBu', // Burundian Franc
  'BMD': '$', // Bermudan Dollar
  'BND': '$', // Brunei Dollar
  'BOB': 'Bs.', // Bolivian Boliviano
  'BRL': 'R$', // Brazilian Real
  'BSD': '$', // Bahamian Dollar
  'BTN': 'Nu.', // Bhutanese Ngultrum
  'BWP': 'P', // Botswanan Pula
  'BYN': 'Br', // Belarusian Ruble
  'BZD': '$', // Belize Dollar
  'CAD': 'C$', // Canadian Dollar
  'CDF': 'FC', // Congolese Franc
  'CHF': 'Fr', // Swiss Franc
  'CLP': '$', // Chilean Peso
  'CNY': '¥', // Chinese Yuan
  'COP': '$', // Colombian Peso
  'CRC': '₡', // Costa Rican Colón
  'CUP': '$', // Cuban Peso
  'CVE': '$', // Cape Verdean Escudo
  'CZK': 'Kč', // Czech Koruna
  'DJF': 'Fdj', // Djiboutian Franc
  'DKK': 'kr', // Danish Krone
  'DOP': '$', // Dominican Peso
  'DZD': 'د.ج', // Algerian Dinar
  'EGP': '£', // Egyptian Pound
  'ERN': 'Nfk', // Eritrean Nakfa
  'ETB': 'Br', // Ethiopian Birr
  'EUR': '€', // Euro
  'FJD': '$', // Fijian Dollar
  'FKP': '£', // Falkland Islands Pound
  'FOK': 'kr', // Faroese Króna
  'GBP': '£', // British Pound
  'GEL': '₾', // Georgian Lari
  'GGP': '£', // Guernsey Pound
  'GHS': '₵', // Ghanaian Cedi
  'GIP': '£', // Gibraltar Pound
  'GMD': 'D', // Gambian Dalasi
  'GNF': 'FG', // Guinean Franc
  'GTQ': 'Q', // Guatemalan Quetzal
  'GYD': '$', // Guyanese Dollar
  'HKD': 'HK$', // Hong Kong Dollar
  'HNL': 'L', // Honduran Lempira
  'HRK': 'kn', // Croatian Kuna
  'HTG': 'G', // Haitian Gourde
  'HUF': 'Ft', // Hungarian Forint
  'IDR': 'Rp', // Indonesian Rupiah
  'ILS': '₪', // Israeli New Shekel
  'IMP': '£', // Manx Pound
  'INR': '₹', // Indian Rupee
  'IQD': 'ع.د', // Iraqi Dinar
  'IRR': '﷼', // Iranian Rial
  'ISK': 'kr', // Icelandic Króna
  'JEP': '£', // Jersey Pound
  'JMD': '$', // Jamaican Dollar
  'JOD': 'د.ا', // Jordanian Dinar
  'JPY': '¥', // Japanese Yen
  'KES': 'KSh', // Kenyan Shilling
  'KGS': 'с', // Kyrgystani Som
  'KHR': '៛', // Cambodian Riel
  'KID': '$', // Kiribati Dollar
  'KMF': 'CF', // Comorian Franc
  'KRW': '₩', // South Korean Won
  'KWD': 'د.ك', // Kuwaiti Dinar
  'KYD': '$', // Cayman Islands Dollar
  'KZT': '₸', // Kazakhstani Tenge
  'LAK': '₭', // Laotian Kip
  'LBP': 'ل.ل', // Lebanese Pound
  'LKR': 'Rs', // Sri Lankan Rupee
  'LRD': '$', // Liberian Dollar
  'LSL': 'L', // Lesotho Loti
  'LYD': 'ل.د', // Libyan Dinar
  'MAD': 'د.م.', // Moroccan Dirham
  'MDL': 'L', // Moldovan Leu
  'MGA': 'Ar', // Malagasy Ariary
  'MKD': 'ден', // Macedonian Denar
  'MMK': 'K', // Myanmar Kyat
  'MNT': '₮', // Mongolian Tugrik
  'MOP': 'MOP$', // Macanese Pataca
  'MRU': 'UM', // Mauritanian Ouguiya
  'MUR': '₨', // Mauritian Rupee
  'MVR': 'ރ', // Maldivian Rufiyaa
  'MWK': 'MK', // Malawian Kwacha
  'MXN': 'Mex$', // Mexican Peso
  'MYR': 'RM', // Malaysian Ringgit
  'MZN': 'MT', // Mozambican Metical
  'NAD': '$', // Namibian Dollar
  'NGN': '₦', // Nigerian Naira
  'NIO': 'C$', // Nicaraguan Córdoba
  'NOK': 'kr', // Norwegian Krone
  'NPR': '₨', // Nepalese Rupee
  'NZD': 'NZ$', // New Zealand Dollar
  'OMR': 'ر.ع.', // Omani Rial
  'PAB': 'B/.', // Panamanian Balboa
  'PEN': 'S/', // Peruvian Sol
  'PGK': 'K', // Papua New Guinean Kina
  'PHP': '₱', // Philippine Peso
  'PKR': '₨', // Pakistani Rupee
  'PLN': 'zł', // Polish Złoty
  'PYG': '₲', // Paraguayan Guarani
  'QAR': 'ر.ق', // Qatari Rial
  'RON': 'lei', // Romanian Leu
  'RSD': 'дин.', // Serbian Dinar
  'RUB': '₽', // Russian Ruble
  'RWF': 'FRw', // Rwandan Franc
  'SAR': 'ر.س', // Saudi Riyal
  'SBD': '$', // Solomon Islands Dollar
  'SCR': '₨', // Seychellois Rupee
  'SDG': 'ج.س.', // Sudanese Pound
  'SEK': 'kr', // Swedish Krona
  'SGD': 'S$', // Singapore Dollar
  'SHP': '£', // Saint Helena Pound
  'SLE': 'Le', // Sierra Leonean Leone
  'SLL': 'Le', // Sierra Leonean Leone
  'SOS': 'Sh.So.', // Somali Shilling
  'SRD': '$', // Surinamese Dollar
  'SSP': '£', // South Sudanese Pound
  'STN': 'Db', // São Tomé and Príncipe Dobra
  'SYP': '£', // Syrian Pound
  'SZL': 'L', // Swazi Lilangeni
  'THB': '฿', // Thai Baht
  'TJS': 'ЅМ', // Tajikistani Somoni
  'TMT': 'm', // Turkmenistani Manat
  'TND': 'د.ت', // Tunisian Dinar
  'TOP': 'T$', // Tongan Paʻanga
  'TRY': '₺', // Turkish Lira
  'TTD': '$', // Trinidad and Tobago Dollar
  'TVD': '$', // Tuvaluan Dollar
  'TWD': 'NT$', // New Taiwan Dollar
  'TZS': 'TSh', // Tanzanian Shilling
  'UAH': '₴', // Ukrainian Hryvnia
  'UGX': 'USh', // Ugandan Shilling
  'USD': '$', // US Dollar
  'UYU': '$U', // Uruguayan Peso
  'UZS': "so'm", // Uzbekistani Som
  'VES': 'Bs.S', // Venezuelan Bolívar
  'VND': '₫', // Vietnamese Dong
  'VUV': 'VT', // Vanuatu Vatu
  'WST': 'WS$', // Samoan Tala
  'XAF': 'FCFA', // Central African CFA Franc
  'XCD': '$', // East Caribbean Dollar
  'XDR': 'SDR', // Special Drawing Rights
  'XOF': 'CFA', // West African CFA Franc
  'XPF': '₣', // CFP Franc
  'YER': '﷼', // Yemeni Rial
  'ZAR': 'R', // South African Rand
  'ZMW': 'ZK', // Zambian Kwacha
  'ZWL': '$' // Zimbabwean Dollar
};

const currencyNames = {
  'AED': 'UAE Dirham',
  'AFN': 'Afghan Afghani',
  'ALL': 'Albanian Lek',
  'AMD': 'Armenian Dram',
  'ANG': 'Netherlands Antillean Guilder',
  'AOA': 'Angolan Kwanza',
  'ARS': 'Argentine Peso',
  'AUD': 'Australian Dollar',
  'AWG': 'Aruban Florin',
  'AZN': 'Azerbaijani Manat',
  'BAM': 'Bosnia-Herzegovina Convertible Mark',
  'BBD': 'Barbadian Dollar',
  'BDT': 'Bangladeshi Taka',
  'BGN': 'Bulgarian Lev',
  'BHD': 'Bahraini Dinar',
  'BIF': 'Burundian Franc',
  'BMD': 'Bermudan Dollar',
  'BND': 'Brunei Dollar',
  'BOB': 'Bolivian Boliviano',
  'BRL': 'Brazilian Real',
  'BSD': 'Bahamian Dollar',
  'BTN': 'Bhutanese Ngultrum',
  'BWP': 'Botswanan Pula',
  'BYN': 'Belarusian Ruble',
  'BZD': 'Belize Dollar',
  'CAD': 'Canadian Dollar',
  'CDF': 'Congolese Franc',
  'CHF': 'Swiss Franc',
  'CLP': 'Chilean Peso',
  'CNY': 'Chinese Yuan',
  'COP': 'Colombian Peso',
  'CRC': 'Costa Rican Colón',
  'CUP': 'Cuban Peso',
  'CVE': 'Cape Verdean Escudo',
  'CZK': 'Czech Koruna',
  'DJF': 'Djiboutian Franc',
  'DKK': 'Danish Krone',
  'DOP': 'Dominican Peso',
  'DZD': 'Algerian Dinar',
  'EGP': 'Egyptian Pound',
  'ERN': 'Eritrean Nakfa',
  'ETB': 'Ethiopian Birr',
  'EUR': 'Euro',
  'FJD': 'Fijian Dollar',
  'FKP': 'Falkland Islands Pound',
  'FOK': 'Faroese Króna',
  'GBP': 'British Pound',
  'GEL': 'Georgian Lari',
  'GGP': 'Guernsey Pound',
  'GHS': 'Ghanaian Cedi',
  'GIP': 'Gibraltar Pound',
  'GMD': 'Gambian Dalasi',
  'GNF': 'Guinean Franc',
  'GTQ': 'Guatemalan Quetzal',
  'GYD': 'Guyanese Dollar',
  'HKD': 'Hong Kong Dollar',
  'HNL': 'Honduran Lempira',
  'HRK': 'Croatian Kuna',
  'HTG': 'Haitian Gourde',
  'HUF': 'Hungarian Forint',
  'IDR': 'Indonesian Rupiah',
  'ILS': 'Israeli New Shekel',
  'IMP': 'Manx Pound',
  'INR': 'Indian Rupee',
  'IQD': 'Iraqi Dinar',
  'IRR': 'Iranian Rial',
  'ISK': 'Icelandic Króna',
  'JEP': 'Jersey Pound',
  'JMD': 'Jamaican Dollar',
  'JOD': 'Jordanian Dinar',
  'JPY': 'Japanese Yen',
  'KES': 'Kenyan Shilling',
  'KGS': 'Kyrgystani Som',
  'KHR': 'Cambodian Riel',
  'KID': 'Kiribati Dollar',
  'KMF': 'Comorian Franc',
  'KRW': 'South Korean Won',
  'KWD': 'Kuwaiti Dinar',
  'KYD': 'Cayman Islands Dollar',
  'KZT': 'Kazakhstani Tenge',
  'LAK': 'Laotian Kip',
  'LBP': 'Lebanese Pound',
  'LKR': 'Sri Lankan Rupee',
  'LRD': 'Liberian Dollar',
  'LSL': 'Lesotho Loti',
  'LYD': 'Libyan Dinar',
  'MAD': 'Moroccan Dirham',
  'MDL': 'Moldovan Leu',
  'MGA': 'Malagasy Ariary',
  'MKD': 'Macedonian Denar',
  'MMK': 'Myanmar Kyat',
  'MNT': 'Mongolian Tugrik',
  'MOP': 'Macanese Pataca',
  'MRU': 'Mauritanian Ouguiya',
  'MUR': 'Mauritian Rupee',
  'MVR': 'Maldivian Rufiyaa',
  'MWK': 'Malawian Kwacha',
  'MXN': 'Mexican Peso',
  'MYR': 'Malaysian Ringgit',
  'MZN': 'Mozambican Metical',
  'NAD': 'Namibian Dollar',
  'NGN': 'Nigerian Naira',
  'NIO': 'Nicaraguan Córdoba',
  'NOK': 'Norwegian Krone',
  'NPR': 'Nepalese Rupee',
  'NZD': 'New Zealand Dollar',
  'OMR': 'Omani Rial',
  'PAB': 'Panamanian Balboa',
  'PEN': 'Peruvian Sol',
  'PGK': 'Papua New Guinean Kina',
  'PHP': 'Philippine Peso',
  'PKR': 'Pakistani Rupee',
  'PLN': 'Polish Złoty',
  'PYG': 'Paraguayan Guarani',
  'QAR': 'Qatari Rial',
  'RON': 'Romanian Leu',
  'RSD': 'Serbian Dinar',
  'RUB': 'Russian Ruble',
  'RWF': 'Rwandan Franc',
  'SAR': 'Saudi Riyal',
  'SBD': 'Solomon Islands Dollar',
  'SCR': 'Seychellois Rupee',
  'SDG': 'Sudanese Pound',
  'SEK': 'Swedish Krona',
  'SGD': 'Singapore Dollar',
  'SHP': 'Saint Helena Pound',
  'SLE': 'Sierra Leonean Leone',
  'SLL': 'Sierra Leonean Leone',
  'SOS': 'Somali Shilling',
  'SRD': 'Surinamese Dollar',
  'SSP': 'South Sudanese Pound',
  'STN': 'São Tomé and Príncipe Dobra',
  'SYP': 'Syrian Pound',
  'SZL': 'Swazi Lilangeni',
  'THB': 'Thai Baht',
  'TJS': 'Tajikistani Somoni',
  'TMT': 'Turkmenistani Manat',
  'TND': 'Tunisian Dinar',
  'TOP': 'Tongan Paʻanga',
  'TRY': 'Turkish Lira',
  'TTD': 'Trinidad and Tobago Dollar',
  'TVD': 'Tuvaluan Dollar',
  'TWD': 'New Taiwan Dollar',
  'TZS': 'Tanzanian Shilling',
  'UAH': 'Ukrainian Hryvnia',
  'UGX': 'Ugandan Shilling',
  'USD': 'US Dollar',
  'UYU': 'Uruguayan Peso',
  'UZS': "Uzbekistani Som",
  'VES': 'Venezuelan Bolívar',
  'VND': 'Vietnamese Dong',
  'VUV': 'Vanuatu Vatu',
  'WST': 'Samoan Tala',
  'XAF': 'Central African CFA Franc',
  'XCD': 'East Caribbean Dollar',
  'XDR': 'Special Drawing Rights',
  'XOF': 'West African CFA Franc',
  'XPF': 'CFP Franc',
  'YER': 'Yemeni Rial',
  'ZAR': 'South African Rand',
  'ZMW': 'Zambian Kwacha',
  'ZWL': 'Zimbabwean Dollar'
};

const formatPrice = (price, currency) => {
  const symbol = currencySymbols[currency] || currency;
  return `${symbol} ${price}`;
};

const categoryOptions = [
  'Starters',
  'Beverages',
  'Main Course',
  'Special',
  'Desserts',
  'Other'
];

export default function RestaurantDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [restaurantInfo, setRestaurantInfo] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    description: '',
    openingHours: '',
    tables: [],
    waitingTime: 10,
    currency: 'USD',
  });
  const [originalRestaurantInfo, setOriginalRestaurantInfo] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [menuForm, setMenuForm] = useState({ name: '', description: '', price: '', category: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editingItemId, setEditingItemId] = useState(null);
  const [menuLoading, setMenuLoading] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [searchBox, setSearchBox] = useState(null);
  const [customCategory, setCustomCategory] = useState('');
  const [currencySearch, setCurrencySearch] = useState('');
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const currencyDropdownRef = useRef(null);
  const [newTable, setNewTable] = useState({ tableNumber: '', seats: '', status: 'Available' });
  const [expandedMenuItems, setExpandedMenuItems] = useState([]);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (currencyDropdownRef.current && !currencyDropdownRef.current.contains(event.target)) {
        setCurrencyDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  useEffect(() => {
    // Check if user is logged in and is a restaurant owner
    const token = localStorage.getItem('token');
    if (!token) {
      handleLogout();
      return;
    }
    // Fetch restaurant data
    fetchRestaurantData();
    // Log out on refresh
    window.addEventListener('beforeunload', handleLogout);
    return () => {
      window.removeEventListener('beforeunload', handleLogout);
    };
  }, []);

  const fetchRestaurantData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/restaurants/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch restaurant data');
      }
      const data = await response.json();
      setRestaurantInfo(data.restaurantInfo);
      setOriginalRestaurantInfo(data.restaurantInfo); // Store original for diff
      setMenuItems(data.menuItems || []);
      setReservations(data.reservations || []);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleRestaurantInfoUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      // Only send fields that have changed
      const changedFields = {};
      if (originalRestaurantInfo) {
        Object.keys(restaurantInfo).forEach(key => {
          // For tables, do a JSON string compare
          if (key === 'tables') {
            if (JSON.stringify(restaurantInfo.tables) !== JSON.stringify(originalRestaurantInfo.tables)) {
              changedFields.tables = restaurantInfo.tables;
            }
          } else if (restaurantInfo[key] !== originalRestaurantInfo[key]) {
            changedFields[key] = restaurantInfo[key];
          }
        });
      } else {
        Object.assign(changedFields, restaurantInfo);
      }
      if (Object.keys(changedFields).length === 0) {
        alert('No changes to update.');
        return;
      }
      const response = await fetch('http://localhost:5000/api/restaurants/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(changedFields)
      });
      if (!response.ok) {
        throw new Error('Failed to update restaurant information');
      }
      alert('Restaurant information updated successfully!');
      // Update original info to new info
      setOriginalRestaurantInfo({ ...restaurantInfo });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReservationAction = async (reservationId, action) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/reservations/${reservationId}/${action}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} reservation`);
      }

      // Refresh reservations list
      fetchRestaurantData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleMenuInputChange = (e) => {
    if (e.target.name === 'category') {
      setMenuForm({ ...menuForm, category: e.target.value });
      if (e.target.value !== 'Other') setCustomCategory('');
    } else {
      setMenuForm({ ...menuForm, [e.target.name]: e.target.value });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    setMenuLoading(true);
    const token = localStorage.getItem('token');
    const categoryToSend = menuForm.category === 'Other' ? customCategory : menuForm.category;
    const formData = new FormData();
    formData.append('name', menuForm.name);
    formData.append('description', menuForm.description);
    formData.append('price', menuForm.price);
    formData.append('category', categoryToSend);
    if (imageFile) formData.append('image', imageFile);
    await fetch('http://localhost:5000/api/restaurants/menu', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    setMenuForm({ name: '', description: '', price: '', category: '' });
    setCustomCategory('');
    setImageFile(null);
    setImagePreview(null);
    setEditingItemId(null);
    setMenuLoading(false);
    fetchRestaurantData();
  };

  const handleEditMenuItem = (item) => {
    setMenuForm({ name: item.name, description: item.description, price: item.price, category: item.category });
    setCustomCategory(item.category === 'Other' ? item.category : '');
    setEditingItemId(item._id);
    setImageFile(null);
    setImagePreview(item.image ? `data:image/jpeg;base64,${arrayBufferToBase64(item.image.data)}` : null);
  };

  const handleUpdateMenuItem = async (e) => {
    e.preventDefault();
    setMenuLoading(true);
    const token = localStorage.getItem('token');
    const categoryToSend = menuForm.category === 'Other' ? customCategory : menuForm.category;
    const formData = new FormData();
    formData.append('name', menuForm.name);
    formData.append('description', menuForm.description);
    formData.append('price', menuForm.price);
    formData.append('category', categoryToSend);
    if (imageFile) formData.append('image', imageFile);
    await fetch(`http://localhost:5000/api/restaurants/menu/${editingItemId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    setMenuForm({ name: '', description: '', price: '', category: '' });
    setCustomCategory('');
    setImageFile(null);
    setImagePreview(null);
    setEditingItemId(null);
    setMenuLoading(false);
    fetchRestaurantData();
  };

  const handleDeleteMenuItem = async (itemId) => {
    if (!window.confirm('Delete this menu item?')) return;
    const token = localStorage.getItem('token');
    await fetch(`http://localhost:5000/api/restaurants/menu/${itemId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchRestaurantData();
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/restaurants/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(passwordForm)
      });

      if (!response.ok) {
        throw new Error('Failed to change password');
      }

      const data = await response.json();
      setPasswordError('');
      setPasswordSuccess(data.message);
      // Log out and redirect to login page after password change
      setTimeout(() => {
        handleLogout();
      }, 1500);
    } catch (err) {
      setPasswordError(err.message);
    }
  };

  // When address changes, optionally update map center (optional, not required for now)

  // Geocode address to lat/lng if needed (optional)

  // Handle place selection from search box
  const onPlacesChanged = () => {
    if (searchBox) {
      const places = searchBox.getPlaces();
      if (places && places.length > 0) {
        const place = places[0];
        const location = place.geometry.location;
        setMapCenter({ lat: location.lat(), lng: location.lng() });
        setMarkerPosition({ lat: location.lat(), lng: location.lng() });
        // Use formatted address if available
        setRestaurantInfo({ ...restaurantInfo, address: place.formatted_address || place.name });
      }
    }
  };

  // Handle map click
  const onMapClick = (e) => {
    setMarkerPosition({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    // Reverse geocode to get address (optional, not implemented here)
  };

  function arrayBufferToBase64(buffer) {
    if (!buffer) return '';
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">{restaurantInfo.name}</h1>
              <p className="text-blue-100">{restaurantInfo.address}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Logout
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-4 font-medium text-sm ${activeTab === 'overview' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('reservations')}
                className={`px-6 py-4 font-medium text-sm ${activeTab === 'reservations' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Reservations
              </button>
              <button
                onClick={() => setActiveTab('menu')}
                className={`px-6 py-4 font-medium text-sm ${activeTab === 'menu' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Menu Management
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-6 py-4 font-medium text-sm ${activeTab === 'settings' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Settings
              </button>
            </nav>
          </div>

          {/* Content Area */}
          <div className="p-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Today's Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-blue-800">Total Reservations</h3>
                    <p className="text-3xl font-bold text-blue-600">{reservations.length}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-green-800">Available Tables</h3>
                    <p className="text-3xl font-bold text-green-600">{restaurantInfo.tables.length}</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-yellow-800">Average Waiting Time</h3>
                    <p className="text-3xl font-bold text-yellow-600">{restaurantInfo.waitingTime} min</p>
                  </div>
                </div>
              </div>
            )}

            {/* Reservations Tab */}
            {activeTab === 'reservations' && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Manage Reservations</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Party Size</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {reservations.map((reservation) => (
                        <tr key={reservation._id}>
                          <td className="px-6 py-4 whitespace-nowrap">{reservation.customerName}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{new Date(reservation.dateTime).toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{reservation.partySize}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {reservation.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {reservation.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleReservationAction(reservation._id, 'approve')}
                                  className="text-green-600 hover:text-green-900 mr-2"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleReservationAction(reservation._id, 'reject')}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Menu Management Tab */}
            {activeTab === 'menu' && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Menu Management</h2>
                <div className="flex justify-end mb-6">
                  <button
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold shadow"
                    onClick={() => router.push('/dashboard/menu/new')}
                  >
                    Add Menu Item
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {menuItems.map((item) => {
                    const isExpanded = expandedMenuItems.includes(item._id);
                    const shortDesc = item.description && item.description.length > 120 ? item.description.slice(0, 120) + '...' : item.description;
                    return (
                      <div
                        key={item._id}
                        className="border rounded-lg p-4 flex flex-col bg-white shadow"
                        style={{ minHeight: 420, height: isExpanded ? 'auto' : 420 }}
                      >
                        {item.image && (
                          <img
                            src={`data:image/jpeg;base64,${arrayBufferToBase64(item.image.data)}`}
                            alt={item.name}
                            className="w-full h-40 object-cover rounded mb-2"
                          />
                        )}
                        <h3 className="font-medium text-lg text-gray-900 mb-1">{item.name}</h3>
                        <span className="text-xs text-blue-600 font-semibold mb-1">{item.category}</span>
                        <p className="text-gray-700 mb-2" style={{ whiteSpace: 'pre-line' }}>
                          {isExpanded ? item.description : shortDesc}
                          {item.description && item.description.length > 120 && (
                            <button
                              type="button"
                              className="text-blue-500 ml-2 underline text-xs"
                              onClick={() => {
                                setExpandedMenuItems(isExpanded
                                  ? expandedMenuItems.filter(id => id !== item._id)
                                  : [...expandedMenuItems, item._id]);
                              }}
                            >
                              {isExpanded ? 'See Less' : 'See More'}
                            </button>
                          )}
                        </p>
                        <p className="font-bold mt-auto text-gray-800">{formatPrice(item.price, restaurantInfo.currency)}</p>
                        <div className="mt-2 flex gap-2">
                          <button
                            onClick={() => router.push(`/dashboard/menu/edit/${item._id}`)}
                            className="text-blue-600 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteMenuItem(item._id)}
                            className="text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Restaurant Settings</h2>
                <div className="bg-white rounded-xl shadow-lg p-8">
                  {/* Google Maps Integration */}
                  {loadError && <div className="text-red-600">Error loading maps</div>}
                  {!isLoaded && !loadError && <div>Loading map...</div>}
                  {isLoaded && (
                    <>
                      <StandaloneSearchBox
                        onLoad={ref => setSearchBox(ref)}
                        onPlacesChanged={onPlacesChanged}
                      >
                        <input
                          type="text"
                          placeholder="Search for your address or place"
                          className="mb-4 w-full px-4 py-2 border-2 border-blue-400 rounded-lg focus:outline-none focus:border-blue-600"
                          style={{ fontSize: '1rem' }}
                        />
                      </StandaloneSearchBox>
                      <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={markerPosition || mapCenter}
                        zoom={markerPosition ? 16 : 12}
                        onClick={onMapClick}
                      >
                        {markerPosition && <Marker position={markerPosition} />}
                      </GoogleMap>
                    </>
                  )}
                  {/* End Google Maps Integration */}
                  <form onSubmit={handleRestaurantInfoUpdate} className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-1">Restaurant Name</label>
                      <input
                        type="text"
                        value={restaurantInfo.name}
                        onChange={(e) => setRestaurantInfo({...restaurantInfo, name: e.target.value})}
                        className="mt-1 block w-full rounded-lg border-gray-700 text-gray-900 border-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2 bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-1">Phone</label>
                      <input
                        type="text"
                        value={restaurantInfo.phone}
                        onChange={(e) => setRestaurantInfo({...restaurantInfo, phone: e.target.value})}
                        className="mt-1 block w-full rounded-lg border-gray-700 text-gray-900 border-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2 bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-1">Address</label>
                      <input
                        type="text"
                        value={restaurantInfo.address}
                        onChange={(e) => setRestaurantInfo({...restaurantInfo, address: e.target.value})}
                        className="mt-1 block w-full rounded-lg border-gray-700 text-gray-900 border-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2 bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-1">Description</label>
                      <input
                        type="text"
                        value={restaurantInfo.description}
                        onChange={(e) => setRestaurantInfo({...restaurantInfo, description: e.target.value})}
                        className="mt-1 block w-full rounded-lg border-gray-700 text-gray-900 border-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2 bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-1">Opening Hours</label>
                      <input
                        type="text"
                        value={restaurantInfo.openingHours}
                        onChange={(e) => setRestaurantInfo({...restaurantInfo, openingHours: e.target.value})}
                        className="mt-1 block w-full rounded-lg border-gray-700 text-gray-900 border-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2 bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-1">Tables</label>
                      <div className="space-y-2 mb-2">
                        {restaurantInfo.tables && restaurantInfo.tables.length > 0 ? (
                          restaurantInfo.tables.map((table, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <span>Table #{table.tableNumber} - Seats: {table.seats} - Status: {table.status}</span>
                              <button type="button" className="text-red-600 hover:underline" onClick={() => {
                                setRestaurantInfo({
                                  ...restaurantInfo,
                                  tables: restaurantInfo.tables.filter((_, i) => i !== idx)
                                });
                              }}>Remove</button>
                            </div>
                          ))
                        ) : (
                          <span className="text-gray-500">No tables added yet.</span>
                        )}
                      </div>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="number"
                          placeholder="Table Number"
                          value={newTable.tableNumber}
                          onChange={e => setNewTable({ ...newTable, tableNumber: e.target.value })}
                          className="border-2 border-gray-700 text-gray-900 rounded px-2 py-1 bg-gray-50 focus:border-blue-500 focus:ring-blue-500"
                          min="1"
                        />
                        <input
                          type="number"
                          placeholder="Seats"
                          value={newTable.seats}
                          onChange={e => setNewTable({ ...newTable, seats: e.target.value })}
                          className="border-2 border-gray-700 text-gray-900 rounded px-2 py-1 bg-gray-50 focus:border-blue-500 focus:ring-blue-500"
                          min="1"
                        />
                        <select
                          value={newTable.status}
                          onChange={e => setNewTable({ ...newTable, status: e.target.value })}
                          className="border-2 border-gray-700 text-gray-900 rounded px-2 py-1 bg-gray-50 focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option value="Available">Available</option>
                          <option value="Reserved">Reserved</option>
                        </select>
                        <button
                          type="button"
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                          onClick={() => {
                            if (!newTable.tableNumber || !newTable.seats) return;
                            setRestaurantInfo({
                              ...restaurantInfo,
                              tables: [...(restaurantInfo.tables || []), { ...newTable, tableNumber: parseInt(newTable.tableNumber), seats: parseInt(newTable.seats) }]
                            });
                            setNewTable({ tableNumber: '', seats: '', status: 'Available' });
                          }}
                        >Add</button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-1">Average Waiting Time (minutes)</label>
                      <input
                        type="number"
                        value={restaurantInfo.waitingTime}
                        onChange={(e) => setRestaurantInfo({...restaurantInfo, waitingTime: parseInt(e.target.value)})}
                        className="mt-1 block w-full rounded-lg border-gray-700 text-gray-900 border-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2 bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-1">Currency</label>
                      <div className="relative" ref={currencyDropdownRef}>
                        <button
                          type="button"
                          className="mt-1 block w-full rounded-lg border-gray-700 text-gray-900 border-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2 bg-gray-50 text-left"
                          onClick={() => {
                            setCurrencyDropdownOpen(!currencyDropdownOpen);
                            setTimeout(() => {
                              const input = document.getElementById('currency-search-input');
                              if (input) input.focus();
                            }, 0);
                          }}
                        >
                          {restaurantInfo.currency} - {currencyNames[restaurantInfo.currency] || restaurantInfo.currency}
                        </button>
                        {currencyDropdownOpen && (
                          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-400 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            <input
                              id="currency-search-input"
                              type="text"
                              placeholder="Search currency..."
                              value={currencySearch}
                              onChange={e => setCurrencySearch(e.target.value)}
                              className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none text-gray-900 bg-gray-100 placeholder-gray-500"
                              style={{ cursor: 'text' }}
                              autoFocus
                              onClick={e => e.stopPropagation()}
                            />
                            {Object.entries(currencyNames)
                              .filter(([code, name]) =>
                                code.toLowerCase().includes(currencySearch.toLowerCase()) ||
                                name.toLowerCase().includes(currencySearch.toLowerCase())
                              )
                              .map(([code, name]) => (
                                <button
                                  key={code}
                                  type="button"
                                  className={`w-full text-left px-4 py-2 hover:bg-blue-100 text-gray-900 ${restaurantInfo.currency === code ? 'bg-blue-200 font-bold' : ''}`}
                                  onClick={() => {
                                    setRestaurantInfo({ ...restaurantInfo, currency: code });
                                    setCurrencyDropdownOpen(false);
                                    setCurrencySearch('');
                                  }}
                                >
                                  {code} - {name}
                                </button>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-1">Email (not editable)</label>
                      <input
                        type="email"
                        value={restaurantInfo.email}
                        disabled
                        className="mt-1 block w-full rounded-lg border-gray-400 text-gray-500 border-2 bg-gray-100 cursor-not-allowed px-4 py-2"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold shadow"
                    >
                      Save Changes
                    </button>
                  </form>
                  {/* Change Password Section */}
                  <div className="mt-10">
                    <h3 className="text-xl font-bold mb-4 text-gray-900">Change Password</h3>
                    <form onSubmit={handleChangePassword} className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-1">Current Password</label>
                        <input
                          type="password"
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                          className="mt-1 block w-full rounded-lg border-gray-700 text-gray-900 border-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2 bg-gray-50"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-1">New Password</label>
                        <input
                          type="password"
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                          className="mt-1 block w-full rounded-lg border-gray-700 text-gray-900 border-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2 bg-gray-50"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-1">Confirm New Password</label>
                        <input
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                          className="mt-1 block w-full rounded-lg border-gray-700 text-gray-900 border-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2 bg-gray-50"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-semibold shadow"
                      >
                        Change Password
                      </button>
                    </form>
                    {passwordError && <div className="text-red-600 mt-2">{passwordError}</div>}
                    {passwordSuccess && <div className="text-green-600 mt-2">{passwordSuccess}</div>}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}