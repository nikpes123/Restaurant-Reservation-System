'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

const categoryOptions = [
  'Starters',
  'Beverages',
  'Main Course',
  'Special',
  'Desserts',
  'Other'
];

export default function EditMenuItemPage() {
  const router = useRouter();
  const params = useParams();
  const itemId = params.id;
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch menu item by ID
    const fetchMenuItem = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/restaurants/menu/item/${itemId}`, { headers: { Authorization: `Bearer ${token}` } });
        if (!response.ok) throw new Error('Failed to fetch menu item');
        const item = await response.json();
        setForm({
          name: item.name || '',
          description: item.description || '',
          price: item.price || '',
          category: item.category || '',
        });
        if (item.image && item.image.data) {
          // Convert Buffer to base64
          const base64 = Buffer.from(item.image.data).toString('base64');
          setImagePreview(`data:image/jpeg;base64,${base64}`);
        }
      } catch (err) {
        setError(err.message);
      }
    };
    fetchMenuItem();
  }, [itemId]);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('price', form.price);
      formData.append('category', form.category);
      if (imageFile) formData.append('image', imageFile);
      const response = await fetch(`http://localhost:5000/api/restaurants/menu/${itemId}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Failed to update menu item');
      }
      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-8">
      <h2 className="text-2xl font-bold mb-8 text-gray-800">Menu Management</h2>
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-xl">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">Edit Menu Item</h1>
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleInputChange}
              className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:border-blue-500 focus:ring-blue-500 text-gray-900"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleInputChange}
              className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:border-blue-500 focus:ring-blue-500 text-gray-900 resize-vertical"
              rows={4}
              required
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleInputChange}
                className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium text-gray-700">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleInputChange}
                className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                required
              >
                <option value="" disabled>Category</option>
                {categoryOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:border-blue-500 focus:ring-blue-500 text-gray-900"
            />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="mt-2 w-full h-40 object-cover rounded shadow" />
            )}
          </div>
          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold shadow transition"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              className="flex-1 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 font-semibold shadow transition"
              onClick={() => router.push('/dashboard')}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 