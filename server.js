
import express from "express";


import {
    scanWebsite
} from "./src/scanner.js";


import {
    checkSecurityHeaders,
    checkHTTPS,
    checkCookies,
    checkTLS,
    checkInformationDisclosure,
    checkCORS,
    checkCertificate,
    checkRedirect,
    checkContentType
} from "./src/checks.js";


import {
    calculateScore
} from "./src/report.js";


const app =
    express();


app.use(
    express.json()
);


app.use(
    express.static("public")
);


app.post(
    "/scan",
    async (req, res) => {

        try {

            const {
                url
            } = req.body;


            if (!url) {

                return res
                    .status(400)
                    .json({

                        error:
                            "Please enter a website URL."

                    });

            }


            const result =
                await scanWebsite(url);


            


            const checks =
                checkSecurityHeaders(
                    result.headers
                );


            checks.unshift(
                checkHTTPS(
                    result.url
                )
            );


            checks.push(
                checkCookies(
                    result.headers
                )
            );


            checks.push(
                checkTLS(
                    result.protocol
                )
            );


            checks.push(
                checkInformationDisclosure(
                    result.headers
                )
            );


            checks.push(
                checkCORS(
                    result.headers
                )
            );


            checks.push(
                checkCertificate(
                    result.certificate
                )
            );


            checks.push(
                checkRedirect(
                    result.url,
                    result.redirect
                )
            );


            checks.push(
                checkContentType(
                    result.headers
                )
            );


            const scoreResult =
                calculateScore(
                    checks
                );


            const score =
                scoreResult.score;


            const breakdown =
                scoreResult.breakdown;


            let rating;


            if (score >= 90) {

                rating = "A+";

            } else if (score >= 80) {

                rating = "A";

            } else if (score >= 65) {

                rating = "B";

            } else if (score >= 50) {

                rating = "C";

            } else {

                rating = "D";

            }


            let summary;


            if (score >= 90) {

                summary =
                    "The website has strong security protections in place with few or no significant issues detected.";

            } else if (score >= 80) {

                summary =
                    "The website has good security protections, although some improvements may still be recommended.";

            } else if (score >= 65) {

                summary =
                    "The website has a reasonable level of security, but several protections could be improved.";

            } else if (score >= 50) {

                summary =
                    "The website has some important security weaknesses that should be reviewed.";

            } else {

                summary =
                    "The scan detected several important security weaknesses that should be addressed.";

            }


            res.json({
    url:
        result.url,

    statusCode:
        result.statusCode,

    statusMessage:
        result.statusMessage,

    score,
    rating,
    summary,
    breakdown,
    checks,

    redirects:
        result.redirects
});

        } catch (error) {

            res
                .status(400)
                .json({

                    error:
                        error.message

                });

        }

    }
);


const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`WebGuard running on port ${PORT}`);
});