const nodemailer = require("nodemailer");

class Email {
  static async sendWishlistEmail({ email, name, movies }) {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const movieItems = movies
      .map(
        (movie) => `
          <div style="display: flex; margin-bottom: 20px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">
            <img 
              src="https://image.tmdb.org/t/p/w200${movie.poster_path}" 
              alt="${movie.title}" 
              style="width: 100px; height: 150px; object-fit: cover; margin-right: 20px; border-radius: 8px;" 
            />
            <div>
              <h3 style="margin: 0; color: #333; font-size: 18px;">${
                movie.title
              }</h3>
              <p style="margin: 5px 0; color: #666; font-size: 14px;">
                <strong>TMDB Rating:</strong> ${
                  movie.vote_average || "N/A"
                } / 10
              </p>
              <p style="margin: 5px 0; color: #666; font-size: 14px;">
                ${movie.overview || "No description available."}
              </p>
            </div>
          </div>
        `
      )
      .join("");

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `${name} shared their favorite movie list with you!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
          <h1 style="text-align: center; color: #333; margin-bottom: 20px;">MovieDB</h1>
          <p style="text-align: center; color: #666; font-size: 16px; margin-bottom: 20px;">
            ${name} shared their favorite movie list with you!
          </p>
          ${movieItems}
          <p style="text-align: center; color: #999; font-size: 12px; margin-top: 20px;">
            This email was sent by MovieDB.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  }
  static async sendReplyNotification({ email, movieId, movieTitle }) {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "You have a new reply to your comment!",
      html: `
        <p>Hi,</p>
        <p>Someone replied to your comment on <strong>${movieTitle}</strong>.</p>
        <p>Click <a href="https://your-app-url/movies/${movieId}">here</a> to view the reply.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  }
  static async sendWelcomeEmail({ email, username }) {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Welcome to MovieDB, ${username}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
          <h1 style="text-align: center; color: #333;">Welcome, ${username}!</h1>
          <p style="text-align: center; color: #666; font-size: 16px; margin-bottom: 20px;">
            We're excited to have you join our platform. Here's what you can do next:
          </p>
          <ul style="padding: 0 20px; color: #666; font-size: 14px;">
            <li>Explore new movies and tv shows from our vast database.</li>
            <li>Start adding movies to your favorites list.</li>
            <li>Share your watch lists with your friends.</li>
            <li>Interact with other users using the comments!</li>
          </ul>
          <p style="text-align: center; color: #666; font-size: 14px; margin-top: 20px;">
            If you have any questions, feel free to reply to this email. Our support team is here to help.
          </p>
          <p style="text-align: center; color: #999; font-size: 12px; margin-top: 20px;">
            This email was sent by MovieDB.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  }
}

module.exports = Email;
