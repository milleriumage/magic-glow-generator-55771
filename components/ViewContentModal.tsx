import React from 'react';
import { ContentItem } from '../types';

interface ViewContentModalProps {
  item: ContentItem;
  onClose: () => void;
}

const ViewContentModal: React.FC<ViewContentModalProps> = ({ item, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-neutral-800 rounded-xl shadow-2xl p-6 w-full max-w-2xl transform transition-all" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">{item.title}</h2>
            <button onClick={onClose} className="text-neutral-400 hover:text-white">&times;</button>
        </div>
        
        <div className="bg-neutral-900 rounded-lg p-4 max-h-[70vh] overflow-y-auto">
            {item.externalLink ? (
                <div className="text-center py-8">
                    <p className="text-neutral-300 mb-4">This content is hosted externally.</p>
                    <a 
                        href={item.externalLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-6 rounded-lg transition"
                    >
                        Access Content Now
                    </a>
                </div>
            ) : (
                <div className="space-y-4">
                   <p className="text-sm text-neutral-400 text-center">
                       Displaying {item.mediaCount.images} image(s) and {item.mediaCount.videos} video(s).
                   </p>
                   {/* We only have one image URL, so we simulate the gallery by repeating it */}
                   {Array.from({ length: item.mediaCount.images }).map((_, index) => (
                       <img key={`img-${index}`} src={item.imageUrl} alt={`${item.title} - Image ${index+1}`} className="w-full h-auto object-cover rounded-lg"/>
                   ))}
                   {Array.from({ length: item.mediaCount.videos }).map((_, index) => (
                       <div key={`vid-${index}`} className="w-full aspect-video bg-black rounded-lg flex items-center justify-center text-neutral-500">
                           Simulated Video Player {index + 1}
                       </div>
                   ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ViewContentModal;
