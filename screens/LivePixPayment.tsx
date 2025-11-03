import React, { useState } from 'react';

const LIVEPIX_WIDGET_URL = "https://widget.livepix.gg/embed/782d9bf9-cb99-4196-b9c2-cfa6a14b4d64";
const LIVEPIX_PAYMENT_URL = "https://livepix.gg/faala";

const LivePixPayment: React.FC = () => {
    const [copyButtonText, setCopyButtonText] = useState('Copiar');

    const handleCopy = () => {
        navigator.clipboard.writeText(LIVEPIX_PAYMENT_URL);
        setCopyButtonText('Copiado!');
        setTimeout(() => setCopyButtonText('Copiar'), 2000);
    };

    return (
        <div className="max-w-md mx-auto text-white">
            <h1 className="text-3xl font-bold mb-6 text-center">Recarregar via LivePix</h1>

            <div className="bg-white p-6 rounded-lg shadow-lg text-black text-center">
                <h2 className="text-xl font-bold mb-4">QR oficial LivePix</h2>
                <div className="w-full h-80 flex items-center justify-center">
                    <iframe 
                        src={LIVEPIX_WIDGET_URL} 
                        width="100%" 
                        height="100%" 
                        frameBorder="0"
                        title="LivePix Payment Widget"
                    ></iframe>
                </div>
            </div>

            <div className="mt-6">
                <label htmlFor="pix-copy" className="block text-sm font-medium text-neutral-300">
                    Código PIX Copia e Cola
                    <a href={LIVEPIX_PAYMENT_URL} target="_blank" rel="noopener noreferrer" className="text-brand-light ml-2 text-xs hover:underline">
                        (abrir link)
                    </a>
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                    <input 
                        id="pix-copy"
                        type="text"
                        readOnly
                        value={LIVEPIX_PAYMENT_URL}
                        className="flex-1 block w-full min-w-0 rounded-none rounded-l-md sm:text-sm border-neutral-600 bg-neutral-700 text-neutral-300 p-2"
                    />
                    <button
                        onClick={handleCopy}
                        className="inline-flex items-center px-4 py-2 border border-l-0 border-neutral-600 rounded-r-md bg-neutral-800 text-sm font-medium text-white hover:bg-neutral-600"
                    >
                        {copyButtonText}
                    </button>
                </div>
            </div>
             <p className="text-center text-sm text-neutral-400 mt-6">
                Este é um QR Code estático. Após o pagamento, os créditos precisam ser confirmados manualmente pelo sistema (simulação).
            </p>
        </div>
    );
};

export default LivePixPayment;