export default function AGB() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-black/30 backdrop-blur-lg rounded-xl p-8 border border-purple-500/20">
          <h1 className="text-3xl font-bold text-white mb-8">Allgemeine Geschäftsbedingungen</h1>
          
          <div className="space-y-6 text-gray-300">
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">§ 1 Geltungsbereich</h2>
              <p className="mb-4">
                Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Leistungen der KryptoMurat-Plattform. Mit der Nutzung der Plattform akzeptieren Sie diese Bedingungen vollumfänglich.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">§ 2 Leistungen</h2>
              <p className="mb-4">
                KryptoMurat bietet eine Web3-Plattform mit folgenden Funktionen:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Kryptowährung-Staking</li>
                <li>NFT-Integration</li>
                <li>Live-Streaming</li>
                <li>AI-Content-Generierung</li>
                <li>Interaktive Story-Spiele</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">§ 3 Nutzungsvoraussetzungen</h2>
              <p className="mb-4">
                Für die Nutzung der Plattform benötigen Sie:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Eine kompatible Kryptowährung-Wallet</li>
                <li>Volljährigkeit oder Zustimmung der Erziehungsberechtigten</li>
                <li>Einen Internetanschluss</li>
                <li>Akzeptanz der Blockchain-Technologie</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">§ 4 Risiken und Haftung</h2>
              <h3 className="text-lg font-medium text-white mb-2">Kryptowährungsrisiken</h3>
              <p className="mb-4">
                Der Handel mit Kryptowährungen ist mit erheblichen Risiken verbunden:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Hohe Volatilität der Preise</li>
                <li>Möglichkeit eines Totalverlustes</li>
                <li>Technische Risiken der Blockchain</li>
                <li>Regulatorische Änderungen</li>
              </ul>
              
              <h3 className="text-lg font-medium text-white mb-2">Haftungsausschluss</h3>
              <p className="mb-4">
                KryptoMurat übernimmt keine Haftung für Verluste, die durch die Nutzung der Plattform entstehen. Die Nutzung erfolgt auf eigene Gefahr.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">§ 5 Staking-Bedingungen</h2>
              <p className="mb-4">
                Für das Staking von MURAT-Token gelten folgende Bedingungen:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Mindestlaufzeit: 30 Tage</li>
                <li>Höchstlaufzeit: 360 Tage</li>
                <li>APY-Sätze sind variabel und nicht garantiert</li>
                <li>Vorzeitige Auflösung kann zu Verlusten führen</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">§ 6 Intellectual Property</h2>
              <p className="mb-4">
                Alle Inhalte der Plattform, einschließlich der Story-Inhalte, sind urheberrechtlich geschützt. Die Nutzung ist nur im Rahmen der Plattform gestattet.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">§ 7 Beendigung</h2>
              <p className="mb-4">
                Beide Parteien können die Nutzung jederzeit beenden. Bei Beendigung werden alle Staking-Positionen entsprechend den ursprünglichen Bedingungen abgewickelt.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">§ 8 Änderungen</h2>
              <p className="mb-4">
                KryptoMurat behält sich das Recht vor, diese AGB jederzeit zu ändern. Nutzer werden über wesentliche Änderungen informiert.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">§ 9 Anwendbares Recht</h2>
              <p className="mb-4">
                Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts. Gerichtsstand ist Herford.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}