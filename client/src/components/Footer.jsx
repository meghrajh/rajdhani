import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";

const socialLinks = [
  { label: "Instagram", href: "https://instagram.com/thera_aver", icon: FaInstagram },
  { label: "Facebook", href: "https://facebook.com", icon: FaFacebookF },
  { label: "YouTube", href: "https://youtube.com", icon: FaYoutube },
];

function Footer() {
  return (
    <footer className="mt-20 bg-maroon-900 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <div>
          <h2 className="font-heading text-3xl">Hotel Rajdhani Palace</h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/78">
            A polished hotel booking experience for guests and administrators, built with the MERN stack and tailored for a college-ready full-stack submission.
          </p>
          <div className="mt-5 space-y-2 text-sm text-white/80">
            <p>Contact: +91 99603 02671</p>
            <p>Email: rajdhanipalace07@gmail.com</p>
            <p>Address: Satara Pandharpur Road, Pusegaon, Maharashtra 415502</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-white/70">Follow Us</p>
          <div className="mt-5 flex gap-3">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-black text-white transition hover:-translate-y-0.5 hover:bg-white hover:text-black"
                aria-label={label}
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
