import React, { useState, useEffect } from 'react';

const MenuItemForm = ({ initialData, onSubmit, onClose }) => {
  // Initialize form state with default values or initialData if editing
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    image: '',
    available: true,
    ...(initialData || {}) // This will override defaults if initialData is provided
  });

  // Update form if initialData prop changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData
      });
    }
  }, [initialData]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Ensure price is converted to number
    const submittedData = {
      ...formData,
      price: parseFloat(formData.price)
    };
    onSubmit(submittedData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-[#2a3563] p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold text-white mb-4">
          {initialData ? 'Edit Menu Item' : 'Add New Menu Item'}
        </h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-gray-300 mb-1">Item Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-[#1c2756] border border-[#3b4784] text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-gray-300 mb-1">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 rounded bg-[#1c2756] border border-[#3b4784] text-white"
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-gray-300 mb-1">Price ($)</label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-[#1c2756] border border-[#3b4784] text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-gray-300 mb-1">Image URL</label>
            <input
              id="image"
              name="image"
              type="url"
              value={formData.image}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-[#1c2756] border border-[#3b4784] text-white"
            />
          </div>

          <div className="flex items-center">
            <input
              id="available"
              name="available"
              type="checkbox"
              checked={formData.available}
              onChange={handleChange}
              className="w-4 h-4 mr-2"
            />
            <label htmlFor="available" className="text-gray-300">Available</label>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button 
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="px-4 py-2 bg-[#6c63ff] hover:bg-[#5a52d5] text-white rounded-md"
          >
            {initialData ? 'Update Item' : 'Add Item'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MenuItemForm;