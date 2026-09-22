import React, { useState, useRef } from 'react';
import { SAMPLE_DOCUMENTS, SampleDocument } from '../data/sampleDocuments';
import {
  FileUp,
  FileText,
  Sparkles,
  Trash2,
  ArrowRight,
  CheckCircle2,
  ShieldAlert,
  HelpCircle,
  FileCheck,
} from 'lucide-react';

interface DocumentInputProps {
  documentText: string;
  onDocumentTextChange: (text: string) => void;
  onAnalyze: (fileData?: { mimeType: string; base64: string; fileName?: string }) => void;
  isLoading: boolean;
  selectedSampleId: string | null;
  onSelectSample: (sample: SampleDocument) => void;
}

export const DocumentInput: React.FC<DocumentInputProps> = ({
  documentText,
  onDocumentTextChange,
  onAnalyze,
  isLoading,
  selectedSampleId,
  onSelectSample,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [filePayload, setFilePayload] = useState<{ mimeType: string; base64: string; fileName?: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Process file
  const processFile = (file: File) => {
    const isTextOrMd = file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.md');
    const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');
    const isImage = file.type.startsWith('image/');

    setUploadedFileName(file.name);

    if (isTextOrMd) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        onDocumentTextChange(text);
        setFilePayload(null);
      };
      reader.readAsText(file);
    } else if (isPdf || isImage) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const base64 = result.split(',')[1];
        setFilePayload({
          mimeType: file.type || (isPdf ? 'application/pdf' : 'image/jpeg'),
          base64,
          fileName: file.name,
        });
        onDocumentTextChange(`[Attached Document File: ${file.name} (${(file.size / 1024).toFixed(1)} KB)]`);
      };
      reader.readAsDataURL(file);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        onDocumentTextChange(text);
        setFilePayload(null);
      };
      reader.readAsText(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const wordCount = documentText.trim() ? documentText.trim().split(/\s+/).length : 0;

  const handleClear = () => {
    onDocumentTextChange('');
    setUploadedFileName(null);
    setFilePayload(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Intake Header */}
      <div className="bg-slate-900 text-white px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center border border-amber-400/30">
            <FileCheck className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Contract Intake &amp; Risk Audit
            </h2>
            <p className="text-[11px] text-slate-400">
              Paste agreement text or upload any PDF, contract document, or image
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Optical Parser &amp; Clause Grounding Ready</span>
        </div>
      </div>

      <div className="p-5 md:p-6 space-y-6">
        {/* Curated Sample Documents */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Curated Test Scenarios &amp; Real Contracts
            </label>
            <span className="text-[11px] text-slate-700">Click any card to load instant scenario</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {SAMPLE_DOCUMENTS.map((sample) => {
              const isSelected = selectedSampleId === sample.id;
              return (
                <button
                  key={sample.id}
                  id={`sample-doc-btn-${sample.id}`}
                  onClick={() => {
                    setUploadedFileName(null);
                    setFilePayload(null);
                    onSelectSample(sample);
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'border-slate-900 bg-slate-950 text-white shadow-md ring-1 ring-amber-400/30'
                      : 'border-slate-200/90 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-300 text-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          isSelected
                            ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                            : 'bg-amber-50 text-amber-900 border-amber-200'
                        }`}
                      >
                        {sample.badge}
                      </span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                    </div>
                    <h3 className="text-xs font-bold line-clamp-1">{sample.title}</h3>
                    <p
                      className={`text-[11px] line-clamp-2 mt-1 leading-relaxed ${
                        isSelected ? 'text-slate-300' : 'text-slate-700'
                      }`}
                    >
                      {sample.description}
                    </p>
                  </div>
                  <div
                    className={`mt-3 text-[10px] font-semibold flex items-center justify-between border-t pt-2 ${
                      isSelected ? 'border-slate-800 text-amber-300' : 'border-slate-200 text-slate-700'
                    }`}
                  >
                    <span>{sample.category}</span>
                    <span className="opacity-80">Click to Load &rarr;</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Textarea and File Upload Zone */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="legal-document-text" className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-700" />
              Document Text Editor &amp; File Ingestion
            </label>
            {documentText && (
              <button
                id="clear-document-btn"
                onClick={handleClear}
                className="text-xs text-slate-700 hover:text-rose-700 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear Document
              </button>
            )}
          </div>

          {/* Drag & Drop Zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-xl transition-all ${
              dragActive ? 'border-amber-500 bg-amber-50/50' : 'border-slate-200 bg-slate-50/40'
            }`}
          >
            <textarea
              id="legal-document-text"
              value={documentText}
              onChange={(e) => {
                onDocumentTextChange(e.target.value);
                setFilePayload(null);
                setUploadedFileName(null);
              }}
              placeholder="Paste your residential lease, employment agreement, NDA, contractor contract, software terms, or loan note here. Or drag and drop a PDF file..."
              rows={8}
              className="w-full p-4 bg-transparent text-xs sm:text-sm font-mono text-slate-800 focus:outline-none resize-y placeholder:text-slate-400 placeholder:font-sans leading-relaxed"
            />

            {/* Bottom Bar inside Textarea Container */}
            <div className="flex flex-wrap items-center justify-between border-t border-slate-200/90 px-4 py-2.5 bg-white rounded-b-xl gap-2">
              <div className="flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  id="file-upload-input"
                  className="hidden"
                  accept=".txt,.md,.pdf,image/*"
                  onChange={handleFileChange}
                />
                <button
                  type="button"
                  id="trigger-file-upload-btn"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/90 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <FileUp className="w-3.5 h-3.5 text-slate-700" />
                  Upload PDF, Contract, or Image
                </button>

                {uploadedFileName && (
                  <span className="inline-flex items-center gap-1 text-xs text-slate-800 font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-md">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    {uploadedFileName}
                  </span>
                )}
              </div>

              <div className="text-xs font-medium text-slate-700">
                {wordCount > 0 ? (
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-mono">
                    {wordCount.toLocaleString()} words loaded
                  </span>
                ) : (
                  'Ready for input'
                )}
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-700">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Full audit will evaluate risk grade (0-100), redline suggestions, deadlines, and attorney prep kit.</span>
            </div>

            <button
              id="run-analysis-btn"
              onClick={() => onAnalyze(filePayload || undefined)}
              disabled={isLoading || (!documentText.trim() && !filePayload)}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-sm ${
                isLoading || (!documentText.trim() && !filePayload)
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-slate-950 hover:bg-slate-900 text-amber-300 cursor-pointer active:scale-98'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                  <span>Auditing Legal Clauses &amp; Traps...</span>
                </>
              ) : (
                <>
                  <span>Audit &amp; Analyze Document</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
