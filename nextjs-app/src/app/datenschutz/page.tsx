export default function Datenschutz() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-black/30 backdrop-blur-lg rounded-xl p-8 border border-purple-500/20">
          <h1 className="text-3xl font-bold text-white mb-8">Datenschutzerklärung</h1>
          
          <div className="space-y-6 text-gray-300">
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">1. Datenschutz auf einen Blick</h2>
              <h3 className="text-lg font-medium text-white mb-2">Allgemeine Hinweise</h3>
              <p className="mb-4">
                Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">2. Datenerfassung auf dieser Website</h2>
              <h3 className="text-lg font-medium text-white mb-2">Wer ist verantwortlich für die Datenerfassung auf dieser Website?</h3>
              <p className="mb-4">
                Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.
              </p>
              
              <h3 className="text-lg font-medium text-white mb-2">Wie erfassen wir Ihre Daten?</h3>
              <p className="mb-4">
                Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z.B. um Daten handeln, die Sie über die Web3-Wallet-Verbindung übermitteln.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">3. Web3 und Blockchain-Daten</h2>
              <h3 className="text-lg font-medium text-white mb-2">Wallet-Verbindung</h3>
              <p className="mb-4">
                Wenn Sie Ihre Kryptowährings-Wallet mit unserer Plattform verbinden, werden folgende Daten verarbeitet:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Wallet-Adresse (öffentlich)</li>
                <li>Transaktionsdaten</li>
                <li>Token-Guthaben</li>
                <li>NFT-Besitz</li>
              </ul>
              
              <h3 className="text-lg font-medium text-white mb-2">Blockchain-Transparenz</h3>
              <p className="mb-4">
                Bitte beachten Sie, dass Blockchain-Transaktionen öffentlich und dauerhaft sind. Wallet-Adressen und Transaktionen können von jedem eingesehen werden.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">4. Cookies</h2>
              <p className="mb-4">
                Diese Website verwendet Cookies. Cookies sind kleine Textdateien, die beim Besuch einer Website auf Ihrem Computer gespeichert werden. Sie dienen dazu, die Benutzerfreundlichkeit zu verbessern und bestimmte Funktionen bereitzustellen.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">5. Ihre Rechte</h2>
              <p className="mb-4">
                Sie haben jederzeit das Recht auf:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Auskunft über Ihre gespeicherten Daten</li>
                <li>Berichtigung unrichtiger Daten</li>
                <li>Löschung Ihrer Daten</li>
                <li>Einschränkung der Datenverarbeitung</li>
                <li>Datenübertragbarkeit</li>
                <li>Widerspruch gegen die Datenverarbeitung</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">6. Kontakt</h2>
              <p>
                Bei Fragen zum Datenschutz können Sie uns jederzeit kontaktieren:
              </p>
              <p className="mt-2">
                E-Mail: datenschutz@kryptomurat.de
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}