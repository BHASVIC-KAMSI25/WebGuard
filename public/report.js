const reportUrl =
    document.getElementById("reportUrl");

const reportDate =
    document.getElementById("reportDate");

const scoreElement =
    document.getElementById("score");

const ratingElement =
    document.getElementById("rating");

const summaryElement =
    document.getElementById("summary");

const passedCount =
    document.getElementById("passedCount");

const failedCount =
    document.getElementById("failedCount");

const highCount =
    document.getElementById("highCount");

const mediumCount =
    document.getElementById("mediumCount");

const lowCount =
    document.getElementById("lowCount");

const breakdownElement =
    document.getElementById("breakdown");

const checksElement =
    document.getElementById("checks");

const breakdownButton =
    document.getElementById("breakdownButton");

const breakdownContent =
    document.getElementById("breakdownContent");

const checksButton =
    document.getElementById("checksButton");

const checksContent =
    document.getElementById("checksContent");

const backButton =
    document.getElementById("backButton");

const scanData =
    sessionStorage.getItem(
        "webguardReport"
    );

if (!scanData) {

    reportUrl.textContent =
        "No scan report found.";

    reportDate.textContent =
        "Please return to the scanner and run a new scan.";

} else {

    try {

        const data =
            JSON.parse(scanData);

        displayReport(data);

    } catch (error) {

        reportUrl.textContent =
            "Unable to load report.";

    }

}

backButton.addEventListener(
    "click",
    () => {

        sessionStorage.removeItem(
            "webguardReport"
        );

        window.location.href = "/";

    }
);

breakdownButton.addEventListener(
    "click",
    () => {

        breakdownContent.classList.toggle(
            "show"
        );

        breakdownButton.classList.toggle(
            "open"
        );

    }
);

checksButton.addEventListener(
    "click",
    () => {

        checksContent.classList.toggle(
            "show"
        );

        checksButton.classList.toggle(
            "open"
        );

    }
);

function displayReport(data) {

    const checks =
        data.checks || [];

    reportUrl.textContent =
        data.url;

    reportDate.textContent =
        `Scan completed: ${new Date().toLocaleString()}`;

    scoreElement.textContent =
        data.score;

    ratingElement.textContent =
        `Rating: ${data.rating}`;

    summaryElement.textContent =
        data.summary;

    updateStatistics(
        checks
    );

    updateScoreCircle(
        data.score
    );

    displayBreakdown(
        data.breakdown || []
    );

    displayChecks(
        checks
    );

}

function updateStatistics(checks) {

    let passed = 0;
    let failed = 0;

    let high = 0;
    let medium = 0;
    let low = 0;

    for (const check of checks) {

        if (check.passed) {

            passed++;

        } else {

            failed++;

            if (check.severity === "high") {
                high++;
            }

            if (check.severity === "medium") {
                medium++;
            }

            if (check.severity === "low") {
                low++;
            }

        }

    }

    passedCount.textContent =
        passed;

    failedCount.textContent =
        failed;

    highCount.textContent =
        high;

    mediumCount.textContent =
        medium;

    lowCount.textContent =
        low;

}

function updateScoreCircle(score) {

    const circle =
        document.querySelector(
            ".score-circle"
        );

    const percentage =
        Math.max(
            0,
            Math.min(
                100,
                score
            )
        );

    circle.style.setProperty(
        "--score",
        `${percentage}%`
    );

}

function displayBreakdown(breakdown) {

    breakdownElement.innerHTML =
        "";

    if (breakdown.length === 0) {

        breakdownElement.innerHTML = `
            <div class="breakdown-success">
                ✓ No security penalties were applied.
            </div>
        `;

        return;
    }

    for (const item of breakdown) {

        const element =
            document.createElement("div");

        element.className =
            "breakdown-item";

        element.innerHTML = `
            <div class="breakdown-info">

                <strong>
                    ${item.check}
                </strong>

                <span>
                    ${item.severity.toUpperCase()}
                </span>

            </div>

            <strong class="penalty">
                -${item.penalty}
            </strong>
        `;

        breakdownElement.appendChild(
            element
        );

    }

}

function displayChecks(checks) {

    checksElement.innerHTML =
        "";

    for (const check of checks) {

        const element =
            document.createElement("div");

        element.className =
            `check ${
                check.passed
                    ? "passed"
                    : "failed"
            }`;

        element.innerHTML = `
            <div class="check-header">

                <div class="check-name">
                    ${
                        check.passed
                            ? "✓"
                            : "✗"
                    }

                    ${check.name}
                </div>

                <div class="check-status">
                    ${
                        check.passed
                            ? "PASS"
                            : "FAIL"
                    }
                </div>

            </div>

            <div class="check-severity">
                Severity:
                ${check.severity.toUpperCase()}
            </div>

            <div class="check-message">
                ${check.message}
            </div>

            <button
                class="explanation-button"
                type="button"
            >
                What is this?
            </button>

            <div class="explanation">
                ${check.explanation}
            </div>

            ${
                !check.passed
                    ? `
                        <button
                            class="recommendation-button"
                            type="button"
                        >
                            How to fix this?
                        </button>

                        <div class="recommendation">
                            ${check.recommendation}
                        </div>
                    `
                    : ""
            }
        `;

        checksElement.appendChild(
            element
        );

        const explanationButton =
            element.querySelector(
                ".explanation-button"
            );

        const explanation =
            element.querySelector(
                ".explanation"
            );

        explanationButton.addEventListener(
            "click",
            () => {

                explanation.classList.toggle(
                    "show"
                );

                explanationButton.textContent =
                    explanation.classList.contains(
                        "show"
                    )
                        ? "Hide explanation"
                        : "What is this?";

            }
        );

        const recommendationButton =
            element.querySelector(
                ".recommendation-button"
            );

        const recommendation =
            element.querySelector(
                ".recommendation"
            );

        if (recommendationButton) {

            recommendationButton.addEventListener(
                "click",
                () => {

                    recommendation.classList.toggle(
                        "show"
                    );

                    recommendationButton.textContent =
                        recommendation.classList.contains(
                            "show"
                        )
                            ? "Hide recommendation"
                            : "How to fix this?";

                }
            );

        }

    }

}