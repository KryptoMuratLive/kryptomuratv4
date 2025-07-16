import React from 'react';

export default function AGB() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-black/30 backdrop-blur-lg rounded-xl p-6 md:p-8 border border-purple-500/20">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">Allgemeine Geschäftsbedingungen (AGB)</h1>
          
          <div className="text-gray-300 space-y-6">
            <div>
              <p className="text-lg font-semibold text-white mb-2">1. Geltungsbereich</p>
              <p className="text-sm">
                Diese AGB gelten für alle digitalen Inhalte, NFT-Angebote und Dienstleistungen auf der Plattform 
                „KryptoMurat / VIP-Players.com" – insbesondere im Zusammenhang mit dem Projekt „Jagd auf den Bitcoin".
              </p>
            </div>

            <div>
              <p className="text-lg font-semibold text-white mb-2">2. Vertragspartner</p>
              <p className="text-sm">
                Vertragspartner ist: Murat Keskin, 32052 Herford, E-Mail: 
                <a href="mailto:info@kryptomur.at" className="text-purple-400 hover:text-purple-300 ml-1">info@kryptomur.at</a>
              </p>
            </div>

            <div>
              <p className="text-lg font-semibold text-white mb-2">3. Leistungen</p>
              <p className="text-sm">
                Wir bieten Zugang zu digitalen Gütern (NFTs, Token, Game-Content, Streaming) sowie Web3-basierten 
                Funktionen wie Wallet-Verknüpfung, Staking und NFT-Galerien.
              </p>
            </div>

            <div>
              <p className="text-lg font-semibold text-white mb-2">4. NFTs & Token</p>
              <p className="text-sm">
                NFTs und Token stellen keine Finanzprodukte im rechtlichen Sinne dar. Der Erwerb erfolgt freiwillig, 
                die Werte können Schwankungen unterliegen. Kein Rückgaberecht.
              </p>
            </div>

            <div>
              <p className="text-lg font-semibold text-white mb-2">5. Zahlung & Gebühren</p>
              <p className="text-sm">
                Alle Zahlungen erfolgen über Kryptowährungen (z. B. MURAT, ETH, MATIC). Es können Netzwerkgebühren 
                anfallen. Rückerstattungen sind ausgeschlossen.
              </p>
            </div>

            <div>
              <p className="text-lg font-semibold text-white mb-2">6. Nutzungsrechte</p>
              <p className="text-sm">
                Beim Erwerb eines NFTs erhalten Nutzer ein einfaches Nutzungsrecht für nicht-kommerzielle Zwecke. 
                Alle Rechte an Inhalten verbleiben beim Betreiber.
              </p>
            </div>

            <div>
              <p className="text-lg font-semibold text-white mb-2">7. Haftung</p>
              <p className="text-sm">
                Wir übernehmen keine Haftung für technische Ausfälle, Blockchain-Fehler oder Wertverluste. 
                Nutzung erfolgt auf eigenes Risiko.
              </p>
            </div>

            <div>
              <p className="text-lg font-semibold text-white mb-2">8. Änderung der AGB</p>
              <p className="text-sm">
                Wir behalten uns vor, diese AGB jederzeit zu ändern. Nutzer werden bei wesentlichen Änderungen informiert.
              </p>
            </div>

            <div>
              <p className="text-lg font-semibold text-white mb-2">9. Gerichtsstand</p>
              <p className="text-sm">
                Es gilt deutsches Recht. Gerichtsstand ist Herford, Deutschland.
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