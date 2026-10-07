
export function checkSecurityHeaders(headers) {

    const checks = [];


    checks.push({

        name: "Content Security Policy",

        header:
            "content-security-policy",

        passed:
            Boolean(
                headers[
                    "content-security-policy"
                ]
            ),

        severity: "high",

        message:
            headers[
                "content-security-policy"
            ]
                ? "Content Security Policy is configured."
                : "No Content Security Policy header detected.",

        explanation:
            "CSP tells the browser which sources are trusted for things such as scripts, styles and other content. It helps reduce the risk of attacks such as cross-site scripting.",

        recommendation:
            "Configure a Content-Security-Policy response header that only allows trusted sources."

    });


    checks.push({

        name:
            "Strict Transport Security",

        header:
            "strict-transport-security",

        passed:
            Boolean(
                headers[
                    "strict-transport-security"
                ]
            ),

        severity: "high",

        message:
            headers[
                "strict-transport-security"
            ]
                ? "HSTS is configured."
                : "No Strict-Transport-Security header detected.",

        explanation:
            "HSTS tells browsers to always use a secure HTTPS connection when communicating with the website.",

        recommendation:
            "Configure a Strict-Transport-Security header so browsers are instructed to use HTTPS."

    });


    checks.push({

        name:
            "X-Content-Type-Options",

        header:
            "x-content-type-options",

        passed:
            headers[
                "x-content-type-options"
            ]?.toLowerCase() === "nosniff",

        severity: "medium",

        message:
            headers[
                "x-content-type-options"
            ]?.toLowerCase() === "nosniff"
                ? "The browser is instructed not to MIME-sniff responses."
                : "The nosniff protection is not configured.",

        explanation:
            "This prevents browsers from trying to guess the type of content being served, which can reduce certain types of content-based attacks.",

        recommendation:
            "Set the X-Content-Type-Options header to 'nosniff'."

    });


    checks.push({

        name:
            "X-Frame-Options",

        header:
            "x-frame-options",

        passed:
            Boolean(
                headers[
                    "x-frame-options"
                ]
            ),

        severity: "medium",

        message:
            headers[
                "x-frame-options"
            ]
                ? "Clickjacking protection is configured."
                : "No X-Frame-Options header detected.",

        explanation:
            "This controls whether the website can be embedded inside another website's frame and helps protect against clickjacking.",

        recommendation:
            "Configure X-Frame-Options or use the frame-ancestors directive in Content Security Policy."

    });


    checks.push({

        name:
            "Referrer Policy",

        header:
            "referrer-policy",

        passed:
            Boolean(
                headers[
                    "referrer-policy"
                ]
            ),

        severity: "low",

        message:
            headers[
                "referrer-policy"
            ]
                ? "A referrer policy is configured."
                : "No Referrer-Policy header detected.",

        explanation:
            "This controls how much information about the previous webpage is shared when a user follows a link to this website.",

        recommendation:
            "Configure a Referrer-Policy header appropriate for the website, such as strict-origin-when-cross-origin."

    });


    checks.push({

        name:
            "Permissions Policy",

        header:
            "permissions-policy",

        passed:
            Boolean(
                headers[
                    "permissions-policy"
                ]
            ),

        severity: "low",

        message:
            headers[
                "permissions-policy"
            ]
                ? "A permissions policy is configured."
                : "No Permissions-Policy header detected.",

        explanation:
            "This controls which browser features, such as the camera, microphone or location, can be used by the website and its embedded content.",

        recommendation:
            "Configure a Permissions-Policy header to restrict browser features that the website does not need."

    });


    return checks;
}


export function checkHTTPS(url) {

    return {

        name: "HTTPS",

        passed:
            url.startsWith("https://"),

        severity: "high",

        message:
            url.startsWith("https://")
                ? "The website uses HTTPS."
                : "The website is not using HTTPS.",

        explanation:
            "HTTPS encrypts communication between the user's browser and the website, helping protect information while it is being transmitted.",

        recommendation:
            "Configure the website to use HTTPS and redirect HTTP traffic to the secure HTTPS version."

    };

}


export function checkCookies(headers) {

    const setCookie =
        headers["set-cookie"];


    if (!setCookie) {

        return {

            name:
                "Cookie Security",

            passed:
                true,

            severity:
                "medium",

            message:
                "No cookies were detected.",

            explanation:
                "This checks whether cookies sent by the website include security attributes such as Secure, HttpOnly and SameSite.",

            recommendation:
                "If the website uses cookies, configure sensitive cookies with Secure, HttpOnly and SameSite attributes."

        };

    }


    const cookies =
        Array.isArray(setCookie)
            ? setCookie
            : [setCookie];


    const cookieResults = [];


    for (const cookie of cookies) {

        const lowerCookie =
            cookie.toLowerCase();


        const missing = [];


        if (!lowerCookie.includes("secure")) {

            missing.push(
                "Secure"
            );

        }


        if (!lowerCookie.includes("httponly")) {

            missing.push(
                "HttpOnly"
            );

        }


        if (!lowerCookie.includes("samesite")) {

            missing.push(
                "SameSite"
            );

        }


        cookieResults.push({
            missing
        });

    }


    const insecureCookies =
        cookieResults.filter(
            cookie =>
                cookie.missing.length > 0
        );


    if (insecureCookies.length === 0) {

        return {

            name:
                "Cookie Security",

            passed:
                true,

            severity:
                "medium",

            message:
                `All ${cookies.length} detected cookie(s) use the recommended security attributes.`,

            explanation:
                "The detected cookies include Secure, HttpOnly and SameSite attributes.",

            recommendation:
                "Continue reviewing cookie settings whenever new cookies are introduced."

        };

    }


    const missingAttributes = [
        ...new Set(
            insecureCookies.flatMap(
                cookie =>
                    cookie.missing
            )
        )
    ];


    return {

        name:
            "Cookie Security",

        passed:
            false,

        severity:
            "medium",

        message:
            `${insecureCookies.length} of ${cookies.length} cookie(s) are missing security attributes: ${missingAttributes.join(", ")}.`,

        explanation:
            "Cookie security attributes help protect session information and control how cookies are transmitted and accessed by browsers.",

        recommendation:
            `Review the affected cookies and configure the missing attributes where appropriate: ${missingAttributes.join(", ")}.`

    };

}


export function checkTLS(protocol) {

    return {

        name:
            "TLS Connection",

        passed:
            Boolean(protocol),

        severity:
            "high",

        message:
            protocol
                ? `Secure connection established using ${protocol}.`
                : "Unable to determine the TLS protocol.",

        explanation:
            "TLS is the encryption protocol used to establish a secure connection between the browser and the website.",

        recommendation:
            "Use a modern TLS configuration and keep the server's TLS software and certificates up to date."

    };

}


export function checkInformationDisclosure(headers) {

    const serverHeader =
        headers["server"];

    const poweredByHeader =
        headers["x-powered-by"];


    const exposedInformation = [];


    if (serverHeader) {

        exposedInformation.push(
            "Server"
        );

    }


    if (poweredByHeader) {

        exposedInformation.push(
            "X-Powered-By"
        );

    }


    return {

        name:
            "Information Disclosure",

        passed:
            exposedInformation.length === 0,

        severity:
            "low",

        message:
            exposedInformation.length === 0
                ? "No unnecessary server technology information was detected."
                : `The website exposes information through: ${exposedInformation.join(", ")}.`,

        explanation:
            "This checks whether the website reveals unnecessary information about the software or technology running on the server. Limiting this information can reduce the amount of technical detail available to attackers.",

        recommendation:
            "Review the server configuration and remove unnecessary technology or version information from response headers where possible."

    };

}


export function checkCORS(headers) {

    const allowOrigin =
        headers[
            "access-control-allow-origin"
        ];

    const allowCredentials =
        headers[
            "access-control-allow-credentials"
        ];


    if (!allowOrigin) {

        return {

            name:
                "CORS Configuration",

            passed:
                true,

            severity:
                "low",

            message:
                "No permissive CORS policy was detected.",

            explanation:
                "CORS controls which other websites are allowed to request resources from this website. A carefully configured policy helps prevent unwanted cross-origin access.",

            recommendation:
                "If the website needs CORS, explicitly allow only the trusted origins that require access."

        };

    }


    if (allowOrigin === "*") {

        if (
            allowCredentials &&
            allowCredentials.toLowerCase() === "true"
        ) {

            return {

                name:
                    "CORS Configuration",

                passed:
                    false,

                severity:
                    "high",

                message:
                    "CORS allows all origins while also allowing credentials.",

                explanation:
                    "The website allows requests from any origin and also allows credentials such as cookies to be included. This combination can create a dangerous cross-origin configuration.",

                recommendation:
                    "Avoid allowing all origins when credentials are enabled. Restrict Access-Control-Allow-Origin to trusted websites."

            };

        }


        return {

            name:
                "CORS Configuration",

            passed:
                false,

            severity:
                "medium",

            message:
                "CORS allows requests from all origins.",

            explanation:
                "The wildcard (*) allows requests from any origin. This may be appropriate for some public resources, but it can be unnecessarily permissive for sensitive data or APIs.",

            recommendation:
                "If possible, replace the wildcard with a list of specific trusted origins."

        };

    }


    return {

        name:
            "CORS Configuration",

        passed:
            true,

        severity:
            "low",

        message:
            `CORS is restricted to: ${allowOrigin}`,

        explanation:
            "CORS controls which other websites are allowed to request resources from this website. Restricting access to known origins can reduce unwanted cross-origin access.",

        recommendation:
            "Regularly review the allowed origins and remove any websites that no longer require access."

    };

}


export function checkCertificate(certificate) {

    if (
        !certificate ||
        !certificate.valid_to
    ) {

        return {

            name:
                "TLS Certificate",

            passed:
                false,

            severity:
                "high",

            message:
                "Unable to obtain the website's TLS certificate.",

            explanation:
                "TLS certificates help authenticate a website and establish a secure encrypted connection.",

            recommendation:
                "Check that the website has a valid TLS certificate installed and configured correctly."

        };

    }


    const expiryDate =
        new Date(
            certificate.valid_to
        );


    const currentDate =
        new Date();


    const daysUntilExpiry =
        Math.ceil(
            (
                expiryDate -
                currentDate
            ) /
            (
                1000 *
                60 *
                60 *
                24
            )
        );


    if (daysUntilExpiry < 0) {

        return {

            name:
                "TLS Certificate",

            passed:
                false,

            severity:
                "high",

            message:
                "The TLS certificate has expired.",

            explanation:
                `The certificate expired on ${certificate.valid_to}.`,

            recommendation:
                "Renew the TLS certificate and ensure the new certificate is correctly installed."

        };

    }


    if (daysUntilExpiry <= 30) {

        return {

            name:
                "TLS Certificate",

            passed:
                false,

            severity:
                "medium",

            message:
                `The TLS certificate expires in ${daysUntilExpiry} days.`,

            explanation:
                `The certificate is valid until ${certificate.valid_to}.`,

            recommendation:
                "Renew the TLS certificate before it expires to avoid service interruptions."

        };

    }


    return {

        name:
            "TLS Certificate",

        passed:
            true,

        severity:
            "high",

        message:
            `TLS certificate is valid for another ${daysUntilExpiry} days.`,

        explanation:
            `The certificate is valid until ${certificate.valid_to}.`,

        recommendation:
            "Continue monitoring the certificate expiry date and renew it before it expires."

    };

}


export function checkRedirect(
    url,
    redirect
) {

    if (
        !redirect ||
        !redirect.isRedirect
    ) {

        return {
            name:
                "Redirect Security",
            passed:
                true,
            severity:
                "medium",
            message:
                "No redirect was detected.",
            explanation:
                "The website did not return an HTTP redirect that needed to be assessed.",
            recommendation:
                "No action is required."
        };

    }

    const location =
        redirect.location;

    if (!location) {

        return {
            name:
                "Redirect Security",
            passed:
                false,
            severity:
                "medium",
            message:
                "The website returned a redirect without a destination.",
            explanation:
                "A redirect should specify where the browser should be sent.",
            recommendation:
                "Check the website's redirect configuration."
        };

    }

    try {

        const redirectURL =
            new URL(
                location,
                url
            );

        if (
            redirectURL.protocol !==
            "https:"
        ) {

            return {
                name:
                    "Redirect Security",
                passed:
                    false,
                severity:
                    "high",
                message:
                    "The website redirects to a non-HTTPS destination.",
                explanation:
                    "Redirecting users from a secure website to an HTTP destination can expose information to interception.",
                recommendation:
                    "Change the redirect destination to an HTTPS URL."
            };

        }

        return {
            name:
                "Redirect Security",
            passed:
                true,
            severity:
                "medium",
            message:
                "The website redirects to an HTTPS destination.",
            explanation:
                "The detected redirect keeps the destination protected by HTTPS.",
            recommendation:
                "No action is required."
        };

    } catch (error) {

        return {
            name:
                "Redirect Security",
            passed:
                false,
            severity:
                "medium",
            message:
                "The redirect destination is invalid.",
            explanation:
                "The scanner could not interpret the redirect destination as a valid URL.",
            recommendation:
                "Check the website's redirect configuration."
        };

    }

}

export function checkContentType(headers) {

    const contentType =
        headers["content-type"];


    const nosniff =
        headers[
            "x-content-type-options"
        ]?.toLowerCase() ===
        "nosniff";


    if (!contentType) {

        return {

            name:
                "Content-Type Configuration",

            passed:
                false,

            severity:
                "medium",

            message:
                "No Content-Type header was detected.",

            explanation:
                "The Content-Type header tells the browser what type of content is being returned, such as HTML, JavaScript or an image.",

            recommendation:
                "Configure the server to return an appropriate Content-Type header for each response."

        };

    }


    if (!nosniff) {

        return {

            name:
                "Content-Type Configuration",

            passed:
                false,

            severity:
                "low",

            message:
                `Content-Type is set to ${contentType}, but nosniff protection is not enabled.`,

            explanation:
                "Browsers can sometimes attempt to interpret content as a different type. The nosniff setting tells the browser to use the declared Content-Type instead.",

            recommendation:
                "Set X-Content-Type-Options to 'nosniff' alongside correctly configured Content-Type headers."

        };

    }


    return {

        name:
            "Content-Type Configuration",

        passed:
            true,

        severity:
            "low",

        message:
            `Content-Type is configured as ${contentType} with nosniff protection.`,

        explanation:
            "The server declares the content type and instructs the browser not to MIME-sniff the response.",

        recommendation:
            "Continue ensuring that each type of response uses the correct Content-Type."

    };

}