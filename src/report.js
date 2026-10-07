
export function calculateScore(checks) {

    let score = 100;

    const penalties = {

        high: 20,

        medium: 10,

        low: 5

    };


    const breakdown = [];


    for (const check of checks) {

        if (!check.passed) {

            const penalty =
                penalties[
                    check.severity
                ] || 0;


            score -= penalty;


            breakdown.push({

                check:
                    check.name,

                severity:
                    check.severity,

                penalty

            });

        }

    }


    return {

        score:
            Math.max(
                0,
                score
            ),

        breakdown

    };

}
