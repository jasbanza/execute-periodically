# Execute Periodically

This JavaScript module provides a function, `executePeriodically`, that periodically executes another provided function with error handling and logging.

## Installation

You can install this package via npm:

```bash
npm install execute-periodically
```

## Usage

Import the `executePeriodically` function and use it to periodically execute another function with custom options.

### Example:

```js
import executePeriodically from "execute-periodically";

// Define your function to be executed periodically (e.g., fetchData) 
async function fetchData() { 
    // Implement your function here 
    // ... 
}

// Define onSuccess and onError callbacks 
function onSuccess(response) { 
    // Handle success here 
    console.log("Function executed successfully:", response); 
}

function onError(error) { 
    // Handle error here 
    console.error("Function execution failed:", error); 
}

// Use the executePeriodically function to periodically execute fetchData 
executePeriodically({ 
    intervalMS: 5000, 
    fn: fetchData, 
    args: [], 
    cbSuccess: onSuccess, 
    cbError: onError, 
    debug: false,
    errorRPMLimitBeforeAbort: 0, // Maximum allowed errors per minute before aborting (default: 0, no limit)
    continueAfterAbort: false, // Whether to continue execution after aborting due to error rate limit (default: false)
    continueDelayAfterAbort: 60000, // Delay in milliseconds before resuming execution after aborting (default: 60000ms, 1 minute)
});
```

## Options

The `executePeriodically` function accepts the following options:

- `intervalMS` (optional): 
  - The time interval in milliseconds between function calls (default: 5000).
- `fn`:
  - The function to be executed periodically.
- `args` (optional):
  - An array of arguments to pass to the function (default: []).
- `cbSuccess` (optional):
  - A callback function to handle the function's output.
- `cbError` (optional):
  - A callback function to handle errors.
- `debug` (optional):
  - Set to true to suppress console output (default: false).
- `errorRPMLimitBeforeAbort` (optional):
  - Maximum allowed errors per minute before aborting (default: 0, no limit).
- `continueAfterAbort` (optional):
  - Whether to continue execution after aborting due to error rate limit (default: false).
- `continueDelayAfterAbort` (optional):
  - Delay in milliseconds before resuming execution after aborting (default: 60000ms, 1 minute).


## Contributing

If you find any issues or have suggestions for improvements, please feel free to open an issue or create a pull request in the [GitHub repository](https://github.com/jasbanza/execute-periodically).

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/jasbanza/execute-periodically/blob/main/LICENSE) file for details.
