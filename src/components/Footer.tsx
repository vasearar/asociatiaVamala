import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import LogoSlider from "./LogoSlider";

const Footer = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "footer" });

  return (
    <footer>
      <LogoSlider />
      <div className="bg-[#f1f1f1] py-10 border-b border-[#BDBFC0]">
        <div className="grid grid-cols-full gap-y-8">
          <div className="col-span-full md:col-span-6 lg:col-span-4">
            <div className="flex gap-3 items-center justify-start">
              <img className="size-[42px]" src="/Logo.svg" alt="logo" />
              <span className="font-medium">{t("logoText")}</span>
            </div>
            <p className="text-[#3F3F40] mt-4 text-left">
              {t("textUnderLogo")}
            </p>
          </div>

          <nav
            aria-label="Quick links"
            className="col-span-full sm:col-span-4 md:col-span-3 md:col-start-7 lg:col-span-2 lg:col-start-6"
          >
            <ul className="flex flex-col gap-2 items-start">
              <li className="font-medium mb-2 sm:mb-4">{t("quickLinks")}</li>
              <li>
                <NavLink
                  className="hover:text-[#5F9CFF] transition-colors"
                  to="/forum&workshop"
                >
                  {t("forumWorkshop")}
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="hover:text-[#5F9CFF] transition-colors"
                  to="/contact"
                >
                  {t("contact")}
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="hover:text-[#5F9CFF] transition-colors"
                  to="/documents"
                >
                  {t("documents")}
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="hover:text-[#5F9CFF] transition-colors"
                  to="/members"
                >
                  {t("members")}
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="hover:text-[#5F9CFF] transition-colors"
                  to="/news"
                >
                  {t("news")}
                </NavLink>
              </li>
            </ul>
          </nav>

          <div className="col-span-full sm:col-span-4 md:col-span-3 md:col-start-10">
            <ul className="flex flex-col gap-2 items-start">
              <li className="font-medium mb-2 sm:mb-4">
                {t("contactCategory")}
              </li>
              <li className="text-left">
                {" "}
                <a
                  className="hover:text-[#5F9CFF] transition-colors"
                  href="https://maps.app.goo.gl/KRZnLuo4uQdkuDkm6"
                >
                  {t("address")}
                </a>
              </li>
              <li className="text-left">
                {" "}
                <a
                  className="hover:text-[#5F9CFF] transition-colors"
                  href="tel:+37369195884"
                >
                  {t("phone")}
                </a>
              </li>
              <li className="text-left">
                {" "}
                <a
                  className="hover:text-[#5F9CFF] transition-colors"
                  href="fax:+37322992235"
                >
                  {t("fax")}
                </a>
              </li>
              <li>
                <a
                  href="mailto:contact@anv.md"
                  className="hover:text-[#5F9CFF] transition-colors"
                >
                  {t("email")}
                </a>
              </li>
              <li className="flex gap-4">
                <a
                  href="https://www.facebook.com/anvmd"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="hover:text-[#5F9CFF] transition-colors"
                >
                  {t("facebook")}
                </a>
                <a
                  href="https://www.instagram.com/anv_md/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="hover:text-[#5F9CFF] transition-colors"
                >
                  {t("instagram")}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-full place-items-center">
        <p className="col-span-full text-[#3F3F40] py-6 text-center">
          {t("copyright")}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
