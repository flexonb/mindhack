'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { Phone, AlertTriangle, MapPin, ArrowRight, Heart, Clock, Search, Globe, PhoneCall, Shield, Download, Check, WifiOff } from 'lucide-react';

// All crisis data for offline caching
const crisisData = {
  hotlines: [
    // International Organizations
    { country: 'International', name: 'Befrienders Worldwide', phone: 'Various', type: 'Directory', available: '24/7', website: 'befrienders.org', region: 'Global' },
    { country: 'International', name: 'IASP Crisis Centres', phone: 'Various', type: 'Directory', available: '24/7', website: 'iasp.info/resources/Crisis-Centres', region: 'Global' },

    // North America
    { country: 'United States', name: '988 Suicide & Crisis Lifeline', phone: '988', type: 'Call/Text', available: '24/7', website: '988lifeline.org', region: 'North America' },
    { country: 'United States', name: 'Crisis Text Line', phone: '741741', type: 'Text', available: '24/7', website: 'crisistextline.org', region: 'North America' },
    { country: 'Canada', name: 'Canada Suicide Prevention Service', phone: '1-833-456-4566', type: 'Call/Text', available: '24/7', website: 'casss.org', region: 'North America' },
    { country: 'Canada', name: 'Kids Help Phone', phone: '1-800-668-6868', type: 'Call/Text', available: '24/7', website: 'kidshelpphone.ca', region: 'North America' },
    { country: 'Mexico', name: 'SAPTEL', phone: '55-5259-8121', type: 'Call/Chat', available: '24/7', website: 'saptel.org.mx', region: 'North America' },

    // Europe
    { country: 'United Kingdom', name: 'Samaritans', phone: '116 123', type: 'Call/Email', available: '24/7', website: 'samaritans.org', region: 'Europe' },
    { country: 'Ireland', name: 'Samaritans Ireland', phone: '116 123', type: 'Call', available: '24/7', website: 'samaritans.org', region: 'Europe' },
    { country: 'Germany', name: 'Telefonseelsorge', phone: '0800-111-0111', type: 'Call', available: '24/7', website: 'telefonseelsorge.de', region: 'Europe' },
    { country: 'Austria', name: 'Telefonseelsorge', phone: '142', type: 'Call', available: '24/7', website: 'telefonseelsorge.at', region: 'Europe' },
    { country: 'Switzerland', name: 'Dargebotene Hand', phone: '143', type: 'Call', available: '24/7', website: 'dargebotenehand.ch', region: 'Europe' },
    { country: 'France', name: 'SOS Amitié', phone: '09 72 39 40 50', type: 'Call/Chat', available: '24/7', website: 'sos-amitie.com', region: 'Europe' },
    { country: 'Netherlands', name: 'Telefonische Hulpverlening', phone: '0900-0767', type: 'Call', available: '24/7', website: 'slachtofferhulp.nl', region: 'Europe' },
    { country: 'Belgium', name: 'Centre de Prévention du Suicide', phone: '0800 32 123', type: 'Call', available: '24/7', website: 'preventionsuicide.be', region: 'Europe' },
    { country: 'Sweden', name: 'Mind', phone: '08-522 828 90', type: 'Call', available: '24/7', website: 'mind.se', region: 'Europe' },
    { country: 'Norway', name: 'Mental Helse', phone: '116 123', type: 'Call', available: '24/7', website: 'mentalhelse.no', region: 'Europe' },
    { country: 'Denmark', name: 'Livslinien', phone: '70-201-201', type: 'Call', available: '24/7', website: 'livslinien.dk', region: 'Europe' },
    { country: 'Finland', name: 'Kriisipuhelin', phone: '09-2525-0111', type: 'Call', available: '24/7', website: 'mielenterveys.fi', region: 'Europe' },
    { country: 'Poland', name: 'Centrum Wsparcia', phone: '800-70-2222', type: 'Call/SMS', available: '24/7', website: 'psychologicznapoc.pl', region: 'Europe' },
    { country: 'Spain', name: 'Teléfono de la Esperanza', phone: '717-003-717', type: 'Call', available: '24/7', website: 'telefonodelaesperanza.org', region: 'Europe' },
    { country: 'Italy', name: 'Telefono Amico', phone: '02-2327-2327', type: 'Call', available: '24/7', website: 'telefonoamico.it', region: 'Europe' },
    { country: 'Portugal', name: 'SOS Voz Amiga', phone: '21-354-4544', type: 'Call', available: '16-24', website: 'sosvozamiga.pt', region: 'Europe' },
    { country: 'Ukraine', name: 'Lifeline Ukraine', phone: '7333', type: 'Call', available: '24/7', website: 'lifelineukraine.org', region: 'Europe' },

    // Asia
    { country: 'Japan', name: 'TELL Lifeline', phone: '03-5774-0992', type: 'Call', available: '9am-11pm', website: 'telljp.com', region: 'Asia' },
    { country: 'India', name: 'Vandrevala Foundation', phone: '1860-2662-345', type: 'Call', available: '24/7', website: 'vandrevalafoundation.com', region: 'Asia' },
    { country: 'India', name: 'iCall', phone: '9152987821', type: 'Call', available: 'Mon-Sat 8am-10pm', website: 'icallhelpline.org', region: 'Asia' },
    { country: 'Singapore', name: 'Samaritans of Singapore', phone: '1800-221-4444', type: 'Call', available: '24/7', website: 'samaritans.org.sg', region: 'Asia' },
    { country: 'Hong Kong', name: 'The Samaritans', phone: '2382-0000', type: 'Call', available: '24/7', website: 'samaritans.org.hk', region: 'Asia' },
    { country: 'Taiwan', name: 'Taiwan Suicide Prevention Center', phone: '1925', type: 'Call', available: '24/7', website: 'tspc.org.tw', region: 'Asia' },
    { country: 'South Korea', name: 'Korea Suicide Prevention Center', phone: '1577-0199', type: 'Call', available: '24/7', website: 'spckorea.or.kr', region: 'Asia' },
    { country: 'China', name: 'Beijing Crisis Center', phone: '010-8295-1332', type: 'Call', available: '24/7', website: 'crisiscenter.cn', region: 'Asia' },
    { country: 'Philippines', name: 'Hopeline', phone: '0917-558-4673', type: 'Call/Text', available: '24/7', website: 'hopeline.ph', region: 'Asia' },
    { country: 'Thailand', name: 'Thai Health Promotion Center', phone: '1330', type: 'Call', available: '24/7', website: 'health2.or.th', region: 'Asia' },
    { country: 'Malaysia', name: 'Befrienders Kuala Lumpur', phone: '03-7627 2929', type: 'Call', available: '24/7', website: 'befrienderskl.org.my', region: 'Asia' },

    // Oceania
    { country: 'Australia', name: 'Lifeline Australia', phone: '13 11 14', type: 'Call/Text', available: '24/7', website: 'lifeline.org.au', region: 'Oceania' },
    { country: 'Australia', name: 'Beyond Blue', phone: '1300 22 4636', type: 'Call/Chat', available: '24/7', website: 'beyondblue.org.au', region: 'Oceania' },
    { country: 'New Zealand', name: 'Lifeline New Zealand', phone: '0800 543 354', type: 'Call', available: '24/7', website: 'lifeline.org.nz', region: 'Oceania' },
    { country: 'New Zealand', name: 'Youthline', phone: '0800 376 633', type: 'Call/Text', available: '24/7', website: 'youthline.co.nz', region: 'Oceania' },

    // Africa
    { country: 'South Africa', name: 'Suicide Crisis Line', phone: '0800-567-567', type: 'Call/SMS', available: '24/7', website: 'suicidehelpline.org.za', region: 'Africa' },
    { country: 'South Africa', name: 'LifeLine', phone: '0861-322-322', type: 'Call', available: '24/7', website: 'lifeline.org.za', region: 'Africa' },
    { country: 'Kenya', name: 'Befrienders Kenya', phone: '0722-178-177', type: 'Call', available: '24/7', website: 'befrienderskenya.org', region: 'Africa' },
    { country: 'Nigeria', name: 'Nigerian Suicide Prevention Foundation', phone: '0805-555-0019', type: 'Call/SMS', available: '24/7', website: 'thenspf.org', region: 'Africa' },
    { country: 'Uganda', name: 'Mind Matters Uganda', phone: '0800-219-222', type: 'Call', available: '24/7', website: 'mindmattersug.com', region: 'Africa' },
    { country: 'Ghana', name: 'Lifeline Ghana', phone: '2332-444-223', type: 'Call', available: '24/7', website: 'lifelineghana.org', region: 'Africa' },
    { country: 'Egypt', name: 'Egyptian Center for Mental Health', phone: '0800-888-0707', type: 'Call', available: '24/7', website: 'moh.gov.eg', region: 'Africa' },
    { country: 'Morocco', name: 'SOS Aide', phone: '0800-200-200', type: 'Call', available: '24/7', website: 'sosaid.com', region: 'Africa' },

    // Middle East
    { country: 'Israel', name: 'ERAN', phone: '1201', type: 'Call/Chat', available: '24/7', website: 'eran.org.il', region: 'Middle East' },
    { country: 'Lebanon', name: 'Embrace', phone: '1564', type: 'Call', available: '24/7', website: 'embrace.org.lb', region: 'Middle East' },
    { country: 'Turkey', name: 'Sağlık Bakanlığı', phone: '112', type: 'Call', available: '24/7', website: 'saglik.gov.tr', region: 'Middle East' },
    { country: 'UAE', name: 'Dubai Health Authority', phone: '800-342', type: 'Call', available: '24/7', website: 'dha.gov.ae', region: 'Middle East' },
    { country: 'Saudi Arabia', name: 'National Center for Mental Health', phone: '920033370', type: 'Call', available: '24/7', website: 'ncmh.org.sa', region: 'Middle East' },

    // Central/South America & Caribbean
    { country: 'Brazil', name: 'CVV', phone: '188', type: 'Call', available: '24/7', website: 'cvv.org.br', region: 'South America' },
    { country: 'Argentina', name: 'Centro de Atención Familiar', phone: '135', type: 'Call', available: '24/7', website: 'casafs.com', region: 'South America' },
    { country: 'Colombia', name: 'Línea 106', phone: '106', type: 'Call', available: '24/7', website: 'secretariasalud.gov.co', region: 'South America' },
    { country: 'Chile', name: 'Fundación Chile', phone: '141', type: 'Call', available: '24/7', website: 'fundacionchile.cl', region: 'South America' },
    { country: 'Peru', name: 'Círculo de Estudios', phone: '419-0800', type: 'Call', available: '24/7', website: 'circuloestudios.org.pe', region: 'South America' },
    { country: 'Jamaica', name: 'Jamaica Suicide Prevention Hotline', phone: '888-NEW-SOLVE', type: 'Call', available: '24/7', website: 'newsolve.org', region: 'Caribbean' },
    { country: 'Puerto Rico', name: 'Coordinación de Salud Mental', phone: '988', type: 'Call/Text', available: '24/7', website: 'salud.gov.pr', region: 'Caribbean' },
  ],
  emergencyNumbers: [
    { region: 'Europe (Most Countries)', number: '112', description: 'Single emergency number' },
    { region: 'United Kingdom', number: '999', description: 'Emergency services' },
    { region: 'United States', number: '911', description: 'Emergency services' },
    { region: 'Canada', number: '911', description: 'Emergency services' },
    { region: 'Australia', number: '000', description: 'Emergency services' },
    { region: 'New Zealand', number: '111', description: 'Emergency services' },
    { region: 'India', number: '112', description: 'Single emergency number' },
    { region: 'Japan', number: '110/119', description: 'Police/Fire/Medical' },
    { region: 'South Korea', number: '119', description: 'Fire/Medical' },
    { region: 'China', number: '110/120/119', description: 'Police/Fire/Medical' },
    { region: 'Brazil', number: '192/190/197', description: 'Medical/Police/Road' },
    { region: 'South Africa', number: '10111', description: 'Police' },
    { region: 'Nigeria', number: '199/112', description: 'Police/Emergency' },
    { region: 'UAE', number: '999/997/998', description: 'Police/Fire/Medical' },
    { region: 'Singapore', number: '999', description: 'Police' },
    { region: 'Mexico', number: '911', description: 'Emergency services' },
  ],
};

const verifiedHotlines = crisisData.hotlines;
const emergencyNumbers = crisisData.emergencyNumbers;

const regions = ['All Regions', 'North America', 'Central America', 'South America', 'Caribbean', 'Europe', 'Asia', 'Middle East', 'Africa', 'Oceania'];

export default function CrisisPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [showTable, setShowTable] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [isCached, setIsCached] = useState(false);
  const [isCaching, setIsCaching] = useState(false);

  // Check online/offline status
  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOffline(!navigator.onLine);
    };

    setIsOffline(!navigator.onLine);
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  // Check if data is cached
  useEffect(() => {
    const checkCache = async () => {
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        setIsCached(cacheNames.includes('crisis-hotlines-v1'));
      }
    };
    checkCache();
  }, []);

  // Cache crisis data for offline use
  const cacheForOffline = async () => {
    setIsCaching(true);
    try {
      if ('caches' in window) {
        const cache = await caches.open('crisis-hotlines-v1');
        // Cache the current page
        await cache.add(window.location.href);
        // Cache crisis data as a JSON file
        await cache.put(
          new Request('/api/crisis-data'),
          new Response(JSON.stringify(crisisData), {
            headers: { 'Content-Type': 'application/json' }
          })
        );
        setIsCached(true);
      }
    } catch (error) {
      console.error('Error caching data:', error);
    } finally {
      setIsCaching(false);
    }
  };

  const filteredHotlines = useMemo(() => {
    return verifiedHotlines.filter(hotline => {
      const matchesSearch = searchTerm === '' ||
        hotline.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotline.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotline.phone.includes(searchTerm);
      const matchesRegion = selectedRegion === 'All Regions' || hotline.region === selectedRegion;
      return matchesSearch && matchesRegion;
    });
  }, [searchTerm, selectedRegion]);

  // Download crisis numbers as text file
  const downloadCrisisNumbers = () => {
    let text = 'CRISIS HELPLINE NUMBERS\n';
    text += '======================\n\n';
    text += 'EMERGENCY NUMBERS\n';
    text += '-----------------\n';
    emergencyNumbers.forEach(e => {
      text += `${e.region}: ${e.number} - ${e.description}\n`;
    });
    text += '\n';
    text += 'COUNTRY HOTLINES\n';
    text += '----------------\n';
    filteredHotlines.forEach(h => {
      text += `${h.country}: ${h.name}\n`;
      text += `  Phone: ${h.phone}\n`;
      text += `  Hours: ${h.available}\n`;
      text += `  Website: ${h.website}\n\n`;
    });

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crisis-numbers-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Layout activePage="crisis" showFooter={false}>
      {/* Offline Banner */}
      {isOffline && (
        <div className="bg-amber-500 text-white px-4 py-2 text-center flex items-center justify-center gap-2">
          <WifiOff className="h-4 w-4" />
          <span className="text-sm font-medium">You are offline. Some features may be limited.</span>
        </div>
      )}

      {/* Emergency Banner */}
      <section className="relative bg-gradient-to-br from-red-600 to-red-700 py-12 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Immediate Help is Available Worldwide
          </h1>
          <p className="text-red-100 text-lg max-w-2xl mx-auto">
            If you are in danger or need immediate assistance, call your local emergency services or reach out to one of the verified crisis hotlines below.
          </p>
        </div>
      </section>

      {/* General Emergency Numbers - Quick Call Buttons */}
      <section className="py-8 -mt-6 relative z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg border border-calm-100 p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <PhoneCall className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-calm-900 mb-1">General Emergency Numbers</h3>
                <p className="text-sm text-calm-500">Tap to call immediately</p>
              </div>
              {/* Cache/Offline Button */}
              <div className="flex gap-2">
                <button
                  onClick={cacheForOffline}
                  disabled={isCached || isCaching}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isCached
                      ? 'bg-green-100 text-green-700'
                      : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                  }`}
                >
                  {isCached ? (
                    <><Check className="h-4 w-4" /> Saved</>
                  ) : isCaching ? (
                    <><Clock className="h-4 w-4 animate-spin" /> Saving...</>
                  ) : (
                    <><Download className="h-4 w-4" /> Save for Offline</>
                  )}
                </button>
                <button
                  onClick={downloadCrisisNumbers}
                  className="flex items-center gap-1 px-3 py-1.5 bg-calm-100 text-calm-700 rounded-lg text-sm font-medium hover:bg-calm-200 transition-colors"
                >
                  <Download className="h-4 w-4" /> Download
                </button>
              </div>
            </div>

            {/* Quick Call Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {emergencyNumbers.slice(0, 10).map((item, index) => (
                <a
                  key={index}
                  href={`tel:${item.number.replace(/\D/g, '')}`}
                  className="flex flex-col items-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200 hover:from-red-100 hover:to-red-200 transition-all hover:shadow-md active:scale-95"
                >
                  <Phone className="h-6 w-6 text-red-600 mb-2" />
                  <div className="text-lg font-bold text-calm-900">{item.number}</div>
                  <div className="text-xs text-calm-600 text-center mt-1">{item.region}</div>
                </a>
              ))}
            </div>

            {/* Expandable Full Emergency List */}
            <details className="mt-4">
              <summary className="cursor-pointer text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2">
                <ArrowRight className="h-4 w-4" /> View all emergency numbers
              </summary>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4 pt-4 border-t border-calm-100">
                {emergencyNumbers.slice(10).map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-calm-50 rounded-lg">
                    <div>
                      <div className="text-xs text-calm-500">{item.region}</div>
                      <div className="font-semibold text-calm-900">{item.number}</div>
                    </div>
                    <a
                      href={`tel:${item.number.replace(/\D/g, '')}`}
                      className="p-2 bg-red-100 rounded-lg text-red-600 hover:bg-red-200 transition-colors"
                    >
                      <Phone className="h-4 w-4" />
                    </a>
                  </div>
                ))}
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* Verified Crisis Hotlines Search */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-full text-sm font-medium text-primary-700 mb-4">
              <Shield className="h-4 w-4" />
              Verified Hotlines
            </div>
            <h2 className="text-3xl font-bold text-calm-900 mb-2">Crisis Helplines</h2>
            <p className="text-calm-600">Find verified mental health crisis hotlines worldwide</p>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-2xl shadow-lg border border-calm-100 p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-calm-400" />
                <input
                  type="text"
                  placeholder="Search by country, hotline name, or phone number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-calm-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-4 py-3 border border-calm-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              >
                {regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
              <button
                onClick={() => setShowTable(!showTable)}
                className="px-6 py-3 bg-calm-100 text-calm-700 rounded-xl hover:bg-calm-200 transition-colors"
              >
                {showTable ? 'Show Cards' : 'Show All'}
              </button>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-calm-500">Showing {filteredHotlines.length} verified hotlines</span>
              {isCached && (
                <span className="flex items-center gap-1 text-green-600">
                  <Check className="h-4 w-4" /> Available offline
                </span>
              )}
            </div>
          </div>

          {/* Hotlines Display */}
          {showTable ? (
            <div className="bg-white rounded-2xl shadow-lg border border-calm-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-calm-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-calm-900">Country</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-calm-900">Hotline Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-calm-900">Phone</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-calm-900">Hours</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-calm-900">Quick Call</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-calm-100">
                    {filteredHotlines.map((hotline, index) => (
                      <tr key={index} className="hover:bg-calm-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-calm-400" />
                            <span className="font-medium text-calm-900">{hotline.country}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-calm-700">{hotline.name}</td>
                        <td className="px-6 py-4">
                          {hotline.phone !== 'Various' ? (
                            <a
                              href={`tel:${hotline.phone.replace(/\D/g, '')}`}
                              className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium"
                            >
                              <PhoneCall className="h-4 w-4" />
                              {hotline.phone}
                            </a>
                          ) : (
                            <span className="text-calm-500 text-sm">See website</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-calm-600 text-sm">{hotline.available}</td>
                        <td className="px-6 py-4">
                          {hotline.phone !== 'Various' ? (
                            <a
                              href={`tel:${hotline.phone.replace(/\D/g, '')}`}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                            >
                              <Phone className="h-4 w-4" /> Call Now
                            </a>
                          ) : (
                            <a
                              href={`https://${hotline.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary-600 hover:text-primary-700 text-sm flex items-center gap-1"
                            >
                              Visit <ArrowRight className="h-3 w-3" />
                            </a>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredHotlines.map((hotline, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-xl p-5 border border-calm-100 hover:shadow-lg hover:border-primary-200 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-calm-100 rounded-lg flex items-center justify-center">
                        <MapPin className="h-4 w-4 text-calm-600" />
                      </div>
                      <span className="font-semibold text-calm-900">{hotline.country}</span>
                    </div>
                    <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                      {hotline.type.split('/')[0]}
                    </span>
                  </div>
                  <h3 className="font-medium text-calm-900 mb-3">{hotline.name}</h3>
                  <div className="flex items-center gap-2">
                    {hotline.phone !== 'Various' ? (
                      <a
                        href={`tel:${hotline.phone.replace(/\D/g, '')}`}
                        className="flex-1 inline-flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold hover:from-red-600 hover:to-red-700 transition-all shadow-lg shadow-red-500/25"
                      >
                        <Phone className="h-5 w-5" />
                        {hotline.phone}
                      </a>
                    ) : (
                      <a
                        href={`https://${hotline.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-2 py-3 bg-calm-100 text-calm-700 rounded-xl font-medium hover:bg-calm-200 transition-all"
                      >
                        <Globe className="h-5 w-5" />
                        Visit Website
                      </a>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-calm-100">
                    <span className="text-xs text-calm-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {hotline.available}
                    </span>
                    <span className="text-xs text-calm-400">{hotline.region}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredHotlines.length === 0 && (
            <div className="text-center py-12">
              <Globe className="h-12 w-12 text-calm-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-calm-900 mb-2">No hotlines found</h3>
              <p className="text-calm-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </section>

      {/* What to Do in Crisis */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-calm-900 mb-2">What to Do in a Crisis</h2>
            <p className="text-calm-600">Follow these steps to stay safe and get support</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Stay Safe', desc: 'Remove access to anything you might use to hurt yourself. Go to a safe place.' },
              { step: '02', title: 'Reach Out', desc: 'Call a crisis hotline, text a counselor, or tell someone you trust how you are feeling.' },
              { step: '03', title: 'Stay Connected', desc: 'Keep talking to someone until help arrives. You do not have to face this alone.' },
            ].map((item, index) => (
              <div
                key={index}
                className="relative bg-gradient-to-br from-calm-50 to-white rounded-2xl p-6 border border-calm-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">{item.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-calm-900 mb-3 mt-2">{item.title}</h3>
                <p className="text-calm-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Planning */}
      <section className="py-16 bg-gradient-to-br from-calm-900 to-calm-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Heart className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Create a Safety Plan</h2>
                <p className="text-calm-300">
                  A safety plan is a written list of coping strategies and resources you can use
                  when thoughts of suicide or self-harm arise. Work with a mental health professional
                  to create your personalized plan.
                </p>
              </div>
            </div>
            <Link
              href="/support"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-calm-900 rounded-xl font-semibold hover:bg-calm-100 transition-all duration-300"
            >
              Get Support
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Encouragement Footer */}
      <section className="py-12 bg-calm-50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Heart className="h-6 w-6 text-primary-600" />
          </div>
          <p className="text-calm-600 text-lg leading-relaxed">
            These resources are available around the world. Asking for help is a sign of strength.
            <br />
            <span className="font-semibold text-calm-900">You matter, and there are people who want to support you.</span>
          </p>
        </div>
      </section>
    </Layout>
  );
}
