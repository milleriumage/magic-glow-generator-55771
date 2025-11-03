import React, { useState, useCallback, ReactNode } from 'react';

const Spinner = () => (
    <div className="absolute inset-0 bg-neutral-900/80 flex items-center justify-center z-10">
        <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    </div>
);

const DesignPanel: React.FC<{ title: string; imageUrl: string | null; children?: ReactNode; isLoading?: boolean; onImageClick?: () => void; }> = ({ title, imageUrl, children, isLoading, onImageClick }) => (
    <div className="bg-neutral-800 rounded-lg shadow-lg flex flex-col relative overflow-hidden min-h-[300px]">
        {isLoading && <Spinner />}
        <h3 className="p-2 text-center text-sm font-semibold text-white bg-neutral-700/50">{title}</h3>
        <div className="flex-1 flex items-center justify-center p-2 cursor-pointer min-h-0" onClick={onImageClick}>
            {imageUrl ? (
                <img src={imageUrl} className="max-w-full max-h-full object-contain rounded" alt={title} />
            ) : (
                <div className="text-neutral-500 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="h-12 w-12 mx-auto"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                    <p>Painel Vazio</p>
                </div>
            )}
        </div>
        {children && <div className="p-2 bg-neutral-800/80 border-t border-neutral-700">{children}</div>}
    </div>
);

const LogoGeneratorPanel: React.FC<{
    logoConcept: string;
    setLogoConcept: (value: string) => void;
    onGenerate: () => void;
    isLoading: boolean;
    generatedLogos: {svg: string; palette: Record<string,string>}[];
    onLogoSelect: (logo: {svg: string; palette: Record<string,string>}) => void;
}> = ({ logoConcept, setLogoConcept, onGenerate, isLoading, generatedLogos, onLogoSelect }) => (
    <div className="bg-neutral-800 rounded-lg shadow-lg flex flex-col relative overflow-hidden min-h-[300px]">
        <h3 className="p-2 text-center text-sm font-semibold text-white bg-neutral-700/50">Painel 4: Gerador de Logo</h3>
        <div className="flex-1 p-4 flex flex-col justify-center space-y-3">
             <div className="flex">
                <input value={logoConcept} onChange={e => setLogoConcept(e.target.value)} placeholder="Conceito (ex: 'Fintech eagle')" className="flex-1 bg-neutral-700 rounded-l p-2 text-white" />
                <button onClick={onGenerate} disabled={isLoading} className="bg-brand-light text-black font-semibold px-3 rounded-r">Gerar</button>
             </div>
             <div className="grid grid-cols-3 gap-2 h-24">
                 {isLoading ? <div className="col-span-3 flex items-center justify-center"><Spinner/></div> : 
                  generatedLogos.map((logo, i) => (
                      <button key={i} onClick={() => onLogoSelect(logo)} className="bg-neutral-900 rounded p-1 border-2 border-transparent hover:border-brand-primary flex items-center justify-center" dangerouslySetInnerHTML={{ __html: logo.svg }} />
                  ))}
             </div>
             <p className="text-xs text-neutral-400 text-center">Clique em um logo para aplicar o branding ao Painel 2.</p>
        </div>
    </div>
);


const ExportModal: React.FC<{ onClose: () => void; designImage: string; logoSvg: string; palette: Record<string,string>; prompt: string }> = ({ onClose, designImage, logoSvg, palette, prompt }) => {
    const cssVars = Object.entries(palette).map(([name, hex]) => `--${name}-color: ${hex};`).join('\n');
    const designSpec = JSON.stringify({ components: ["Header", "Card", "Button"], typography: { fontFamily: "Inter", baseSize: "16px" }, intent: "Modern e-commerce dashboard" }, null, 2);
    
    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-neutral-800 rounded-xl shadow-2xl p-6 w-full max-w-3xl transform transition-all flex flex-col" onClick={e => e.stopPropagation()}>
                 <h2 className="text-2xl font-bold text-white mb-4">Pacote de Implementação (Simulado)</h2>
                 <p className="text-neutral-400 mb-4 text-sm">Em um aplicativo real, isso seria um download .zip. Aqui estão os conteúdos gerados:</p>
                 <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto max-h-[70vh]">
                    {/* Visuals */}
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold text-white mb-1">design_visual.png</h3>
                            <img src={designImage} alt="Design Visual" className="rounded-lg border border-neutral-700" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white mb-1">logo_final.svg</h3>
                            <div className="p-4 bg-neutral-900 rounded-lg border border-neutral-700 flex justify-center items-center h-32" dangerouslySetInnerHTML={{ __html: logoSvg }} />
                        </div>
                    </div>
                    {/* Code */}
                    <div className="space-y-4">
                        <div>
                             <h3 className="font-semibold text-white mb-1">style_variables.css</h3>
                             <pre className="text-xs bg-neutral-900 p-2 rounded-lg border border-neutral-700 max-h-24 overflow-auto"><code>{cssVars}</code></pre>
                        </div>
                        <div>
                             <h3 className="font-semibold text-white mb-1">design_spec.json</h3>
                             <pre className="text-xs bg-neutral-900 p-2 rounded-lg border border-neutral-700 max-h-24 overflow-auto"><code>{designSpec}</code></pre>
                        </div>
                        <div>
                             <h3 className="font-semibold text-white mb-1">coding_prompt.txt</h3>
                             <textarea readOnly value={prompt} className="text-xs bg-neutral-900 p-2 rounded-lg border border-neutral-700 w-full h-32"/>
                        </div>
                    </div>
                 </div>
                 <button onClick={onClose} className="mt-4 bg-brand-primary text-white font-bold py-2 px-4 rounded-lg self-center">Fechar</button>
            </div>
        </div>
    );
};


const DesignStudio: React.FC = () => {
    type PanelId = 'P1' | 'P2' | 'P3';
    
    const [panelImages, setPanelImages] = useState<Record<PanelId, string | null>>({
        P1: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        P2: null,
        P3: null,
    });
    
    const [command, setCommand] = useState('');
    const [commandHistory, setCommandHistory] = useState<string[]>([]);
    const [commandTargetPanel, setCommandTargetPanel] = useState<PanelId>('P2'); 

    const [logoConcept, setLogoConcept] = useState('');
    const [generatedLogos, setGeneratedLogos] = useState<{svg: string; palette: Record<string,string>}[]>([]);
    const [selectedLogo, setSelectedLogo] = useState<{svg: string; palette: Record<string,string>} | null>(null);
    
    const [generatedPalette, setGeneratedPalette] = useState<Record<string,string> | null>(null);
    const [paletteTargetPanel, setPaletteTargetPanel] = useState<PanelId>('P2');
    const [generatedPrompt, setGeneratedPrompt] = useState('');
    const [selectedSourcePanel, setSelectedSourcePanel] = useState<PanelId>('P2'); 

    const [loadingStates, setLoadingStates] = useState({ P1: false, P2: false, P3: false, logo: false });
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [layoutMode, setLayoutMode] = useState<'grid' | 'column'>('grid');

    const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setPanelImages({ P1: reader.result as string, P2: null, P3: null });
            };
            reader.readAsDataURL(file);
        }
    }, []);

    const runCommand = useCallback((cmd: string, targetPanel: PanelId) => {
        if (!panelImages.P1) { alert("Faça upload de uma imagem de referência primeiro."); return; }
        setLoadingStates(s => ({...s, [targetPanel]: true}));
        setCommandHistory(h => [cmd, ...h].slice(0, 5));
        setTimeout(() => {
            setPanelImages(prev => ({ ...prev, [targetPanel]: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }));
            setLoadingStates(s => ({...s, [targetPanel]: false}));
        }, 1500);
    }, [panelImages.P1]);
    
    const handleCommandSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        runCommand(command, commandTargetPanel);
        setCommand('');
    };

    const handleGenerateOptimized = useCallback(() => runCommand("Generate Optimized Interface", 'P2'), [runCommand]);
    const handleGenerateRandom = useCallback(() => {
        if (!panelImages.P1) { alert("Faça upload de uma imagem de referência primeiro."); return; }
        setLoadingStates(s => ({...s, P3: true}));
        setTimeout(() => {
            setPanelImages(prev => ({...prev, P3: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }));
            setLoadingStates(s => ({...s, P3: false}));
        }, 1500);
    }, [panelImages.P1]);

    const handleGenerateLogo = useCallback(() => {
        if (!logoConcept) return;
        setLoadingStates(s => ({...s, logo: true}));
        setTimeout(() => {
            setGeneratedLogos([
                { svg: '<svg viewBox="0 0 100 100" width="60" height="60"><path d="M50 10L90 90H10L50 10Z" fill="#3B82F6"/><path d="M50 10L10 90H30L50 50L70 90H90L50 10Z" fill="#A78BFA"/></svg>', palette: { primary: '#3B82F6', secondary: '#A78BFA' } },
                { svg: '<svg viewBox="0 0 100 100" width="60" height="60"><circle cx="50" cy="50" r="40" fill="#10B981"/><path d="M50 20C66.568 20 80 33.432 80 50C80 66.568 66.568 80 50 80C33.432 80 20 66.568 20 50C20 33.432 33.432 20 50 20ZM50 30C55.523 30 60 34.477 60 40C60 45.523 55.523 50 50 50C44.477 50 40 45.523 40 40C40 34.477 44.477 30 50 30Z" fill="#FBBF24"/></svg>', palette: { primary: '#10B981', secondary: '#FBBF24' } },
                { svg: '<svg viewBox="0 0 100 100" width="60" height="60"><rect x="10" y="10" width="80" height="80" rx="10" fill="#EF4444"/><rect x="25" y="25" width="50" height="50" rx="5" fill="#4B5563"/></svg>', palette: { primary: '#EF4444', secondary: '#4B5563' } }
            ]);
            setLoadingStates(s => ({...s, logo: false}));
        }, 1500);
    }, [logoConcept]);

    const applyBranding = useCallback((logo: {svg: string, palette: Record<string,string>}) => {
        if (!panelImages.P2) { alert("Gere uma interface no Painel 2 primeiro."); return; }
        setSelectedLogo(logo);
        alert(`Branding aplicado! O logo foi adicionado e as cores primárias do Painel 2 foram atualizadas com a paleta do logo.`);
    }, [panelImages.P2]);

    const handleGeneratePalette = useCallback(() => {
         setGeneratedPalette({ primary: '#4F46E5', secondary: '#A78BFA', accent: '#FBBF24', neutral: '#374151' });
         alert(`Paleta gerada a partir do Painel ${selectedSourcePanel}`);
    }, [selectedSourcePanel]);

    const handleApplyPalette = useCallback(() => {
        if (!generatedPalette) { alert("Gere uma paleta primeiro."); return; }
        if (!panelImages[paletteTargetPanel]) { alert(`Painel ${paletteTargetPanel} está vazio.`); return; }
        setLoadingStates(s => ({...s, [paletteTargetPanel]: true}));
        setTimeout(() => {
             setPanelImages(prev => ({ ...prev, [paletteTargetPanel]: 'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }));
            setLoadingStates(s => ({...s, [paletteTargetPanel]: false}));
        }, 1000);
    }, [generatedPalette, paletteTargetPanel, panelImages]);

    const handleGenerateUXKit = useCallback(() => {
        if (!panelImages[selectedSourcePanel]) { alert(`Gere uma interface no Painel ${selectedSourcePanel} primeiro.`); return; }
        alert(`Kit UX alternativo gerado para o Painel ${selectedSourcePanel}. Em uma aplicação real, isso alteraria o painel visualmente.`);
    }, [panelImages, selectedSourcePanel]);

    const handleGeneratePrompt = useCallback(() => {
        if (!panelImages[selectedSourcePanel]) { alert(`Gere uma interface no Painel ${selectedSourcePanel} primeiro.`); return; }
        const promptText = `cinematic photo of a modern web application dashboard UI/UX for a ${logoConcept || 'tech'} company, dark mode, vibrant ${selectedLogo?.palette.primary || 'blue'} and ${selectedLogo?.palette.secondary || 'purple'} accents, data visualization with charts and graphs, clean typography, minimalist design, professional product screenshot, behance, dribbble --ar 4:3 --style raw`;
        setGeneratedPrompt(promptText);
        alert(`Prompt gerado a partir do Painel ${selectedSourcePanel}!`);
    }, [panelImages, selectedSourcePanel, logoConcept, selectedLogo]);
    
    const handleCopyPrompt = () => {
        navigator.clipboard.writeText(generatedPrompt);
        alert('Prompt copiado para a área de transferência!');
    };


    return (
        <div className="flex flex-col md:flex-row h-full max-h-full overflow-hidden bg-neutral-900">
            {isExportModalOpen && panelImages.P2 && <ExportModal 
                onClose={() => setIsExportModalOpen(false)}
                designImage={panelImages.P2}
                logoSvg={selectedLogo?.svg || '<svg></svg>'}
                palette={selectedLogo?.palette || generatedPalette || {}}
                prompt={generatedPrompt || 'Gere um prompt primeiro.'}
            />}
            {/* Sidebar */}
            <aside className="w-full md:w-80 lg:w-96 bg-neutral-800 border-r border-neutral-700 flex-shrink-0 flex flex-col p-4 space-y-4 overflow-y-auto">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">Design Studio</h2>
                    <div className="flex items-center bg-neutral-900 rounded-lg p-1">
                        <button onClick={() => setLayoutMode('grid')} className={`px-2 py-1 text-xs rounded ${layoutMode === 'grid' ? 'bg-brand-primary' : ''}`}>Grid</button>
                        <button onClick={() => setLayoutMode('column')} className={`px-2 py-1 text-xs rounded ${layoutMode === 'column' ? 'bg-brand-primary' : ''}`}>Coluna</button>
                    </div>
                </div>

                <div>
                    <label htmlFor="ref-upload" className="w-full text-center cursor-pointer bg-brand-primary text-white font-bold py-2 px-4 rounded-lg block">Upload da Imagem de Referência</label>
                    <input id="ref-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </div>
                <form onSubmit={handleCommandSubmit}>
                    <textarea value={command} onChange={e => setCommand(e.target.value)} placeholder="Comando de Texto (ex: 'mude o botão para vermelho')" className="w-full h-24 bg-neutral-700 rounded p-2 text-white resize-none" />
                    <div className="flex mt-1 gap-1">
                        <select value={commandTargetPanel} onChange={e => setCommandTargetPanel(e.target.value as PanelId)} className="bg-neutral-700 text-white p-2 rounded text-sm">
                            <option value="P1">em P1</option>
                            <option value="P2">em P2</option>
                            <option value="P3">em P3</option>
                        </select>
                        <button type="submit" className="flex-1 bg-brand-secondary text-white font-semibold py-2 rounded">Gerar</button>
                    </div>
                </form>
                <div>
                    <h4 className="text-sm font-semibold text-neutral-300 mb-1">Histórico de Comandos:</h4>
                    <ul className="text-xs text-neutral-400 space-y-1">
                        {commandHistory.map((c, i) => <li key={i} className="truncate bg-neutral-700/50 p-1 rounded">{c}</li>)}
                    </ul>
                </div>
                 {/* Ferramentas Auxiliares */}
                 <div className="pt-2 border-t border-neutral-700 space-y-2">
                    <h3 className="text-lg font-bold text-white text-center">Ferramentas Auxiliares</h3>
                     <div>
                        <h4 className="text-sm font-semibold text-neutral-300 mb-1 text-center">Painel de Origem (Para Gerar)</h4>
                        <div className="grid grid-cols-3 gap-1 bg-neutral-900 rounded-lg p-1">
                            {(['P1', 'P2', 'P3'] as PanelId[]).map(p => (
                                <button key={p} onClick={() => setSelectedSourcePanel(p)} className={`text-xs px-3 py-1 rounded-md transition-colors ${selectedSourcePanel === p ? 'bg-brand-primary text-white' : 'text-neutral-300 hover:bg-neutral-700'}`}>{p}</button>
                            ))}
                        </div>
                    </div>
                     <button onClick={handleGeneratePalette} className="w-full bg-neutral-700 py-2 rounded">Gerar Paleta de Cores ({selectedSourcePanel})</button>
                     {generatedPalette && <div className="flex justify-around p-1 bg-neutral-900 rounded">{Object.values(generatedPalette).map((hex, i) => <div key={i} style={{backgroundColor: hex}} className="w-6 h-6 rounded-full border-2 border-neutral-700" title={hex} />)}</div>}
                     <div className="flex gap-1">
                         <select value={paletteTargetPanel} onChange={e => setPaletteTargetPanel(e.target.value as PanelId)} className="bg-neutral-700 text-white p-2 rounded text-sm">
                            <option value="P1">em P1</option>
                            <option value="P2">em P2</option>
                            <option value="P3">em P3</option>
                        </select>
                        <button onClick={handleApplyPalette} disabled={!generatedPalette} className="flex-1 bg-neutral-700 py-2 rounded disabled:opacity-50">Aplicar Paleta</button>
                     </div>
                     <button onClick={handleGenerateUXKit} className="w-full bg-neutral-700 py-2 rounded">Gerar Kit UX Alternativo</button>
                 </div>
                 {/* Engenharia Reversa e Exportação */}
                 <div className="pt-2 border-t border-neutral-700 space-y-2">
                      <h3 className="text-lg font-bold text-white text-center">Finalização</h3>
                      <button onClick={handleGeneratePrompt} className="w-full bg-neutral-700 py-2 rounded">Gerar Prompt de Imagem ({selectedSourcePanel})</button>
                      {generatedPrompt && (
                          <div className="relative">
                            <textarea readOnly value={generatedPrompt} className="w-full h-28 bg-neutral-900 rounded p-2 text-xs text-neutral-400 resize-none" />
                            <button onClick={handleCopyPrompt} className="absolute top-2 right-2 bg-neutral-600 hover:bg-neutral-500 p-1 rounded text-xs text-white">Copiar</button>
                          </div>
                      )}
                      <button onClick={() => { if(panelImages.P2 && selectedLogo) setIsExportModalOpen(true); else alert('Gere uma interface no Painel 2 e aplique uma marca primeiro.') }} className="w-full bg-accent-green text-black font-bold py-2 rounded">💾 Exportar Pacote de Implementação</button>
                 </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 h-full overflow-y-auto">
                <div className={`${layoutMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 grid-rows-2 gap-4' : 'flex flex-col space-y-4'}`}>
                    <DesignPanel title="Painel 1: Referência Original" imageUrl={panelImages.P1} isLoading={loadingStates.P1}>
                        <button onClick={handleGenerateOptimized} disabled={!panelImages.P1} className="text-xs bg-brand-primary text-white py-1 px-2 rounded w-full disabled:opacity-50">Gerar Interface Otimizada (Magic Button)</button>
                    </DesignPanel>
                    <DesignPanel title="Painel 2: Versão Iterada" imageUrl={panelImages.P2} isLoading={loadingStates.P2} />
                    <DesignPanel title="Painel 3: Versão Alternativa" imageUrl={panelImages.P3} isLoading={loadingStates.P3}>
                        <button onClick={handleGenerateRandom} disabled={!panelImages.P1} className="text-xs bg-brand-secondary text-white py-1 px-2 rounded w-full disabled:opacity-50">Gerar Interface Aleatória</button>
                    </DesignPanel>
                    <LogoGeneratorPanel 
                        logoConcept={logoConcept}
                        setLogoConcept={setLogoConcept}
                        onGenerate={handleGenerateLogo}
                        isLoading={loadingStates.logo}
                        generatedLogos={generatedLogos}
                        onLogoSelect={applyBranding}
                    />
                </div>
            </main>
        </div>
    );
};

export default DesignStudio;
