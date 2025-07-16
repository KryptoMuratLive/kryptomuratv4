import React from 'react';

export default function Impressum() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-black/30 backdrop-blur-lg rounded-xl p-6 md:p-8 border border-purple-500/20">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">Impressum</h1>
          
          <div className="text-gray-300 space-y-6">
            <div>
              <p className="text-lg font-semibold text-white mb-2">Angaben gemäß § 5 TMG:</p>
              <p>
                Murat Keskin<br />
                Unternehmer & Projektleitung<br />
                KryptoMurat / kryptomur.at<br />
                32052 Herford<br />
                Deutschland
              </p>
            </div>

            <div>
              <p className="text-lg font-semibold text-white mb-2">Kontakt:</p>
              <p>
                E-Mail: <a href="mailto:cashkeskin@gmail.com" className="text-purple-400 hover:text-purple-300">cashkeskin@gmail.com</a><br />
                Telegram: <a href="https://t.me/moneyclitch" className="text-purple-400 hover:text-purple-300">@moneyclitch</a>
              </p>
            </div>

            <div>
              <p className="text-lg font-semibold text-white mb-2">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:</p>
              <p>Murat Keskin, Herford</p>
            </div>

            <div>
              <p className="text-lg font-semibold text-white mb-2">Haftungsausschluss:</p>
              <p className="text-sm">
                Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links.
                Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-purple-500/20">
              <p className="text-sm text-gray-400">
                Stand: {new Date().toLocaleDateString("de-DE")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}