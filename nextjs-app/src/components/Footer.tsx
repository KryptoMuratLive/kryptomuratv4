'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black/40 backdrop-blur-lg border-t border-purple-500/20 mt-8">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-black">₿</span>
              </div>
              <span className="text-white font-bold text-lg">KryptoMurat</span>
            </div>
            <p className="text-gray-400 text-sm">
              Die ultimative Web3-Plattform für das &quot;Jagd auf den Bitcoin&quot; Abenteuer.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</a></li>
              <li><a href="#story" className="text-gray-400 hover:text-white transition-colors">Bitcoin-Jagd</a></li>
              <li><a href="#staking" className="text-gray-400 hover:text-white transition-colors">Staking</a></li>
              <li><a href="#streaming" className="text-gray-400 hover:text-white transition-colors">Live Streaming</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Rechtliches</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/impressum" className="text-gray-400 hover:text-white transition-colors">Impressum</Link></li>
              <li><Link href="/agb" className="text-gray-400 hover:text-white transition-colors">AGB</Link></li>
              <li><Link href="/datenschutz" className="text-gray-400 hover:text-white transition-colors">Datenschutz</Link></li>
              <li><Link href="/nutzungsbedingungen" className="text-gray-400 hover:text-white transition-colors">Nutzungsbedingungen</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white font-semibold mb-4">Community</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Discord</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Telegram</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Twitter</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">GitHub</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-purple-500/20 mt-8 pt-6 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} KryptoMurat. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  );
}