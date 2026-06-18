import React, { useState, useRef } from 'react';
import { X, Upload, Paperclip } from 'lucide-react';

interface CreateTicketDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (subject: string, category: string, description: string, attachment: File | null) => void;
}

export default function CreateTicketDialog({ isOpen, onClose, onSubmit }: CreateTicketDialogProps) {
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Technical Issue');
  const [description, setDescription] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (subject.trim() && description.trim()) {
      onSubmit(subject, category, description, attachment);
      setSubject('');
      setDescription('');
      setCategory('Technical Issue');
      setAttachment(null);
      onClose();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      // 25MB file size limit check as per risk guidelines
      if (file.size > 25 * 1024 * 1024) {
        alert("File size exceeds 25 MB. Please select a smaller file.");
        return;
      }
      setAttachment(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#111118] border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Title */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/10">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Raise a Support Ticket</h2>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Let us know how we can assist you today.</p>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors rounded-full p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Close"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label htmlFor="ticket-category" className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <select
              id="ticket-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2.5 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none text-sm bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-medium cursor-pointer shadow-sm transition-all"
            >
              <option value="Technical Issue">Technical Issue</option>
              <option value="Billing & Payments">Billing & Payments</option>
              <option value="Design Change">Design Change</option>
              <option value="Marketing">Marketing (Ads/Leads)</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="ticket-subject" className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Subject
            </label>
            <input
              id="ticket-subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief summary of the issue"
              className="w-full p-2.5 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none text-sm bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 shadow-sm transition-all"
              required
            />
          </div>
          
          <div>
            <label htmlFor="ticket-description" className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Description / Issue Details
            </label>
            <textarea
              id="ticket-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your issue or change request in detail. Mention pages, devices or errors if any."
              rows={4}
              className="w-full p-2.5 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none resize-none text-sm bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 shadow-sm transition-all"
              required
            />
          </div>

          <div>
            <label 
              htmlFor="ticket-file-upload"
              className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5"
            >
              Attach Screenshot / File (Optional, max 25MB)
            </label>
            <input
              id="ticket-file-upload"
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              title="Upload file"
              aria-label="Upload file"
            />
            {attachment ? (
              <div className="flex items-center justify-between p-2.5 border border-dashed border-pink-300 dark:border-pink-900/50 bg-pink-50/30 dark:bg-pink-950/10 rounded-xl text-sm">
                <div className="flex items-center gap-2 truncate text-slate-700 dark:text-slate-300 font-medium">
                  <Paperclip size={14} className="text-pink-500 shrink-0" />
                  <span className="truncate">{attachment.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setAttachment(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  title="Remove attachment"
                  aria-label="Remove attachment"
                >
                  <X size={15} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 border border-dashed border-slate-300 dark:border-white/10 rounded-xl flex flex-col items-center justify-center gap-1.5 text-slate-500 hover:text-pink-600 dark:hover:text-pink-400 hover:border-pink-300 dark:hover:border-pink-900/50 cursor-pointer bg-slate-50/50 dark:bg-slate-900/10 transition-all text-xs font-medium"
              >
                <Upload size={16} />
                <span>Choose File to Upload</span>
              </button>
            )}
          </div>
          
          <div className="pt-2 flex justify-end gap-3 border-t border-slate-100 dark:border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/10 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!subject.trim() || !description.trim()}
              className="px-4 py-2.5 text-xs font-semibold text-white bg-pink-700 hover:bg-pink-800 active:bg-pink-900 dark:bg-pink-700 dark:hover:bg-pink-800 rounded-xl shadow-md shadow-pink-500/10 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed transition-all"
            >
              Submit Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
