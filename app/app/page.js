const KEY = process.env.API_KEY;
const DOMAIN = process.env.DOMAIN;
var CronJob = require("cron").CronJob;
const mailgun = require("mailgun-js")({ apiKey: KEY, domain: DOMAIN });

export async function sendEmail() {
	const body = "Bu set edilmiş bir mail denemesidir SAAT 12.37";

	const data = {
		from: "reminder@ketencek.com",
		to: "idilaydindogan@gmail.com",
		subject: "CRON DENEME",
		text: body,
	};

	try {
		await mailgun.messages().send(data);
		console.log(`Email sent to ${to} with subject "${subject}"`);
	} catch (error) {
		console.error("Error sending email:", error);
	}
}

export default function Home() {
	console.log("Before job instantiation");
	const job = new CronJob("00 50 * * * 1-5", function () {
		const d = new Date();
		sendEmail();
	});

	job.start();
	return <main>CRON DENEME</main>;
}
