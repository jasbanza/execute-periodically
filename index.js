import out from "js-console-log-colors"; // Custom context colors for console logging by jasbanza

/**
 * Periodically executes a provided function with error handling and logging.
 * It will execute a function, wait for the response, and then wait the timeout before retrying.
 *
 * @param {Object} options - Options for the periodic function call.
 * @param {number} [options.intervalMS=5000] - The time interval in milliseconds between function calls (default is 5000ms).
 * @param {function} options.fn - The function to be executed periodically.
 * @param {Array} [options.args=[]] - An array of arguments to pass to the function.
 * @param {function|null} [options.cbSuccess=null] - A callback function to handle the function's output.
 * @param {function|null} [options.cbError=null] - A callback function to handle errors.
 * @param {boolean} [options.debug=false] - Set to true to suppress console output (default is false).
 * @param {number} [options.errorRPMLimitBeforeAbort=0] - Maximum allowed errors per minute before aborting (default is 0, no limit).
 * @param {boolean} [options.continueAfterAbort=false] - Whether to continue execution after aborting due to error rate limit (default is false).
 * @param {number} [options.continueDelayAfterAbort=60000] - Delay in milliseconds before resuming execution after aborting (default is 60000ms, 1 minute).
 * @returns {void}
 */
async function executePeriodically({
  intervalMS = 5000,
  fn,
  args = [],
  cbSuccess = null,
  cbError = null,
  debug = false,
  errorRPMLimitBeforeAbort = 0,
  continueAfterAbort = false, // New attribute for continuing after abort
  continueDelayAfterAbort = 60000, // New attribute for delay after abort
}) {
  let abortExecution = false; // Variable to control execution abort
  let errorCount = 0; // Initialize the error count
  let lastErrorTimestamp = 0; // Initialize the timestamp of the last error
  /**
   * Executes the provided function, handles its output, and logs success or errors.
   *
   * @throws {Error} If the provided function throws an error.
   */
  async function executeFunction() {
    try {
      const output = await fn(...args);
      if (cbSuccess && typeof cbSuccess === "function") {
        cbSuccess(output);
      }
      if (!debug) {
        out.success(
          `Periodic function call: ${
            fn.name || "Anonymous Function"
          } completed successfully`
        );
      }
    } catch (error) {
      if (cbError && typeof cbError === "function") {
        cbError(error);
      }
      if (!debug) {
        out.failure(
          `Periodic function call ${
            fn.name || "Anonymous Function"
          } encountered an error: ${error}`
        );
      }

      // Increment error count and check error rate limit
      errorCount++;
      const now = Date.now();
      if (
        now - lastErrorTimestamp < 60000 &&
        errorCount > errorRPMLimitBeforeAbort
      ) {
        console.error(
          `Error rate limit exceeded. Aborting code execution due to ${errorCount} errors in the last minute.`
        );

        if (continueAfterAbort) {
          // Set abortExecution to true before setting up the setTimeout
          abortExecution = true;
          // Delay before resuming execution
          setTimeout(() => {
            // Set abortExecution back to false inside the setTimeout callback
            abortExecution = false;
            executeFunction();
          }, continueDelayAfterAbort);
          return;
        } else {
          abortExecution = true; // Set abortExecution to true when halting code execution
          return; // Halt code execution
        }
      } else if (now - lastErrorTimestamp >= 60000) {
        // Reset error count if more than a minute has passed since the last error
        errorCount = 1;
        lastErrorTimestamp = now;
      }
    } finally {
      // Schedule the next execution only if abortExecution is false
      if (!abortExecution) {
        setTimeout(executeFunction, intervalMS);
      }
    }
  }

  try {
    // Start the first execution
    executeFunction();
  } catch (error) {
    console.error("Interval setup error:", error);

    // Propagate the error to the caller
    throw error;
  }
}

export default executePeriodically;
