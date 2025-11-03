import React, { useState, useEffect } from 'react';
import { CreditPackage } from '../types';
import { useCredits } from '../hooks/useCredits';

interface EditCreditPackModalProps {
  creditPackage: CreditPackage;
  onClose: () => void;
}

const EditCreditPackModal: React.FC<EditCreditPackModalProps> = ({ creditPackage, onClose }) => {
    const { updateCreditPackage } = useCredits();
    const [formData, setFormData] = useState(creditPackage);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setFormData(creditPackage);
    }, [creditPackage]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: Number(value) }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            updateCreditPackage(formData);
            setIsLoading(false);
            onClose();
        }, 1000);
    };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-neutral-800 rounded-xl shadow-2xl p-8 w-full max-w-lg transform transition-all" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-white mb-6">Edit Credit Pack</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-neutral-300">Credits</label>
                    <input type="number" name="credits" value={formData.credits} onChange={handleChange} className="mt-1 block w-full bg-neutral-700 border-neutral-600 rounded-md py-2 px-3 text-white" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-neutral-300">Bonus Credits</label>
                    <input type="number" name="bonus" value={formData.bonus} onChange={handleChange} className="mt-1 block w-full bg-neutral-700 border-neutral-600 rounded-md py-2 px-3 text-white" />
                </div>
            </div>
             <div>
                <label className="block text-sm font-medium text-neutral-300">Price (USD)</label>
                <input type="number" name="price" step="0.01" value={formData.price} onChange={handleChange} className="mt-1 block w-full bg-neutral-700 border-neutral-600 rounded-md py-2 px-3 text-white" />
            </div>
            <div className="flex items-center">
                <input type="checkbox" name="bestValue" id="bestValue" checked={formData.bestValue} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-brand-primary"/>
                <label htmlFor="bestValue" className="ml-2 block text-sm text-neutral-300">Mark as 'Best Value'</label>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                 <button type="button" onClick={onClose} className="bg-neutral-600 hover:bg-neutral-500 text-white font-bold py-2 px-4 rounded-lg">Cancel</button>
                 <button type="submit" disabled={isLoading} className="bg-brand-primary hover:bg-brand-primary/90 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50">{isLoading ? 'Saving...' : 'Save Changes'}</button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default EditCreditPackModal;