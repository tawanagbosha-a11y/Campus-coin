import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PartnerDeal } from '../../types';
import {
  Tag,
  Search,
  Filter,
  Sparkles,
  MapPin,
  Phone,
  Calendar,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  ShoppingBag,
  Bus,
  Utensils,
  BookOpen
} from 'lucide-react';

export const CampusDeals: React.FC = () => {
  const { partnerDeals, user } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDeal, setSelectedDeal] = useState<PartnerDeal | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const categories = ['all', 'Food', 'Printing & Tech', 'Transport', 'Books & Stationery', 'Health & Grooming'];

  const filteredDeals = useMemo(() => {
    return partnerDeals.filter(d => {
      if (!d.active) return false;
      const matchesSearch =
        d.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCat = selectedCategory === 'all' || d.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [partnerDeals, searchTerm, selectedCategory]);

  const handleCopyVoucher = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-[#0a1f44]">
              Campus Deals & Discounts
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
              BELVEDERE & HARARE
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Verified student savings on cafeteria meals, printing, thesis binding, and campus shuttle transport.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
            {filteredDeals.length} Offers Available
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search partner, offer, or location..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0f2e69]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full py-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-colors shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-[#0f2e69] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'all' ? 'All Offers' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDeals.map(deal => (
          <div
            key={deal.id}
            className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden"
          >
            {/* Top Badge: Sponsored vs Organic */}
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                {deal.sponsored ? (
                  <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-600 fill-amber-600" />
                    SPONSORED PARTNER
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200 flex items-center gap-1">
                    ORGANIC STUDENT OFFER
                  </span>
                )}

                <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  {deal.discount}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-400 block uppercase">
                  {deal.businessName}
                </span>
                <h3 className="text-base font-bold text-[#0a1f44] mt-0.5 leading-snug">
                  {deal.title}
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-3">
                  {deal.description}
                </p>
              </div>

              <div className="space-y-1.5 pt-2 text-[11px] text-slate-500 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{deal.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Valid until {deal.expiryDate}</span>
                </div>
              </div>
            </div>

            {/* Redeem CTA */}
            <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                Code: {deal.offerCode}
              </span>
              <button
                onClick={() => setSelectedDeal(deal)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-[#0f2e69] hover:bg-[#0a1f44] transition-colors shadow-2xs"
              >
                Redeem Voucher
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Redemption Modal */}
      {selectedDeal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  {selectedDeal.businessName}
                </span>
                <h3 className="text-base font-black text-slate-900">
                  {selectedDeal.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDeal(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 text-center space-y-2">
              <span className="text-xs text-amber-900 font-bold uppercase tracking-wide block">
                Show this student voucher at checkout
              </span>
              <div className="text-2xl font-black font-mono text-slate-900 bg-white py-2 px-4 rounded-xl border border-amber-300 inline-block shadow-xs">
                {selectedDeal.offerCode}
              </div>
              <div>
                <button
                  onClick={() => handleCopyVoucher(selectedDeal.offerCode)}
                  className="text-xs font-bold text-[#0f2e69] hover:underline"
                >
                  {copiedCode ? '✓ Copied to clipboard!' : 'Copy voucher code'}
                </button>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{selectedDeal.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Contact: {selectedDeal.contact}</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-800 font-medium pt-1">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Please show your physical or digital HIT Student ID card upon redemption.</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedDeal(null)}
              className="w-full py-2.5 rounded-xl font-bold text-white bg-[#0f2e69] hover:bg-[#0a1f44] text-xs transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
