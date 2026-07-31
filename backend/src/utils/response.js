export function sendSuccess(res, { statusCode = 200, message = "Success", data = null, meta = undefined }) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    ...(meta ? { meta } : {}),
  });
}

export function sendCreated(res, { message = "Created", data = null, meta = undefined }) {
  return sendSuccess(res, { statusCode: 201, message, data, meta });
}

export function sendPaginated(res, { statusCode = 200, message = "Success", data = [], meta = {} }) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    meta,
  });
}
