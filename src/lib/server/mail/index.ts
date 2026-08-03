import nodemailer, { type Transporter } from 'nodemailer';
import { env } from '$env/dynamic/private';
import { CONTACT } from '$lib/data/content';
import { renderHtmlTemplate, renderTemplate, type TemplateValues } from './template';
// ?raw bündelt die Vorlagen in den Server-Build — kein Dateizugriff zur Laufzeit nötig.
import htmlTemplate from './templates/anfrage.html?raw';
import textTemplate from './templates/anfrage.txt?raw';

export interface AnfrageMail {
	name: string;
	email: string;
	phone: string;
	date: string;
	location: string;
	guests: string;
	bar: string;
	package: string;
	message: string;
}

const EMPTY = '—';

let transporter: Transporter | undefined;

function requireEnv(key: string): string {
	const value = env[key];
	if (!value) {
		throw new Error(`${key} ist nicht gesetzt — SMTP-Versand nicht konfiguriert`);
	}
	return value;
}

/** Transport wird einmalig aufgebaut und danach wiederverwendet (Connection-Pool). */
function getTransporter(): Transporter {
	if (transporter) return transporter;

	const port = Number(env.SMTP_PORT ?? 587);
	if (!Number.isInteger(port) || port <= 0) {
		throw new Error(`SMTP_PORT ist keine gültige Portnummer: ${env.SMTP_PORT}`);
	}

	transporter = nodemailer.createTransport({
		host: requireEnv('SMTP_HOST'),
		port,
		// Port 465 spricht direkt TLS, alles andere startet per STARTTLS.
		secure: env.SMTP_SECURE ? env.SMTP_SECURE === 'true' : port === 465,
		auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: requireEnv('SMTP_PASS') } : undefined,
		pool: true
	});

	return transporter;
}

/** Kopfzeilen dürfen keine Zeilenumbrüche enthalten (Header-Injection). */
function singleLine(value: string): string {
	return value.replace(/[\r\n]+/g, ' ').trim();
}

function withFallbacks(data: AnfrageMail): TemplateValues {
	const submittedAt = new Intl.DateTimeFormat('de-DE', {
		dateStyle: 'full',
		timeStyle: 'short',
		timeZone: 'Europe/Berlin'
	}).format(new Date());

	return {
		name: data.name,
		email: data.email,
		phone: data.phone,
		date: data.date || EMPTY,
		location: data.location || EMPTY,
		guests: data.guests || EMPTY,
		bar: data.bar,
		package: data.package,
		message: data.message,
		submittedAt,
		replySubject: encodeURIComponent(`Eure BigLemon-Anfrage vom ${submittedAt}`)
	};
}

/**
 * Rendert die Anfrage aus der Vorlage und verschickt sie per SMTP an
 * die Kontaktadresse. Reply-To zeigt auf die anfragende Person, damit
 * eine Antwort direkt dort landet.
 */
export async function sendAnfrageMail(data: AnfrageMail): Promise<void> {
	const values = withFallbacks(data);

	await getTransporter().sendMail({
		from: env.SMTP_FROM || `BigLemon Website <${requireEnv('SMTP_USER')}>`,
		to: env.CONTACT_EMAIL || CONTACT.email,
		replyTo: `${singleLine(data.name)} <${data.email}>`,
		subject: singleLine(`Neue Anfrage von ${data.name} — ${data.package} / ${data.bar}`),
		text: renderTemplate(textTemplate, values),
		html: renderHtmlTemplate(htmlTemplate, values)
	});
}
