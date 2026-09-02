"use client";

import { useState } from "react";

export default function DeleteAccountPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
  e.preventDefault();

  if (!email.trim()) return;

  const subject = encodeURIComponent("Account Deletion Request");

  const body = encodeURIComponent(
    `Hello FindArtisans Support,

I would like to request the deletion of my FindArtisans account and associated personal data.

My account email address is: ${email}

Thank you.`
  );

  const mailtoLink =
  `mailto:support.findartisans@gmail.com` +
  `?subject=${subject}` +
  `&body=${body}`;

  window.open(mailtoLink, "_self");

  setSubmitted(true);
};

  return (
    <div className="min-h-screen bg-gray-950 px-5 py-12">

      <div className="mx-auto w-full max-w-2xl">

        {/* ======================================
            MAIN CARD
        ====================================== */}

        <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-8 sm:p-10">

          {/* ======================================
              HEADER
          ====================================== */}

          <div className="text-center mb-10">

            <h1 className="text-3xl font-bold text-white">
              Delete Your FindArtisans Account
            </h1>

            <p className="text-gray-400 mt-3 leading-relaxed">
              If you would like to delete your FindArtisans account and
              associated personal data, you can submit a deletion request below.
            </p>

          </div>


          {/* ======================================
              REQUEST ACCOUNT DELETION
          ====================================== */}

          <section className="mb-10">

            <h2 className="text-xl font-semibold text-white mb-3">
              Request Account Deletion
            </h2>

            <p className="text-gray-400 mb-5 leading-relaxed">
              Enter the email address associated with your FindArtisans account.
              Your email application will open with a pre-filled deletion
              request.
            </p>


            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* EMAIL */}

              <div>

                <label
                  htmlFor="email"
                  className="text-sm text-gray-300"
                >
                  Account Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="you@example.com"
                  className="w-full mt-2 p-3 rounded-xl bg-gray-800 text-white placeholder-gray-500 outline-none border border-gray-700 focus:border-orange-500 transition"
                />

              </div>


              {/* BUTTON */}

              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 transition text-white font-semibold py-3 rounded-xl shadow-lg"
              >
                Request Account Deletion
              </button>

            </form>


            {/* SUCCESS MESSAGE */}

            {submitted && (

              <div className="mt-5 bg-green-500/10 border border-green-500/20 rounded-xl p-4">

                <p className="text-green-400 text-sm text-center">
                  Your email application should now be open with your
                  deletion request. Please send the email to complete
                  your request.
                </p>

              </div>

            )}

          </section>


          {/* ======================================
              WHAT WILL BE DELETED
          ====================================== */}

          <section className="mb-10">

            <h2 className="text-xl font-semibold text-white mb-3">
              What Will Be Deleted
            </h2>

            <p className="text-gray-400 mb-4 leading-relaxed">
              When your account deletion request is processed, we will delete
              personal information associated with your account, including:
            </p>

            <ul className="list-disc space-y-2 pl-6 text-gray-400">

              <li>
                Your name and email address
              </li>

              <li>
                Your phone number and profile information
              </li>

              <li>
                Your customer or worker profile
              </li>

              <li>
                Your profile photo, where applicable
              </li>

              <li>
                Other personal information associated with your account
              </li>

            </ul>

          </section>


          {/* ======================================
              RETAINED INFORMATION
          ====================================== */}

          <section className="mb-10">

            <h2 className="text-xl font-semibold text-white mb-3">
              Information That May Be Retained
            </h2>

            <p className="text-gray-400 leading-relaxed">
              Some information may be retained where necessary for legal,
              security, fraud-prevention, dispute-resolution, or regulatory
              purposes. Information retained for these purposes will only be
              kept for as long as necessary.
            </p>

          </section>


          {/* ======================================
              PROCESSING TIME
          ====================================== */}

          <section className="mb-10">

            <h2 className="text-xl font-semibold text-white mb-3">
              Processing Time
            </h2>

            <p className="text-gray-400 leading-relaxed">
              Account deletion requests will normally be processed within
              <strong className="text-gray-300"> 30 days </strong>
              after the request has been received and verified.
            </p>

          </section>


          {/* ======================================
              CONTACT
          ====================================== */}

          <section>

            <h2 className="text-xl font-semibold text-white mb-3">
              Contact
            </h2>

            <p className="text-gray-400 leading-relaxed">
              If you have questions about account deletion or your personal
              data, please contact the FindArtisans support team.
            </p>

            <p className="mt-4 text-orange-500 font-semibold">
              FindArtisans
            </p>

          </section>

        </div>

      </div>

    </div>
  );
}

