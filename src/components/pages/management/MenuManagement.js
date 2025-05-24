import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import MenuItemForm from './compo/MenuItemForm';
import { menuService } from '../../../api/menu';
import { useAuth } from '../../../context/AuthContext';

const MenuManagement = () => {
    const { user } = useAuth();

    const [restaurantData, setRestaurantData] = useState(null);
    const [activeCategory, setActiveCategory] = useState('');
    const [isAddingItem, setIsAddingItem] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) return; // user is not yet loaded

        if (user.role === 'restaurant') {
            const fetchRestaurantData = async () => {
                try {
                    setLoading(true);
                    const data = await menuService.getRestaurantData();

                    if (!data) {
                        console.log("no data");
                    } else {
                        setRestaurantData(data);
                        setActiveCategory(data.categories[0] || '');
                    }
                } catch (err) {
                    console.error(err);
                    setError('Failed to load restaurant data');
                } finally {
                    setLoading(false);
                }
            };

            fetchRestaurantData();
        }
    }, [user]);

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) return;
        const newCategory = await menuService.addCategory({
            name: newCategoryName,
            restaurantId: user.restaurantId,
        });
        // setCategories((prev) => [...prev, newCategory]);
        setActiveCategory(newCategory.id);
        setNewCategoryName('');
        setIsAddingCategory(false);
    };

    // Add new item
    const handleAddItem = async (itemData) => {
        try {
            const response = await menuService.addMenuItem({
                ...itemData,
                category: activeCategory,
            });

            setRestaurantData(prev => ({
                ...prev,
                menu: [...prev.menu, response.data.menuItem],
                categories: response.data.categories,
            }));
            setIsAddingItem(false);
        } catch (err) {
            console.error("Add item error:", err);
            setError('Failed to add menu item');
        }
    };

    // Update item
    const handleUpdateItem = async (updatedItem) => {
        try {
            // Ensure we're using the correct ID field (_id)
            const itemId = updatedItem._id;
            
            const response = await menuService.updateMenuItem(itemId, {
                ...updatedItem,
                category: activeCategory // Ensure category is set correctly
            });
            
            setRestaurantData(prev => ({
                ...prev,
                menu: prev.menu.map(item =>
                    item._id === itemId ? response.data.menuItem : item
                ),
                categories: response.data.categories,
            }));
            setEditingItem(null);
        } catch (err) {
            console.error("Update item error:", err);
            setError('Failed to update menu item');
        }
    };

    // Delete item
    const handleDeleteItem = async (itemId) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                // Check if we're using the correct ID field
                console.log("Attempting to delete item with ID:", itemId);
                
                await menuService.deleteMenuItem(itemId);
                
                setRestaurantData(prev => ({
                    ...prev,
                    menu: prev.menu.filter(item => {
                        // Check both possible ID fields
                        return item._id !== itemId && item.id !== itemId;
                    }),
                }));
            } catch (err) {
                console.error("Delete item error:", err);
                setError('Failed to delete menu item');
            }
        }
    };

    // Delete category
    const handleDeleteCategory = async (categoryName) => {
        // Check if category has any items
        const hasItems = restaurantData.menu.some(item => item.category === categoryName);
        if (hasItems) {
            alert('Cannot delete category with existing items. Please remove all items first.');
            return;
        }

        if (!window.confirm(`Are you sure you want to delete the "${categoryName}" category?`)) return;

        try {
            await menuService.deleteCategory(categoryName);
            
            // Calculate new state values
            const newCategories = restaurantData.categories.filter(cat => cat !== categoryName);
            const newActiveCategory = activeCategory === categoryName 
                ? newCategories[0] || ''
                : activeCategory;

            // Update state
            setRestaurantData(prev => ({
                ...prev,
                categories: newCategories
            }));
            setActiveCategory(newActiveCategory);
            
        } catch (err) {
            console.error("Delete category error:", err);
            setError('Failed to delete category');
        }
    };

    const categories = restaurantData?.categories || [];
    const activeItems = restaurantData?.menu?.filter(item => item.category === activeCategory) || [];

    if (loading) return <div className="text-center py-8">Loading menu...</div>;
    if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

    return (
        <div className="bg-[#1c2756] rounded-lg shadow-md overflow-hidden">
            <header className="p-6 border-b border-[#2a3563]">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-bold">Menu Management</h1>
                    <button
                        onClick={() => setIsAddingCategory(true)}
                        className="px-4 py-2 bg-[#6c63ff] hover:bg-[#5a52d5] rounded-md flex items-center"
                    >
                        <Plus size={18} className="mr-1" />
                        Add Category
                    </button>
                </div>
            </header>

            <main className="p-6">
                {/* Add Category UI */}
                {isAddingCategory && (
                    <div className="mb-6 bg-[#2a3563] p-4 rounded-md">
                        <h2 className="font-medium mb-2">Add New Category</h2>
                        <form onSubmit={e => {
                            e.preventDefault();
                            handleAddCategory();
                        }} className="flex">
                            <input
                                type="text"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                placeholder="Category name"
                                className="flex-1 px-4 py-2 rounded-l bg-[#1c2756] border border-[#3b4784] text-white focus:outline-none"
                                required
                            />
                            <button type="submit" className="px-4 py-2 bg-[#6c63ff] hover:bg-[#5a52d5] rounded-r">
                                Add
                            </button>
                        </form>
                        <div className="flex justify-end mt-2">
                            <button
                                onClick={() => setIsAddingCategory(false)}
                                className="text-sm text-gray-400 hover:text-white"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Categories */}
                <div className="flex overflow-x-auto pb-4 mb-6 scrollbar-hide">
                    {categories.map(category => (
                        <div key={category} className="relative group mr-2">
                            <button
                                onClick={() => setActiveCategory(category)}
                                className={`px-4 py-2 rounded-full whitespace-nowrap ${
                                    activeCategory === category
                                        ? 'bg-[#6c63ff] text-white'
                                        : 'bg-[#2a3563] text-gray-300 hover:bg-[#3b4784]'
                                }`}
                            >
                                {category}
                            </button>
                            <button
                                onClick={() => handleDeleteCategory(category)}
                                className="absolute -top-2 -right-2 text-xs text-red-400 bg-[#1c2756] hover:text-red-600 rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                                title="Delete category"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>

                {/* Items */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium">{activeCategory} Items</h2>
                    <button
                        onClick={() => setIsAddingItem(true)}
                        className="px-4 py-2 bg-[#6c63ff] hover:bg-[#5a52d5] rounded-md flex items-center"
                    >
                        <Plus size={16} className="mr-1" /> Add Item
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activeItems.map(item => {
                        // Use the correct ID field (_id or id)
                        const itemId = item._id || item.id;
                        
                        return (
                            <div key={itemId} className="bg-[#2a3563] rounded-lg overflow-hidden shadow-md">
                                <div className="h-40 overflow-hidden">
                                    <img
                                        src={item.image || '/default-placeholder.png'} // fallback
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                                        <span className="text-[#6c63ff] font-bold">${item.price.toFixed(2)}</span>
                                    </div>
                                    <p className="text-gray-300 text-sm mb-3 line-clamp-2">{item.description}</p>
                                    <div className="flex justify-between items-center">
                                        <span className={`px-2 py-1 rounded text-xs ${
                                            item.available
                                                ? 'bg-green-500 bg-opacity-20 text-green-300'
                                                : 'bg-red-500 bg-opacity-20 text-red-300'
                                        }`}>
                                            {item.available ? 'Available' : 'Out of Stock'}
                                        </span>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => setEditingItem(item)}
                                                className="p-2 bg-[#3b4784] hover:bg-[#4b5794] rounded-md"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteItem(itemId)}
                                                className="p-2 bg-red-500 bg-opacity-20 hover:bg-opacity-30 rounded-md"
                                            >
                                                <Trash2 size={16} className="text-red-300" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Add/Edit Form Modal */}
                {(isAddingItem || editingItem) && (
                    <MenuItemForm
                        onClose={() => {
                            setIsAddingItem(false);
                            setEditingItem(null);
                        }}
                        onSubmit={isAddingItem ? handleAddItem : handleUpdateItem}
                        initialData={editingItem}
                    />
                )}
            </main>
        </div>
    );
};

export default MenuManagement;