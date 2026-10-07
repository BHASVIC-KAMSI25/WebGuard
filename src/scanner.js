import https from "https";
import http from "http";

export function scanWebsite(url) {

    return followRedirects(
        url,
        [],
        0
    );
}

function followRedirects(
    url,
    redirects,
    redirectCount
) {

    return new Promise(
        (resolve, reject) => {

            let websiteURL;

            try {

                websiteURL =
                    new URL(url);

            } catch (error) {

                reject(
                    new Error(
                        "Invalid URL. Please enter a valid website address."
                    )
                );

                return;
            }

            if (
                websiteURL.protocol !==
                    "https:" &&
                websiteURL.protocol !==
                    "http:"
            ) {

                reject(
                    new Error(
                        "Please enter a valid HTTP or HTTPS website."
                    )
                );

                return;
            }

            if (redirectCount >= 5) {

                reject(
                    new Error(
                        "Too many redirects. The website could not be reached safely."
                    )
                );

                return;
            }

            const client =
                websiteURL.protocol ===
                    "https:"
                    ? https
                    : http;

            const request =
                client.get(
                    websiteURL,
                    (response) => {

                        const certificate =
                            websiteURL.protocol ===
                                "https:"
                                ? response.socket
                                    .getPeerCertificate()
                                : null;

                        const location =
                            response.headers
                                .location ||
                            null;

                        const isRedirect =
                            response.statusCode >=
                                300 &&
                            response.statusCode <
                                400 &&
                            location;

                        if (isRedirect) {

                            let redirectURL;

                            try {

                                redirectURL =
                                    new URL(
                                        location,
                                        websiteURL
                                    ).href;

                            } catch (error) {

                                reject(
                                    new Error(
                                        "The website returned an invalid redirect."
                                    )
                                );

                                return;
                            }

                            redirects.push({
                                from:
                                    websiteURL.href,

                                to:
                                    redirectURL,

                                statusCode:
                                    response.statusCode
                            });

                            response.resume();

                            followRedirects(
                                redirectURL,
                                redirects,
                                redirectCount + 1
                            )
                                .then(resolve)
                                .catch(reject);

                            return;
                        }

                        const result = {

                            url:
                                websiteURL.href,

                            statusCode:
                                response.statusCode,

                            statusMessage:
                                response.statusMessage,

                            headers:
                                response.headers,

                            protocol:
                                websiteURL.protocol ===
                                    "https:"
                                    ? response.socket
                                        .getProtocol()
                                    : null,

                            certificate,

                            redirects,

                            redirect: {

                                location,

                                isRedirect:
                                    response.statusCode >=
                                        300 &&
                                    response.statusCode <
                                        400
                            }

                        };

                        response.resume();

                        resolve(result);

                    }
                );

            request.setTimeout(
                10000,
                () => {

                    request.destroy();

                    reject(
                        new Error(
                            "The website took too long to respond."
                        )
                    );

                }
            );

            request.on(
                "error",
                () => {

                    reject(
                        new Error(
                            "Unable to connect to the website."
                        )
                    );

                }
            );

        }
    );
}