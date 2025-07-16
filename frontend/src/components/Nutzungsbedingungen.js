import React from 'react';

export default function Nutzungsbedingungen() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-black/30 backdrop-blur-lg rounded-xl p-6 md:p-8 border border-purple-500/20">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">Nutzungsbedingungen für „Jagd auf den Bitcoin"</h1>
          
          <div className="text-gray-300 space-y-6">
            <div>
              <p className="text-lg font-semibold text-white mb-2">1. Teilnahmevoraussetzungen</p>
              <p className="text-sm">
                Teilnahme am Projekt ist nur mit Wallet-Verknüpfung möglich. Mindestalter: 18 Jahre.
              </p>
            </div>

            <div>
              <p className="text-lg font-semibold text-white mb-2">2. Account & Wallet</p>
              <p className="text-sm">
                Die Verantwortung für Wallets und Zugangsdaten liegt beim Nutzer. Wir haben keinen Zugriff auf private Keys.
              </p>
            </div>

            <div>
              <p className="text-lg font-semibold text-white mb-2">3. Inhalte & Verhalten</p>
              <p className="text-sm">
                Jegliche Beleidigungen, Hacks, Cheats oder die Manipulation des Spiels sind untersagt und führen zum 
                sofortigen Ausschluss.
              </p>
            </div>

            <div>
              <p className="text-lg font-semibold text-white mb-2">4. NFTs & Spielmechanik</p>
              <p className="text-sm">
                NFTs können Teil der Spielmechanik sein. Der Besitz bestimmter NFTs kann bestimmte Vorteile im Spiel 
                freischalten. Kein Anspruch auf bestimmte Inhalte.
              </p>
            </div>

            <div>
              <p className="text-lg font-semibold text-white mb-2">5. Token-Staking</p>
              <p className="text-sm">
                MURAT Token können gestaked werden. Staking-Rewards sind nicht garantiert und können sich ändern. 
                Staking-Perioden sind bindend.
              </p>
            </div>

            <div>
              <p className="text-lg font-semibold text-white mb-2">6. KI & Automatisierung</p>
              <p className="text-sm">
                Nutzer dürfen keine automatisierten Bots verwenden. Fair Use ist Voraussetzung. 
                AI-generierte Inhalte unterliegen unseren Nutzungsrichtlinien.
              </p>
            </div>

            <div>
              <p className="text-lg font-semibold text-white mb-2">7. Live-Streaming</p>
              <p className="text-sm">
                Streaming-Inhalte müssen legal und angemessen sein. Wir behalten uns vor, Streams zu moderieren oder 
                zu beenden.
              </p>
            </div>

            <div>
              <p className="text-lg font-semibold text-white mb-2">8. Änderungen & Updates</p>
              <p className="text-sm">
                Das Spiel ist experimentell. Inhalte, Regeln und Funktionen können sich jederzeit ändern. 
                Es besteht kein Anspruch auf dauerhafte Verfügbarkeit einzelner Features.
              </p>
            </div>

            <div>
              <p className="text-lg font-semibold text-white mb-2">9. Haftungsausschluss</p>
              <p className="text-sm">
                Der Betreiber übernimmt keine Haftung für eventuelle Schäden durch Nutzung oder Ausfall der Plattform.
              </p>
            </div>

            <div>
              <p className="text-lg font-semibold text-white mb-2">10. Schlussbestimmungen</p>
              <p className="text-sm">
                Durch Nutzung der Plattform akzeptieren Sie diese Nutzungsbedingungen.
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