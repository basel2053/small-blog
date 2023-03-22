export const resetTemplate = (link: string, code: string, name?: string) => {
  return `<!doctype html>
    <html ⚡4email>
      <head>
        <meta charset="utf-8">
      </head>
      <body>
        <p>Hi ${name},</p>
        <p>You requested to reset your password.</p>
        <h2>Reset Code: ${code}</h2>
        <p> Please, click the link below to reset your password</p>
          <a href="${link}">Reset Password</a>
      </body>
    </html>`;
};

export const confirmTemplate = (link: string, name?: string) => {
  return `<!doctype html>
    <html ⚡4email>
      <head>
        <meta charset="utf-8">
      </head>
      <body>
        <p>Hi ${name},</p>
        <p>Welcome to our blog, its nice to have you around.</p>
        <h2>This mail is for confirming your email</h2>
        <p>Note: if you got this by mistake, please ignore it</p>
        <p>Please, click the link below to confirm your email</p>
          <a href="${link}">Click here</a>
      </body>
    </html>`;
};
