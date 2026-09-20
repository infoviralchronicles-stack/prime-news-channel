"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, MapPin, Phone, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8 font-sans">
      <div className="border-b border-neutral-200 pb-3 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center text-xs uppercase tracking-wider font-bold text-neutral-600 hover:text-black">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Prime News Channel
        </Link>
        <span className="text-xs font-bold uppercase tracking-widest text-[#b00]">
          Contact The Newsroom
        </span>
      </div>

      <div className="space-y-3">
        <h1 className="text-3xl sm:text-5xl font-black font-headline text-[#111111] leading-tight">
          Contact Us
        </h1>
        <p className="text-base font-serif italic text-neutral-600 border-l-2 border-black pl-4">
          Connect with our editors, technical bureau, and administrative desk.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4">
        {/* Contact Information */}
        <div className="md:col-span-5 space-y-6">
          <div className="p-6 border border-neutral-300 bg-[#fafafa] space-y-5">
            <h3 className="font-bold text-sm font-headline uppercase tracking-wider text-[#111111] border-b border-neutral-200 pb-2">
              Newsroom Bureaus
            </h3>

            <div className="flex items-start space-x-3 text-xs text-neutral-700">
              <Mail className="w-4 h-4 text-[#b00] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-neutral-900 font-semibold">Editorial Desk:</strong>
                <span>editorial@primenewschannel.com</span>
              </div>
            </div>

            <div className="flex items-start space-x-3 text-xs text-neutral-700">
              <Phone className="w-4 h-4 text-[#b00] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-neutral-900 font-semibold">Press &amp; Syndication:</strong>
                <span>+1 (202) 555-0198</span>
              </div>
            </div>

            <div className="flex items-start space-x-3 text-xs text-neutral-700">
              <MapPin className="w-4 h-4 text-[#b00] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-neutral-900 font-semibold">Digital Operations:</strong>
                <span>primenewschannel.com Newsroom Network</span>
              </div>
            </div>
          </div>

          <div className="p-5 border border-neutral-200 bg-white text-xs text-neutral-600 space-y-2">
            <h4 className="font-bold text-neutral-900 uppercase">Corrections &amp; Clarifications</h4>
            <p className="leading-relaxed">
              Prime News Channel is dedicated to accuracy. If you notice a factual discrepancy in any published report, please specify the story URL and relevant paragraph details.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-7">
          {submitted ? (
            <div className="p-8 border border-neutral-300 bg-[#fafafa] text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-[#b00] mx-auto" />
              <h3 className="text-xl font-bold font-headline text-[#111111]">Inquiry Received</h3>
              <p className="text-xs text-neutral-600 max-w-sm mx-auto leading-relaxed font-serif">
                Thank you for contacting Prime News Channel. Our editorial team reviews reader submissions and will respond promptly if follow-up is required.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 inline-block text-xs uppercase font-bold tracking-wider underline hover:text-[#b00] cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 p-6 border border-neutral-300 bg-white">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your Name"
                  className="w-full text-sm border border-neutral-300 p-2.5 focus:border-black outline-none transition bg-[#fcfcfc]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full text-sm border border-neutral-300 p-2.5 focus:border-black outline-none transition bg-[#fcfcfc]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Subject / Topic
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Editorial inquiry, feedback, or tip"
                  className="w-full text-sm border border-neutral-300 p-2.5 focus:border-black outline-none transition bg-[#fcfcfc]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Message
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Provide detailed information regarding your inquiry..."
                  className="w-full text-sm border border-neutral-300 p-2.5 focus:border-black outline-none transition bg-[#fcfcfc]"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center bg-black hover:bg-neutral-800 text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 mr-2" /> Send Dispatch
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
