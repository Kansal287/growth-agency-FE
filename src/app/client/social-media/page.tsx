'use client';

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  ExternalLink,
  Calendar,
  Clock,
  ThumbsUp,
  ThumbsDown,
  X
} from 'lucide-react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

const Instagram = ({ size = 16, ...props }: IconProps) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const Facebook = ({ size = 16, ...props }: IconProps) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const Linkedin = ({ size = 16, ...props }: IconProps) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
import ReusableTable, { TableColumn } from '@/components/ui/ReusableTable';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

interface SocialPost {
  id: string;
  caption: string;
  mediaUrl: string;
  platforms: ('Instagram' | 'Facebook' | 'LinkedIn')[];
  scheduledTime: string;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
  rejectionNote?: string;
}

const INITIAL_POSTS: SocialPost[] = [
  {
    id: 'PST-101',
    caption: '🚀 Scaling a local SaaS team doesn’t have to mean breaking the bank. In our latest guide, we detail exactly how modular agencies cover resource spikes. Link in bio!',
    mediaUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=3540&auto=format&fit=crop',
    platforms: ['LinkedIn', 'Instagram'],
    scheduledTime: '2026-06-15T15:00:00.000Z',
    status: 'PENDING_APPROVAL'
  },
  {
    id: 'PST-102',
    caption: 'Why is UX often ignored in early-stage validation? 💡 Here is the audit framework our design operators use on new product checkups. Drop a comment with your audit checklist!',
    mediaUrl: 'https://images.unsplash.com/photo-1581291518655-9523c932ded7?q=80&w=3540&auto=format&fit=crop',
    platforms: ['Instagram', 'Facebook'],
    scheduledTime: '2026-06-18T10:00:00.000Z',
    status: 'PENDING_APPROVAL'
  },
  {
    id: 'PST-103',
    caption: 'Client Spotlight: Congratulations to Acme Builders Ltd on their resident pipeline scaling to 80% capacity this quarter. Incredible operational effort!',
    mediaUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=3540&auto=format&fit=crop',
    platforms: ['LinkedIn'],
    scheduledTime: '2026-06-12T14:00:00.000Z',
    status: 'APPROVED'
  },
  {
    id: 'PST-104',
    caption: 'Weekly operational tips: Standardize your workflows before automating them. Automation applied to inefficient systems just accelerates chaos.',
    mediaUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=3540&auto=format&fit=crop',
    platforms: ['LinkedIn', 'Facebook'],
    scheduledTime: '2026-06-09T09:30:00.000Z',
    status: 'APPROVED'
  }
];

export default function ClientSocialMediaPage() {
  const [posts, setPosts] = useState<SocialPost[]>(INITIAL_POSTS);
  const [activePost, setActivePost] = useState<SocialPost | null>(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionNote, setRejectionNote] = useState('');

  // Slices: Pending & History
  const pendingPosts = posts.filter(p => p.status === 'PENDING_APPROVAL');
  
  const handleApprove = (id: string) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, status: 'APPROVED' } : p));
    toast.success('Post approved for scheduling!');
  };

  const handleOpenReject = (post: SocialPost) => {
    setActivePost(post);
    setRejectModalOpen(true);
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePost || !rejectionNote.trim()) return;

    setPosts(prev => prev.map(p => p.id === activePost.id ? { 
      ...p, 
      status: 'REJECTED', 
      rejectionNote: rejectionNote 
    } : p));

    setRejectModalOpen(false);
    setRejectionNote('');
    setActivePost(null);
    toast.info('Rejection feedback logged.');
  };

  const columns: TableColumn<SocialPost>[] = [
    {
      header: 'Post ID',
      accessor: 'id',
      align: 'center' as const,
    },
    {
      header: 'Scheduled Date',
      accessor: (item) => {
        try {
          return format(new Date(item.scheduledTime), 'dd MMM yyyy, hh:mm a');
        } catch {
          return item.scheduledTime;
        }
      },
      align: 'center' as const,
    },
    {
      header: 'Platforms',
      accessor: (item) => (
        <div className="flex gap-1.5 justify-center">
          {item.platforms.map((p, i) => (
            <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300">
              {p}
            </span>
          ))}
        </div>
      ),
      align: 'center' as const,
    },
    {
      header: 'Caption Preview',
      accessor: (item) => <p className="max-w-xs truncate text-xs">{item.caption}</p>,
      align: 'left' as const,
    },
    {
      header: 'Approval Status',
      accessor: (item) => {
        const styles: Record<string, string> = {
          PENDING_APPROVAL: 'bg-amber-100/80 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/30',
          APPROVED: 'bg-emerald-100/80 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/30',
          REJECTED: 'bg-red-100/80 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200/50 dark:border-red-800/30'
        };
        const labels: Record<string, string> = {
          PENDING_APPROVAL: 'Pending Approval',
          APPROVED: 'Approved',
          REJECTED: 'Feedback Logged'
        };
        return (
          <div className="flex flex-col items-center gap-1">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[item.status]}`}>
              {labels[item.status] || item.status}
            </span>
            {item.rejectionNote && (
              <span className="text-[9px] text-red-500 max-w-[120px] truncate" title={item.rejectionNote}>
                Note: {item.rejectionNote}
              </span>
            )}
          </div>
        );
      },
      align: 'center' as const,
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black">Social Media Content</h2>
          <p className="text-xs text-slate-500 mt-0.5">Review post creatives, calendar schedules, and approve active templates</p>
        </div>
      </div>

      <div className="space-y-6 animate-fade-in text-slate-900 dark:text-slate-100">
        
        {/* Pending approvals cards feed */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <Clock size={16} className="text-pink-500" />
            Pending Review & Approval ({pendingPosts.length})
          </h3>

          {pendingPosts.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-dashed border-gray-200 dark:border-white/10 bg-white dark:bg-[#111118] text-slate-400 text-xs">
              <CheckCircle2 className="mx-auto text-emerald-500 mb-3" size={24} />
              All content items approved! Check back soon for new drafts.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingPosts.map((post) => (
                <div key={post.id} className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111118] overflow-hidden flex flex-col justify-between">
                  {/* Creative Preview */}
                  <div className="aspect-video relative bg-slate-100 dark:bg-white/2 overflow-hidden border-b border-gray-200 dark:border-white/5">
                    <img 
                      src={post.mediaUrl} 
                      alt="Post design reference"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      {post.platforms.map((p, i) => (
                        <span key={i} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-[#070b12]/80 backdrop-blur-md text-white shadow-sm border border-white/10">
                          {p === 'Instagram' && <Instagram size={10} />}
                          {p === 'LinkedIn' && <Linkedin size={10} />}
                          {p === 'Facebook' && <Facebook size={10} />}
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Caption & Metadata */}
                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <Calendar size={12} />
                        Scheduled for: {format(new Date(post.scheduledTime), 'dd MMM yyyy, hh:mm a')}
                      </p>
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 mt-3 leading-relaxed whitespace-pre-wrap select-text">
                        {post.caption}
                      </p>
                    </div>

                    {/* Bottom sign-off actions */}
                    <div className="flex gap-3 border-t border-gray-100 dark:border-white/5 pt-4 mt-4">
                      <button
                        onClick={() => handleOpenReject(post)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-red-200 dark:border-red-950/40 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400 text-xs font-bold transition-colors cursor-pointer"
                      >
                        <ThumbsDown size={14} />
                        Needs Changes
                      </button>
                      <button
                        onClick={() => handleApprove(post.id)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-pink-700 hover:bg-pink-800 text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
                      >
                        <ThumbsUp size={14} />
                        Approve Post
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Calendar & schedule feed history */}
        <div className="p-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111118] space-y-4">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <Calendar size={16} className="text-pink-500" />
            Social Editorial Calendar Feed
          </h3>

          <ReusableTable
            data={posts}
            columns={columns}
            keyExtractor={(item) => item.id}
            loading={false}
          />
        </div>

      </div>

      {/* Reject/Changes modal prompt */}
      {rejectModalOpen && activePost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Scrim */}
          <div 
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs cursor-pointer"
            onClick={() => { setRejectModalOpen(false); setActivePost(null); }}
          />

          <form 
            onSubmit={handleRejectSubmit}
            className="relative w-full max-w-md bg-white dark:bg-[#0e121a] rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-2xl z-10 overflow-hidden animate-fade-in text-slate-900 dark:text-slate-100"
          >
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50 dark:bg-slate-900/30">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center">
                  <ThumbsDown size={16} />
                </div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white">Request Copy/Media Revision</h4>
              </div>
              <button 
                type="button"
                onClick={() => { setRejectModalOpen(false); setActivePost(null); }}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/20 rounded-xl text-[11px] text-red-800 dark:text-red-300 leading-relaxed">
                Provide detail feedback. The design/copywriter team will update drafts within 24 hours.
              </div>
              <div>
                <label htmlFor="reject-note" className="block text-[10px] text-slate-400 font-bold uppercase mb-1.5">
                  Change Request Notes <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="reject-note"
                  required
                  rows={4}
                  placeholder="e.g. Please update the first sentence to refer to our new Enterprise plan instead. In the creative design, let's use the secondary brand color for background icons..."
                  value={rejectionNote}
                  onChange={(e) => setRejectionNote(e.target.value)}
                  className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/30 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => { setRejectModalOpen(false); setActivePost(null); }}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md transition-colors"
              >
                Send Feedback
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
