import React from 'react';

export default function Datenschutz() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-black/30 backdrop-blur-lg rounded-xl p-6 md:p-8 border border-purple-500/20">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">Datenschutzerklärung</h1>
          
          <div className="text-gray-300 space-y-6">
            <p className="text-sm">
              Diese Datenschutzerklärung klärt Sie über die Art, den Umfang und Zweck der Verarbeitung von 
              personenbezogenen Daten auf.
            </p>

            <div>
              <h2 className="text-xl font-semibold text-white mb-3">Verantwortlicher</h2>
              <p className="text-sm">
                Murat Keskin<br />
                <a href="mailto:cashkeskin@gmail.com" className="text-purple-400 hover:text-purple-300">cashkeskin@gmail.com</a>
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-3">Zugriffsdaten</h2>
              <p className="text-sm">
                Wir, bzw. unser Hostinganbieter, erheben Daten über jeden Zugriff auf den Server (sogenannte Serverlogfiles).
                Zu den Zugriffsdaten gehören z. B. Name der abgerufenen Webseite, Datei, Datum und Uhrzeit, übertragene 
                Datenmenge, Browsertyp usw.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-3">Umgang mit personenbezogenen Daten</h2>
              <p className="text-sm">
                Personenbezogene Daten (z. B. Name, E-Mail-Adresse) werden nur dann gespeichert, wenn Sie diese freiwillig 
                mitteilen (z. B. im Rahmen einer Kontaktaufnahme).
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-3">Wallet-Daten & Blockchain</h2>
              <p className="text-sm">
                Wallet-Adressen werden zur Identifikation und Zugriffskontrolle gespeichert. Private Keys werden niemals 
                gespeichert oder übertragen. Blockchain-Transaktionen sind öffentlich einsehbar.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-3">Rechte der Nutzer</h2>
              <p className="text-sm">
                Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Widerspruch. Bitte wenden Sie sich dazu per 
                E-Mail an: <a href="mailto:cashkeskin@gmail.com" className="text-purple-400 hover:text-purple-300">cashkeskin@gmail.com</a>
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-3">Cookies</h2>
              <p className="text-sm">
                Diese Website verwendet Cookies für die Funktionalität. Wenn Sie dies nicht wünschen, deaktivieren Sie 
                Cookies in Ihrem Browser.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-3">Kontaktaufnahme</h2>
              <p className="text-sm">
                Bei der Kontaktaufnahme per E-Mail oder Telegram werden Ihre Angaben zur Bearbeitung der Anfrage verarbeitet.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-3">Drittanbieter-Services</h2>
              <p className="text-sm">
                Wir nutzen Dienste wie OpenAI, Livepeer und Polygon-Blockchain. Diese können eigene Datenschutzrichtlinien haben.
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