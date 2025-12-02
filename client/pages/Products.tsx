import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { Eye, Trash2, Edit, Plus, Search, X } from "lucide-react";
import { SAMPLE_PRODUCTS } from "@/utils/sampleProducts";

export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  image?: string;
}

const CATEGORIES = ["Coffee", "Bundle", "Accessories", "Equipment", "Other"];

export default function Products() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Omit<Product, "id">>({
    title: "",
    price: 0,
    description: "",
    category: "Coffee",
    image: "",
  });

  // Check authentication
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      loadProducts();
    }
  }, [isLoggedIn, navigate]);

  // Load products from localStorage
  const loadProducts = () => {
    const stored = localStorage.getItem("products");
    let productsList = stored ? JSON.parse(stored) : [];

    // Initialize with sample products if empty
    if (productsList.length === 0) {
      productsList = SAMPLE_PRODUCTS;
      localStorage.setItem("products", JSON.stringify(productsList));
    }

    setProducts(productsList);
    filterProducts(productsList, searchTerm, selectedCategory);
  };

  // Filter products based on search and category
  const filterProducts = (
    productsList: Product[],
    search: string,
    category: string
  ) => {
    let filtered = productsList;

    if (search) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase()) ||
          p.category.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== "All") {
      filtered = filtered.filter((p) => p.category === category);
    }

    setFilteredProducts(filtered);
  };

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterProducts(products, value, selectedCategory);
  };

  // Handle category filter
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedCategory(value);
    filterProducts(products, searchTerm, value);
  };

  // Save product
  const handleSaveProduct = () => {
    if (!formData.title || !formData.price || !formData.description) {
      alert("Please fill in all fields");
      return;
    }

    if (editingProduct) {
      const updated = products.map((p) =>
        p.id === editingProduct.id
          ? { ...formData, id: editingProduct.id }
          : p
      );
      setProducts(updated);
      localStorage.setItem("products", JSON.stringify(updated));
      alert(
        `Product "${formData.title}" updated successfully!`
      );
      console.log("Updated Product:", { ...formData, id: editingProduct.id });
    } else {
      const newProduct: Product = {
        ...formData,
        id: Date.now().toString(),
      };
      const updated = [...products, newProduct];
      setProducts(updated);
      localStorage.setItem("products", JSON.stringify(updated));
      alert(`Product "${formData.title}" created successfully!`);
      console.log("Created Product:", newProduct);
    }

    filterProducts(products, searchTerm, selectedCategory);
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      title: "",
      price: 0,
      description: "",
      category: "Electronics",
    });
  };

  // View product
  const handleViewProduct = (product: Product) => {
    setViewingProduct(product);
  };

  // Edit product
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      price: product.price,
      description: product.description,
      category: product.category,
    });
    setShowModal(true);
  };

  // Delete product
  const handleDeleteProduct = (product: Product) => {
    if (
      confirm(
        `Are you sure you want to delete "${product.title}"?`
      )
    ) {
      const updated = products.filter((p) => p.id !== product.id);
      setProducts(updated);
      localStorage.setItem("products", JSON.stringify(updated));
      filterProducts(updated, searchTerm, selectedCategory);
      alert(`Product "${product.title}" deleted successfully!`);
      console.log("Deleted Product:", product);
    }
  };

  // Reset form
  const handleResetForm = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      title: "",
      price: 0,
      description: "",
      category: "Electronics",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <Button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Product
          </Button>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, description, or category..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option>All</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredProducts.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No products found. Create your first product to get started!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-300">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Category
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product, index) => (
                    <tr
                      key={product.id}
                      className={`border-b border-gray-200 hover:bg-gray-50 transition ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {product.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {product.description}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleViewProduct(product)}
                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                            title="View"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition"
                            title="Edit"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product)}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* View Product Modal */}
      {viewingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {viewingProduct.title}
              </h2>
              <button
                onClick={() => setViewingProduct(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Price
                </label>
                <p className="text-lg text-gray-900">
                  ${viewingProduct.price.toFixed(2)}
                </p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Category
                </label>
                <p className="text-gray-900">{viewingProduct.category}</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Description
                </label>
                <p className="text-gray-900">{viewingProduct.description}</p>
              </div>
            </div>

            <Button
              onClick={() => setViewingProduct(null)}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Close
            </Button>
          </div>
        </div>
      )}

      {/* Create/Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingProduct ? "Edit Product" : "Create Product"}
              </h2>
              <button
                onClick={handleResetForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Product title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: parseFloat(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  placeholder="Product description"
                  rows={4}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleSaveProduct}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Save
              </Button>
              <Button
                onClick={handleResetForm}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
