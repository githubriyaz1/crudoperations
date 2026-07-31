import { useState } from "react";
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import { ContactService } from "../services/contact.service";

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState({ loading: false, message: "", success: false });

  const submit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, message: "", success: false });
    try {
      const res = await ContactService.submitInquiry(form);
      setStatus({
        loading: false,
        message: res.message || "Thank you for contacting Love2Bazzar. We will respond shortly.",
        success: true,
      });
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setStatus({
        loading: false,
        message: err.response?.data?.message || "Failed to send message. Please try again.",
        success: false,
      });
    }
  };

  return (
    <main className="page-shell">
      <div className="container">
        <div className="section-title">
          <p className="eyebrow">Contact</p>
          <h1>We Are Here To Help</h1>
          <p>Reach out for product details, gifting support, or order assistance.</p>
          <div className="gold-divider" />
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="soft-card grid gap-5 p-6">
            <ContactRow icon={<FaMapMarkerAlt />} title="Address">
              No.18, Golden City, Pettai, Tirunelveli - 627004
            </ContactRow>
            <ContactRow icon={<FaPhoneAlt />} title="Phone">
              +91 6374253665
            </ContactRow>
            <ContactRow icon={<FaEnvelope />} title="Email">
              love2bazzar@gmail.com
            </ContactRow>
          </section>

          <form onSubmit={submit} className="soft-card grid gap-4 p-6">
            <h2 className="font-display text-3xl font-bold">Send A Message</h2>
            {status.message && (
              <p
                className={`rounded-lg border p-3 text-sm ${
                  status.success
                    ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                    : "border-red-300 bg-red-50 text-red-800"
                }`}
              >
                {status.message}
              </p>
            )}
            <div className="grid gap-4 md:grid-cols-2">
              <input
                className="input"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
              />
              <input
                className="input"
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Email"
              />
            </div>
            <input
              className="input"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder="Subject"
            />
            <textarea
              className="input min-h-32 py-3"
              required
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Message"
            />
            <button className="btn btn-gold w-max" type="submit" disabled={status.loading}>
              {status.loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

function ContactRow({ icon, title, children }) {
  return (
    <div className="flex gap-4">
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#fbf1d1] text-[#9a6b10]">
        {icon}
      </div>
      <div>
        <h2 className="font-bold">{title}</h2>
        <p className="mt-1 leading-7 text-[#746c60]">{children}</p>
      </div>
    </div>
  );
}

export default Contact;
