const levels = {
  info: "INFO",
  warn: "WARN",
  error: "ERROR",
  debug: "DEBUG",
};

function write(level, message, meta) {
  const payload = {
    level: levels[level],
    message,
    timestamp: new Date().toISOString(),
    ...(meta ? { meta } : {}),
  };
  const line = JSON.stringify(payload);
  if (level === "error") {
    console.error(line);
    return;
  }
  console.log(line);
}

function serializeError(error) {
  if (!error) return undefined;
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }
  return error;
}

export const logger = {
  info: (message, meta) => write("info", message, meta),
  warn: (message, meta) => write("warn", message, meta),
  error: (message, meta) => write("error", message, serializeError(meta)),
  debug: (message, meta) => write("debug", message, meta),
};

export const requestLoggerStream = {
  write: (message) => logger.info(message.trim()),
};
