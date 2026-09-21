
import React from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-[#FDFBF7]">

      {/* ================= HERO ================= */}
      <section className="py-16 sm:py-20 lg:py-24 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

          <div className="max-w-3xl">
            <span className="uppercase text-[10px] sm:text-xs tracking-[0.3em] font-semibold text-[#B85028]">
              Contact Us
            </span>

            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-serif text-gray-900 leading-tight">
              We'd Love to
              <span className="block">Hear From You.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-sm sm:text-base text-gray-600 font-light leading-7">
              Have a question, a suggestion, or simply want to say hello?
              Get in touch with the Tanlia Studio team.
            </p>
          </div>

        </div>
      </section>


      {/* ================= CONTACT CONTENT ================= */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

            {/* ================= CONTACT INFO ================= */}
            <div>

              <span className="uppercase text-[10px] sm:text-xs tracking-[0.25em] font-semibold text-[#B85028]">
                Get In Touch
              </span>

              <h2 className="mt-3 text-3xl sm:text-4xl font-serif text-gray-900">
                Let's Start a Conversation
              </h2>

              <p className="mt-5 max-w-lg text-sm sm:text-base text-gray-600 font-light leading-7">
                Whether you're a customer looking for help or a boutique
                interested in joining Tanlia Studio, we're here to help.
              </p>


              {/* Email */}
              <div className="mt-10 flex items-start gap-4">
                <div className="w-11 h-11 shrink-0 flex items-center justify-center border border-gray-200 rounded-full">
                  <Mail className="w-4 h-4 text-[#B85028]" />
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Email
                  </h3>

                  <p className="mt-1 text-sm text-gray-500 font-light">
                    rawjtaul02@gmail.com
                  </p>
                </div>
              </div>


              {/* Phone */}
              <div className="mt-6 flex items-start gap-4">
                <div className="w-11 h-11 shrink-0 flex items-center justify-center border border-gray-200 rounded-full">
                  <Phone className="w-4 h-4 text-[#B85028]" />
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Phone
                  </h3>

                  <p className="mt-1 text-sm text-gray-500 font-light">
                    +880 1401088049
                  </p>
                </div>
              </div>


              {/* Location */}
              <div className="mt-6 flex items-start gap-4">
                <div className="w-11 h-11 shrink-0 flex items-center justify-center border border-gray-200 rounded-full">
                  <MapPin className="w-4 h-4 text-[#B85028]" />
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Location
                  </h3>

                  <p className="mt-1 text-sm text-gray-500 font-light">
                    Dhaka, Bangladesh
                  </p>
                </div>
              </div>

            </div>


            {/* ================= CONTACT FORM ================= */}
            <div className="bg-white border border-gray-200 p-6 sm:p-8 lg:p-10">

              <h2 className="text-2xl sm:text-3xl font-serif text-gray-900">
                Send Us a Message
              </h2>

              <p className="mt-2 text-sm text-gray-500 font-light">
                Fill out the form and we'll get back to you.
              </p>


              <form className="mt-8 space-y-5">

                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs font-medium text-gray-700 mb-2"
                  >
                    Your Name
                  </label>

                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 border border-gray-200 bg-[#FDFBF7] text-sm text-gray-900 outline-none focus:border-[#B85028] transition-colors"
                  />
                </div>


                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-medium text-gray-700 mb-2"
                  >
                    Email Address
                  </label>

                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 border border-gray-200 bg-[#FDFBF7] text-sm text-gray-900 outline-none focus:border-[#B85028] transition-colors"
                  />
                </div>


                {/* Subject */}
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-xs font-medium text-gray-700 mb-2"
                  >
                    Subject
                  </label>

                  <input
                    id="subject"
                    type="text"
                    placeholder="What is this about?"
                    className="w-full px-4 py-3 border border-gray-200 bg-[#FDFBF7] text-sm text-gray-900 outline-none focus:border-[#B85028] transition-colors"
                  />
                </div>


                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-xs font-medium text-gray-700 mb-2"
                  >
                    Message
                  </label>

                  <textarea
                    id="message"
                    rows="5"
                    placeholder="Write your message..."
                    className="w-full px-4 py-3 border border-gray-200 bg-[#FDFBF7] text-sm text-gray-900 outline-none resize-none focus:border-[#B85028] transition-colors"
                  ></textarea>
                </div>


                {/* Submit */}
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-black text-white text-xs sm:text-sm font-medium tracking-wide hover:bg-[#B85028] transition-all duration-300"
                >
                  Send Message
                  <Send className="w-4 h-4" />
                </button>

              </form>

            </div>

          </div>

        </div>
      </section>


      {/* ================= BOTTOM CTA ================= */}
      <section className="pb-16 sm:pb-20 lg:pb-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

          <div className="bg-[#EFE9DF] px-6 py-10 sm:px-10 sm:py-12 text-center">

            <span className="uppercase text-[10px] sm:text-xs tracking-[0.25em] font-semibold text-[#B85028]">
              For Boutique Owners
            </span>

            <h2 className="mt-3 text-2xl sm:text-3xl font-serif text-gray-900">
              Want to Join Tanlia Studio?
            </h2>

            <p className="mt-3 max-w-xl mx-auto text-sm text-gray-600 font-light leading-6">
              If you own a boutique or fashion brand, we'd love to hear
              about your collection.
            </p>

          </div>

        </div>
      </section>

    </div>
  );
};

export default Contact;