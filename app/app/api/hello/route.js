const KEY = process.env.API_KEY;
const DOMAIN = process.env.DOMAIN;
var CronJob = require("cron").CronJob;
const mailgun = require("mailgun-js")({ apiKey: KEY, domain: DOMAIN });

function sendEmail() {
	const body = "Bu set edilmiş bir mail denemesidir SAAT 12.37";
	const data = {
		from: "Weather News <reminder@ketencek.com>",
		to: "idilaydindogan@gmail.com, idil_aydin@yahoo.com",
		subject: "Daily Weather Report",
		html: `<h1>deneme emaili idilden</h1>
          <p>deneme emaili saat 13.02</p>
         
          `,
	};
	mailgun.messages().send(data),
		(error, body) => {
			if (error) {
				console.log(error);
				res.status(500).send({ message: "Error in sending email" });
			}
			console.log(body?.message);
		};

	return new Response("Email was sent!", {
		status: 200,
	});
}

console.log("Before job instantiation");
const job = new CronJob("00 05 * * * 1-5", function () {
	const d = new Date();
	sendEmail();
});
job.start();
