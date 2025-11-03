
import React, { useState, useCallback, ReactNode } from 'react';

// --- CONFIGURATION DATA ---
const platformTypes = ['Criadores de Conteúdo', 'Moda & Lifestyle', 'Educação Premium', 'Artistas & Estúdios', 'Coaching & Mentoria', 'Plataforma Fitness', 'Luxury Brand Hub'];
const targetAudiences = ['Influencers de Luxo', 'Empreendedores Criativos', 'Modelos & Estilistas', 'Produtores de Conteúdo', 'Artistas', 'Comunidade Premium'];
const visualStyles = ['Vogue Digital', 'Pinterest Soft', 'Nike App', 'Patreon Clean', 'Apple Studio'];
const layouts = ['Sidebar lateral', 'Sidebar inferior', 'Navegação flutuante', 'Sem sidebar'];
const audienceValues = ['Até R$ 500', 'R$ 500–2.000', 'Acima de R$ 2.000'];

// --- SUB-COMPONENTS ---

const Spinner: React.FC = () => (
    <div className="absolute inset-0 bg-neutral-900/80 flex items-center justify-center z-10 rounded-lg">
        <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    </div>
);

const ConfigSelect: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: string[]; }> = ({ label, value, onChange, options }) => (
    <div>
        <label className="block text-sm font-semibold text-neutral-300 mb-1">{label}</label>
        <select value={value} onChange={onChange} className="w-full bg-neutral-700 border-neutral-600 rounded-md py-2 px-3 text-white focus:ring-brand-primary focus:border-brand-primary">
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);

const GeneratedImageView: React.FC<{ title: string; imageUrl: string | null; isLoading: boolean; }> = ({ title, imageUrl, isLoading }) => {
    const handleGeneratePrompt = () => alert(`Prompt para "${title}":\n\n(Simulado) Ultra-realistic 8K photo of a ${title.toLowerCase()} screen for a luxury creator platform, Vogue Digital style, dark mode, sophisticated UI/UX, Behance, Dribbble.`);
    const handleDownload = () => alert(`Simulando download de "${title}.png"...`);

    return (
        <div className="bg-neutral-800 rounded-lg shadow-lg flex flex-col relative overflow-hidden aspect-video group">
            {isLoading && <Spinner />}
            <h3 className="p-2 text-center text-xs font-semibold text-white bg-neutral-700/50">{title}</h3>
            <div className="flex-1 flex items-center justify-center p-2 min-h-0">
                {imageUrl ? <img src={imageUrl} className="max-w-full max-h-full object-contain rounded" alt={title} /> : <div className="text-neutral-500">Vazio</div>}
            </div>
            {imageUrl && !isLoading && (
                 <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button onClick={handleGeneratePrompt} className="text-xs bg-brand-light text-black font-semibold py-1 px-3 rounded-full">Gerar Prompt</button>
                    <button onClick={handleDownload} className="text-xs bg-accent-green text-black font-semibold py-1 px-3 rounded-full">Download</button>
                </div>
            )}
        </div>
    );
};


// --- MAIN COMPONENT ---
const ThemeGenerator: React.FC = () => {
    // Config State
    const [platformType, setPlatformType] = useState(platformTypes[0]);
    const [targetAudience, setTargetAudience] = useState(targetAudiences[0]);
    const [visualStyle, setVisualStyle] = useState(visualStyles[0]);
    const [layout, setLayout] = useState(layouts[0]);
    const [audienceValue, setAudienceValue] = useState(audienceValues[0]);
    const [customPrompt, setCustomPrompt] = useState('');

    // Generated State
    const [generatedTheme, setGeneratedTheme] = useState<{ palette: Record<string, string>; typography: string[] } | null>(null);
    const [mainImage, setMainImage] = useState<string | null>(null);
    const [variations, setVariations] = useState<Record<string, string | null>>({
        website: null, subscription: null, chat: null, appHome: null, login: null
    });

    // Loading State
    const [loading, setLoading] = useState({ theme: false, mainImage: false, variations: false });

    const handleGenerateTheme = useCallback(() => {
        setLoading(s => ({ ...s, theme: true }));
        setTimeout(() => {
            setGeneratedTheme({
                palette: { Base: '#1F2937', Destaque: '#EF4444', Neutra: '#4B5563', Interativa: '#EC4899' },
                typography: ['Playfair Display', 'Inter']
            });
            setLoading(s => ({ ...s, theme: false }));
        }, 1000);
    }, []);

    const handleGenerateMainImage = useCallback(() => {
        if (!generatedTheme) { alert("Primeiro gere um tema!"); return; }
        setLoading(s => ({ ...s, mainImage: true }));
        setTimeout(() => {
            setMainImage('https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
            setLoading(s => ({ ...s, mainImage: false }));
        }, 1500);
    }, [generatedTheme]);
    
    const handleGenerateVariations = useCallback(() => {
        if(!mainImage) { alert("Gere a imagem principal primeiro."); return; }
        setLoading(s => ({ ...s, variations: true }));
        setTimeout(() => {
            setVariations({
                website: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop',
                subscription: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=800&auto=format&fit=crop',
                chat: 'https://images.unsplash.com/photo-1581007871115-f14BC0155a3b?q=80&w=800&auto=format&fit=crop',
                appHome: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800&auto=format&fit=crop',
                login: 'https://images.unsplash.com/photo-1529539795054-3c162a4afc9a?q=80&w=800&auto=format&fit=crop',
            });
             setLoading(s => ({ ...s, variations: false }));
        }, 2500);
    }, [mainImage]);

    return (
        <div className="flex flex-col lg:flex-row h-full max-h-full overflow-hidden bg-neutral-900 rounded-lg">
            {/* Left Config Panel */}
            <aside className="w-full lg:w-2/5 xl:w-1/3 bg-neutral-800 border-r border-neutral-700 flex-shrink-0 p-4 space-y-4 overflow-y-auto">
                <h2 className="text-xl font-bold text-white">⚙️ Configuração de Geração de Tema</h2>
                
                <div className="space-y-3 p-3 bg-neutral-900/50 rounded-lg">
                    <ConfigSelect label="1. 🎯 Tipo de Plataforma" value={platformType} onChange={e => setPlatformType(e.target.value)} options={platformTypes} />
                    <ConfigSelect label="2. 💎 Público-Alvo" value={targetAudience} onChange={e => setTargetAudience(e.target.value)} options={targetAudiences} />
                    <ConfigSelect label="3. 🎨 Estilo Visual" value={visualStyle} onChange={e => setVisualStyle(e.target.value)} options={visualStyles} />
                    <ConfigSelect label="4. 📐 Layout" value={layout} onChange={e => setLayout(e.target.value)} options={layouts} />
                    <ConfigSelect label="5. 💰 Valor Médio do Público" value={audienceValue} onChange={e => setAudienceValue(e.target.value)} options={audienceValues} />
                    <div>
                        <label className="block text-sm font-semibold text-neutral-300 mb-1">6. ✍️ Prompt Personalizado</label>
                        <textarea value={customPrompt} onChange={e => setCustomPrompt(e.target.value)} placeholder="Opcional: Descreva seu tema ideal..." className="w-full h-20 bg-neutral-700 rounded p-2 text-white resize-none" />
                    </div>
                </div>

                <button onClick={handleGenerateTheme} disabled={loading.theme} className="w-full bg-brand-secondary text-white font-bold py-2 rounded-lg disabled:opacity-50">
                    {loading.theme ? 'Gerando Tema...' : '🔮 Gerar Tema pra Mim'}
                </button>
                
                {generatedTheme && (
                    <div className="p-3 bg-neutral-900/50 rounded-lg animate-fade-in-down">
                        <h3 className="text-md font-semibold text-white mb-2">Tema Gerado:</h3>
                        <div className="mb-2">
                            <p className="text-xs text-neutral-400 mb-1">Paleta de Cores:</p>
                            <div className="flex justify-around p-1 bg-neutral-800 rounded">{Object.entries(generatedTheme.palette).map(([name, hex]) => <div key={name} style={{backgroundColor: hex}} className="w-8 h-8 rounded-full border-2 border-neutral-700" title={`${name}: ${hex}`} />)}</div>
                        </div>
                        <div>
                            <p className="text-xs text-neutral-400 mb-1">Tipografia:</p>
                            <p className="text-lg text-center text-white bg-neutral-800 p-2 rounded">
                                <span style={{fontFamily: generatedTheme.typography[0]}}>Aa</span> <span className="text-neutral-400 text-sm">{generatedTheme.typography[0]}</span> + <span style={{fontFamily: generatedTheme.typography[1]}}>Aa</span> <span className="text-neutral-400 text-sm">{generatedTheme.typography[1]}</span>
                            </p>
                        </div>
                    </div>
                )}
            </aside>

            {/* Right Output Panel */}
            <main className="flex-1 p-4 h-full overflow-y-auto space-y-4">
                <div>
                     <button onClick={handleGenerateMainImage} disabled={!generatedTheme || loading.mainImage} className="w-full bg-brand-primary text-white font-bold py-2 rounded-lg mb-2 disabled:opacity-50">
                        {loading.mainImage ? 'Gerando...' : 'Gerar Imagem Principal'}
                    </button>
                    <GeneratedImageView title="Imagem Principal (Editável)" imageUrl={mainImage} isLoading={loading.mainImage} />
                </div>
                 <div>
                     <button onClick={handleGenerateVariations} disabled={!mainImage || loading.variations} className="w-full bg-accent-green text-black font-bold py-2 rounded-lg mb-2 disabled:opacity-50">
                        {loading.variations ? 'Gerando...' : 'Gerar 5 Variações'}
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <GeneratedImageView title="Website View" imageUrl={variations.website} isLoading={loading.variations} />
                        <GeneratedImageView title="Plano de Assinatura View" imageUrl={variations.subscription} isLoading={loading.variations} />
                        <GeneratedImageView title="Chat View" imageUrl={variations.chat} isLoading={loading.variations} />
                        <GeneratedImageView title="Front View (App Home + Sidebar)" imageUrl={variations.appHome} isLoading={loading.variations} />
                        <GeneratedImageView title="Login View" imageUrl={variations.login} isLoading={loading.variations} />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ThemeGenerator;