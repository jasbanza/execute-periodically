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
 * @returns {void}
 */
async function executePeriodically({
  intervalMS = 5000,
  fn,
  args = [],
  cbSuccess = null,
  cbError = null,
  debug = false 
}) {
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
    } finally {
      // Schedule the next execution
      setTimeout(executeFunction, intervalMS);
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
