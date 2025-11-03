import React, { useState, useEffect } from 'react';
import { SubscriptionPlan } from '../types';
import { useCredits } from '../hooks/useCredits';

interface EditPlanModalProps {
  plan: SubscriptionPlan;
  onClose: () => void;
}

const EditPlanModal: React.FC<EditPlanModalProps> = ({ plan, onClose }) => {
    const { updateSubscriptionPlan } = useCredits();
    const [formData, setFormData] = useState(plan);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setFormData(plan);
    }, [plan]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'price' || name === 'credits' ? Number(value) : value }));
    };

    const handleFeatureChange = (index: number, value: string) => {
        const newFeatures = [...formData.features];
        newFeatures[index] = value;
        setFormData(prev => ({...prev, features: newFeatures}));
    };

    const addFeature = () => {
        setFormData(prev => ({...prev, features: [...prev.features, '']}));
    };

    const removeFeature = (index: number) => {
        setFormData(prev => ({...prev, features: prev.features.filter((_, i) => i !== index)}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            updateSubscriptionPlan(formData);
            setIsLoading(false);
            onClose();
        }, 1000); // Simulate API call
    };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-neutral-800 rounded-xl shadow-2xl p-8 w-full max-w-lg transform transition-all" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-white mb-6">Edit Plan: {plan.name}</h2>
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-300">Plan Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full bg-neutral-700 border border-neutral-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-brand-primary focus:border-brand-primary" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-neutral-300">Price</label>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} className="mt-1 block w-full bg-neutral-700 border border-neutral-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-brand-primary focus:border-brand-primary" />
                </div>
                 <div>
                    <label htmlFor="currency" className="block text-sm font-medium text-neutral-300">Currency</label>
                    <select name="currency" value={formData.currency} onChange={handleChange} className="mt-1 block w-full bg-neutral-700 border border-neutral-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-brand-primary focus:border-brand-primary">
                        <option>USD</option>
                        <option>BRL</option>
                        <option>EUR</option>
                    </select>
                </div>
            </div>
             <div>
                <label htmlFor="credits" className="block text-sm font-medium text-neutral-300">Credits per Month</label>
                <input type="number" name="credits" value={formData.credits} onChange={handleChange} className="mt-1 block w-full bg-neutral-700 border border-neutral-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-brand-primary focus:border-brand-primary" />
            </div>
             <div>
                <label htmlFor="stripeProductId" className="block text-sm font-medium text-neutral-300">Stripe Product ID</label>
                <input type="text" name="stripeProductId" value={formData.stripeProductId} onChange={handleChange} className="mt-1 block w-full bg-neutral-700 border border-neutral-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-brand-primary focus:border-brand-primary" />
            </div>
            <div>
                 <label className="block text-sm font-medium text-neutral-300">Features</label>
                 {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 mt-1">
                        <input type="text" value={feature} onChange={(e) => handleFeatureChange(index, e.target.value)} className="block w-full bg-neutral-700 border border-neutral-600 rounded-md shadow-sm py-2 px-3 text-white" />
                        <button type="button" onClick={() => removeFeature(index)} className="p-2 bg-red-600/50 hover:bg-red-500 rounded-md text-white">X</button>
                    </div>
                 ))}
                 <button type="button" onClick={addFeature} className="mt-2 text-sm text-brand-light hover:text-brand-primary">Add Feature</button>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
                 <button type="button" onClick={onClose} className="bg-neutral-600 hover:bg-neutral-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300">Cancel</button>
                 <button type="submit" disabled={isLoading} className="bg-brand-primary hover:bg-brand-primary/90 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50">{isLoading ? 'Saving...' : 'Save Changes'}</button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default EditPlanModal;