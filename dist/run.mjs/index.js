/*!
 * run - v0.1.0
 * @aimwhy/run is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 * @copyright (C) 2011 - 2022 aimWhy
 */
function isPromise(obj) {
    return (
        Boolean(obj) &&
        (typeof obj === "object" || typeof obj === "function") &&
        (typeof obj.then === "function" && typeof obj.catch === "function")
    );
}

function run(fn, args = [], context, isCatchRace) {
    if (typeof fn !== "function") {
        throw new Error("first Argument must be a function");
    }

    if (typeof context === "boolean") {
        isCatchRace = context;
        context = null;
    }

    const timestamp = fn.timestamp = String(performance.now());

    const successFn = (value) => {
        let error = null;

        if (isCatchRace) {
            if (!("timestamp" in fn)) {
                console.warn("!important: function reference is changed");
            } else if (timestamp !== fn.timestamp) {
                error = new Error("RaceError");
                error.isRace = true;
            }
        }

        return [error, value];
    };

    const errorFn = (err) => {
        let error = err;

        if (isCatchRace) {
            if (!("timestamp" in fn)) {
                console.warn("!important: function reference is changed");
            } else if (timestamp !== fn.timestamp) {
                error = new Error(err.message);
                error.stack = err.stack;
                error.isRace = true;
            }
        }

        return [error, null];
    };

    try {
        const result = fn.apply(context, args);
        return isPromise(result) ? result.then(successFn, errorFn) : [null, result];
    } catch (err) {
        return [err, null];
    }
}

export { run };
