export default function Impressum() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-black/30 backdrop-blur-lg rounded-xl p-8 border border-purple-500/20">
          <h1 className="text-3xl font-bold text-white mb-8">Impressum</h1>
          
          <div className="space-y-6 text-gray-300">
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">Angaben gemäß § 5 TMG</h2>
              <p>
                KryptoMurat<br />
                Musterstraße 123<br />
                32052 Herford<br />
                Deutschland
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">Kontakt</h2>
              <p>
                E-Mail: info@kryptomurat.de<br />
                Telefon: +49 (0) 5221 123456
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
              <p>
                KryptoMurat Team<br />
                Musterstraße 123<br />
                32052 Herford
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">Haftungsausschluss</h2>
              <h3 className="text-lg font-medium text-white mb-2">Haftung für Inhalte</h3>
              <p className="mb-4">
                Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht unter der Verpflichtung, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
              </p>
              
              <h3 className="text-lg font-medium text-white mb-2">Haftung für Links</h3>
              <p className="mb-4">
                Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">Urheberrecht</h2>
              <p>
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">Kryptowährungen und Risiken</h2>
              <p>
                Der Handel mit Kryptowährungen ist mit erheblichen Risiken verbunden. Die Preise können stark schwanken und es besteht die Möglichkeit eines Totalverlustes. Diese Plattform dient ausschließlich zu Informations- und Unterhaltungszwecken und stellt keine Anlageberatung dar.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}