import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { MenuItem } from "@/types/index";
import axios from 'axios';
import { toast } from 'sonner';

const MenuManagement: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    menuItemName: '',
    menuItemDesc: '',
    menuItemPrice: '',
    menuItemCategory: '',
    menuItemPic: ''
  });

  const categories = ['Main Course', 'Appetizer', 'Dessert', 'Beverage', 'Salad'];

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get<MenuItem[]>('http://localhost:8081/api/menu-items');
      setMenuItems(response.data);
    } catch (error) {
      toast.error('Failed to fetch menu items');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, menuItemCategory: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.menuItemCategory) {
      toast.error("Kategori seçmelisiniz!");
      return;
    }

    const menuItemData = {
      menuItemName: formData.menuItemName,
      menuItemDesc: formData.menuItemDesc,
      menuItemPrice: parseInt(formData.menuItemPrice),
      menuItemCategory: formData.menuItemCategory,
      menuItemPic: formData.menuItemPic
    };

    try {
      console.log('Submitting data:', menuItemData); // Debug log
      
      if (selectedItem) {
        const response = await axios.put(`http://localhost:8081/api/menu-items/${selectedItem.menuItemId}`, menuItemData);
        console.log('Update response:', response.data);
        toast.success('Menu item updated successfully');
      } else {
        const response = await axios.post('http://localhost:8081/api/menu-items', menuItemData);
        console.log('Create response:', response.data);
        toast.success('Menu item added successfully');
      }

      setIsAddDialogOpen(false);
      setIsEditDialogOpen(false);
      setFormData({
        menuItemName: '',
        menuItemDesc: '',
        menuItemPrice: '',
        menuItemCategory: '',
        menuItemPic: ''
      });
      setSelectedItem(null);
      await fetchMenuItems();
    } catch (error) {
      console.error('Error saving menu item:', error); // Detailed error logging
      if (axios.isAxiosError(error)) {
        toast.error(`Failed to save menu item: ${error.response?.data?.message || error.message}`);
      } else {
        toast.error('Failed to save menu item');
      }
    }
  };

  const handleEdit = (item: MenuItem) => {
    setSelectedItem(item);
    setFormData({
      menuItemName: item.menuItemName,
      menuItemDesc: item.menuItemDesc,
      menuItemPrice: item.menuItemPrice.toString(),
      menuItemCategory: item.menuItemCategory,
      menuItemPic: item.menuItemPic
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8081/api/menu-items/${id}`);
      toast.success('Menu item deleted successfully');
      fetchMenuItems();
    } catch (error) {
      toast.error('Failed to delete menu item');
    }
  };

  const renderForm = (isEdit: boolean) => (
    <form onSubmit={handleSubmit} className="space-y-4 z-[1000]">
      <Input
        name="menuItemName"
        placeholder="Item Name"
        value={formData.menuItemName}
        onChange={handleInputChange}
        required
      />
      <Textarea
        name="menuItemDesc"
        placeholder="Description"
        value={formData.menuItemDesc}
        onChange={handleInputChange}
        required
      />
      <Input
        name="menuItemPrice"
        type="number"
        placeholder="Price"
        value={formData.menuItemPrice}
        onChange={handleInputChange}
        required
      />
      <div className="relative z-[1100]">
        <Select value={formData.menuItemCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full z-[110]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent className="z-[120] bg-white shadow-xl">
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Input
        name="menuItemPic"
        placeholder="Image URL"
        value={formData.menuItemPic}
        onChange={handleInputChange}
        required
      />
      <Button type="submit">{isEdit ? 'Update' : 'Save'}</Button>
    </form>
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Menu Management</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add New Item</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] overflow-visible z-[100] bg-white">
            <DialogHeader>
              <DialogTitle>Add New Menu Item</DialogTitle>
              <DialogDescription>
                Fill in the details below to add a new menu item.
              </DialogDescription>
            </DialogHeader>
            {renderForm(false)}
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {menuItems.map((item) => (
            <TableRow key={item.menuItemId}>
              <TableCell>{item.menuItemName}</TableCell>
              <TableCell>{item.menuItemDesc}</TableCell>
              <TableCell>${item.menuItemPrice}</TableCell>
              <TableCell>{item.menuItemCategory}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => handleEdit(item)}>Edit</Button>
                  <Button variant="destructive" onClick={() => handleDelete(item.menuItemId)}>Delete</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] overflow-visible z-[100] bg-white">
          <DialogHeader>
            <DialogTitle>Edit Menu Item</DialogTitle>
            <DialogDescription>
              Update the details of the menu item below.
            </DialogDescription>
          </DialogHeader>
          {renderForm(true)}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MenuManagement;
