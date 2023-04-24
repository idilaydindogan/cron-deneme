const KEY = process.env.API_KEY;
const DOMAIN = process.env.DOMAIN;
const CronJob = require("cron").CronJob;

const mailgun = require("mailgun-js")({
	apiKey: KEY,
	domain: DOMAIN,
});

export async function GET(req, res) {
	const response = await fetch(
		`https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID}/Contacts`,
		{
			headers: {
				Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
			},

			next: {
				revalidate: 60,
			},
		}
	);
	const data = await response.json();
	const results = data.records;

	const body = results.map((item) => ({
		company: item.fields.Company,
		name: item.fields.Name,
		email: item.fields.Email_1,
		remaining: item.fields.Remaining,
		subject: item.fields.Subject,
		type: item.fields.Type,
	}));

	const emailList = body.filter(
		(result) =>
			Number(result.remaining) === 1 ||
			Number(result.remaining) === 2 ||
			Number(result.remaining) === 3 ||
			Number(result.remaining) === 5 ||
			Number(result.remaining) === 10 ||
			Number(result.remaining) === 20 ||
			Number(result.remaining) === 30 ||
			Number(result.remaining) === 60 ||
			Number(result.remaining) === 90
	);

	async function sendEmail(email, company, subject, type) {
		const msg = {
			from: "reminder@ketencek.com",
			to: `${email}`,
			subject: `${subject}`,
			text: `${company} şirketinin ${type} ödemesi için hatırlatmadır.`,
		};

		mailgun.messages().send(msg),
			(error) => {
				if (error) {
					console.log(error);
					res.status(500).send({ message: "Error in sending email" });
				}
			};

		return new Response("Email was sent!", {
			status: 200,
		});
	}

	const job = new CronJob("00 06 * * 1-5", function () {
		emailList.map((list) =>
			sendEmail(list.email, list.company, list.subject, list.type)
		);
	});
	job.start();
}

// const KEY = process.env.API_KEY;
// const DOMAIN = process.env.DOMAIN;
// // var CronJob = require("cron").CronJob;
// const mailgun = require("mailgun-js")({ apiKey: KEY, domain: DOMAIN });

// export async function GET(req, res) {
// 	try {
// 		const msg = {
// 			from: "<reminder@ketencek.com>",
// 			to: "idilaydindogan@gmail.com, idil_aydin@yahoo.com",
// 			subject: "set edilmiş email denemesi",
// 			html: `<h1>deneme emaili idilden</h1>
// 			  <p>deneme emaili saat ${new Date()}</p>
// 			  `,
// 		};

// 		await mailgun.messages().send(msg);
// 		console.log(`Email sent with subject ${subject}`);
// 	} catch (error) {
// 		console.log(error);
// 	}
// }

// console.log("Before job instantiation");
// const job = new CronJob("00 05 * * * 1-5", function () {
// 	const d = new Date();
// 	sendEmail();
// });
// job.start();

// function sendEmail() {
// 	const body = "Bu set edilmiş bir mail denemesidir SAAT 12.37";
// 	const data = {
// 		from: "Weather News <reminder@ketencek.com>",
// 		to: "idilaydindogan@gmail.com, idil_aydin@yahoo.com",
// 		subject: "Daily Weather Report",
// 		html: `<h1>deneme emaili idilden</h1>
//           <p>deneme emaili saat 13.02</p>
//           `,
// 	};
// 	mailgun.messages().send(data),
// 		(error, body) => {
// 			if (error) {
// 				console.log(error);
// 				res.status(500).send({ message: "Error in sending email" });
// 			}
// 			console.log(body?.message);
// 		};

// 	return new Response("Email was sent!", {
// 		status: 200,
// 	});
// }

// console.log("Before job instantiation");
// const job = new CronJob("00 05 * * * 1-5", function () {
// 	const d = new Date();
// 	sendEmail();
// });
// job.start();
