"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, Plus, Trash2, Globe, Shield, Rss, Layers } from 'lucide-react';
import { NewsSource } from '@/lib/types';

export default function AdminPage() {
  const [sources, setSources] = useState<NewsSource[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState<'World' | 'Technology' | 'Business' | 'Sports' | 'General'>('World');

  useEffect(() => {
    loadSources();
  }, []);

  const loadSources = async () => {
    try {
      const res = await fetch('/api/sources');
      const data = await res.json();
      setSources(data.sources || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSyncNow = async () => {
    setIsSyncing(true);
    setSyncStatus('Fetching RSS streams and auto-publishing...');
    try {
      const res = await fetch('/api/news', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setSyncStatus(`Success: ${data.result.newCount} new stories published! Total in archive: ${data.result.totalCount}`);
      } else {
        setSyncStatus(`Error: ${data.error}`);
      }
    } catch (e: any) {
      setSyncStatus(`Failed: ${e.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleAddSource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !url) return;

    try {
      const res = await fetch('/api/sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add', name, url, category }),
      });
      const data = await res.json();
      if (data.sources) {
        setSources(data.sources);
        setName('');
        setUrl('');
        alert('RSS Feed added successfully!');
      }
    } catch (e) {
      alert('Error adding source');
    }
  };

  const handleDeleteSource = async (id: string) => {
    if (!confirm('Are you sure you want to remove this news feed?')) return;
    try {
      const res = await fetch('/api/sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id }),
      });
      const data = await res.json();
      if (data.sources) {
        setSources(data.sources);
      }
    } catch (e) {
      alert('Error deleting source');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <Link href="/" className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-red-600 mb-2">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Main Portal
          </Link>
          <h1 className="text-2xl font-black text-slate-900 flex items-center">
            <Shield className="w-6 h-6 mr-2 text-red-600" /> Prime News Channel - Control Center
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage automated news streams, RSS providers, and manual sync triggers for <strong>primenewschannel.com</strong>.
          </p>
        </div>

        <button
          onClick={handleSyncNow}
          disabled={isSyncing}
          className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Publishing News...' : 'Fetch & Publish Now'}
        </button>
      </div>

      {syncStatus && (
        <div className={`p-4 rounded-lg text-sm font-medium border ${syncStatus.startsWith('Success') ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'}`}>
          {syncStatus}
        </div>
      )}

      {/* Auto-Pilot Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center text-red-600 mb-2">
            <Rss className="w-5 h-5 mr-2" />
            <span className="font-bold text-sm">Active Feed Streams</span>
          </div>
          <p className="text-2xl font-black text-slate-900">{sources.length}</p>
          <p className="text-xs text-slate-500 mt-1">Live monitored RSS feeds</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center text-blue-600 mb-2">
            <Globe className="w-5 h-5 mr-2" />
            <span className="font-bold text-sm">Target Domain</span>
          </div>
          <p className="text-xl font-bold font-mono text-slate-900">primenewschannel.com</p>
          <p className="text-xs text-slate-500 mt-1">SSL &amp; SEO Ready</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center text-emerald-600 mb-2">
            <Layers className="w-5 h-5 mr-2" />
            <span className="font-bold text-sm">Publishing Mode</span>
          </div>
          <p className="text-xl font-bold text-emerald-700">Autonomous (Auto)</p>
          <p className="text-xs text-slate-500 mt-1">Zero-duplicate filter enabled</p>
        </div>
      </div>

      {/* Add Feed Form */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center">
          <Plus className="w-4 h-4 mr-2 text-red-600" /> Add New Verified News Source
        </h2>

        <form onSubmit={handleAddSource} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-4">
            <label className="block text-xs font-semibold text-slate-600 mb-1">Source Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Al Jazeera Tech"
              className="w-full text-sm bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-red-600 outline-none"
            />
          </div>

          <div className="sm:col-span-5">
            <label className="block text-xs font-semibold text-slate-600 mb-1">RSS XML Endpoint URL</label>
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/rss.xml"
              className="w-full text-sm bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-red-600 outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full text-sm bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-red-600 outline-none"
            >
              <option value="World">World</option>
              <option value="Technology">Technology</option>
              <option value="Business">Business</option>
              <option value="Sports">Sports</option>
              <option value="General">General</option>
            </select>
          </div>

          <div className="sm:col-span-1 flex items-end">
            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold p-2 rounded-lg text-sm transition cursor-pointer"
            >
              Add
            </button>
          </div>
        </form>
      </div>

      {/* Feed List */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h3 className="font-bold text-sm text-slate-900">Configured RSS Feeds ({sources.length})</h3>
          <span className="text-xs text-slate-500">Auto-polled every cycle</span>
        </div>

        <div className="divide-y divide-slate-100">
          {sources.map((src) => (
            <div key={src.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
              <div className="min-w-0 flex-1 pr-4">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-sm text-slate-900">{src.name}</span>
                  <span className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded">
                    {src.category}
                  </span>
                </div>
                <p className="text-xs font-mono text-slate-400 truncate mt-0.5">{src.url}</p>
              </div>

              <button
                onClick={() => handleDeleteSource(src.id)}
                className="text-slate-400 hover:text-red-600 p-2 rounded transition cursor-pointer"
                title="Remove feed"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
