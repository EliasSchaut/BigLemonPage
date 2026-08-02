// Geteilter Buchungs-State: Bar-Karten, Paket-/Bar-Chips und das Formular
// lesen und schreiben dieselbe Auswahl. Wird nur durch Klicks im Client
// mutiert, daher als Modul-State unbedenklich für SSR.
export const booking = $state({
	pkg: 'plus',
	bar: 'biglemon',
	sent: false
});
